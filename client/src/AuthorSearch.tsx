import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CrossRefResponse, Author as AuthorType } from "./types";

const AuthorSearch = () => {
	const [authors, setAuthors] = useState<AuthorType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { search } = useLocation();
	const query = new URLSearchParams(search).get("name");

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const response = await fetch(
					`https://api.crossref.org/works?query.author=${encodeURIComponent(query || "")}`,
				);

				if (!response.ok) throw new Error("Failed to fetch data");

				const data: CrossRefResponse = await response.json();
				const allAuthors = data.message.items.flatMap(
					(work) => work.author || [],
				);

				const uniqueAuthors = Array.from(
					new Map(
						allAuthors.map((author) => [
							`${author.given} ${author.family}`,
							author,
						]),
					).values(),
				);

				setAuthors(uniqueAuthors);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (query) fetchResults();
	}, [query]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="p-8">
			<h2 className="text-3xl font-medium mb-6">
				Authors matching "{query}"
			</h2>
			{authors.length === 0 ? (
				<p>No authors found.</p>
			) : (
				<ul className="space-y-4">
					{authors.map((author, index) => (
						<li key={index} className="border p-4 rounded">
							<p className="text-xl">
								{author.given} {author.family}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AuthorSearch;
