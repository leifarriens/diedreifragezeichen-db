# diedreifragezeichen-db

## Contributing

Read the [Contribution Guide](CONTRIBUTING.md).

## API

### Lists all folgen

GET `/api/folgen`

#### Parameters

##### Query parameters

| Param  | Description                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Type `number` - limits the listed items (max 20)                                                                                         |
| offset | Type `number` - skips the `offset` amount of results                                                                                     |
| sort   | Type `string` - determines the order of the returned data. Possible values are: `['release_date', '-release_date', 'rating', '-rating']` |

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
