# diedreifragezeichen-db

## Setup

### Database

Set MONGO_URI to full connection string with /${database_name}.

### Folgen sync

To use cron folgen sync with github workflows set `ACTION_KEY` secret on github and `APP_KEY` on vercel to a matching value.

### Authentication

Set `NEXTAUTH_URL` to your host url.

Set `{AUTH_PROVIDER}_CLIENT_ID` and `{AUTH_PROVIDER}_CLIENT__SECRET`

## API

Get all folgen

GET `/api/folgen`

Get folge by ID

GET `/api/folgen/{id}`

Get alt folgen

GET `/api/folgen/{id}/alts`

Authenticatin is required for GET and POST /rating

Get user rating for folge

GET `/api/folgen/{id}/rating`

Post user rating

POST `/api/folgen/{id}/rating`
