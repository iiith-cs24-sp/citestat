import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import { Author, Work } from "../types";
import AuthorView from "../components/AuthorView";

/**
 * @property authorName - name of this author
 * @property works - publications by this author
 * @property loading : loading status
 * @property error: whether there was some error in fetching api results
 * @returns Stats related to orc id in react component
 */
export const ORCID: React.FC = () => {
	const [authorName, setAuthorName] = useState<string>();
	const [works, setWorks] = useState<Work[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const orcid = decodeURIComponent(useParams().orcid as string);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				const authorFetch = await fetch(
					`https://api.crossref.org/works?filter=orcid:${orcid}&select=author,editor&rows=1`,
				);
				if (!authorFetch.ok)
					throw new Error(
						authorFetch.status + " " + authorFetch.statusText,
					);

				await authorFetch.json().then((res) => {
					console.log(res);
					const work: Work = res.message.items[0];
					const contributors: Author[] = (work.author ?? []).concat(
						work.editor ?? [],
					);
					// Find author name from the list of authors using the ORCID
					const author: Author = contributors.find((author) =>
						author.ORCID?.includes(orcid),
					)!;
					console.log(contributors);
					setAuthorName(
						(author?.given ?? "") + " " + (author?.family ?? ""),
					);
				});

				const response = await fetch(
					`https://api.crossref.org/works?filter=orcid:${orcid}&sort=published&order=desc&rows=1000`,
				);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);

				await response.json().then((res) => {
					console.log(res);
					setWorks(
						res.message.items.filter(
							// Only authors, not editors
							(item: Work) =>
								item.author?.find((author) =>
									author.ORCID?.includes(orcid),
								) !== undefined,
						) as Work[],
					);
				});
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (orcid) fetchResults();
	}, [orcid]);

	useEffect(() => {
		const oldTitle = document.title;
		document.title = `Citestat | ${authorName}`;
		return () => {
			document.title = oldTitle;
		};
	}, [authorName]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;

	return (
		<div className="p-8">
			<Searchbar initialQuery={orcid} />
			{loading || !works || !authorName ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				AuthorView({
					name: authorName,
					orcid: orcid,
					works: works,
				})
			)}
		</div>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export default ORCID;
