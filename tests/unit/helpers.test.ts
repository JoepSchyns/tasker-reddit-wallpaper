import { mkdtemp, rm, writeFile, readFile } from 'fs/promises';
import {
    describe,
    expect,
    test,
    beforeEach,
    afterEach,
    jest,
} from '@jest/globals';
import {
    getCachedWithIds,
    readOrCreatePrevious,
    sendNotification,
    writePrevious,
} from '../../src/helpers/functions';
import { mockImages, mockPreviouses } from '../helpers/functions';

const info = jest.spyOn(console, 'info').mockImplementation((...args) => console.log("mocked console.log", ...args));

describe('Notification', () => {
    test('Send', () => {
        // Listen to console.info
        sendNotification('test', 'test_url');

        // console.info('Perform task', taskName, parameterOne, parameterTwo); mocks taskers implementation of performTask
        // Wallpaper is send using task "WallpaperNotification"
        // Test if alleast one call to console.info contained "Perform task" in te first argument and "WallpaperNotification" in the second
        expect(
            info.mock.calls.find(
                (call) =>
                    /Perform task/.test(call[0]) &&
                    /WallpaperNotification/.test(call[1])
            )
        ).toBeTruthy();
    });
});
describe('Handle files', () => {
    let tempDirPromise: Promise<string>;

    beforeEach(() => {
        tempDirPromise = mkdtemp('temp-');
    });
    afterEach(async () => {
        const tempDir = await tempDirPromise;
        rm(tempDir, { recursive: true });
    });

    test("Cached with id's", async () => {
        const tempDir = await tempDirPromise;
        const files = await mockImages(tempDir, 3);
        const cached = getCachedWithIds(tempDir);
        expect(cached.length).toBe(3);

        cached.forEach((ob) => {
            expect(files.find((file) => file.includes(ob.id))).toBeTruthy();
        });
    });

    test('No cached images', async () => {
        const tempDir = await tempDirPromise;
        await mockImages(tempDir, 0);
        const cached = getCachedWithIds(tempDir);
        expect(cached.length).toBe(0);
    });

    test('Write previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = `${tempDir}/test.json`;
        await writePrevious(mockPreviouses(3), previousesPath);
        const previouses = JSON.parse(
            (await readFile(previousesPath)).toString()
        );
        expect(previouses.length).toBe(3);
    });
    test('Create empty previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = `${tempDir}/test.json`;

        const previouses = readOrCreatePrevious(previousesPath);

        expect(previouses.length).toBe(0);
    });

    test('Read previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = `${tempDir}/test.json`;

        await writeFile(previousesPath, JSON.stringify(mockPreviouses(1)));
        const previouses = readOrCreatePrevious(previousesPath);

        expect(previouses.length).toBe(1);
    });

    test('Sort previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = `${tempDir}/test.json`;

        // Write a randomly sorted mock previouses
        await writeFile(
            previousesPath,
            JSON.stringify(
                mockPreviouses(20)
                    .map((p, index) => ({ ...p, displayedLast: index }))
                    .sort(() => Math.random() - 0.5)
            )
        );
        const previouses = readOrCreatePrevious(previousesPath);

        // Expect read previouses to be sorted
        expect(
            previouses
                .slice(0, -1)
                .some(
                    (previous, i) =>
                        previous.displayedLast < previouses[i + 1].displayedLast
                )
        ).toBeFalsy();
    });

    test('No duplicates in previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = `${tempDir}/test.json`;

        // Write previouses with the same id
        await writeFile(
            previousesPath,
            JSON.stringify(
                mockPreviouses(5).map((p) => ({ ...p, id: 0 }))
            )
        );
        const previouses = readOrCreatePrevious(previousesPath);

        // Expect read previouses to be sorted
        expect(previouses.length).toBe(1);
    });
});
