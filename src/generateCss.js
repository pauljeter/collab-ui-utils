const fs = require('fs');
const sass = require('node-sass');
const csso = require('csso');
const Promise = require('bluebird');

function compileCss(inputFile, outputFilePath, outputFileName) {
  return new Promise((resolve) => {
    const cssFile = `${outputFilePath}${outputFileName}.css`;
    sass.render({
      file: inputFile,
      outFile: cssFile,
      includePaths: ['node_modules/'],
    }, (err, result) => {
      if (err) { return console.error(err); }

      fs.writeFile(cssFile, result.css, (err) => {
        if (err) { return console.error(err); }
        const css = fs.readFile(cssFile, 'utf8');
        const compressedCss = csso.compress(css, {
          restructure: false,
          usage: true,
          logger: true,
        });

        console.log(compressedCss);

        fs.writeFile(cssFile, compressedCss, (err) => {
          if (err) { return console.error(err); }
          resolve(console.info(`${cssFile} has been saved!`));
        });
      });

      // const css = fs.readFile(cssFile. 'utf8');

      // const compressedCss = csso.compress(result.css, {
      //   restructure: false,
      //   usage: true,
      //   logger: true,
      // });

    });
  });
}

function minifyCss() {

}

function compileCssMin(inputFile, outputFilePath, outputFileName) {
  return new Promise((resolve) => {
    const cssFile = `${outputFilePath}${outputFileName}.min.css`;
    sass.render({
      file: inputFile,
      outFile: cssFile,
      outputStyle: 'compressed',
      includePaths: ['node_modules/'],
    }, (err, result) => {
      if (err) { return console.error(err); }
      fs.writeFile(cssFile, result.css, (err) => {
        if (err) { return console.error(err); }
        resolve(console.info(`${cssFile} has been saved!`));
      });
    });
  });
}

export function generateCss(inputFile, outputFilePath, outputFileName = inputFile.substring(0, inputFile.indexOf('.'))) {
  // const outFile = outputFileName ? outputFileName : inputFile.substring(0, inputFile.indexOf('.'));
  return Promise.all([compileCss(inputFile, outputFilePath, outputFileName), compileCssMin(inputFile, outputFilePath, outputFileName)]).then(() => {
    console.info('CSS files created!')
  });
}
