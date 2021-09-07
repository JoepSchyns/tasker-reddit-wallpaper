// TODO why does this not work with export default
module.exports = Object.freeze(
    new (function () {
        /* eslint-disable no-invalid-this */
        this.TASKER_PATH = 'Tasker';
        this.MAX_WALLPAPERS = 1000;
        this.PREVIOUS_FILEPATH = this.TASKER_PATH + '/wallpaper/previous.json';
        this.IMAGE_PATH = this.TASKER_PATH + '/wallpaper/images/';
        this.REDDIT_CLIENT_BASE_URL = 'https://reddit.premii.com/#';
        this.MIN_WIDTH = 1080;
        this.MIN_HEIGHT = 1920;
    })()
);
