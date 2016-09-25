const { readFileSync, writeFileSync, unlinkSync } = require('fs');
const { execSync, spawnSync } = require('child_process');
const inquirer = require('inquirer');
const Liftoff = require('liftoff');
const argv = require('minimist-argv');

['p', 'C', 'c', 'm', 't'].forEach(argKey => {
  if (argv[argKey]) {
    console.log(`Argument -${argKey} not supported`);
    process.exit(1);
  }
});

[
  'patch',
  'reuse-message',
  'reedit-message',
  'fixup',
  'squash',
  'message',
  'template',
  'amend',
].forEach(argKey => {
  if (argv[argKey]) {
    console.log(`Argument --${argKey} not supported`);
    process.exit(1);
  }
});

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

Commit.launch({
  cwd: argv.cwd,
  configPath: argv.commitrc
}, run);

function run (env) {
  let configPath = env.configFiles['.commitrc.js'].cwd;

  if (!configPath) {
    console.log('No local config found.');

    if (env.configFiles['.commitrc.js'].home === null) {
      console.log('No global config found.');
      
      execSync('cp .commitrc.tpl ~/.commitrc.js');
      execSync('cp ~/.commitrc.js .commitrc.js', { stdio: 'inherit'});
      
      console.log('Create global and local config...');
      console.log('Your configurations are ready. run `commit` to commit');
      return;
    }

    console.log('Using global config.');
    configPath = env.configFiles['.commitrc.js'].home;
  } else {
    console.log('Use local config.');
  }

  const configFile = require(configPath);
  return inquirer.prompt(configFile.questions)
    .then(configFile.processAnswers)
    .then((fileContent) => {
      writeFileSync('#temp_commit', fileContent);

      process.nextTick(() => {
        execSync('$EDITOR \\#temp_commit', { stdio: 'inherit' });

        const commitMsg = readFileSync('#temp_commit');
        unlinkSync('#temp_commit');

        if (!commitMsg) {
          console.log('Aborting, empty commit message.');
          process.exit(1);
        }

        spawnSync(
          'git',
          ['commit'].concat(process.argv.slice(2)).concat('-m'+ commitMsg),
          { stdio: 'inherit' }
        );
      });
  });
}
