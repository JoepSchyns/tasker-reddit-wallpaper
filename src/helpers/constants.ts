import { global, setGlobal } from '../Tasker';

const createGlobalIfNotExist = (name, defaultValue) => {
    console.log(global, setGlobal);
    const value = global(name);
    if (!value) {
        setGlobal(name, defaultValue);
        return defaultValue;
    }
    return value;
};

export const TASKER_PATH = 'Tasker';
export const MAX_WALLPAPERS = createGlobalIfNotExist(
    '%WallpaperMaxWallpapers',
    1000
);
export const PREVIOUS_FILEPATH = TASKER_PATH + '/wallpaper/previous.json';
export const IMAGE_PATH = TASKER_PATH + '/wallpaper/images';
export const REDDIT_CLIENT_BASE_URL = createGlobalIfNotExist(
    '%WallpaperClientBaseUrl',
    'https://www.troddit.com'
);
export const REDDIT_WALLPAPER_SOURCE_URL = createGlobalIfNotExist(
    '%WallpaperRedditSourceUrl',
    'https://reddit.com/r/art.json'
);
export const MIN_WIDTH = createGlobalIfNotExist('%WallpaperMinWidth', 1080);
export const MIN_HEIGHT = createGlobalIfNotExist('%WallpaperMinHeight', 1920);
