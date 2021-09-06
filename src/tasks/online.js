import {sendNotification, writePrevious } from '../helpers/helpers.js'
import { fetch, shell, setWallpaper, global, setGlobal } from '../Tasker.js'

const isImage = ({ url }) => RegExp('.(jpg|png|jpeg)$', 'i').test(url);

const isLargeEnough = ({ width, height }) => width >= 1080 && height >= 1920;

const getWallpaperPosts = async (after) => {
  const request = await fetch(
    `https://reddit.com/r/art.json?limit=100${after ? `&after=${after}` : ''}`
  );
  const result = await request.json();
  // Clean data
  const posts = result.data.children.map((post) => (({
 id, title, permalink, url, preview 
}) => ({
      id,
      title,
      permalink,
      url,
      width: 
        preview &&
        preview.images &&
        preview.images.length &&
        preview.images[0].source &&
        preview.images[0].source.width?
          preview.images[0].source.width:
          0,
      height:
        preview &&
        preview.images &&
        preview.images.length &&
        preview.images[0].source &&
        preview.images[0].source.height?
          preview.images[0].source.height:
          0,
    }))(post.data)
  );
  return [result.data.after, posts.filter(isImage).filter(isLargeEnough)];
};

const downloadImage = (url, filePath, timeoutSec = 30) =>
  new Promise((resolve, reject) => {
    const r = shell(
      `cd /storage/emulated/0 && curl -L -f -o "${filePath}" "${url}" && echo d`,
      false,
      timeoutSec
    );
    if (r) {
      return resolve();
    }
    reject(`Could not download ${url} to /storage/emulated/0/${filePath}`);
  });

  export default async (previous, after) => {
    // GET previously used wallpapers and new current on reddit
    const [nextAfter, current] = await getWallpaperPosts(after);
  
    // Check if there is a new wallpaper
    const newWallpaper = current.find(
      (wallpaper) => !previous.find(
        (prevWallpaper) => prevWallpaper && prevWallpaper.id === wallpaper.id
      )
    );
  
    // Paginate
    if (!newWallpaper) {
      if (!nextAfter) {
        throw new Error('Can not paginate without a after parameter');
      }
      return online(previous, nextAfter);
    }
  
    // Get new wallpaper
    const [ext] = newWallpaper.url.match(/\.\w{3,4}($|\?)/);
    const filePath = `Tasker/wallpaper/images/${newWallpaper.id}${ext}`;
    await downloadImage(newWallpaper.url, filePath);
  
    setWallpaper(filePath);
    sendNotification(
      newWallpaper.title,
      `https://reddit.premii.com/#${newWallpaper.permalink}`
    );
  
    // Save date displayed last
    newWallpaper.displayedLast = Date.now();
  
    // Update previous list
    previous.unshift(newWallpaper);
    const wallpaperMemLength = global('%WallpaperMemLength');
    if (!wallpaperMemLength) {
      setGlobal('%WallpaperMemLength', 1000);
    }
    previous.length = wallpaperMemLength || 1000;
    writePrevious(previous);
    return previous;
  };