import { useEffect, useMemo, useState } from "react";
import Searchbar from "../components/Searchbar";
import { Work } from "../types";
import AuthorView from "../components/AuthorView";
import { useSearchParams } from "react-router-dom";

/**
 *  works  :
 * loading : loading status
 * error: whether there was some error in fetching api results
 *  searchParams : search parameters extracted from url
 * @returns Author page functional component
 */
const AuthorPage: React.FC = () => {
	const [works, setWorks] = useState<Work[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams] = useSearchParams();
	const name: string = searchParams.get("name") as string;
	const dois: string[] = useMemo(
		() => searchParams.getAll("doi"),
		[searchParams],
	); // This is necessary as searchParams is an object that changes on every render.

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				// Batch the DOIs into a single request
				const response = await fetch(
					`https://api.crossref.org/works?filter=doi:${dois.join(",doi:")}&sort=published&order=desc&rows=1000`,
				);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);

				await response.json().then((res) => {
					setWorks(res.message.items);
				});
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (dois) fetchResults();
	}, [dois]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;

	return (
		<div className="p-8">
			<Searchbar initialQuery={name} />
			{loading || !works || !name ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				AuthorView({
					name: name,
					works: works,
				})
			)}
		</div>
	);
};
/**
 *  works  :
 * loading : loading status
 * error: whether there was some error in fetching api results
 *  searchParams : search parameters extracted from url
 * @returns Author page functional component
 */
export default AuthorPage;
