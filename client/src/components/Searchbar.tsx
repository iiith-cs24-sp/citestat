import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchbarProps {
	initialQuery: string | null;
}

const Searchbar: React.FC<SearchbarProps> = ({ initialQuery }) => {
	const [query, setQuery] = useState<string>(
		initialQuery ? initialQuery : "",
	);
	const navigate = useNavigate();

	const handleSearch = () => {
		if (query.trim()) {
			navigate(`/search?name=${encodeURIComponent(query)}`);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<input
			type="text"
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			onKeyDown={handleKeyDown}
			placeholder="Search for Author"
			className="input input-bordered w-full text-2xl px-6 py-6 my-4"
		/>
	);
};

export default Searchbar;
