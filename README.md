# Job Board GraphQL Example

Sample GraphQL application with a Node/Express backend and a React frontend.

# Notes

1. You can leave off the word `query` in the script, not necessary. GraphQL knows
2. restart graphql if it's not working

Querying twice in a row, means you have to have two resolve cases

```
{
  jobs {
    id
    title
    company {
      id
      name
    }
  }
}
```

JobQuery is an optional name but might be useful for debugging. Using the word `query` is necessary when passing variables

```
query JobQuery {
  job(id: "rJKAbDd_z"){
    id
    title
    company {
      id
      name
    }
    description
  }
}
```

expressJwt used here for generating token

STOPPED AT VIDEO 23 - It worked fine on insomnia, but it had problems when testing it on client with end user