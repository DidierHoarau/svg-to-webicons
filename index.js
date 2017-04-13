const
  fs = require('fs'),
  svg2png = require("svg2png");
  pnFs = require("pn/fs");

const
  outputDir = 'output',
  inputSvg = 'icon.svg'
  outputBaseName = 'icon-';

console.log('SVG to Web Icons');


// Init
if (fs.existsSync(outputDir)) {
  rmDirSync(outputDir);
}
fs.mkdirSync(outputDir);


// Check
if (!fs.existsSync(inputSvg)) {
  console.error('File: ' + inputSvg + ' not found');
  process.exit(1);
}


// PNGs
const dimensions = [72, 96, 128, 144, 152, 192, 384, 512];
for (let i=0 ; i<dimensions.length ; i++) {
  const dimension = dimensions[i];
  const outputPath = outputDir + '/' + outputBaseName + dimension + 'x' + dimension + '.png';
  generatePng(inputSvg, outputPath, { width: dimension, height: dimension })
    .catch( (error) => {
      console.error('Error: ' + error);
      process.exit(1);
    });
}

// Favicon


/**
 * SVG to PNG
 */
function generatePng(inputPath, outputPath, options) {
  return new Promise( (resolve, reject) => {
    pnFs.readFile(inputPath)
      .then( (buffer) => {
        return svg2png(buffer, options);
      }).then( (buffer) => {
        return pnFs.writeFile(outputPath, buffer);
      }).catch( (error) => {
        console.error(error);
        reject(error);
      });
  });
}




/**
 * Delete a folder reccursively
 */
function rmDirSync(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        rmDirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
