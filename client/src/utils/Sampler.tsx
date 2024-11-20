import { Work } from "../types";

async function fetchSample() {
	let response = null;
	do {
		response = await fetch(
			"https://api.crossref.org/works?sample=1&filter=has-orcid%3A1&select=author,editor,DOI",
		);
	} while (!response.ok);
	return response.json();
}

/**
 * Get a random ORCID from the CrossRef API
 * @returns a random ORCID
 */
export async function getRandomORCID(): Promise<string> {
	// Fetch a random sample of works with ORCID
	const data = await fetchSample();
	// At least one author/editor should have an ORCID
	// Find and return the ORCID
	const item: Work = data.message.items[0];
	const contributors = (item.author ?? []).concat(item.editor ?? []);
	const author = contributors.find((author) => author.ORCID !== undefined);
	if (!author || !author.ORCID) {
		throw new Error("No ORCID found");
	}
	// Extract the ORCID from the URL
	return author.ORCID.replace("http://orcid.org/", "");
}

/**
 * Get a random DOI from the CrossRef API
 * @returns a random DOI
 */
export async function getRandomDOI(): Promise<string> {
	// Fetch a random sample of works
	const data = await fetchSample();
	// Find and return the DOI
	const item: Work = data.message.items[0];
	if (!item.DOI) {
		throw new Error("No DOI found");
	}
	return item.DOI;
}
