import { flash, setWallpaper } from '../Tasker.js';
import {
    getCachedWithIds,
    sendNotification,
    writePrevious,
} from '../helpers/helpers.js';

const offline = (previous) => {
    const cached = getCachedWithIds();
    // Get wallpaper displayed longest ago
    const nonnones = previous.filter((p) => Boolean(p));
    if (!cached.length || !previous.length) {
        flash('Could not set offline wallpaper no cached image');
        return previous;
    }
    const last = nonnones.pop();

    // Get file
    const cachedLast = cached.find(({ id }) => id === last.id);
    if (!cachedLast) {
        offline(nonnones);
    }

    setWallpaper(cachedLast.filePath);
    sendNotification(
        last.title,
        `https://reddit.premii.com/#${last.permalink}`
    );

    // Save date displayed last
    last.displayedLast = Date.now();

    // Update previous list
    nonnones.unshift(last);
    nonnones.length = previous.length;
    writePrevious(nonnones);

    return previous;
};

export default offline;
