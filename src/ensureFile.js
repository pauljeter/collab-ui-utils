import fs from 'fs-extra';
import { chalkError, chalkSuccess } from './chalkConfig';

/* eslint-disable no-console */
export function ensureFile(file) {
  return fs
    .ensureFile(file)
    .then(() => {
      console.log(chalkSuccess(`File created: ${file}`));
      return file;
    })
    .catch(err => console.log(chalkError(`File creation error: ${err}`)));
}
/* eslint-enable no-console */
