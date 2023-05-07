import { mkdtemp, readdir, rm } from 'fs/promises';
import {
    describe,
    expect,
    test,
    beforeEach,
    afterEach,
    jest,
} from '@jest/globals';
import { createTempDir, mockImages, mockPreviouses } from '../helpers/functions';
import offline from '../../src/tasks/offline';
import { TempFolderStructure } from '../types/temps';

const info = jest.spyOn(console, 'info').mockImplementation(() => {});

describe('Device is offline', () => {
    let tempDirPromise: Promise<TempFolderStructure>;

    beforeEach(() => {
        tempDirPromise = createTempDir();
    });
    
    afterEach(async () => {
        const tempDir = await tempDirPromise;
        rm(tempDir.rootPath, { recursive: true, force: true });
    });

    test('Wallpapers available', async () => {
        const {imagePath, previousesFilePath} = await tempDirPromise;

        await mockImages(imagePath, 10);

        // Get current wallpapers
        const filesPrev = await readdir(imagePath);

        // Mock previous.json
        const previouses = mockPreviouses(
            filesPrev.map((file) => file.split('.')[0])
        );

        // Perform "offline" task
        const newPreviouses = await offline(
            [...previouses],
            imagePath,
            previousesFilePath
        );

        // console.info('Wallpaper set', filePath); mocks taskers implementation of setWallpaper
        // Test if alleast one call to console.info contained "wallpaper set" in te first argument
        const wallpapersetArgs = info.mock.calls.find((call) =>
            /wallpaper set/i.test(call[0])
        );
        expect(wallpapersetArgs).toBeTruthy();

        // Test if no wallpaper is added or deleted
        const filesNew = await readdir(imagePath);
        expect(filesNew.length - filesPrev.length).toBe(0);

        // Test if newly set wallpaper was at the back of the queue
        expect(
            wallpapersetArgs!
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
    });

    test('No wallpapers available', async () => {
        const {imagePath, previousesFilePath} = await tempDirPromise;

        // Perform "offline" task
        await offline([], imagePath, previousesFilePath);

        // console.info(str); mocks taskers implementation of flash
        // Test if alleast one call to console.info contained "Could not set offline wallpaper" in te first argument
        const wallpapersetArgs = info.mock.calls.find((call) =>
            /Could not set offline wallpaper/i.test(call[0])
        );
        expect(wallpapersetArgs).toBeTruthy();
    });
});
