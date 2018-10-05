const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob');
const dss = require('./parseComments');
const docsJson = require('./docsJson');
const compileJSON = require('./compileJSON');
const jsonfile = require('jsonfile');
const _ = require('lodash');


const docsFramework = (baseJSON, parsedComments, isCollabUI) => {
  const compiledJSON = compileJSON.compile(baseJSON, parsedComments, isCollabUI);

  return compiledJSON;
};


export function comments(filesGlob, outputDir, filename, baseJSON, isCollabUI) {
  return glob(filesGlob, null, (err, files) => {
    let commentBlocks = [];

    _.forEach(files, (file) => {
      const fileContents = fs.readFileSync(file);
      dss.parse(fileContents, {}, (parsedObject) => {
        if (!parsedObject.blocks.length > 0) {
          return;
        }

        commentBlocks = [...commentBlocks, parsedObject.blocks];
      });
    });

    mkdirp(outputDir, (mkdirpErr) => {
      if (mkdirpErr) {
        return console.error(mkdirpErr);
      }
      return jsonfile.writeFile(
        outputDir + filename,
        docsFramework(baseJSON, docsJson(commentBlocks), isCollabUI),
        (writeErr) => {
          if (writeErr) {
            return console.error(writeErr);
          }
          console.log(`${outputDir}${filename} was saved!`);
        });
    });
  });
}
