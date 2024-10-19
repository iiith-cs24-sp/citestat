export interface Author {
	given: string;
	family: string;
}

export interface Work {
	DOI: string;
	title: string[];
	author: Author[];
	"published-print"?: { "date-parts": number[][] };
	URL: string;
}

export interface CrossRefResponse {
	message: {
		items: Work[];
	};
}
