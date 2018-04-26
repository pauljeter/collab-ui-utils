import fs from 'fs-extra';
import { chalkError, chalkSuccess } from './chalkConfig';

/* eslint-disable no-console */
export function emptyDir(dir) {
  return fs
    .emptyDir(dir)
    .then(() => {
      console.log(chalkSuccess(`Directory created: ${dir}`));
      return dir;
    })
    .catch(err => console.log(chalkError(`Directory creation error: ${err}`)));
}
/* eslint-enable no-console */
