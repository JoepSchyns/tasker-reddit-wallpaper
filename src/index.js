import { deleteFile, exit, flash, global } from './Tasker.js';
import {
    getCachedWithIds,
    readOrCreatePrevious,
    sendNotification,
} from './helpers/functions.js';
import offline from './tasks/offline.js';
import online from './tasks/online.js';

const cleanCached = (previous) =>
    getCachedWithIds()
        .filter(({ id }) => !previous.find((post) => post && post.id === id))
        .forEach(({ filePath }) => deleteFile(filePath));

(async () => {
    try {
        sendNotification('Updating wallpaper...');
        const previous = readOrCreatePrevious();
        const [_, group] = global('%WIFII').match(/>>> (.+) <<</);
        if (group === 'CONNECTION') {
            console.log('online');
            const newPrevious = await online(previous);
            cleanCached(newPrevious);
        } else {
            console.log('offline');
            const newPrevious = await offline(previous);
            cleanCached(newPrevious);
        }
    } catch (e) {
        console.error(e);
        flash(e.toString());
    }
    exit();
})();
