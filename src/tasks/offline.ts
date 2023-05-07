import {
    IMAGE_PATH,
    PREVIOUS_FILEPATH,
    REDDIT_CLIENT_BASE_URL,
} from '../helpers/constants';
import { flash, setGlobal, setWallpaper } from '../Tasker';
import {
    getCachedWithIds,
    sendNotification,
    writePrevious,
} from '../helpers/functions';
import { POST as STORAGE_POST } from '../../types/storage';

const offline = (
    previous: Array<STORAGE_POST>,
    imagePath = IMAGE_PATH,
    previousFilePath = PREVIOUS_FILEPATH
): Array<STORAGE_POST> => {
    console.log('Start offline');

    const cached = getCachedWithIds(imagePath);
    // Get wallpaper displayed longest ago
    const nonnones = previous.filter((p) => Boolean(p));
    if (cached.length === 0 || nonnones.length === 0) {
        flash('Could not set offline wallpaper with no cached images');
        return previous;
    }
    const last = nonnones.pop();
    if (!last) {
        throw new Error('Could not pop from array');
    }

    // Get file
    const cachedLast = cached.find(({ id }) => id === last.id);
    if (!cachedLast) {
        return offline(nonnones);
    }
    setWallpaper(cachedLast.filePath);
    sendNotification(last.title, `${REDDIT_CLIENT_BASE_URL}${last.permalink}`);
    setGlobal('WallpaperPostUrl', `${REDDIT_CLIENT_BASE_URL}${last.permalink}`);

    // Save date displayed last
    last.displayedLast = Date.now();

    // Update previous list
    nonnones.unshift(last);
    nonnones.length = previous.length;
    writePrevious(nonnones, previousFilePath);

    return nonnones;
};

export default offline;
