/* eslint no-console: 'off' */
import argv from 'minimist-argv';
import { readFileSync, unlinkSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import prepareCommitMessage from './prepare-commit-msg';
import notification from './notifications';

export default function () {
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

  argv.path = '#temp_commit';
  prepareCommitMessage()
    .then(() => {
      execSync('$EDITOR \\#temp_commit', { stdio: 'inherit' });

      const commitMsg = readFileSync(argv.path);
      if (!commitMsg) {
        throw new Error('The commit message is empty');
      }

      spawnSync(
        'git',
        ['commit', '--cleanup=strip', `-m${commitMsg}`].concat(process.argv.slice(2)),
        { stdio: 'inherit' },
      );
    })
    .then(() => {
      unlinkSync(argv.path);
    })
    .catch((msg) => {
      notification.failure(msg);
      process.exit(1);
    });
}
