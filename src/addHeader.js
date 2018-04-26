const fs = require('fs');

export function addHeader(file, header) {
  const fileContents = fs.readFileSync(file).toString('utf8');
  const fileWithHeader = `${header}\n${fileContents}`;
  fs.writeFile(file, fileWithHeader, (err) => {
    if (err) throw err;
    console.log(`Header has been added to ${file}`);
  });
}
