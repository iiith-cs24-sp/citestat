import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "./components/Searchbar";

const DOI = () => {
	const [data, setData] = useState<JSON>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const query = decodeURIComponent(useParams().doi as string);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`https://api.crossref.org/works/${query}`,
				);
				console.log(response);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);

				setData(await response.json());
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (query) fetchResults();
	}, [query]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;

	return (
		<div className="p-8">
			<Searchbar initialQuery={query} />
			<h2 className="text-3xl font-medium mb-6">DOI "{query}"</h2>
			{loading ? (
				<div className="skeleton h-full w-full rounded"></div>
			) : (
				<pre>{JSON.stringify(data, null, 4)}</pre>
			)}
		</div>
	);
};

export default DOI;
