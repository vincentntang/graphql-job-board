const db = require('./db');

const Query = {
  company: (root, {id}) => db.companies.get(id),
  job: (root, {id}) => db.jobs.get(id), // See query  -  job(id: ID!): Job # Arguments
  jobs: () => db.jobs.list()
};
// const Mutation = {
//   createJob: (root, {input}, context) => { 
//     console.log('context:', context);
//     // return db.jobs.create({companyId, title, description}); // create is part of the fakeDB we're using
//     // const id = db.jobs.create(input); // SIDE-EFFECT by making it a job object instead of id, now means we can grab more data from frontend
//     // return db.jobs.get(id);
//   }
// }

const Mutation = {
  createJob: (root, {input}, {user}) => { // {user} = context.user
    if (!user) {
      throw new Error('Unauthorized');
    }
    const id = db.jobs.create(input); // SIDE-EFFECT by making it a job object instead of id, now means we can grab more data from frontend
    return db.jobs.get(id);
    // console.log('context:', context); // context: { user: { sub: 'BJrp-DudG', iat: 1568206680 } }
    // return null;
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