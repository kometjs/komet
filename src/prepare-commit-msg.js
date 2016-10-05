/* eslint no-console: 'off' */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import inquirer from 'inquirer';
import Liftoff from 'liftoff';
import argv from 'minimist-argv';
import ConfigGenerator from './ConfigGenerator';
import resolvePath from './utils/resolve';

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
  return new Promise((resolve) => {
    Commit.launch({ cwd: argv.cwd, configPath: argv.commitrc }, (env) => {
      let envPath = env.configFiles['.git'].up;
      const msgCommitPath = argv.path;

      if (!envPath) {
        throw new Error('This folder is not a git repository');
      }

      envPath = envPath.replace('/.git', '');
      const configPath = `${envPath}/.commitrc.js`;

      if (!existsSync(configPath)) {
        return new ConfigGenerator(configPath);
      }

      // eslint-disable-next-line global-require, import/no-dynamic-require
      const configFile = require(configPath);

      if (!Array.isArray(configFile)) {
        throw new Error(`config should return an array, got "${typeof configFile}"`);
      }

      const message = (() => {
        try {
          return readFileSync(argv.path).toString();
        } catch (err) {
          return '';
        }
      })();

      Promise.resolve(message).then(message => {
        const plugins = configFile.map((plugin) => {
          if (typeof plugin === 'string') {
            let pluginLoc = resolvePath(`pob-commit-${plugin}`, envPath) || resolvePath(plugin, envPath);
            if (!pluginLoc) throw new Error(`Could not find plugin "${plugin}"`);
            // eslint-disable-next-line global-require, import/no-dynamic-require
            plugin = require(pluginLoc);
          }

          const res = plugin(message);
          if (!res) throw new Error('Invalid plugin');

          return res;
        });

        const questions = plugins.reduce(
          (questions, plugin) => questions.concat(plugin.questions),
          [],
        );

        return inquirer.prompt(questions)
          .then((answers) => (
            plugins.reduce(
              (message, plugin) => plugin.processAnswers(answers, message),
              '',
            )
          ));
      })
        .then((fileContent) => {
          writeFileSync(msgCommitPath, fileContent);
        })
        .then(resolve);
    });
  });
}
