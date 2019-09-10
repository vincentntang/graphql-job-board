# Job Board GraphQL Example

Sample GraphQL application with a Node/Express backend and a React frontend.

# Notes

1. You can leave off the word `query` in the script, not necessary. GraphQL knows
2. restart graphql if it's not working

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