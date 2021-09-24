import { MIN_HEIGHT, MIN_WIDTH } from '../../src/helpers/constants.js';
import fs from 'fs/promises';

const randomString = () => Math.random().toString(36).slice(2);

export const mockImages = async (
    path,
    amount,
    fileTypes = ['jpg', 'png', 'jpeg']
) => {
    if (!(await fs.stat(path).catch(() => false))) {
        await fs.mkdir(path);
    }
    return Promise.all(
        [...Array(amount)].map(async () => {
            const fileType =
                fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const fileName = `${randomString()}.${fileType}`;
            await fs.writeFile(`${path}/${fileName}`, Buffer.alloc(0));
            return fileName;
        })
    );
};

export const mockPreviouses = (sizeOrIds) => {
    const MOCK = 'Added by helpers.test.js';

    const ids = isNaN(sizeOrIds)
        ? sizeOrIds
        : [...Array(sizeOrIds)].map(() => randomString());

    return ids.map((id) => ({
        id,
        title: MOCK,
        permalink: MOCK,
        url: MOCK,
        width: MIN_WIDTH,
        height: MIN_HEIGHT,
        displayedLast: 0,
    }));
};

export const mockRedditResult = async (
    tempDir,
    amount,
    fileTypes = ['jpg', 'png', 'jpeg']
) => {
    const apiDir = tempDir + '/api';
    const files = await mockImages(apiDir, amount, fileTypes);
    return {
        kind: 'Listing',
        data: {
            after: randomString(),
            children: files.map((file) => ({
                kind: 't3',
                data: {
                    id: randomString(),
                    permalink: randomString(),
                    title: randomString(),
                    url: `file://${process.cwd()}/${apiDir}/${file}`,
                    preview: {
                        images: [
                            {
                                source: {
                                    width: MIN_WIDTH,
                                    height: MIN_HEIGHT,
                                },
                            },
                        ],
                    },
                },
            })),
        },
    };
};
