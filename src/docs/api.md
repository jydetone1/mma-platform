# API Documentation

## Setup

1. Install dependencies: `npm install`
2. Configure PostgreSQL and Redis in `.env`.
3. Run the server: `npm run start:dev`

## Example Queries and Mutations

### Get Fighter, Get Rankings, Create Fighter, Create fight, Update Fight Results

```graphql
query {
  fighter(id: 1) {
    id
    firstName
    lastName
    weightClass
    fightHistory {
      outcome
      method
    }
  }
}

mutation {
  createFighter(
    input: { firstName: "John", lastName: "Cent", weightClass: "Lightweight" }
  ) {
    id
    firstName
    lastName
  }
}

mutation {
  createFight(
    input: {
      eventId: 1
      fighter1Id: 1
      fighter2Id: 2
      result: "win"
      method: "knockout"
      round: 1
      time: "00:02:30"
    }
  ) {
    id
    result
    method
    createdAt
  }
}

mutation {
  updateFightResult(
    id: 1
    input: { result: "win", method: "knockout", round: 1, time: "02:30" }
  ) {
    id
    result
  }
}

query {
  rankings(weightClass: "Lightweight") {
    fighter {
      firstName
      lastName
    }
    rankPosition
    points
    lastFightDate
  }
}
```
