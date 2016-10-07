import notification from './notifications';

export commit from './commit';
export prepareCommitMessage from './prepare-commit-msg';

process.on('unhandledRejection', (err) => {
  // console.log(err.stack);
  notification.failure(err.message || err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  notification.failure(err.message || err);
  process.exit(1);
});
