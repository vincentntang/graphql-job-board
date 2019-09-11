import { isLoggedIn, getAccessToken } from "./auth";

const endpointURL = 'http://localhost:9002/graphql'

// This handles the POST request stringify and header stuff
// as we recycle it often
async function graphqlRequest(query, variables={}) {
  const request = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ query, variables})
  }
  if (isLoggedIn()) {
    request.headers['authorization'] = 'Bearer ' + getAccessToken(); // this grabs off local storage
  }
  const response = await fetch(endpointURL, request );
  const responseBody = await response.json();
  if (responseBody.errors) {
    const message = responseBody.errors.map((error) => error.message).join('\n'); // Handles error checking
    throw new Error(message);
  }
  return responseBody.data;
}

export async function createJob(input) {
  console.log(input, "async function createJob");
  const query = `mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input) {
      id
      title
      company {
        id
        name
      }
    }
  }`;
  const {job} = await graphqlRequest(query,{input});
  return job;
}

export async function loadCompany(id) {
  const query = `query CompanyQuery($id : ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }`;

  const {company} = await graphqlRequest(query, {id});
  return company;
}

export async function loadJob(id) {
  const query = `query JobQuery($id: ID!) {
    job(id: $id){
      id
      title
      company {
        id
        name
      }
      description
    }
  }`
  const { job} = await graphqlRequest(query, {id});
  return job
}

// export async function loadJob(id) {
//   const response = await fetch(endpointURL, {
//     method: 'POST',
//     headers: {'content-type': 'application/json'},
//     body: JSON.stringify({
//       query: `query JobQuery($id: ID!) {
//         job(id: $id){
//           id
//           title
//           company {
//             id
//             name
//           }
//           description
//         }
//       }`,
//       variables: {id}
//     })
//   });
//   const responseBody = await response.json();
//   return responseBody.data.job;
// }

export async function loadJobs() {
  const query = `{
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }`
  const {jobs} = await graphqlRequest(query)
  return jobs;
}

// export async function loadJobs() {
//   const response = await fetch(endpointURL, {
//     method: 'POST',
//     headers: {'content-type': 'application/json'},
//     body: JSON.stringify({
//       query: `{
//         jobs {
//           id
//           title
//           company {
//             id
//             name
//           }
//         }
//       }`
//     })
//   });
//   const responseBody = await response.json();
//   return responseBody.data.jobs;
// }
