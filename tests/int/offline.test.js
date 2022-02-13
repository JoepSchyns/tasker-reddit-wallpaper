import { mockImages, mockPreviouses } from '../helpers/functions.js';
import fs from 'fs/promises';
import offline from '../../src/tasks/offline.js';

describe('Device is offline', () => {
    let tempDirPromise;

    beforeEach(() => {
        tempDirPromise = fs.mkdtemp('temp-');
    });
    afterEach(async () => {
        const tempDir = await tempDirPromise;
        fs.rm(tempDir, { recursive: true });
    });

    test('Wallpapers available', async () => {
        // Listen to console.info
        const prevConsoleInfo = console.info;
        console.info = jest.fn();

        const tempDir = await tempDirPromise;
        const imagePath = tempDir + '/images';
        const previousesfilePath = tempDir + '/test.json';

        await mockImages(imagePath, 10);

        // Get current wallpapers
        const filesPrev = await fs.readdir(imagePath);

        // Mock previous.json
        const previouses = mockPreviouses(
            filesPrev.map((file) => file.split('.')[0])
        );

        // Perform "offline" task
        const newPreviouses = await offline(
            [...previouses],
            imagePath,
            previousesfilePath
        );

        // console.info('Wallpaper set', filePath); mocks taskers implementation of setWallpaper
        // Test if alleast one call to console.info contained "wallpaper set" in te first argument
        const wallpapersetArgs = console.info.mock.calls.find((call) =>
            /wallpaper set/i.test(call[0])
        );
        expect(wallpapersetArgs).toBeTruthy();

        // Test if no wallpaper is added or deleted
        const filesNew = await fs.readdir(imagePath);
        expect(filesNew.length - filesPrev.length).toBe(0);

        // Test if newly set wallpaper was at the back of the queue
        expect(
            wallpapersetArgs
                .join()
                .includes(previouses[previouses.length - 1].id)
        ).toBeTruthy();

        // Test if newly setWallpaper is now at the front of the queue
        expect(newPreviouses[0].id).toBe(previouses[previouses.length - 1].id);

        // Test if timestamp is updated
        expect(previouses[previouses.length - 1].displayedLast).toBeGreaterThan(
            0
        );

        // Test if no new entry is added to previous
        expect(newPreviouses.length - previouses.length === 0).toBeTruthy();

        // Return console.info to its original state
        console.info = prevConsoleInfo;
    });

    test('No wallpapers available', async () => {
        // Listen to console.info
        const prevConsoleInfo = console.info;
        console.info = jest.fn();

        const tempDir = await tempDirPromise;
        const imagePath = tempDir + '/images';
        const previousesfilePath = tempDir + '/test.json';

        // Perform "offline" task
        await offline([], imagePath, previousesfilePath);

        // console.info(str); mocks taskers implementation of flash
        // Test if alleast one call to console.info contained "Could not set offline wallpaper" in te first argument
        const wallpapersetArgs = console.info.mock.calls.find((call) =>
            /Could not set offline wallpaper/i.test(call[0])
        );
        expect(wallpapersetArgs).toBeTruthy();

        // Return console.info to its original state
        console.info = prevConsoleInfo;
    });
});
