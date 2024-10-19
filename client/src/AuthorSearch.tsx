import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CrossRefResponse, Author as AuthorType } from "./types";

interface AuthorWithCount extends AuthorType {
	publicationCount: number;
}

const AuthorSearch = () => {
	const [authors, setAuthors] = useState<AuthorWithCount[]>([]);
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

				const authorMap = new Map<string, AuthorWithCount>();

				allAuthors.forEach((author) => {
					const fullName = `${author.given} ${author.family}`;
					if (authorMap.has(fullName)) {
						authorMap.get(fullName)!.publicationCount += 1;
					} else {
						authorMap.set(fullName, {
							...author,
							publicationCount: 1,
						});
					}
				});

				setAuthors(Array.from(authorMap.values()));
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		if (query) fetchResults();
	}, [query]);

	if (loading)
		return (
			<div className="p-8">
				<h2 className="text-3xl font-medium mb-6">
					Authors matching "{query}"
				</h2>
				<ul className="space-y-4">
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
				</ul>
			</div>
		);
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
							<div className="flex justify-between">
								<div className="text-xl">
									{author.given} {author.family}
								</div>
								<div>
									{author.publicationCount} Publications
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AuthorSearch;
