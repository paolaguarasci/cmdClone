("use strict");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const posix = require("posix");
const color = require("colors");

let myPath = path.resolve(process.argv[2] || "./");

let result = [];

try {
  fs.readdir(myPath, (err, list) => {
    if (err) throw "Error: " + myPath + " isn't a valid path";
    list.forEach(x => {
      let abs = `${myPath}/${x}`;
      let stats = fs.statSync(abs);
      result.push({
        name: x,
        size: stats.size,
        qta: stats.isDirectory() ? fs.readdirSync(abs).length : 1,
        owner: getUID(stats.uid),
        group: getGID(stats.gid),
        permission: getMod(abs),
        lastMod: moment(stats.mtime).format("MMM D HH:mm"),
        dir: stats.isDirectory() ? true : false
      });
    }); // forEach
    for (let i in result) {
      console.log(
        result[i].permission + " ",
        result[i].qta + " ",
        result[i].owner + " ",
        result[i].group + " ",
        result[i].size + " ",
        result[i].lastMod + " ",
        result[i].dir ? result[i].name.blue.bold : result[i].name
      );
    }
  }); // readDir
} catch (e) {
  console.log(e);
}

function getMod(e) {
  // found by google on internet
  // https://code-maven.com/system-information-about-a-file-or-directory-in-nodejs
  // and mod to fit my code

  let stats = fs.statSync(e);
  let result = "";
  // directory
  result += stats.mode & 0040000 ? "d" : "-";

  // owner
  result += stats.mode & 400 ? "r" : "-";
  result += stats.mode & 200 ? "w" : "-";
  result += stats.mode & 100 ? "x" : "-";

  // group
  result += stats.mode & 40 ? "r" : "-";
  result += stats.mode & 20 ? "w" : "-";
  result += stats.mode & 10 ? "x" : "-";

  // other
  result += stats.mode & 4 ? "r" : "-";
  result += stats.mode & 2 ? "w" : "-";
  result += stats.mode & 1 ? "x" : "-";

  return result;
}

function getUID(uid) {
  return posix.getpwnam(uid).name;
}
function getGID(gid) {
  return posix.getgrnam(gid).name;
}
