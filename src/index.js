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

const PREVIOUS_FILEPATH = 'Tasker/wallpaper/previous.json';
const readOrCreatePrevious = (path = PREVIOUS_FILEPATH) => {
  try {
    // Get previous from file and sort based on display date
    return JSON.parse(readFile(path))
      .sort((a, b) => !a || !b ? 0 : b.displayedLast - a.displayedLast)
      .filter((p, i, self) =>
        !p || i === self.filter(p_ => !!p_).findIndex(p_ => 
          p.id === p_.id
        )
      )
  } catch (error) {
    if(error.code !== 'ENOENT'){
      console.error(error);
    }
    writeFile(path, '[]');
  }
  return [];
};

const writePrevious = (previous, path = PREVIOUS_FILEPATH) =>
  writeFile(path, JSON.stringify(previous));

const saveImage = (url, filePath, timeoutSec = 30) =>
  new Promise((resolve, reject) => {
    const r = shell(
      `cd /storage/emulated/0 && curl -L -f -o ${filePath} ${url} && echo d`,
      false,
      timeoutSec
    );
    if (r) {
      return resolve();
    }
    reject(`w download ${url} to /storage/emulated/0/${filePath}`);
  });

const sendNotification = (title, url) => performTask('WallpaperNotification', 10, title, url);

const online = async (previous, after) => {
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
  await saveImage(newWallpaper.url, filePath);

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

const getCachedWithIds = () => {
  const filesString = listFiles('Tasker/wallpaper/images');
  if (!filesString) {
    return [];
  }
  return filesString.split('\n').map((image) => ({
    id: image.match(/(\w+)\.\w{3,4}/)[1],
    filePath: image,
  }));
};

const offline = (previous) => {
  const cached = getCachedWithIds();
  // Get wallpaper displayed longest ago
  const nonnones = previous.filter((p) => !!p);
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
  sendNotification(last.title, `https://reddit.premii.com/#${last.permalink}`);

  // Save date displayed last
  last.displayedLast = Date.now();

  // Update previous list
  nonnones.unshift(last);
  nonnones.length = previous.length
  writePrevious(nonnones);

  return previous;
};

const cleanCached = (previous) => {
  const cached = getCachedWithIds();
  const shouldBeRemoved = cached.filter(
    ({ id }) => !previous.find((post) => post && post.id === id)
  );
  shouldBeRemoved.forEach(({ filePath }) => deleteFile(filePath));
};

(async () => {
  try {
    sendNotification('Updating wallpaper...');
    const previous = readOrCreatePrevious();
    const [match, group] = global('%WIFII').match(/>>> (.+) <<</);
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
    console.error(e)
    flash(e.toString());
  }
  exit();
})();
