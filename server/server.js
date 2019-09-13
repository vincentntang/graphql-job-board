// const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');  - VERSION 1.0 APOLLO SERVER
const {ApolloServer, gql} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('./db');


const port = 9002;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const typeDefs = gql(fs.readFileSync('./schema.graphql', {encoding: 'utf-8'})); // VERSION 2.0 pass gql function
const resolvers = require('./resolvers');

const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));

const graphqlServer = new ApolloServer({
  typeDefs, 
  resolvers,
  context: ({req}) => ({user: req.user && db.users.get(req.user.sub)})
  // playground: false // for production
}); // VERSION 2.0 - Pass a third 
graphqlServer.applyMiddleware({app}); // VERSION 2.0 - has graphql path by default
// graphql is our main endpoint - VERSION 1.0 APOLLO SERVER
// const schema = makeExecutableSchema({typeDefs, resolvers})
// app.use('/graphql', graphqlExpress((req) => ({
//   schema,
//   context: {user: req.user && db.users.get(req.user.sub)} //context is { id: 'BJrp-DudG', email: 'alice@facegle.io', password: 'alice123', companyId: 'HJRa-DOuG' } 
//   // context: {user: req.user} // context only has user id {id: 'BJrp-DudG'}
// })));

// // This is our playground endpoint
// app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

// I think this is an old endpoint - tba removed later
app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
  res.send({token});
});

app.listen(port, () => console.info(`Server started on port ${port}`));
