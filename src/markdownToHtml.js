const fs = require('fs');
const showdown = require('showdown');

const converter = new showdown.Converter();

export function markdownToHtml(file, outFile, wrapperClasses) {
  const mkdown = fs.readFileSync(file).toString('utf8');
  const html = converter.makeHtml(mkdown);
  const wrappedHtml = `<div class="${wrapperClasses}">
  ${html}
  </div>`;
  fs.writeFile(outFile, wrappedHtml, (err) => {
    if (err) throw err;
    console.log(`${file} has been converted to HTML`);
  });
}

