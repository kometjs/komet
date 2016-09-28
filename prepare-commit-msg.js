/* eslint no-console: 'off' */
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const Liftoff = require('liftoff');
const argv = require('minimist-argv');

const msgCommitPath = argv._[0];

const Commit = new Liftoff({
  name: 'commit',
  configName: '.commitrc.js',
  extensions: {},
  configFiles: {
    '.commitrc.js': {
      cwd: '.',
      home: { path: '~' },
    },
  },
});


module.exports = function () {
  return new Promise((resolve, reject) => {
    Commit.launch({ cwd: argv.cwd, configPath: argv.commitrc }, (env) => {
      let configPath = env.configFiles['.commitrc.js'].cwd;

      if (!configPath) {
        console.log('No local config found.');

        if (env.configFiles['.commitrc.js'].home === null) {
          console.log('No global config found.');

          execSync('cp .commitrc.tpl ~/.commitrc.js');
          execSync('cp ~/.commitrc.js .commitrc.js', { stdio: 'inherit' });

          console.log('Create global and local config...');
          console.log('Your configurations are ready. run `commit` to commit');
          return;
        }

        console.log('Using global config.');
        configPath = env.configFiles['.commitrc.js'].home;
      } else {
        console.log('Use local config.');
      }

      // eslint-disable-next-line global-require
      const configFile = require(configPath);

      let questions = configFile.questions;
      let processAnswers = configFile.processAnswers;
      if (configFile.preset) {
        // eslint-disable-next-line global-require
        const preset = require(`./presets/${configFile.preset}`);
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
