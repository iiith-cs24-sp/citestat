import Searchbar from "./components/Searchbar";

const Home: React.FC = () => {
	return (
		<div className="hero">
			<div className="hero-content text-center py-36">
				<div className="max-w-md">
					<h1 className="text-7xl font-medium">Citestat</h1>
					<p className="text-neutral-500 text-xl">
						See your impact on the world.
					</p>
					<Searchbar />
				</div>
			</div>
		</div>
	);
};

export default Home;
