import { ApolloClient, ApolloLink, HttpLink , InMemoryCache} from 'apollo-boost';
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from "./auth";

const endpointURL = 'http://localhost:9002/graphql'

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

export async function createJob(input) {
  console.log(input, "async function createJob");
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput){
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }`;
  // const {job} = await graphqlRequest(query,{input});
  const {data: {job}} = await client.mutate({mutation, variables: {input}});
  return job;
}

export async function loadCompany(id) {
  const query = gql`query CompanyQuery($id : ID!) {
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

  // const {company} = await graphqlRequest(query, {id});
  const {data: {company}} = await client.query({query, variables: {id}});
  return company;
}

export async function loadJob(id) {
  // const query = `query JobQuery($id: ID!) {
  //   job(id: $id){
  //     id
  //     title
  //     company {
  //       id
  //       name
  //     }
  //     description
  //   }
  // }`
  const query = gql`query JobQuery($id: ID!) {
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
  const {data: {job}} = await client.query({query, variables: {id}});
  return job;
  // const { job} = await graphqlRequest(query, {id});
  // return job
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
  const query = gql`{
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }`
  // const {jobs} = await graphqlRequest(query)
  const {data: {jobs}} = await client.query({query});
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
