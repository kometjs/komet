/* eslint no-console: 'off' */
const { writeFileSync, existsSync } = require('fs');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const Liftoff = require('liftoff');
const argv = require('minimist-argv');

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
        console.log('This folder is not a git repository');
        return reject();
      }

      envPath = envPath.replace('/.git', '');
      const configPath = envPath + "/.commitrc.js";

      if (!existsSync(configPath)) {
        console.log('No config file found');
        return inquirer.prompt([{
          type: 'confirm',
          name: 'create',
          message: 'Would you like to create the config file ?',
          default: true,
        },
        {
          type: 'list',
          name: 'preset',
          message: 'Which preset do you want to use ?',
          choices: [
            {name: 'karma: <type>(<scope>): <subject>', value: 'karma', short: 'karma'},
          ],
          default: 'karma',
        }]).then(({create, preset}) => {
          if (create) {
            execSync(`cp ../.commitrc.tpl ${configPath}`);
          }
        });
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
};
