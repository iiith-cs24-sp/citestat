import { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { Work } from "../types";
import AuthorView from "../components/AuthorView";
import { useSearchParams } from "react-router-dom";

const AuthorPage: React.FC = () => {
	const [works, setWorks] = useState<Work[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams] = useSearchParams();
	const name: string = searchParams.get("name") as string;
	const dois: string[] = searchParams.getAll("doi");

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				// Fetch each DOI in parallel
				const fetches = dois.map(async (doi) => {
					const response = await fetch(
						`https://api.crossref.org/works/${doi}`,
					);
					if (!response.ok)
						throw new Error(
							response.status + " " + response.statusText,
						);

					return response.json();
				});
				const responses = await Promise.all(fetches);
				const works = responses.map(
					(response) => response.message as Work,
				);
				setWorks(works);
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

export default AuthorPage;
