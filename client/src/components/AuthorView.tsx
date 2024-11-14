import { Work } from "../types";
import { Link } from "react-router-dom";
import { Tooltip } from "./Tooltip";

interface AuthorViewProps {
	name: string;
	orcid?: string;
	works: Work[];
}

const AuthorView: React.FC<AuthorViewProps> = ({ name, orcid, works }) => {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-medium mb-6">{name}</h2>
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
			<h3 className="text-2xl font-medium mb-4">Metrics</h3>
			<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
				<p className="text-lg">Total Works: {works.length}</p>
				<p className="text-lg">
					Total Citations:{" "}
					{works.reduce(
						(acc, work) =>
							acc + (work["is-referenced-by-count"] ?? 0),
						0,
					)}
				</p>
				<p className="text-lg">
					H-Index:{" "}
					{(() => {
						const hIndex = works
							.map((work) => work["is-referenced-by-count"] ?? 0)
							.sort((a, b) => b - a)
							.findIndex((count, index) => count <= index);
						return hIndex === -1 ? works.length : hIndex;
					})()}
				</p>
			</div>
			<h3 className="text-2xl font-medium mb-4">Works</h3>
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
