import { mkdtemp, readdir, rm} from 'fs/promises';
import {
    describe,
    expect,
    test,
    beforeEach,
    afterEach,
    jest,
} from '@jest/globals';
import {
    createTempDir,
    mockImages,
    mockPreviouses,
    mockRedditResult,
} from '../helpers/functions';
import { MAX_WALLPAPERS } from '../../src/helpers/constants';
import { isImage } from '../../src/helpers/functions';
import online from '../../src/tasks/online';
import { POST, POST as STORAGE_POST } from '../../types/storage';
import { TempFolderStructure } from '../types/temps';

global.fetch = jest.fn() as (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
) => Promise<Response>;
const mockedFetch = jest.mocked(fetch);
const info = jest.spyOn(console, 'info').mockImplementation(() => {});

describe('Device is online', () => {
    let tempDirPromise: Promise<TempFolderStructure>;

    beforeEach(() => {
        tempDirPromise = createTempDir();
    });

    afterEach(async () => {
        const tempDir = await tempDirPromise;
        rm(tempDir.rootPath, { recursive: true, force: true });
    });

    test('Reddit online', async () => {
        const {imagePath, apiPath, previousesFilePath} = await tempDirPromise;

        await mockImages(imagePath, 10);

        // Get current wallpapers
        const filesPrev = await readdir(imagePath);

        // Mock previous.json
        const previouses = mockPreviouses(
            filesPrev.map((file) => file.split('.')[0])
        );

        // Mock api
        mockedFetch.mockImplementation(() =>
            Promise.resolve({
                json: () => mockRedditResult(apiPath, 1),
            } as Response)
        );

        // Perform "online" task
        const newPreviouses = await online(
            JSON.parse(JSON.stringify(previouses)),
            undefined,
            imagePath,
            previousesFilePath
        );

        // Test if one wallpaper is added
        const filesNew = await readdir(imagePath);
        expect(filesNew.length - filesPrev.length).toBe(1);

        // Test if new file is a image
        const downloaded = filesNew.find(
            (fileNew) => !filesPrev.find((filePrev) => filePrev === fileNew)
        );

        expect(isImage(downloaded as string)).toBeTruthy();

        // Test if online caps cache to the max
        expect(newPreviouses.length).toBe(MAX_WALLPAPERS);
        // Test if one new entry is added to previous
        expect(
            newPreviouses.filter((p) => Boolean(p)).length -
                previouses.filter((p) => Boolean(p)).length
        ).toBe(1);

        // Test if new entry contains all required values
        const newPrevious = newPreviouses.find(
            ({id: newId}) =>
                !previouses.find(({id: prevId}) => newId === prevId)
        );
        expect(downloaded).toBeDefined();
        expect(newPrevious).toBeDefined();
        expect(
            (downloaded as string).includes((newPrevious as STORAGE_POST).id)
        ).toBeTruthy();

        // console.info('Wallpaper set', filePath); mocks taskers implementation of setWallpaper
        // Test if alleast one call to console.info contained "wallpaper set" in te first argument
        expect(
            info.mock.calls.find((call) => /wallpaper set/i.test(call[0]))
        ).toBeTruthy();
    });

    test('No new wallpaper could be found', async () => {
        const { apiPath } = await tempDirPromise;

        const getErrorMessage = async () => {
            // Create result with id '0'
            const result = await mockRedditResult(apiPath, 1);
            result.data.children[0].data.id = '0';

            // Mock api
            mockedFetch.mockImplementation(() =>
                Promise.resolve({
                    json: () =>
                        new Promise((resolveJSON) => resolveJSON(result)),
                } as Response)
            );

            try {
                // previous id is '0' and api id 0 so no new wallpaper is found. Timeout of 0 millis to paginate
                await online(
                    [{ id: '0' } as POST],
                    undefined,
                    undefined,
                    undefined,
                    0
                );
            } catch (error) {
                return error.message;
            }
            return null;
        };
        expect(await getErrorMessage()).toBe(
            'Could not find new wallpaper within timeout'
        );
    });

    test('Keep newest', async () => {
        const {imagePath, apiPath, previousesFilePath} = await tempDirPromise;
        // Mock previous.json
        const previouses = mockPreviouses(
            MAX_WALLPAPERS,
        );

        // Set timestamp 0...MAX_WALLPAPERS
        previouses.map((p, i) => p.firstSeen = i);
        
        const redditResult = mockRedditResult(apiPath, 1)
        // Mock api
        mockedFetch.mockImplementation(() =>
            Promise.resolve({
                json: () => redditResult,
            } as Response)
        );

        // Perform "online" task
        const newPreviouses = await online(
            JSON.parse(JSON.stringify(previouses)),
            undefined,
            imagePath,
            previousesFilePath
        );
        const oldestPrevious = previouses[0];
        // Oldest removed
        expect(newPreviouses.find(np => np.id === oldestPrevious.id)).toBeUndefined();

        // Newest present
        const newestId = (await redditResult).data.children[0].data.id
        expect(newPreviouses.find(np => np.id === newestId)).toBeDefined();
    });
});
