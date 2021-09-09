import fs from 'fs/promises';
import { mockPreviouses } from '../helpers/functions.js';
import { readOrCreatePrevious } from '../../src/helpers/functions.js';

describe('Read or create previous file', () => {
    let tempDirPromise;

    beforeEach(() => {
        tempDirPromise = fs.mkdtemp('temp-');
    });
    afterEach(async () => {
        const tempDir = await tempDirPromise;
        fs.rmdir(tempDir, { recursive: true });
    });

    test('Create empty previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = tempDir + '/test.json';

        const previouses = readOrCreatePrevious(previousesPath);

        expect(previouses.length).toBe(0);
    });

    test('Read previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = tempDir + '/test.json';

        await fs.writeFile(previousesPath, JSON.stringify(mockPreviouses(1)));
        const previouses = readOrCreatePrevious(previousesPath);

        expect(previouses.length).toBe(1);
    });

    test('Sort previous', async () => {
        const tempDir = await tempDirPromise;
        const previousesPath = tempDir + '/test.json';

        // Write a randomly sorted mock previouses
        await fs.writeFile(
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
        const previousesPath = tempDir + '/test.json';

        // Write previouses with the same id
        await fs.writeFile(
            previousesPath,
            JSON.stringify(
                mockPreviouses(5).map((p, index) => ({ ...p, id: 0 }))
            )
        );
        const previouses = readOrCreatePrevious(previousesPath);

        // Expect read previouses to be sorted
        expect(previouses.length).toBe(1);
    });
});
