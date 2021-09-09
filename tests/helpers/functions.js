import { MIN_HEIGHT, MIN_WIDTH } from '../../src/helpers/constants.js';
import fs from 'fs/promises';

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
            const fileName = `${Math.random()
                .toString(36)
                .slice(2)}.${fileType}`;
            await fs.writeFile(`${path}/${fileName}`, Buffer.alloc(0));
            return fileName;
        })
    );
};

export const mockPreviouses = (sizeOrIds) => {
    const MOCK = 'Added by helpers.test.js';

    const ids = isNaN(sizeOrIds)
        ? sizeOrIds
        : [...Array(sizeOrIds)].map(() => Math.random().toString(36).slice(2));

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
