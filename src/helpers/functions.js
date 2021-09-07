import { IMAGE_PATH, PREVIOUS_FILEPATH } from './constants.js';
import { listFiles, performTask, readFile, writeFile } from '../Tasker.js';

export const isImage = ({ url }) => RegExp('.(jpg|png|jpeg)$', 'i').test(url);

export const readOrCreatePrevious = (path = PREVIOUS_FILEPATH) => {
    try {
        // Get previous from file and sort based on display date
        return JSON.parse(readFile(path))
            .sort((a, b) => (!a || !b ? 0 : b.displayedLast - a.displayedLast))
            .filter(
                (p, i, self) =>
                    !p ||
                    i ===
                        self
                            .filter((p_) => Boolean(p_))
                            .findIndex((p_) => p.id === p_.id)
            );
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(error);
        }
        writeFile(path, '[]');
    }
    return [];
};

export const writePrevious = (previous, path = PREVIOUS_FILEPATH) =>
    writeFile(path, JSON.stringify(previous));

export const sendNotification = (title, url) =>
    performTask('WallpaperNotification', 10, title, url);

export const getCachedWithIds = () => {
    const filesString = listFiles(IMAGE_PATH);
    if (!filesString) {
        return [];
    }
    return filesString.split('\n').map((image) => ({
        id: image.match(/(\w+)\.\w{3,4}/)[1],
        filePath: image,
    }));
};