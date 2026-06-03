import { IMAGE_PATH, PREVIOUS_FILEPATH, REDDIT_USER_AGENT, REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } from './constants';
import {
    listFiles,
    performTask,
    readFile,
    writeFile,
    deleteFile,
} from '../Tasker';
import { POST as STORAGE_POST } from '../../types/storage';


export const redditFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> =>  {
  const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      'User-Agent': REDDIT_USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const { access_token } = (await tokenResponse.json()) as { access_token: string };

  const cleanPath = endpoint.replace(/^(https?:\/\/)?(www\.)?(oauth\.)?reddit\.com\/?/, '').replace(/^\//, '');
  const url = `https://oauth.reddit.com/${cleanPath}`;

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${access_token}`);
  headers.set('User-Agent', REDDIT_USER_AGENT);

  return fetch(url, { ...options, headers });
}

export const isImage = (name: string) =>
    RegExp('.(jpg|png|jpeg)$', 'i').test(name);

export const readOrCreatePrevious = (
    path = PREVIOUS_FILEPATH
): Array<STORAGE_POST> => {
    try {
        // Get previous from file, sort based on display date and remove duplicates
        return (JSON.parse(readFile(path).toString()) as Array<STORAGE_POST>)
            .sort((a, b) => (!a || !b ? 0 : b.displayedLast - a.displayedLast))
            .filter(
                (p, i, self) =>
                    !p ||
                    i ===
                        self
                            .filter((p_) => Boolean(p_))
                            .findIndex((p_) => p.id === p_.id)
            );
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(error);
        }
        writeFile(path, '[]');
    }
    return [];
};

export const writePrevious = (
    previous: Array<STORAGE_POST>,
    path = PREVIOUS_FILEPATH
) => writeFile(path, JSON.stringify(previous));

export const sendNotification = (title: string, url?: string) =>
    performTask('WallpaperNotification', 10, title, url);

export const getCachedWithIds = (
    path = IMAGE_PATH
): Array<{ id: string; filePath: string }> => {
    const filesString = listFiles(path);
    if (!filesString) {
        return [];
    }
    return filesString
        .split('\n')
        .reduce((acc: Array<{ id: string; filePath: string }>, image) => {
            // Get file extension
            const match = image.match(/(\w+)\.\w{3,4}$/);

            // Remove files without extension from the list
            if (!match) {
                return acc;
            }

            acc.push({
                id: match[1],
                filePath: image,
            });

            return acc;
        }, []);
};

/**
 * Compare wallpapers that should be stored against images that are actually stored. Remove images that are not in the list.
 * @param previous list of wallpapers that should currently be stored
 */
export const cleanCached = (previous: Array<STORAGE_POST>) =>
    getCachedWithIds()
        .filter(({ id }) => !previous.find((post) => post && post.id === id))
        .forEach(({ filePath }) => deleteFile(filePath));
