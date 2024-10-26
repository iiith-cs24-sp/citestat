import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CrossRefResponse, Author as AuthorType } from "../types";
import Searchbar from "../components/Searchbar";

interface AuthorWithCount extends AuthorType {
	publicationDOIs: string[];
	publicationCount: number;
}

const AuthorSearch: React.FC = () => {
	const [authors, setAuthors] = useState<AuthorWithCount[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { search } = useLocation();
	const query = new URLSearchParams(search).get("name");

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`https://api.crossref.org/works?query.author=${encodeURIComponent(query || "")}&rows=500&cursor=*&select=title,author,DOI,is-referenced-by-count`,
				);
				console.log(response);
				if (!response.ok) throw new Error("Failed to fetch data");

				const data: CrossRefResponse = await response.json();
				const authorMap: Map<string, AuthorWithCount> = new Map();

				data.message.items.forEach((item) => {
					if (!item.author) return;
					item.author.forEach((author) => {
						const key = `${author.given} ${author.family}`;
						const authorWithCount = authorMap.get(key) || {
							...author,
							publicationDOIs: [],
							publicationCount: 0,
						};
						authorWithCount.publicationDOIs.push(item.DOI);
						authorWithCount.publicationCount++;
						authorMap.set(key, authorWithCount);
					});
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

	if (error) return <p>{error}</p>;

	return (
		<div className="p-8">
			<Searchbar initialQuery={query} />
			<h2 className="text-3xl font-medium mb-6">
				Authors matching "{query}"
			</h2>
			{loading ? (
				<ul className="space-y-4">
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
					<li className="skeleton h-16 w-full rounded"></li>
				</ul>
			) : authors.length === 0 ? (
				<p>No authors found.</p>
			) : (
				<ul className="space-y-4">
					{authors.map((author, index) => (
						<li key={index} className="border p-4 rounded">
							<div className="flex justify-between">
								<div className="text-xl">
									{author.given} {author.family}
								</div>
								<Link
									to={`/author?name=${author.given} ${author.family}&doi=${author.publicationDOIs.join("&doi=")}`}
								>
									{author.publicationCount} Publications
								</Link>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default AuthorSearch;
