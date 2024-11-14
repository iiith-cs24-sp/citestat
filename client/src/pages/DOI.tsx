import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import { DoiNetwork } from "../components/DoiNetwork";
import { CSLData } from "../models/CslJson";

// Load Citation.js
import "@citation-js/plugin-doi";
import { Cite } from "@citation-js/core";

const DoiView: React.FC<CSLData> = (cslData: CSLData) => {
	console.log(cslData);
	return (
		<div className="grid grid-cols-2 gap-4">
			<div>
				<h3 className="text-xl font-medium mb-2">Title</h3>
				<p className="text-lg">{cslData.title}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Authors</h3>
				<ul>
					{cslData.author?.map((author, index) => (
						<li key={index}>
							{author.given} {author.family}
						</li>
					))}
				</ul>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Published</h3>
				<p>{cslData.issued?.["date-parts"]?.flat().join("/")}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">DOI</h3>
				<p>{cslData.DOI}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Publisher</h3>
				<p>{cslData.publisher}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">URL</h3>
				<p>
					<a
						href={cslData.URL}
						target="_blank"
						rel="noreferrer"
						className="link link-primary"
					>
						{cslData.URL}
					</a>
				</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Reference Count</h3>
				<p>
					{(cslData["citation-number"] ||
						cslData["reference-count"]) ?? // Crossref uses reference count
						"unknown"}
				</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Cited By Count</h3>
				<p>
					{
						cslData["is-referenced-by-count"] ?? "unknown" // Crossref
					}
				</p>
			</div>
		</div>
	);
};

export const DOI: React.FC = () => {
	const [data, setData] = useState<CSLData>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const query = decodeURIComponent(useParams().doi as string);
	const [level, setLevel] = useState<number>(1);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				Cite.async(query).then((res) => {
					console.debug(res.data);
					setData(res.data[0] as CSLData);
				});
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
			{loading || !data ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				DoiView(data)
			)}
			<div className="my-6 flex items-center justify-between">
				<h3 className="text-2xl font-medium">Citation Network</h3>
				<select
					className="select select-bordered w-full max-w-xs"
					onChange={(e) => {
						const value = parseInt(e.target.value);
						if (
							value >= 2 &&
							!window.confirm(
								"This will take a long time to load. Are you sure?",
							)
						) {
							return;
						}
						setLevel(value);
					}}
					value={level}
				>
					<option value="0">Level 0</option>
					<option value="1">Level 1</option>
					<option value="2">Level 2</option>
					<option value="3">Level 3</option>
				</select>
			</div>
			<DoiNetwork doi={query} n={level} />
		</div>
	);
};
