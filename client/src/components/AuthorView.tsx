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
			<ul className="grid grid-cols-1 gap-4">
				{works.map((work) => (
					<li
						className="card bg-base-100 w-full shadow-xl"
						key={work.DOI}
					>
						<div className="card-body overflow-auto">
							<p className="text-xl font-medium">{work.title}</p>
							<p className="text-lg">
								Publisher: {work.publisher}
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
