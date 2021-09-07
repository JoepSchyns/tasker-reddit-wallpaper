import { isImage, readOrCreatePrevious } from "../src/helpers/functions.js"
import fs from 'fs/promises'
import online from '../src/tasks/online.js';
import { expect } from "@jest/globals";
import { TASKER_PATH, IMAGE_PATH, MAX_WALLPAPERS, MIN_WIDTH, MIN_HEIGHT } from '../src/helpers/constants.js'


test('Device is online', async () => {
    // Get current wallpapers
    const filesPrev = await fs.readdir(IMAGE_PATH);

    // Mock previous.json 
    const previouses = filesPrev.map(file => {
        const [id] = file.split('.');
        const MOCK = "Added by online.test.js";
        return {
            id,
            title: MOCK,
            permalink: MOCK,
            url: MOCK,
            width: MIN_WIDTH,
            height: MIN_HEIGHT,
            displayedLast: Date.now()
        }
    });

    // Perform "online" task
    const newPreviouses = await online([...previouses]);

    // Test if one wallpaper is added
    const filesNew = await fs.readdir(IMAGE_PATH);
    expect(filesNew.length - filesPrev.length).toBe(1);

    // Test if new file is a image
    const downloaded = filesNew.find(fileNew => !filesPrev.find(filePrev => filePrev === fileNew));
    expect(isImage({url: downloaded })).toBeTruthy();

    // Test if one new entry is added to previous 
    expect(newPreviouses.length === MAX_WALLPAPERS || newPreviouses.length - previouses.length === 1).toBeTruthy();

    // Test if new entry contains all required values
    const newPrevious = newPreviouses.find(newPrevious_ => !previouses.find(previous => previous === newPrevious_));
    expect(downloaded.includes(newPrevious.id)).toBeTruthy();
    expect(newPrevious.id).toBeDefined();
    expect(newPrevious.title).toBeDefined();
    expect(newPrevious.permalink).toBeDefined();
    expect(newPrevious.url).toBeDefined();
    expect(newPrevious.width).toEqual(expect.any(Number));
    expect(newPrevious.height).toEqual(expect.any(Number));
    expect(newPrevious.displayedLast).toEqual(expect.any(Number));
  });