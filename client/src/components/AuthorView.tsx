import { Work } from "../types";
import { Link } from "react-router-dom";
import { Tooltip } from "./Tooltip";
import { WorkCharts } from "./WorkCharts";

function getHIndex(works: Work[]): number {
	const sortedCitations = works
		.map((work) => work["is-referenced-by-count"] ?? 0)
		.sort((a, b) => b - a);
	const hIndex = sortedCitations.findIndex((count, index) => count <= index);
	return hIndex === -1 ? works.length : hIndex;
}
function getMQuotient(hIndex: number, works: Work[]): number {
	const yearSet = new Set<number>();
	const currYear = new Date().getFullYear();
	works.forEach((work) => {
		const year =
			work.issued?.["date-parts"]?.[0]?.[0] || // Use issued date
			work.created["date-parts"]?.[0]?.[0]; // Fall back to created date
		yearSet.add(year);
	});
	const yearsActive = currYear - Math.min(...yearSet) + 1;
	const mQ = hIndex / yearsActive;
	return mQ;
}

interface AuthorViewProps {
	name: string;
	orcid?: string;
	works: Work[];
}

/**
 * @param props.name - Name of the author
 * @param props.orcid - Orcid of the author
 * @param props.works - Publications from this author
 * @returns React component displaying data for author
 */
const AuthorView: React.FC<AuthorViewProps> = ({ name, orcid, works }) => {
	const hIndex = getHIndex(works);

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-3xl font-bold">{name}</h2>
				<Tooltip
					className="dropdown-end"
					title="Data Source"
					content={() => {
						return (
							<p>
								Data provided by{" "}
								<a
									href="https://www.crossref.org/"
									target="_blank"
									rel="noreferrer"
									className="link link-primary"
								>
									Crossref
								</a>
								.
							</p>
						);
					}}
				/>
			</div>
			{orcid && <p className="text-xl mb-4">ORCID: {orcid}</p>}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-2xl font-medium">Metrics</h3>
				<Tooltip
					className="dropdown-end"
					title="Source"
					content={() => {
						return (
							<p>
								Metrics are ⚠️calculated locally⚠️ from the
								works listed.
							</p>
						);
					}}
				/>
			</div>
			<div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
				<p className="text-lg">Total Works: {works.length}</p>
				<p className="text-lg">
					Total Citations:{" "}
					{works.reduce(
						(acc, work) =>
							acc + (work["is-referenced-by-count"] ?? 0),
						0,
					)}
				</p>
				<p className="text-lg">H-Index: {hIndex}</p>
				<p className="text-lg">
					M-Quotient: {getMQuotient(hIndex, works).toFixed(2)}
				</p>
			</div>
			<div className="flex items-center justify-between my-4">
				<h3 className="text-2xl font-medium">Work Charts</h3>
			</div>
			<WorkCharts works={works} />
			<div className="flex items-center justify-between my-4">
				<h3 className="text-2xl font-medium">Works</h3>
				<Tooltip
					className="dropdown-end"
					title="All works not listed?"
					content={() => {
						if (orcid)
							return (
								<p>They might not be linked to your ORCID.</p>
							);
						return (
							<p>
								Search by ORCID to view all works.
								<br />
								Don't have an ORCID?
								<br />
								Go and get one at{" "}
								<a
									href="https://orcid.org/"
									target="_blank"
									rel="noreferrer"
									className="link link-primary"
								>
									orcid.org
								</a>
								<br />
								<b>It's free!</b>
							</p>
						);
					}}
				/>
			</div>
			<ul className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
				{works.map((work) => (
					<li
						className="card bg-base-100 w-full shadow-xl"
						key={work.DOI}
					>
						<div className="card-body overflow-auto">
							<h4 className="text-xl font-medium">
								{work.title}
							</h4>
							<p className="text-lg flex justify-between">
								Publisher: {work.publisher}
								{work.published ? (
									<span className="ml-4">
										Published:{" "}
										{work.published["date-parts"]
											.flat()
											.join("/")}
									</span>
								) : null}
							</p>
							{work["is-referenced-by-count"] ? (
								<p className="text-lg">
									Cited by: {work["is-referenced-by-count"]}
								</p>
							) : null}
							<Link
								to={`/doi/${encodeURIComponent(work.DOI)}`}
								className="text-lg link link-primary"
							>
								DOI: {work.DOI}
							</Link>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AuthorView;
