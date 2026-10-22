package archive

// Collection identifies a Folge collection exposed by the Archiv API.
type Collection string

const (
	CollectionSerie    Collection = "serie"
	CollectionSpecials Collection = "specials"
)

// Folge is one item returned by the archive API.
type Folge struct {
	Number        *int64               `json:"number" tstype:"number | null,required"`
	Title         string               `json:"title"`
	ID            int64                `json:"id"`
	Collection    Collection           `json:"collection"`
	Description   *string              `json:"description" tstype:"string | null,required"`
	ReleaseDate   *string              `json:"release_date" tstype:"string | null,required"`
	TotalDuration *int64               `json:"total_duration" tstype:"number | null,required"`
	Streaming     map[string]Streaming `json:"streaming"`
	Cover         *string              `json:"cover" tstype:"string | null,required"`
	Weblink       *string              `json:"weblink" tstype:"string | null,required"`
	Artwork       *string              `json:"artwork" tstype:"string | null,required"`
	Authors       []string             `json:"authors"`
	ScriptAuthors []string             `json:"script_authors"`
	VoiceRoles    []VoiceRole          `json:"voice_roles"`
}

// VoiceRole pairs a character with one voice performer.
type VoiceRole struct {
	Role    string `json:"role"`
	Speaker string `json:"speaker"`
}

// SearchOptions contains distinct values available for archive search filters.
type SearchOptions struct {
	Speakers      []string     `json:"speakers"`
	Roles         []string     `json:"roles"`
	Authors       []string     `json:"authors"`
	ScriptAuthors []string     `json:"script_authors"`
	Collections   []Collection `json:"collections"`
}

// Streaming identifies an available streaming service and its URL.
type Streaming struct {
	Link string `json:"link"`
	ID   string `json:"id"`
}
