const fetch = require('node-fetch');
const fs = require('fs');
const { execSync } = require('child_process');

const shell = (command, root, timeoutSeconds) => {
  const removed_android_paths_command = command.replace(/\/storage\/emulated\/0\/?/g, "");
  try {
    return execSync(removed_android_paths_command, {
      timeout: timeoutSeconds * 1000,
      stdio: [
        'ignore',
        'pipe',
        'ignore',
      ],
    }).toString();
  } catch (error) {
    console.error(error)
    return;
  }
};

const exit = () => console.log('Tasker exit');

const writeFile = (path, text, append = false) => fs[append ? 'appendFileSync' : 'writeFileSync'](path, text);

const readFile = (path) => fs.readFileSync(path);

const GLOBALS_PATH = "Tasker/globals_.json";

const global = (variable) => {
  switch (variable) {
    case "%WIFII":
      return Math.random() > .5? 
        `>>> CONNECTION <<<

        "Gerards wifi"
        
        Mac: 69:69:69:69:69:69
        IP : 192.168.1.1
        Sig: 9
        Spd: 96Mbps
        Chl: 5`:
        `>>> SCAN <<<

        Gerards wifi
        
        Mac: 69:69:69:69:69:69
        IP : 192.168.1.1
        Sig: 9
        Spd: 96Mbps
        Chl: 5

        Johannet
        Mac: 42:42:42:42:42:42
        Cap: [WPA2-PSK-CCMP][RSN-PSK-CCMP][ESS]
        Sig: 9
        Chl: 5`;
      break;
    default:
      let globals = []
      try {
        return JSON.parse(fs.readFileSync(GLOBALS_PATH))[variable];
      }
      catch(e){
        console.info(`Global variable ${variable} is either not in the Tasker ecosystem, not implemented or a unset custom global`, e)
        return;
      }
  }
}

const setGlobal = (variable, value) => {
  let globals;
  try {
    globals = JSON.parse(fs.readFileSync(GLOBALS_PATH));
  }catch{
    globals = {};
  }
  globals[variable] = value;
  fs.writeFileSync(GLOBALS_PATH, JSON.stringify(globals))
}

const deleteFile = (filePath, shredTimes, useRoot ) => fs.unlinkSync(filePath.replace(/\/storage\/emulated\/0\/?/g, ""));

const listFiles = (dirPath, hiddenToo) => fs.readdirSync(dirPath).map(d => `/storage/emulated/0/${dirPath}/${d}`).join('\n');

const flash = (str) => {
  if(typeof str !== "string"){
    throw new Error("Flash does not support non strings");
    console.log(undefined);
  }
  console.log(str);
};

const flashLong = flash;

const setWallpaper = (filePath) => console.info("Wallpaper set", filePath);

const performTask = (taskName, priority, parameterOne, parameterTwo ) => console.log("Perform task", taskName, parameterOne, parameterTwo)