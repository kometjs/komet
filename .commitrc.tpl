module.exports = {
  questions: [
    {
      type: 'list',
      name: 'type',
      message: 'type:',
      choices: [
        { name: 'feat: new feature for the user, not a new feature for build script', value: 'feat', short: 'feat' },
        { name: 'fix: bug fix for the user, not a fix to a build script', value: 'fix', short: 'fix' },
        { name: 'docs: changes to the documentation', value: 'docs', short: 'docs' },
        { name: 'style: formatting, missing semi colons, etc; no production code change', value: 'style', short: 'style' },
        { name: 'refactor: refactoring production code, eg. renaming a variable', value: 'refactor', short: 'refactor' },
        { name: 'test: adding missing tests, refactoring tests; no production code change', value: 'test', short: 'test' },
        { name: 'chore: updating tasks, dependencies etc; no production code change', value: 'chore', short: 'chore' },
      ],
    },
    {
      name: 'scope',
      message: 'scope:',
      default: '',
      filter: scope => scope.toLowerCase(),
    },
    {
      name: 'subject',
      message: 'subject:',
      default: '',
      filter: subject => subject.toLowerCase(),
    },
    {
      name: 'issue',
      message: 'What issue this commit solves? (issue ID)',
      default: 0,
      validate: issue => Number.isInteger(parseInt(issue)),
    },
    {
      name: 'why',
      message: 'Why is this change necessary?',
      default: '',
    },
    {
      name: 'how',
      message: 'How this change address the issue?',
      default: '',
    }
  ],

  processAnswers: ({type, scope, subject, issue, why, how}) => {
    const issueID = issue == 0 ? '' : `issue [#${issue}]\n\n`;
    const whyParsed = why == '' ? '' : `${why}\n\n`;
    const howParsed = how == '' ? '' : `${how}\n\n`;

    const firstLine = `${type}${scope ? `(${scope})` : ''}: ${subject}`;

    if (firstLine.length > 70) {
      console.log(`First line too long, expecting less than 70 chars, got ${firstLine.length}`);
      process.exit(1);
    }

    return [firstLine, '\n\n', issueID, whyParsed, howParsed].join('');
  },
};
