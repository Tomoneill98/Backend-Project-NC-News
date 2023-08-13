# Backend Project: Readdit News

## Introduction
This is the backend section of the Readdit News project which was built with a Node-Postgres API created with PSQL, Express, Node.js and Jest. 
Various API endpoints are connected to the database and each responds with different content dependent on the endpoint inputted. For example, you can request each possible user with the "/users" endpoint or view all of the articles to read with the "articles" endpoint. Individual articles can be found by specifying an article ID such as "/articles/6". 

## Website
https://northcoders-news-fsce.onrender.com/api/

## Set-up guide
1. Clone the repository
```console
git clone https://github.com/Tomoneill98/Backend-Project-Readdit-News.git
```

2. Install dependencies
```console
npm install
npm install -D jest
npm install -D jest-sorted
```

3. Add Files to Connect Two Databases Locally

You will need to create two .env files for your project: .env.test and .env.development. 
Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double-check that these .env files are .gitignored.

- .env.development (in here write PGDATABASE=nc_news)
- .env.test (in here write PGDATABASE=nc_news_test)

4. Seed the database
```console
npm run seed
```

## Testing
To run the tests:
```console
npm test
```

## Requirements
- Postgres: 3.3.4
- Node JS: 0.4.0
