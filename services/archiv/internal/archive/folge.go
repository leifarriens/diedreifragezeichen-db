package archive

// Collection identifies the upstream Folge collection.
type Collection string

const (
	CollectionSerie   Collection = "serie"
	CollectionSpezial Collection = "spezial"
)

// Folge is one item returned by the archive API.
type Folge struct {
	Number        *int64            `json:"number" tstype:"number | null,required"`
	Title         string            `json:"title"`
	ID            int64             `json:"id"`
	Collection    Collection        `json:"collection"`
	Description   *string           `json:"description" tstype:"string | null,required"`
	ReleaseDate   *string           `json:"release_date" tstype:"string | null,required"`
	TotalDuration *int64            `json:"total_duration" tstype:"number | null,required"`
	Links         map[string]string `json:"links"`
	Cover         *string           `json:"cover" tstype:"string | null,required"`
	Weblink       *string           `json:"weblink" tstype:"string | null,required"`
	Artwork       *string           `json:"artwork" tstype:"string | null,required"`
}
