import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
	const [author, setAuthor] = useState<string>("");
	const navigate = useNavigate();

	const handleSearch = () => {
		if (author.trim()) {
			navigate(`/author?name=${encodeURIComponent(author)}`);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="hero">
			<div className="hero-content text-center py-36">
				<div className="max-w-md">
					<h1 className="text-7xl font-medium">Citestat</h1>
					<p className="text-neutral-500 text-xl">
						See your impact on the world.
					</p>
					<input
						type="text"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Search for Author"
						className="input input-bordered w-full text-2xl px-6 py-6 my-4"
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
