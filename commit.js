/* eslint no-console: 'off' */
const argv = require('minimist-argv');
const { readFileSync, unlinkSync } = require('fs');
const { execSync, spawnSync } = require('child_process');


['p', 'C', 'c', 'm', 't'].forEach((argKey) => {
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
].forEach((argKey) => {
  if (argv[argKey]) {
    console.log(`Argument --${argKey} not supported`);
    process.exit(1);
  }
});


argv._[0] = '#temp_commit';
require('./prepare-commit-msg.js')().then(() => {
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
      ['commit'].concat(process.argv.slice(2)).concat(`-m${commitMsg}`),
      { stdio: 'inherit' }
    );
  });
});
