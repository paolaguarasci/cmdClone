// Clone copy script - cp command

// import that we need
const fs = require("fs");

// get command line arguments
const source = process.argv[2];
const destination = process.argv[3];

// check if source is directory
if (fs.statSync(source).isDirectory()) {
  copyDir(source, destination);
} else {
  copyFile(source, destination);
}

// copy file
function copyFile(source, destination) {
  fs.readFile(source, (err, buffer) => {
    if (err) throw err;
    fs.writeFile(destination, buffer, err => {
      if (err) throw err;
    });
  });
}

// Copy directory, recursivly if need
function copyDir(source, destination) {
  createDest(destination);
  fs.readdir(source, (err, elements) => {
    if (err) throw err;
    elements.forEach(element => {
      let s = source + "/" + element;
      let d = destination + "/" + element;
      if (fs.statSync(s).isDirectory()) {
        copyDir(s, d);
      } else {
        copyFile(s, d);
      }
    });
  });
}

// Make Dir, if don't exist, else do a warning to user
function createDest(destination) {
  fs.mkdir(destination, err => {
    if (err) {
      if (err.code === "EEXIST") {
        console.error(` Warning: ${destination} already exists`);
      }
    }
  });
}
