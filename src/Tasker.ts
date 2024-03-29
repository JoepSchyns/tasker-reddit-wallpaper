/** Allow no-unused vars for params used in Tasker but not in use for Node implementation*/
/* eslint-disable @typescript-eslint/no-unused-vars  */

import { execSync } from 'child_process';
import {
    readFileSync,
    writeFileSync,
    unlinkSync,
    existsSync,
    readdirSync,
    appendFileSync,
    mkdirSync,
} from 'fs';
import { dirname }  from 'path';
import { GLOBALS_NAME, GLOBALS_VALUE } from '../types/tasker';

export const shell = (
    command: string,
    root: boolean,
    timeoutSeconds: number
) => {
    command = command.replace(/\/storage\/emulated\/0\/?/g, './');

    try {
        return execSync(command, {
            timeout: timeoutSeconds * 1000,
            stdio: ['ignore', 'pipe', 'ignore'],
        }).toString();
    } catch (error) {
        console.error(error);
    }
    return null;
};

export const exit = () => console.info('Tasker exit');

export const writeFile = (path: string, text: string, append = false) => {
    mkdirSync(dirname(path), { recursive: true}); // Tasker creates folders
    (append ? appendFileSync : writeFileSync)(path, text);
}
    

export const readFile = (path: string) => readFileSync(path);

export const GLOBALS_PATH = 'Tasker/globals_.json';

export const global = (variable: string) => {
    switch (variable) {
        case '%WIFII':
            return Math.random() > 0.5
                ? `>>> CONNECTION <<<

        "Gerards wifi"
        
        Mac: 69:69:69:69:69:69
        IP : 192.168.1.1
        Sig: 9
        Spd: 96Mbps
        Chl: 5`
                : `>>> SCAN <<<

        Gerards wifi
        
        Mac: 69:69:69:69:69:69
        IP : 192.168.1.1
        Sig: 9
        Spd: 96Mbps
        Chl: 5

        Johannet
        Mac: 42:42:42:42:42:42
        Cap: [WPa2? : any-PSK-CCMP][RSN-PSK-CCMP][ESS]
        Sig: 9
        Chl: 5`;
        default:
            try {
                return JSON.parse(readFileSync(GLOBALS_PATH).toString())[
                    variable
                ];
            } catch (e) {
                console.info(
                    `Global variable ${variable} is either not in the Tasker ecosystem, not implemented or a unset custom global`
                );
            }
    }
    return null;
};

export const setGlobal = (variable: GLOBALS_NAME, value: GLOBALS_VALUE) => {
    let globals;
    try {
        globals = JSON.parse(readFileSync(GLOBALS_PATH).toString());
    } catch {
        globals = {};
    }
    globals[variable] = value;
    writeFile(GLOBALS_PATH, JSON.stringify(globals));
};

export const deleteFile = (
    filePath: string,
    shredTimes?: number,
    useRoot?: boolean
) => unlinkSync(filePath.replace(/\/storage\/emulated\/0\/?/g, './'));

export const listFiles = (dirPath: string, hiddenToo?: boolean) => {
    if (existsSync(dirPath)) {
        return readdirSync(dirPath)
            .map((d) => `/storage/emulated/0/${dirPath}/${d}`)
            .join('\n');
    }
    // eslint-disable-next-line no-undefined
    return undefined;
};

export const flash = (str: string) => {
    if (typeof str !== 'string') {
        throw new Error('Flash does not support non strings');
    }
    console.info(str);
};

export const flashLong = flash;

export const setWallpaper = (filePath: string) =>
    console.info('Wallpaper set', filePath);

export const performTask = (
    taskName: string,
    priority?: number,
    parameterOne?: string,
    parameterTwo?: string
) => {
    console.info(
        'Perform task',
        taskName,
        priority,
        parameterOne,
        parameterTwo
    );
    return 'true';
};

export const setClip = (text: string, appendFlag: string) =>
    console.info('Set clipboard', text, appendFlag);

