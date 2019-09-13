import { ApolloClient, ApolloLink, HttpLink , InMemoryCache} from 'apollo-boost';
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from "./auth";

const endpointURL = 'http://localhost:9002/graphql'

// This handles the POST request stringify and header stuff
// as we recycle it often
// async function graphqlRequest(query, variables={}) {
//   const body = JSON.stringify({ query, variables})
//   console.log(body, "body");
//   console.log("I RAN");
//   const request = {
//     method: 'POST',
//     headers: {'content-type': 'application/json'},
//     body,
//   }
//   // if (isLoggedIn()) {
//   //   request.headers['authorization'] = 'Bearer ' + getAccessToken(); // this grabs off local storage
//   // }
//   const response = await fetch(endpointURL, request );
//   const responseBody = await response.json();
//   if (responseBody.errors) {
//     const message = responseBody.errors.map((error) => error.message).join('\n'); // Handles error checking
//     throw new Error(message);
//   }
//   return responseBody.data;
// }

const authLink = new ApolloLink((operation, forward) => {
  if(isLoggedIn()) {
    // request.headers['authorization'] = 'Bearer ' + getAccessTokoen();
    operation.setContext({
      headers: {
        'authorization': 'Bearer ' + getAccessToken()
      }
    });
  }
  return forward(operation);
})

const client = new ApolloClient({
  link: ApolloLink.from ([
    authLink, // get authorized before sending off any http requests
    new HttpLink({uri: endpointURL}), // communicates to server, what allows gql requests
  ]),
  cache: new InMemoryCache() // In memory cache prevents calling data when you have it already
});


// FRAGMENTS
const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

// GQL
const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;


const companyQuery = gql`
  query CompanyQuery($id: ID!) {
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

// For creating job, recycling queries what gets returned from mutation and
const jobQuery = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

const jobsQuery = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`;

export async function createJob(input) {
  const {data: {job}} = await client.mutate({
    mutation: createJobMutation,
    variables: {input},
    update: (cache, {data}) => {
      cache.writeQuery({
        query: jobQuery,
        variables: {id: data.job.id},
        data
      })
    }
  });
  return job;
}

export async function loadJob(id) {
  // const { job} = await graphqlRequest(query, {id});
  const {data: {job}} = await client.query({query: jobQuery, variables: {id}});
  return job;
}

export async function loadJobs() {

  // const {jobs} = await graphqlRequest(query)
  const {data: {jobs}} = await client.query({query: jobsQuery, fetchPolicy:'no-cache'}); // it won't use cache - forcing it to grab all posts if new items added
  return jobs;
}


export async function loadCompany(id) {
  // const {company} = await graphqlRequest(query, {id});
  const {data: {company}} = await client.query({query:companyQuery, variables: {id}});
  return company;
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
