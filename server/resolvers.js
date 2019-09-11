const db = require('./db');

const Query = {
  company: (root, {id}) => db.companies.get(id),
  job: (root, {id}) => db.jobs.get(id), // See query  -  job(id: ID!): Job # Arguments
  jobs: () => db.jobs.list()
};

const Mutation = {
  createJob: (root, {companyId, title, description}) => { 
    console.log("MUTATION RAN")
    return db.jobs.create({companyId, title, description}); // create is part of the fakeDB we're using
  }
}

const Company = {
  jobs: (company) => db.jobs.list()
    .filter((job) => job.companyId === company.id)
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

// Basically, check the first query
// If it sees a nested list, match it with that specific name
// Query, Company, Job names must match the schema.graphql
// Because it's loaded in Apolloserver

module.exports = { Query, Company, Job, Mutation}; // Make sure to specify all exports