/** Allow no-explicity-any for functions in tasker but not yet implemented */
/* eslint-disable  @typescript-eslint/no-explicit-any */
// v1 tv5.12.22
export const alarmVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function alarmVol is not yet implemented');
};
export const alert = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any
) => {
    throw new Error('Function alert is not yet implemented');
};
export const audioRecord = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function audioRecord is not yet implemented');
};
export const audioRecordStop = () => {
    throw new Error('Function audioRecordStop is not yet implemented');
};
export const btVoiceVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function btVoiceVol is not yet implemented');
};
export const browseURL = (a1?: any) => {
    throw new Error('Function browseURL is not yet implemented');
};
export const button = (a1?: any) => {
    throw new Error('Function button is not yet implemented');
};
export const call = (a1?: any, a2?: any) => {
    throw new Error('Function call is not yet implemented');
};
export const callBlock = (a1?: any, a2?: any) => {
    throw new Error('Function callBlock is not yet implemented');
};
export const callDivert = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function callDivert is not yet implemented');
};
export const callRevert = (a1?: any) => {
    throw new Error('Function callRevert is not yet implemented');
};
export const callVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function callVol is not yet implemented');
};
export const carMode = (a1?: any) => {
    throw new Error('Function carMode is not yet implemented');
};
export const clearKey = (a1?: any) => {
    throw new Error('Function clearKey is not yet implemented');
};
export const composeEmail = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function composeEmail is not yet implemented');
};
export const composeMMS = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function composeMMS is not yet implemented');
};
export const composeSMS = (a1?: any, a2?: any) => {
    throw new Error('Function composeSMS is not yet implemented');
};
export const convert = (a1?: any, a2?: any) => {
    throw new Error('Function convert is not yet implemented');
};
export const createDir = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function createDir is not yet implemented');
};
export const createScene = (a1?: any) => {
    throw new Error('Function createScene is not yet implemented');
};
export const cropImage = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function cropImage is not yet implemented');
};
export const decryptDir = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function decryptDir is not yet implemented');
};
export const decryptFile = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function decryptFile is not yet implemented');
};
export const deleteDir = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function deleteDir is not yet implemented');
};
export const destroyScene = (a1?: any) => {
    throw new Error('Function destroyScene is not yet implemented');
};
export const disable = () => {
    throw new Error('Function disable is not yet implemented');
};
export const displayAutoBright = (a1?: any) => {
    throw new Error('Function displayAutoBright is not yet implemented');
};
export const displayAutoRotate = (a1?: any) => {
    throw new Error('Function displayAutoRotate is not yet implemented');
};
export const displayTimeout = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function displayTimeout is not yet implemented');
};
export const dpad = (a1?: any, a2?: any) => {
    throw new Error('Function dpad is not yet implemented');
};
export const dtmfVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function dtmfVol is not yet implemented');
};
export const elemBackColour = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function elemBackColour is not yet implemented');
};
export const elemBorder = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function elemBorder is not yet implemented');
};
export const elemPosition = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any
) => {
    throw new Error('Function elemPosition is not yet implemented');
};
export const elemText = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function elemText is not yet implemented');
};
export const elemTextColour = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function elemTextColour is not yet implemented');
};
export const elemTextSize = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function elemTextSize is not yet implemented');
};
export const elemVisibility = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function elemVisibility is not yet implemented');
};
export const endCall = () => {
    throw new Error('Function endCall is not yet implemented');
};
export const enableProfile = (a1?: any, a2?: any) => {
    throw new Error('Function enableProfile is not yet implemented');
};
export const encryptDir = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function encryptDir is not yet implemented');
};
export const encryptFile = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function encryptFile is not yet implemented');
};
export const enterKey = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any
) => {
    throw new Error('Function enterKey is not yet implemented');
};
export const filterImage = (a1?: any, a2?: any) => {
    throw new Error('Function filterImage is not yet implemented');
};
export const flipImage = (a1?: any) => {
    throw new Error('Function flipImage is not yet implemented');
};
export const getLocation = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function getLocation is not yet implemented');
};
export const getVoice = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function getVoice is not yet implemented');
};
export const goHome = (a1?: any) => {
    throw new Error('Function goHome is not yet implemented');
};
export const haptics = (a1?: any) => {
    throw new Error('Function haptics is not yet implemented');
};
export const hideScene = (a1?: any) => {
    throw new Error('Function hideScene is not yet implemented');
};
export const loadApp = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function loadApp is not yet implemented');
};
export const loadImage = (a1?: any) => {
    throw new Error('Function loadImage is not yet implemented');
};
export const local = (a1?: any) => {
    throw new Error('Function local is not yet implemented');
};
export const lock = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any
) => {
    throw new Error('Function lock is not yet implemented');
};
export const mediaControl = (a1?: any) => {
    throw new Error('Function mediaControl is not yet implemented');
};
export const mediaVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function mediaVol is not yet implemented');
};
export const micMute = (a1?: any) => {
    throw new Error('Function micMute is not yet implemented');
};
export const mobileData = (a1?: any) => {
    throw new Error('Function mobileData is not yet implemented');
};
export const musicBack = (a1?: any) => {
    throw new Error('Function musicBack is not yet implemented');
};
export const musicPlay = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function musicPlay is not yet implemented');
};
export const musicSkip = (a1?: any) => {
    throw new Error('Function musicSkip is not yet implemented');
};
export const musicStop = () => {
    throw new Error('Function musicStop is not yet implemented');
};
export const navigationBar = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function navigationBar is not yet implemented');
};
export const nightMode = (a1?: any) => {
    throw new Error('Function nightMode is not yet implemented');
};
export const notificationVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function notificationVol is not yet implemented');
};
export const parseFormatDateTime = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any
) => {
    throw new Error('Function parseFormatDateTime is not yet implemented');
};
export const popup = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any
) => {
    throw new Error('Function popup is not yet implemented');
};
export const profileActive = (a1?: any) => {
    throw new Error('Function profileActive is not yet implemented');
};
export const pulse = (a1?: any) => {
    throw new Error('Function pulse is not yet implemented');
};
export const reboot = (a1?: any) => {
    throw new Error('Function reboot is not yet implemented');
};
export const resizeImage = (a1?: any, a2?: any) => {
    throw new Error('Function resizeImage is not yet implemented');
};
export const ringerVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function ringerVol is not yet implemented');
};
export const rotateImage = (a1?: any, a2?: any) => {
    throw new Error('Function rotateImage is not yet implemented');
};
export const saveImage = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function saveImage is not yet implemented');
};
export const say = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any,
    a8?: any
) => {
    throw new Error('Function say is not yet implemented');
};
export const scanCard = (a1?: any) => {
    throw new Error('Function scanCard is not yet implemented');
};
export const sendIntent = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any,
    a7?: any,
    a8?: any
) => {
    throw new Error('Function sendIntent is not yet implemented');
};
export const sendSMS = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function sendSMS is not yet implemented');
};
export const settings = (a1?: any) => {
    throw new Error('Function settings is not yet implemented');
};
export const setAirplaneMode = (a1?: any) => {
    throw new Error('Function setAirplaneMode is not yet implemented');
};
export const setAirplaneRadios = (a1?: any) => {
    throw new Error('Function setAirplaneRadios is not yet implemented');
};
export const setAlarm = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function setAlarm is not yet implemented');
};
export const setAutoSync = (a1?: any) => {
    throw new Error('Function setAutoSync is not yet implemented');
};
export const setBT = (a1?: any) => {
    throw new Error('Function setBT is not yet implemented');
};
export const setBTID = (a1?: any) => {
    throw new Error('Function setBTID is not yet implemented');
};
export const setKey = (a1?: any, a2?: any) => {
    throw new Error('Function setKey is not yet implemented');
};
export const setLocal = (a1?: any, a2?: any) => {
    throw new Error('Function setLocal is not yet implemented');
};
export const setWifi = (a1?: any) => {
    throw new Error('Function setWifi is not yet implemented');
};
export const showScene = (
    a1?: any,
    a2?: any,
    a3?: any,
    a4?: any,
    a5?: any,
    a6?: any
) => {
    throw new Error('Function showScene is not yet implemented');
};
export const shutdown = () => {
    throw new Error('Function shutdown is not yet implemented');
};
export const silentMode = (a1?: any) => {
    throw new Error('Function silentMode is not yet implemented');
};
export const sl4a = (a1?: any, a2?: any) => {
    throw new Error('Function sl4a is not yet implemented');
};
export const soundEffects = (a1?: any) => {
    throw new Error('Function soundEffects is not yet implemented');
};
export const speakerphone = (a1?: any) => {
    throw new Error('Function speakerphone is not yet implemented');
};
export const statusBar = (a1?: any) => {
    throw new Error('Function statusBar is not yet implemented');
};
export const stayOn = (a1?: any) => {
    throw new Error('Function stayOn is not yet implemented');
};
export const stopLocation = (a1?: any) => {
    throw new Error('Function stopLocation is not yet implemented');
};
export const systemLock = () => {
    throw new Error('Function systemLock is not yet implemented');
};
export const systemVol = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function systemVol is not yet implemented');
};
export const takeCall = () => {
    throw new Error('Function takeCall is not yet implemented');
};
export const takePhoto = (a1?: any, a2?: any, a3?: any, a4?: any) => {
    throw new Error('Function takePhoto is not yet implemented');
};
export const taskRunning = (a1?: any) => {
    throw new Error('Function taskRunning is not yet implemented');
};
export const type = (a1?: any, a2?: any) => {
    throw new Error('Function type is not yet implemented');
};
export const unzip = (a1?: any, a2?: any) => {
    throw new Error('Function unzip is not yet implemented');
};
export const usbTether = (a1?: any) => {
    throw new Error('Function usbTether is not yet implemented');
};
export const vibrate = (a1?: any) => {
    throw new Error('Function vibrate is not yet implemented');
};
export const vibratePattern = (a1?: any) => {
    throw new Error('Function vibratePattern is not yet implemented');
};
export const wait = (a1?: any) => {
    throw new Error('Function wait is not yet implemented');
};
export const wifiTether = (a1?: any) => {
    throw new Error('Function wifiTether is not yet implemented');
};
export const zip = (a1?: any, a2?: any, a3?: any) => {
    throw new Error('Function zip is not yet implemented');
};
