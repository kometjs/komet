module.exports = {
  preset: 'karma',
  questions: [
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

  processAnswers({ issue, why, how }, firstLine) {
    const issueID = issue == 0 ? '' : `issue [#${issue}]\n\n`;
    const whyParsed = why == '' ? '' : `${why}\n\n`;
    const howParsed = how == '' ? '' : `${how}\n\n`;

    return [firstLine, '\n\n', issueID, whyParsed, howParsed].join('');
  },
};
