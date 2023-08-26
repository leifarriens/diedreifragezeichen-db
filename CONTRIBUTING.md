# diedreifragezeichen-db Contribution Guide

## Prerequisites

- Node.js version >=16.17.0
- pnpm version >=8.6.0
- mongoDB version >=6.0.1

## Note

Before putting a lot of work into a new feature please start a [Discussion](https://github.com/leifarriens/diedreifragezeichen-db/discussions) at the original repo to evaluate with other contributors.

## Getting started

### Local development setup

Create a fork of the repository and clone it to your local machine:

```sh
git clone https://github.com/{username}/diedreifragezeichen-db.git
```

Checkout the `development` branch:

```sh
git checkout development
```

Install the dependencies using pnpm:

```sh
pnpm i
```

Before you can run the project locally you have to set every required environment variable defined in the `.env.example` file.

You can run a mongoDB locally with docker:

```sh
docker compose up -d
```

Run the project in development mode:

```sh
pnpm dev
```

### Sync Folgen to your (local) Database

However you setup your mongoDB instance you have to populate it with the DDF Folgen. Perform a request with the `APP_KEY` as the Bearer Token using your favorite HTTP client:

`GET http://localhost:3000/api/sync/folgen`

Before working on a new feature checkout a new branch:

```sh
git checkout -b feature/awesome
```

### Pull request

Create a pull request to the original repo.
