/* eslint no-console: 'off' */
import { writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import Liftoff from 'liftoff';
import argv from 'minimist-argv';
import ConfigGenerator from './ConfigGenerator';

const Commit = new Liftoff({
  name: 'commit',
  configName: '.git',
  extensions: {},
  configFiles: {
    '.git': {
      up: {
        path: '.',
        findUp: true,
      },
    },
  },
});

export default function () {
  return new Promise((resolve, reject) => {
    Commit.launch({ cwd: argv.cwd, configPath: argv.commitrc }, (env) => {
      let envPath = env.configFiles['.git'].up;
      const msgCommitPath = argv._[0];
      
      if (!envPath) {
        return reject('This folder is not a git repository');
      }

      envPath = envPath.replace('/.git', '');
      const configPath = `${envPath}/.commitrc.js`;

      if (!existsSync(configPath)) {
        return new ConfigGenerator(configPath);
      }

      // eslint-disable-next-line global-require
      const configFile = require(configPath);
      let questions = configFile.questions;
      let processAnswers = configFile.processAnswers;

      if (configFile.preset) {
        // eslint-disable-next-line global-require
        const preset = require(`../presets/${configFile.preset}`);
        questions = preset.questions.concat(questions);
        processAnswers = (answers) => {
          const presetContent = preset.processAnswers(answers);
          return configFile.processAnswers(answers, presetContent);
        };
      }

      return inquirer.prompt(questions)
        .then(processAnswers)
        .then((fileContent) => {
          writeFileSync(msgCommitPath, fileContent);
        })
        .then(resolve)
        .catch(reject);
    });
  });
}
