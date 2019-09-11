const db = require('./db');

const Query = {
  job: (root, {id}) => db.jobs.get(id), // See query  -  job(id: ID!): Job # Arguments
  jobs: () => db.jobs.list()
};

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

module.exports = { Query, Job};