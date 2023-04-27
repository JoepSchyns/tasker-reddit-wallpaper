import {
    IMAGE_PATH,
    MAX_WALLPAPERS,
    MIN_HEIGHT,
    MIN_WIDTH,
    PREVIOUS_FILEPATH,
    REDDIT_CLIENT_BASE_URL,
    REDDIT_WALLPAPER_SOURCE_URL,
} from '../helpers/constants';
import {setGlobal, setWallpaper, shell } from '../Tasker';
import {
    isImage,
    sendNotification,
    writePrevious,
} from '../helpers/functions';
import { POST as STORAGE_POST } from '../../types/storage';
import { API_RESPONSE } from '../../types/reddit-api';

const isLargeEnough = ({ width, height }) =>
    width >= MIN_WIDTH && height >= MIN_HEIGHT;

const getWallpaperPosts = async (after) => {
    const request = await fetch(
        `${REDDIT_WALLPAPER_SOURCE_URL}?limit=100${
            after ? `&after=${after}` : ''
        }`
    );
    const result = await request.json();

    // Clean data
    const posts = result.data.children.map((post) =>
        (({ id, title, permalink, url, preview }) => ({
            id,
            title,
            permalink,
            url,
            width:
                preview &&
                preview.images &&
                preview.images.length &&
                preview.images[0].source &&
                preview.images[0].source.width
                    ? preview.images[0].source.width
                    : 0,
            height:
                preview &&
                preview.images &&
                preview.images.length &&
                preview.images[0].source &&
                preview.images[0].source.height
                    ? preview.images[0].source.height
                    : 0,
        }))(post.data)
    );
    return [result.data.after, posts.filter(isImage).filter(isLargeEnough)];
};

const getWallpaperBase64 = (url, filePath) : Promise<void> =>
    new Promise((resolve, reject) => {
        // Image present in Tasker js
        // eslint-disable-next-line no-undef
        const img = new Image();
        img.onload = function () {
            // document present in Tasker js
            // eslint-disable-next-line no-undef
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const rFactor = MIN_HEIGHT / img.height;
            canvas.width = img.width * rFactor;
            canvas.height = MIN_HEIGHT;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const base64 = canvas
                .toDataURL('image/jpeg', 0.8)
                .match(/^data:image\/[a-z]+;base64,(?<base>.+)$/).groups.base;
            const command = `echo '${base64}' | base64 -d > /storage/emulated/0/${filePath} && echo done`;
            const r = shell(command, false, 45);
            if (!r) {
                return reject(
                    new Error(
                        `shell command failed Tasker JS does not include error, ${command}`
                    )
                );
            }
            return resolve();
        };
        img.src = url;
    });

const getWallpaperCurl = (url, filePath) => {
    const command = `cd /storage/emulated/0 && curl -L -f -o "${filePath}" "${url}" && echo done`;
    const r = shell(command, false, 45);
    if (!r) {
        throw new Error(
            `Curl wallpaper download errored with commmand: ${command}`
        );
    }
};

const downloadImage = async (url, filePath) => {
    // Test shell commands needed for downloading methods
    if (shell('curl --help', false, 10)) {
        getWallpaperCurl(url, filePath);
    } else if (shell('base64 --help', false, 10)) {
        await getWallpaperBase64(url, filePath);
    } else {
        throw new Error(
            'Neither curl or base64 commands precent in shell, no methods available to download image'
        );
    }
};

const online = async (
    previous: Array<STORAGE_POST> = [],
    after: API_RESPONSE['data']['after'],
    imagePath = IMAGE_PATH,
    previousFilepath = PREVIOUS_FILEPATH,
    endTime = null
) => {
    // GET previously used wallpapers and new current on reddit
    const [nextAfter, current] = await getWallpaperPosts(after);

    // Check if there is a new wallpaper
    const newWallpaper = current.find(
        (wallpaper) =>
            !previous.find(
                (prevWallpaper) =>
                    prevWallpaper && prevWallpaper.id === wallpaper.id
            )
    );

    // Paginate
    if (!newWallpaper) {
        if (!nextAfter) {
            throw new Error('Can not paginate without a after parameter');
        }
        if (Boolean(endTime) && endTime >= Date.now()) {
            throw new Error('Could not find new wallpaper within timeout');
        }
        return online(previous, nextAfter, imagePath, previousFilepath);
    }

    // Get new wallpaper
    const [ext] = newWallpaper.url.match(/\.\w{3,4}($|\?)/);
    const filePath = `${imagePath}/${newWallpaper.id}${ext}`;
    await downloadImage(newWallpaper.url, filePath);

    setWallpaper(filePath);
    sendNotification(
        newWallpaper.title,
        `${REDDIT_CLIENT_BASE_URL}${newWallpaper.permalink}`
    );
    setGlobal(
        'WallpaperPostUrl',
        `${REDDIT_CLIENT_BASE_URL}${newWallpaper.permalink}`
    );

    // Save date displayed last
    newWallpaper.displayedLast = Date.now();

    // Update previous list
    previous.unshift(newWallpaper);
    previous.length = MAX_WALLPAPERS;
    writePrevious(previous, previousFilepath);
    return previous;
};

const initOnline = async (
    previous = [],
    after?,
    imagePath = IMAGE_PATH,
    previousFilepath = PREVIOUS_FILEPATH,
    timeoutDuration = 30 * 1000
) => {
    console.log('Start online');
    const endtime = Date.now() + timeoutDuration;
    const result = await online(
        previous,
        after,
        imagePath,
        previousFilepath,
        endtime
    );
    return result;
};
export default initOnline;
