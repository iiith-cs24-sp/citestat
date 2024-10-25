import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
	initialQuery: string | null;
}

/**
 * Reference: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
 */
function isDOI(query: string): boolean {
	return query.match(/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i) !== null;
}

function isORCID(query: string): boolean {
	return query.match(/^(\d{4}-){3,}\d{3}(\d|X)$/i) !== null;
}

const Searchbar: React.FC<SearchbarProps> = ({ initialQuery }) => {
	const [query, setQuery] = useState<string>(
		initialQuery ? initialQuery : "",
	);
	const navigate = useNavigate();

	const handleSearch = () => {
		if (query.trim()) {
			if (isDOI(query)) {
				navigate(`/doi/${encodeURIComponent(query)}`);
			} else if (isORCID(query)) {
				navigate(`/author/${encodeURIComponent(query)}`);
			} else {
				navigate(`/search?name=${encodeURIComponent(query)}`);
			}
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<label className="input input-bordered flex w-full items-center gap-2 text-2xl my-4">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search for Author or DOI"
				className="w-full"
			/>
			<button onClick={handleSearch}>🔍</button>
		</label>
	);
};

export default Searchbar;
