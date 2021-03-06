import {
    mockImages,
    mockPreviouses,
    mockRedditResult,
} from '../helpers/functions.js';
import { MAX_WALLPAPERS } from '../../src/helpers/constants.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import { isImage } from '../../src/helpers/functions.js';
import online from '../../src/tasks/online.js';

jest.mock('node-fetch');

describe('Device is online', () => {
    let tempDirPromise;

    beforeEach(() => {
        tempDirPromise = fs.mkdtemp('temp-');
    });
    afterEach(async () => {
        const tempDir = await tempDirPromise;
        fs.rm(tempDir, { recursive: true });
    });

    test('Reddit online', async () => {
        // Listen to console.info
        const prevConsoleInfo = console.info;
        console.info = jest.fn();

        const tempDir = await tempDirPromise;
        const imagePath = tempDir + '/images';
        const previousesFilePath = tempDir + '/test.json';

        await mockImages(imagePath, 10);

        // Get current wallpapers
        const filesPrev = await fs.readdir(imagePath);

        // Mock previous.json
        const previouses = mockPreviouses(
            filesPrev.map((file) => file.split('.')[0])
        );

        // Mock api
        fetch.mockResolvedValue(
            new Promise((resolve) =>
                resolve({
                    json: () => mockRedditResult(tempDir, 1),
                })
            )
        );

        // Perform "online" task
        const newPreviouses = await online(
            [...previouses],
            null,
            imagePath,
            previousesFilePath
        );

        // Test if one wallpaper is added
        const filesNew = await fs.readdir(imagePath);
        expect(filesNew.length - filesPrev.length).toBe(1);

        // Test if new file is a image
        const downloaded = filesNew.find(
            (fileNew) => !filesPrev.find((filePrev) => filePrev === fileNew)
        );
        expect(isImage({ url: downloaded })).toBeTruthy();

        // Test if online caps cache to the max
        expect(newPreviouses.length).toBe(MAX_WALLPAPERS);

        // Test if one new entry is added to previous
        expect(
            newPreviouses.filter((p) => Boolean(p)).length - previouses.length
        ).toBe(1);

        // Test if new entry contains all required values
        const newPrevious = newPreviouses.find(
            (newPrevious_) =>
                !previouses.find((previous) => previous === newPrevious_)
        );
        expect(downloaded.includes(newPrevious.id)).toBeTruthy();
        expect(newPrevious.id).toBeDefined();
        expect(newPrevious.title).toBeDefined();
        expect(newPrevious.permalink).toBeDefined();
        expect(newPrevious.url).toBeDefined();
        expect(newPrevious.width).toEqual(expect.any(Number));
        expect(newPrevious.height).toEqual(expect.any(Number));
        expect(newPrevious.displayedLast).toEqual(expect.any(Number));

        // console.info('Wallpaper set', filePath); mocks taskers implementation of setWallpaper
        // Test if alleast one call to console.info contained "wallpaper set" in te first argument
        expect(
            console.info.mock.calls.find((call) =>
                /wallpaper set/i.test(call[0])
            )
        ).toBeTruthy();

        // Return console.info to its original state
        console.info = prevConsoleInfo;
    });

    test('No new wallpaper could be found', async () => {
        const tempDir = await tempDirPromise;

        // Create result with id 0
        const result = await mockRedditResult(tempDir, 1);
        result.data.children[0].data.id = 0;

        // Mock api
        fetch.mockResolvedValue(
            new Promise((resolve) =>
                resolve({
                    json: () =>
                        new Promise((resolveJSON) => resolveJSON(result)),
                })
            )
        );
        const getErrorMessage = async () => {
            try {
                // previous id is 0 and api id 0 so no new wallpaper is found. Timeout of 0 millis to paginate
                await online([{ id: 0 }], null, null, null, 0);
            } catch (error) {
                return error.message;
            }
            return null;
        };
        expect(await getErrorMessage()).toBe(
            'Could not find new wallpaper within timeout'
        );
    });
});
