import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "../components/Searchbar";
import { Tooltip } from "../components/Tooltip";
import { CSLData } from "../models/CslJson";
import { lazy, Suspense } from "react";
const DoiNetwork = lazy(() => import("../components/DoiNetwork"));

// Load Citation.js
import "@citation-js/plugin-doi";
// @ts-expect-error Citation.js is not typed
import { Cite } from "@citation-js/core";
import { YearCitationChart } from "../components/YearCitationChart";
import { AltmetricsChart } from "../components/AltmetricsChart";

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
/**
 * @property data
 * @property query : parsed doi string from url request
 * @property loading : loading status
 * @property error: whether there was some error in fetching api results
 * @returns  React component showing stats and charts related to DOI
 */
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

	useEffect(() => {
		const oldTitle = document.title;
		document.title = `Citestat | "${data?.title ?? query}"`;
		return () => {
			document.title = oldTitle;
		};
	}, [data, query]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;

	return (
		<div className="p-8">
			<Searchbar initialQuery={query} />
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-medium mb-6">DOI "{query}"</h2>
				<Tooltip
					className="dropdown-end"
					title="Data Source for DOI information"
					content={() => {
						return (
							<p>
								We use{" "}
								<a
									href="https://citation.js.org/"
									target="_blank"
									rel="noreferrer"
									className="link link-primary"
								>
									Citation.js
								</a>{" "}
								to fetch the metadata for the DOI. This allows
								us to follow DOI redirects and fetch the
								metadata from any source.
							</p>
						);
					}}
				/>
			</div>
			{loading || !data ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				DoiView(data)
			)}
			<div className="my-6 flex items-center justify-between">
				<h3 className="text-2xl font-medium">
					Citation Network
					<Tooltip
						className="dropdown-right"
						title="Citation Network"
						content={() => {
							return (
								<p>
									Data provided by{" "}
									<a
										href="https://opencitations.net/"
										target="_blank"
										rel="noreferrer"
										className="link link-primary"
									>
										OpenCitations
									</a>
									.
								</p>
							);
						}}
					/>
				</h3>
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
			<Suspense
				fallback={<div className="skeleton h-96 w-full rounded"></div>}
			>
				<DoiNetwork doi={query} n={level} />
			</Suspense>
			<div className="my-6 flex items-center justify-between">
				<h3 className="text-2xl font-medium">Yearwise Citations</h3>
				<Tooltip
					className="dropdown-end"
					title="Yearwise Citations"
					content={() => {
						return (
							<p>
								Data provided by{" "}
								<a
									href="https://opencitations.net/"
									target="_blank"
									rel="noreferrer"
									className="link link-primary"
								>
									OpenCitations
								</a>
								.
							</p>
						);
					}}
				/>
			</div>
			<YearCitationChart doi={query} />
			<div className="my-6 flex items-center justify-between">
				<h3 className="text-2xl font-medium">Altmetrics</h3>
				<Tooltip
					className="dropdown-end"
					title="Altmetrics"
					content={() => {
						return (
							<p>
								Data provided by{" "}
								<a
									href="https://altmetric.com"
									target="_blank"
									rel="noreferrer"
									className="link link-primary"
								>
									Altmetric
								</a>
								.
							</p>
						);
					}}
				/>
			</div>
			<AltmetricsChart doi={query} />
		</div>
	);
};
