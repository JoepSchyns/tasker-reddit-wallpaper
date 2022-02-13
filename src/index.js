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

// Main function
(async () => {
    try {
        sendNotification('Updating wallpaper...');

        // Get history of wallpapers
        const previous = readOrCreatePrevious();

        // Check if phone is connected to Wifi and run either off or online
        const [_, group] = global('%WIFII').match(/>>> (.+) <<</);
        
        const newPrevious = await (process.argv.includes("--online")? online: process.argv.includes("--offline")? offline:group === 'CONNECTION' ? online : offline)(
            previous
        );

        // Remove wallpapers from cache
        cleanCached(newPrevious);
    } catch (e) {
        console.error(e);
        flash(e.toString());
    }
    exit();
})();
