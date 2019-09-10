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