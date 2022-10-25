# diedreifragezeichen-db

## Contributing

Read the [Contribution Guide](CONTRIBUTING.md).

## API

### folgen

Get all folgen

GET `/api/folgen`

Get folge by folgeId

GET `/api/folgen/{folgeId}`

#### alts

Get alt folgen

GET `/api/folgen/{folgeId}/alts`

#### ratings

Add or update rating. Authenticated session required.

POST `/api/folgen/{folgeId}/ratings`

Request

```json
{
  "rating": 10
}
```

Response

Success: `201`

### user

All user api endpoints need to be access with a authenticated session. Otherwise a `401` `Unauthorized` will be returned.

Get user

GET `/api/user`

Delete user

DELETE `/api/user`

Response

Success: `204`

#### ratings

Get all user ratings

GET `/api/user/ratings`

Get user rating by folgeId

GET `/api/user/ratings?folgeId={folgeId}`

#### list

Get list

GET `/api/user/list`

Add folge to list

POST `/api/user/list`

Request

```json
{
  "folge": "{folgeId}"
}
```

Response

Success: `201`

Response

Success: `200`

Delete folge from list

DELETE `/api/user/list/{folgeId}`

Response

Success: `204`
