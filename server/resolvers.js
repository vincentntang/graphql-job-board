const db = require('./db');

const Query = {
  company: (root, {id}) => db.companies.get(id),
  job: (root, {id}) => db.jobs.get(id), // See query  -  job(id: ID!): Job # Arguments
  jobs: () => db.jobs.list()
};

const Company = {
  jobs: (company) => db.jobs.list()
    .filter((job) => job.companyId === company.id)
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

// Basically, check the first query
// If it sees a nested list, match it with that specific name
// Query, Company, Job doesn't mean anything

module.exports = { Query, Company, Job};