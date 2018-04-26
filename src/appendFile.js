import fs from 'fs-extra';

export function appendFile(file, data, extraData) {
  const appendData = (extraData && extraData + data) || data;

  return fs.appendFile(file, appendData);
}

