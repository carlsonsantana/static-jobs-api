const fs = require('fs');

const jobsPromise = require('jobs-promise');

const REPOSITORIES = process.env.REPOSITORIES.split(',').map((repository) => {
  const [owner, repo] = repository.split('/');
  return {owner, repo};
});

const THIRTY_DAYS_AGO = new Date(Date.now() - 2592000000);
THIRTY_DAYS_AGO.setMilliseconds(0);
THIRTY_DAYS_AGO.setSeconds(0);
THIRTY_DAYS_AGO.setMinutes(0);
THIRTY_DAYS_AGO.setHours(0);

jobsPromise.githubIssuesPromise(REPOSITORIES, THIRTY_DAYS_AGO).then((jobs) => {
  const sortedJobs = jobs.sort((job1, job2) => {
    return (job1.publishedAt.getTime() > job2.publishedAt.getTime()) ? -1 : 1;
  });
  fs.writeFileSync('./data.json', JSON.stringify(sortedJobs));
});
