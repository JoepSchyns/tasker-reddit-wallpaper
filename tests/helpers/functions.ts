import { stat, mkdir, writeFile, mkdtemp } from 'fs/promises';
import { MIN_HEIGHT, MIN_WIDTH } from '../../src/helpers/constants';
import { API_RESPONSE } from '../../types/reddit-api';
import { POST } from '../../types/storage';
import { join } from 'path';
import { TempFolderStructure } from '../types/temps';

const randomString = () => Math.random().toString(36).slice(2);

export const mockImages = async (
    path: string,
    amount: number,
    fileTypes = ['jpg', 'png', 'jpeg']
): Promise<Array<string>> => {
    if (!(await stat(path).catch(() => false))) {
        await mkdir(path);
    }
    return Promise.all(
        [...Array(amount)].map(async () => {
            const fileType =
                fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const fileName = `${randomString()}.${fileType}`;
            await writeFile(`${path}/${fileName}`, Buffer.alloc(0));
            return fileName;
        })
    );
};

export const mockPreviouses = (
    sizeOrIds: number | Array<string>
): Array<POST> => {
    const MOCK = 'Added by helpers.test';

    const ids = Array.isArray(sizeOrIds)
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
        firstSeen: 0,
    }));
};

export const mockRedditResult = async (
    apiDir: string,
    amount: number,
    fileTypes = ['jpg', 'png', 'jpeg']
): Promise<API_RESPONSE> => {
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

export async function createTempDir() : Promise<TempFolderStructure>{
    const rootPath = await mkdtemp('temp-');
    const imagePath = join(rootPath, 'images');
    const apiPath = join(rootPath, 'api');
    await Promise.all([mkdir(imagePath), mkdir(apiPath)]);
    const previousesFilePath = `${rootPath}/test.json`;
    return {previousesFilePath, rootPath, imagePath, apiPath};
}
