import { Work } from "../types";
import { Link } from "react-router-dom";

interface AuthorViewProps {
	name: string;
	orcid?: string;
	works: Work[];
}

const AuthorView: React.FC<AuthorViewProps> = ({ name, orcid, works }) => {
	return (
		<div className="mb-8">
			<h2 className="text-3xl font-medium mb-6">{name}</h2>
			{orcid && <p className="text-xl mb-4">ORCID: {orcid}</p>}
			<ul className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
				{works.map((work) => (
					<li
						className="card bg-base-100 w-full shadow-xl"
						key={work.DOI}
					>
						<div className="card-body overflow-auto">
							<h3 className="text-xl font-medium">
								{work.title}
							</h3>
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
