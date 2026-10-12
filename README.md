# ddfdb

Website and mobile app for browsing Die drei Fragezeichen Folgen and managing user-specific data.

Start with the [architecture overview](ARCHITECTURE.md) to understand the Archiv metadata service, user API, database ownership, and code locations. Contributors and coding agents should also read the [agent guidelines](AGENTS.md).

## API

### Legacy API

> [!WARNING]
> This API is considered legacy and will be deprecated in the future.

### Lists all folgen

GET `/api/folgen`

#### Parameters

##### Query parameters

| Param  | Description                                                                                                                              |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| limit  | Type `number` - limits the listed items (max 50)                                                                                         |
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

## Feature Implementation Plan

- Bookmarks
- Mobile App Auth & Ratings
- Google Auth
- AI Chat to get recommendations (https://ai-sdk.dev/cookbook/guides/rag-chatbot)
