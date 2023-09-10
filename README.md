# diedreifragezeichen-db

## Contributing

Read the [Contribution Guide](CONTRIBUTING.md).

## API

### API access

Get your `apikey` from your [Account page](http://www.ddfdb.de/profil/account) and add it as a query param to your request url.

| Param  | Description                 |
| ------ | --------------------------- |
| apikey | Type `string` - user apikey |

### Lists all folgen

GET `/api/folgen`

#### Parameters

##### Query parameters

| Param  | Description                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Type `number` - limits the listed items (max 20)                                                                                         |
| offset | Type `number` - skips the `offset` amount of results                                                                                     |
| sort   | Type `string` - determines the order of the returned data. Possible values are: `['release_date', '-release_date', 'rating', '-rating']` |
| query  | Type `string` - search for `name` and `number`                                                                                           |

##### HTTP response status codes

| Status code | Description  |
| ----------- | ------------ |
| `200`       | OK           |
| `304`       | Not modified |
| `400`       | Bad request  |

### Get folge by folgeId

GET `/api/folgen/{folgeId}`

##### HTTP response status codes

| Status code | Description  |
| ----------- | ------------ |
| `200`       | OK           |
| `304`       | Not modified |
| `404`       | Not found    |
