import { useState } from "react";
import Searchbar from "../components/Searchbar";
import { getRandomDOI, getRandomORCID } from "../utils/Sampler";

const shuffleIcon = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		version="1.1"
		width="100%"
		height="100%"
		fill="currentColor"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<title>shuffle icon</title>
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		></g>
		<g id="SVGRepo_iconCarrier">
			<path
				id="primary"
				d="M21.71,15.29l-2-2a1,1,0,0,0-1.42,1.42l.3.29h-.87A5,5,0,0,1,14,13.29l-3.41-3.9A7,7,0,0,0,5.28,7H3A1,1,0,0,0,3,9H5.28A5,5,0,0,1,9,10.71l3.41,3.9A7,7,0,0,0,17.72,17h.87l-.3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l2-2A1,1,0,0,0,21.71,15.29Z"
				style={{ fill: "currentColor" }}
				className="text-accent"
			></path>
			<path
				id="secondary"
				d="M21.71,7.29l-2-2a1,1,0,0,0-1.42,1.42l.3.29h-.87a7,7,0,0,0-5.27,2.39L9,13.29A5,5,0,0,1,5.28,15H3a1,1,0,0,0,0,2H5.28a7,7,0,0,0,5.27-2.39L14,10.71A5,5,0,0,1,17.72,9h.87l-.3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l2-2A1,1,0,0,0,21.71,7.29Z"
				style={{ fill: "currentColor" }}
				className="text-primary"
			></path>
		</g>
	</svg>
);

// Import svg file. import is required for bundling
import logo_path from "../../icons/logo_optimized.svg";

/**
 * react component for application home page
 * Landing page of our site.
 * @returns
 */
export const Home: React.FC = () => {
	const [rng, setRng] = useState<boolean>(false);
	if (rng) {
		return (
			<div className="flex flex-col m-10">
				<div className="self-center loading loading-infinity loading-lg"></div>
			</div>
		);
	}

	return (
		<>
			<div className="hero">
				<div className="hero-content text-center py-36">
					<div className="max-w-md">
						<h1 className="text-7xl font-medium gap-0 flex items-center justify-center">
							<img
								src={logo_path}
								alt="citestat logo - a sunburst chart in the shape of a C"
								className="w-20 h-20"
							/>
							itestat
						</h1>
						<p className="font-light text-xl">
							See your impact on the world
						</p>
						<Searchbar initialQuery={""} />
					</div>
				</div>
			</div>
			<ul className="justify-items-center grid md:grid-cols-2 grid-cols-1 gap-x-16 gap-y-4 xl:mx-64 lg:mx-32 mx-16">
				<li className="card w-96">
					<button
						onClick={() => {
							setRng(true);
							getRandomORCID().then((orcid) =>
								window.open(`/author/${orcid}`, "_self"),
							);
						}}
						className="btn-ghost rounded-xl card-body items-center"
					>
						<h2 className="card-title">See a random author</h2>
						<p className="w-16 h-16">{shuffleIcon}</p>
					</button>
				</li>
				<li className="card w-96">
					<button
						onClick={() => {
							setRng(true);
							getRandomDOI().then((doi) =>
								window.open(
									`/doi/${encodeURIComponent(doi)}`,
									"_self",
								),
							);
						}}
						className="btn-ghost rounded-xl card-body items-center"
					>
						<h2 className="card-title">See a random work</h2>
						<p className="w-16 h-16">{shuffleIcon}</p>
					</button>
				</li>
			</ul>
		</>
	);
};
