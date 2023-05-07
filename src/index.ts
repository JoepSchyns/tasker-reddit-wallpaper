import { exit, flash, global } from './Tasker';
import {
    cleanCached,
    readOrCreatePrevious,
    sendNotification,
} from './helpers/functions';
import offline from './tasks/offline';
import online from './tasks/online';

/**
 * Main loop
 */
(async () => {
    try {
        sendNotification('Updating wallpaper...');

        // Get history of wallpapers
        const previous = readOrCreatePrevious();

        // Check if phone is connected to Wifi and run either off or online
        const [, group] = global('%WIFII').match(/>>> (.+) <<</);

        const newPrevious = await (!global('sdk') &&
            process.argv.includes('--online')
            ? online
            : !global('sdk') && process.argv.includes('--offline')
            ? offline
            : group === 'CONNECTION'
            ? online
            : offline)(previous);

        // Remove wallpapers from cache
        cleanCached(newPrevious);
    } catch (e) {
        console.error(e);
        flash(e.toString());
    }
    exit();
})();
