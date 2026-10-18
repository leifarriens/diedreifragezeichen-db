# ddfdb

Website and mobile app for browsing Die drei Fragezeichen Folgen and managing user-specific data.

Start with the [architecture overview](ARCHITECTURE.md) to understand the Archiv metadata service, user API, database ownership, and code locations. Contributors and coding agents should also read the [agent guidelines](AGENTS.md).

## API

### Legacy API

> [!WARNING]
> This API is considered legacy and will be deprecated in the future.

> [!INFO]
> The legacy API no longer requires an API key (formerly named `apikey`).

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

### Folgen Response Example

> [!Tip]
> The `id` field is the ID used by the new Archive API. `_id` is the legacy ID.

```json
{
  "_id": "6a1b5c18b4ca864fa6d86468",
  "created_at": "2026-05-30T21:52:24.927Z",
  "deezer_id": "945481241",
  "id": 430,
  "images": [
    {
      "height": 640,
      "url": "https://i.scdn.co/image/ab67616d0000b27394a88ff27c87eca641f10725",
      "width": 640
    }
  ],
  "inhalt": "Wer hat die Bibliothek von Mr. Lehmann verwüstet? ...",
  "isHidden": false,
  "name": "Das Geheimnis der sieben Palmen",
  "number": "239",
  "number_of_ratings": 0,
  "popularity": 0,
  "rating": 0,
  "release_date": "2026-05-22T00:00:00.000Z",
  "spotify_id": "2mh0BDhRAJFa7clABwut3L",
  "sprecher": "Erzähler - Axel Milberg \nJustus Jonas, Erster Detektiv - Oliver Rohrbeck ...",
  "type": "regular",
  "upc": "",
  "updated_at": "2026-08-10T20:54:12.178Z",
  "weblink": "https://www.dreifragezeichen.de/produktwelt/details/das-geheimnis-der-sieben-palmen"
}
```

## Development

### Prerequisites

- [pnpm](https://pnpm.io/) — install dependencies and run project scripts
- [Docker](https://www.docker.com/) — run the development environment
- [mise](https://mise.jdx.dev/) — manage the development tools

### Setup

Install the project dependencies using pnpm:

```bash
pnpm install
```

Start the development environment using Docker:

```bash
docker compose up
```

Start the development server using pnpm:

```bash
pnpm dev
```

Install the agent skills (optional):

```bash
pnpx skills experimental_install
```
