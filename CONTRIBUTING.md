# diedreifragezeichen-db Contribution Guide

## Prerequisites

- Node.js version >=16.17.0
- yarn version 1.22.19
- mongoDB version >=6.0.1

## Note

Before putting a lot of work into a new feature please start a [Discussion](https://github.com/leifarriens/diedreifragezeichen-db/discussions) at the original repo to evaluate with other contributors.

## Getting started

### Local development setup

Create a fork of the repository and clone it to your local machine:

```sh
git clone https://github.com/{username}/diedreifragezeichen-db.git
```

Checkout the `main` branch:

```sh
git checkout main
```

Install the dependencies using yarn:

```sh
yarn
```

Before you can run the project locally you have to set every required environment variable defined in the `.env.example` file.

Run the project in development mode:

```sh
yarn dev
```

### Sync Folgen to your (local) Database

However you setup your mongoDB instance you have to populate it with the DDF Folgen. Perform a request with the `APP_KEY` as the Bearer Token using your favorite HTTP client:

`GET http://localhost:3000/api/folgen/sync`

Before working on a new feature checkout a new branch:

```sh
git checkout -b feature/awesome
```

### Pull request

Create a pull request to the original repo.
