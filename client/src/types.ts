export interface Author {
	ORCID?: string;
	given: string;
	family: string;
	sequence: string;
	affiliation: Affiliation[];
}

export interface Affiliation {
	name: string;
}

export interface DateParts {
	"date-parts": number[][];
}

export interface DateAndVersion {
	date: DateParts;
	"date-time": Date;
	timestamp: number;
}

export interface Date {
	"date-parts": number[][];
	"date-time": string;
	timestamp: number;
}

export interface WorkDomain {
	domain: string[];
	crossmark_restriction: boolean;
}

export interface Resources {
	resource: string[];
}

export interface WorkFreeToRead {
	"free-to-read": boolean;
}

export interface WorkJournalIssue {
	issue: string;
	"published-print": DateParts;
}

export interface WorkRelation {
	relation: string[];
}

export interface Work {
	institution?: string;
	indexed: DateAndVersion;
	posted?: DateParts;
	"publisher-location"?: string;
	"update-to"?: string;
	"standards-body"?: string;
	"edition-number"?: string;
	"group-title"?: string;
	"reference-count"?: number;
	reference?: Work[];
	publisher: string;
	issue?: string;
	"isbn-type"?: string;
	license?: string;
	funder?: string;
	"content-domain"?: WorkDomain;
	chair?: string;
	"short-container-title"?: string;
	accepted?: DateParts;
	"content-updated"?: DateParts;
	"published-print"?: DateParts;
	abstract?: string;
	DOI: string;
	type: string;
	created: Date;
	approved?: DateParts;
	page?: string;
	"update-policy"?: string;
	source: string;
	"is-referenced-by-count"?: number;
	title?: string;
	prefix: string;
	volume?: string;
	"clinical-trial-number"?: string;
	author?: Author[];
	member: string;
	"content-created"?: DateParts;
	"published-online"?: DateParts;
	"container-title"?: string;
	"original-title"?: string;
	language?: string;
	link?: string;
	deposited: Date;
	score: number;
	degree?: string;
	resource: Resources;
	subtitle?: string;
	translator?: string;
	"free-to-read"?: WorkFreeToRead;
	editor?: Author[];
	"proceedings-subject"?: string;
	"component-number"?: string;
	"short-title"?: string;
	issued: DateParts;
	ISBN?: string;
	"references-count"?: number;
	"part-number"?: string;
	"issue-title"?: string;
	"journal-issue"?: WorkJournalIssue;
	"alternative-id"?: string;
	URL: string;
	archive?: string;
	relation?: WorkRelation;
	ISSN?: string;
	"issn-type"?: string;
	subject?: string;
	"published-other"?: DateParts;
	published?: DateParts;
	assertion?: string;
	subtype?: string;
	"article-number"?: string;
}

export interface CrossRefResponse {
	message: {
		items: Work[];
	};
}

/**
* for parsing citations query from opencitations api 
* Sample 
* 
        "timespan": "P0Y11M",
        "oci": "06101335997-06180294718",
        "journal_sc": "no",
        "cited": "10.3389/fimmu.2020.602256",
        "creation": "2021-12",
        "author_sc": "no",
        "citing": "10.1016/j.isci.2021.103478"
 */
export interface Citation {
	timespan: string;
	oci: string;
	journal_sc: string;
	cited: string;
	creation: string;
	author_sc: string;
	citing: string;
}

export interface OpencitationsResponse {
	items: Citation[];
}
