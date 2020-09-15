# HackerNews Server

This is a documentation of hacker news clone graphql api, this api is built using small reusable feature based parts

**_API is deployed here: [https://maa-hacker-news.herokuapp.com/](https://maa-hacker-news.herokuapp.com/)_**

## Table of Contents

- [Installation and Setup Instructions](#installation-and-setup-instructions)
- [Technologies](#technologies)
  - [Dependencies](#dependencies)
  - [Dev Dependencies](#dev-dependencies)
- [Prisma](#prisma)
- [Modules](#modules)
- [Type Definitions](#type-definitions)

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

**_Installation:_**

`npm install`

**_Database URL:_**

_Rename `prisma/.env.example` to `prisma/.env` and assign database url_

**_Nodemon Environemnt Variables:_**

_Rename `nodemon.example.json` to `nodemon.json` and assign APP_SECRET to a string of your own_

**_To Start Server with Nodemon(Recomended in Development):_**

`npm run dev`

**_To Start Server:_**

`npm start`

**_To Visit App:_**

`localhost:4000`

## Technologies

### Dependencies

- Apollo Server
- GraphQL Tools
- Graphql Subscriptions
- Prisma Client
- Bcrypt
- Json Web Token

### Dev Dependencies

- Prisma CLI
- Nodemon

## Prisma

This API uses prisma migrate and client open source database toolkit.

- `schema.prisma` file has database tables and columns schema defintions, it uses postgresql database.
- `npx prisma migrate save --experimental` saves a migratation file in prisma folder.
- `npx prisma migrate up --experimental` command line retrieves database url from .env file and migrate `schema.prisma` file into database.
- `prisma generate` command line is used to generate prisma client which is used for CRUD operations.

## Modules

> A module consists of a type file and a resolver file, then they are merged together.
> Every type file has its own root types (Query, Mutation, Subscription, etc...) and its own object type.

| Module      | Type Definition  | Resolver        |
| ----------- | ---------------- | --------------- |
| User Module | userType.graphql | userResolver.js |
| Link Module | linkType.graphql | linkResolver.js |
| Vote Module | voteType.graphql | voteResolver.js |

## Type Definitions

### User Type

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  links: [Link!]!
}

type Mutation {
  signup(email: String!, password: String!, name: String!): AuthPayload
  login(email: String!, password: String!): AuthPayload
}
```

---

### Link Type

```graphql
scalar Date

type Link {
  id: ID!
  createdAt: Date!
  description: String!
  url: String!
  postedBy: User
  votes: [Vote!]!
}

type Query {
  info: String!
  feed(filter: String, skip: Int, take: Int, orderBy: LinkOrderByInput): Feed!
}

type Feed {
  links: [Link!]!
  count: Int!
}

type Mutation {
  post(url: String!, description: String!): Link!
}

type Subscription {
  newLink: Link
}

input LinkOrderByInput {
  description: Sort
  url: Sort
  createdAt: Sort
}

enum Sort {
  asc
  desc
}
```

---

### Vote Type

```graphql
type Vote {
  id: ID!
  link: Link!
  user: User!
}

type Mutation {
  vote(linkId: ID!): Vote
}

type Subscription {
  newVote: Vote
}
```

---

### Auth Payload Type

```graphql
type AuthPayload {
  token: String
  user: User
}
```
