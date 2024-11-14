export interface CSLData {
	type:
		| "article"
		| "article-journal"
		| "article-magazine"
		| "article-newspaper"
		| "bill"
		| "book"
		| "broadcast"
		| "chapter"
		| "classic"
		| "collection"
		| "dataset"
		| "document"
		| "entry"
		| "entry-dictionary"
		| "entry-encyclopedia"
		| "event"
		| "figure"
		| "graphic"
		| "hearing"
		| "interview"
		| "legal_case"
		| "legislation"
		| "manuscript"
		| "map"
		| "motion_picture"
		| "musical_score"
		| "pamphlet"
		| "paper-conference"
		| "patent"
		| "performance"
		| "periodical"
		| "personal_communication"
		| "post"
		| "post-weblog"
		| "regulation"
		| "report"
		| "review"
		| "review-book"
		| "software"
		| "song"
		| "speech"
		| "standard"
		| "thesis"
		| "treaty"
		| "webpage";
	id: string | number;
	"citation-key"?: string;
	categories?: string[];
	language?: string;
	journalAbbreviation?: string;
	shortTitle?: string;
	author?: NameVariable[];
	chair?: NameVariable[];
	"collection-editor"?: NameVariable[];
	compiler?: NameVariable[];
	composer?: NameVariable[];
	"container-author"?: NameVariable[];
	contributor?: NameVariable[];
	curator?: NameVariable[];
	director?: NameVariable[];
	editor?: NameVariable[];
	"editorial-director"?: NameVariable[];
	"executive-producer"?: NameVariable[];
	guest?: NameVariable[];
	host?: NameVariable[];
	interviewer?: NameVariable[];
	illustrator?: NameVariable[];
	narrator?: NameVariable[];
	organizer?: NameVariable[];
	"original-author"?: NameVariable[];
	performer?: NameVariable[];
	producer?: NameVariable[];
	recipient?: NameVariable[];
	"reviewed-author"?: NameVariable[];
	"script-writer"?: NameVariable[];
	"series-creator"?: NameVariable[];
	translator?: NameVariable[];
	accessed?: DateVariable;
	"available-date"?: DateVariable;
	"event-date"?: DateVariable;
	issued?: DateVariable;
	"original-date"?: DateVariable;
	submitted?: DateVariable;
	abstract?: string;
	annote?: string;
	archive?: string;
	archive_collection?: string;
	archive_location?: string;
	"archive-place"?: string;
	authority?: string;
	"call-number"?: string;
	"chapter-number"?: string | number;
	"citation-number"?: string | number;
	"citation-label"?: string;
	"collection-number"?: string | number;
	"collection-title"?: string;
	"container-title"?: string;
	"container-title-short"?: string;
	dimensions?: string;
	division?: string;
	DOI?: string;
	edition?: string | number;
	event?: string; // Deprecated
	"event-title"?: string;
	"event-place"?: string;
	"first-reference-note-number"?: string | number;
	genre?: string;
	ISBN?: string;
	ISSN?: string;
	issue?: string | number;
	jurisdiction?: string;
	keyword?: string;
	locator?: string | number;
	medium?: string;
	note?: string;
	number?: string | number;
	"number-of-pages"?: string | number;
	"number-of-volumes"?: string | number;
	"original-publisher"?: string;
	"original-publisher-place"?: string;
	"original-title"?: string;
	page?: string | number;
	"page-first"?: string | number;
	part?: string | number;
	"part-title"?: string;
	PMCID?: string;
	PMID?: string;
	printing?: string | number;
	publisher?: string;
	"publisher-place"?: string;
	references?: string;
	"reviewed-genre"?: string;
	"reviewed-title"?: string;
	scale?: string;
	section?: string;
	source?: string;
	status?: string;
	supplement?: string | number;
	title?: string;
	"title-short"?: string;
	URL?: string;
	version?: string;
	volume?: string | number;
	"volume-title"?: string;
	"volume-title-short"?: string;
	"year-suffix"?: string;
	custom?: JSON;
}

export interface NameVariable {
	family?: string;
	given?: string;
	"dropping-particle"?: string;
	"non-dropping-particle"?: string;
	suffix?: string;
	"comma-suffix"?: string | number | boolean;
	"static-ordering"?: string | number | boolean;
	literal?: string;
	"parse-names"?: string | number | boolean;
}

export interface DateVariable {
	"date-parts"?: (string | number)[][];
	season?: string | number;
	circa?: string | number | boolean;
	literal?: string;
	raw?: string;
}
