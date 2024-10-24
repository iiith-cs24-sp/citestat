export interface Author {
	given: string;
	family: string;
}

export interface Work {
	DOI: string;
	title: string[];
	author: Author[];
	"is-referenced-by-count": number;
}

export interface CrossRefResponse {
	message: {
		items: Work[];
	};
}
