import { readdir, rm } from 'fs/promises';
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
import offline from '../../src/tasks/offline';
import online from '../../src/tasks/online';
import { readOrCreatePrevious, writePrevious } from '../../src/helpers/functions';
import { POST } from '../../types/storage';
import { TempFolderStructure } from '../types/temps';

global.fetch = jest.fn() as (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
) => Promise<Response>;
const mockedFetch = jest.mocked(fetch);
const info = jest.spyOn(console, 'info').mockImplementation(() => {});

describe('Online-offline-online-offline sequence', () => {
    let tempDirPromise: Promise<TempFolderStructure>;

    beforeEach(() => {
        info.mockClear();
        tempDirPromise = createTempDir();
    });

    afterEach(async () => {
        const tempDir = await tempDirPromise;
        rm(tempDir.rootPath, { recursive: true, force: true });
    });

    test('Second offline session does not restart the same wallpaper sequence as the first', async () => {
        const { imagePath, apiPath, previousesFilePath } = await tempDirPromise;

        // Setup: 10 initial cached images, all with displayedLast = 0
        await mockImages(imagePath, 10);
        const initialFiles = await readdir(imagePath);
        const initialPreviouses: POST[] = mockPreviouses(
            initialFiles.map((f : string) => f.split('.')[0])
        );
        // Write initial state to disk, as production would have it
        writePrevious(initialPreviouses, previousesFilePath);

        // Mock fetch so each online call downloads a new unique wallpaper
        mockedFetch.mockImplementation(() =>
            Promise.resolve({
                json: () => mockRedditResult(apiPath, 1),
            } as Response)
        );

        // First online session: acquire 2 new wallpapers
        // Each call reads from disk first (simulating production's readOrCreatePrevious), then calls online
        let previouses = readOrCreatePrevious(previousesFilePath);
        previouses = await online(previouses, undefined, imagePath, previousesFilePath);
        previouses = readOrCreatePrevious(previousesFilePath);
        previouses = await online(previouses, undefined, imagePath, previousesFilePath);

        // After online, every entry read back from disk must have a numeric displayedLast.
        const afterFirstOnline = readOrCreatePrevious(previousesFilePath);
        expect(
            afterFirstOnline.filter(Boolean).every((p) => typeof p.displayedLast === 'number')
        ).toBeTruthy();

        // First offline session: 3 rounds, each time reading from disk first to simulate a
        // fresh app invocation 
        const firstOfflineIds: string[] = [];
        for (let i = 0; i < 3; i++) {
            previouses = readOrCreatePrevious(previousesFilePath);
            previouses = offline(previouses, imagePath, previousesFilePath);
            // After each offline call, previouses[0] is the wallpaper just shown
            firstOfflineIds.push(previouses[0].id);
        }
        expect(firstOfflineIds).toHaveLength(3);

        // Second online session: acquire 2 more wallpapers
        previouses = readOrCreatePrevious(previousesFilePath);
        previouses = await online(previouses, undefined, imagePath, previousesFilePath);
        previouses = readOrCreatePrevious(previousesFilePath);
        previouses = await online(previouses, undefined, imagePath, previousesFilePath);

        // Second offline session: 3 rounds, again reading from disk before each call
        const secondOfflineIds: string[] = [];
        for (let i = 0; i < 3; i++) {
            previouses = readOrCreatePrevious(previousesFilePath);
            previouses = offline(previouses, imagePath, previousesFilePath);
            secondOfflineIds.push(previouses[0].id);
        }
        expect(secondOfflineIds).toHaveLength(3);

        // The wallpapers shown in the first offline session now have a recent displayedLast
        // timestamp, so they should be shown last in the second offline session not first.
        // Therefore there must be no overlap between the two sequences.
        const overlap = secondOfflineIds.filter((id) => firstOfflineIds.includes(id));
        expect(overlap).toHaveLength(0);
    });
});
