import {
    IMAGE_PATH,
    PREVIOUS_FILEPATH,
    REDDIT_CLIENT_BASE_URL,
} from '../helpers/constants.js';
import { flash, setWallpaper } from '../Tasker.js';
import {
    getCachedWithIds,
    sendNotification,
    writePrevious,
} from '../helpers/functions.js';

const offline = (
    previous,
    imagePath = IMAGE_PATH,
    previousFilePath = PREVIOUS_FILEPATH
) => {
    const cached = getCachedWithIds(imagePath);
    // Get wallpaper displayed longest ago
    const nonnones = previous.filter((p) => Boolean(p));
    if (!cached.length || !previous.length) {
        flash('Could not set offline wallpaper with no cached images');
        return previous;
    }
    const last = nonnones.pop();

    // Get file
    const cachedLast = cached.find(({ id }) => id === last.id);
    if (!cachedLast) {
        offline(nonnones);
    }

    setWallpaper(cachedLast.filePath);
    sendNotification(last.title, `${REDDIT_CLIENT_BASE_URL}${last.permalink}`);

    // Save date displayed last
    last.displayedLast = Date.now();

    // Update previous list
    nonnones.unshift(last);
    nonnones.length = previous.length;
    writePrevious(nonnones, previousFilePath);

    return nonnones;
};

export default offline;
