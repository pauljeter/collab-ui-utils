#!/usr/bin/env node
'use strict';

const args = require('yargs').argv;
const webexTeams = require('ciscospark');
const cwd = process.cwd();
const packageFile = cwd + '/package.json';
const pkg = require(packageFile);

function promptCiscoWebexToken() {
  return new Promise(function(resolve, reject) {
    if (process.env.WEBEXTEAMS_ACCESS_TOKEN) {
      resolve(process.env.WEBEXTEAMS_ACCESS_TOKEN);
    } else {
      reject('WEBEXTEAMS_ACCESS_TOKEN env variable not found');
    }
  });
}

function promptCiscoWebexSpace() {
  return new Promise(function(resolve, reject) {
    if (process.env.WEBEXTEAMS_SPACE_ID) {
      resolve(process.env.WEBEXTEAMS_SPACE_ID);
    } else {
      reject('WEBEXTEAMS_SPACE_ID env variable not found.');
    }
  });
}

export function sendWebexTeamsMessage() {
  const teamsMessage = '# ' + pkg.name + '\n' + args.message;
  let spaceId;
  promptCiscoWebexSpace()
    .then((response) => {
      spaceId = response;
      return promptCiscoWebexToken();
    })
    .then((wtToken) => {
      const teams = webexTeams.init({
        credentials: {
          authorization: {
            access_token: wtToken,
          },
        },
      });
      return teams.messages.create({
        markdown: teamsMessage,
        roomId: spaceId,
      });
    });
}
