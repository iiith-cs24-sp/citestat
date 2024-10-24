import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Searchbar from "./components/Searchbar";
import { Work } from "./types";

/**
 * Sample Response from the Crossref API for a DOI query
{
    "status": "ok",
    "message-type": "work",
    "message-version": "1.0.0",
    "message": {
        "indexed": {
            "date-parts": [
                [
                    2024,
                    9,
                    4
                ]
            ],
            "date-time": "2024-09-04T23:24:53Z",
            "timestamp": 1725492293544
        },
        "reference-count": 0,
        "publisher": "SCITEPRESS - Science and and Technology Publications",
        "content-domain": {
            "domain": [],
            "crossmark-restriction": false
        },
        "short-container-title": [],
        "published-print": {
            "date-parts": [
                [
                    2015
                ]
            ]
        },
        "DOI": "10.5220/0005368801100117",
        "type": "proceedings-article",
        "created": {
            "date-parts": [
                [
                    2015,
                    5,
                    21
                ]
            ],
            "date-time": "2015-05-21T11:01:04Z",
            "timestamp": 1432206064000
        },
        "page": "110-117",
        "source": "Crossref",
        "is-referenced-by-count": 1,
        "title": [
            "A Defect Dependency based Approach to Improve Software Quality in Integrated Software Products"
        ],
        "prefix": "10.5220",
        "author": [
            {
                "given": "Sai Anirudh",
                "family": "Karre",
                "sequence": "first",
                "affiliation": [
                    {
                        "name": "International Institute of Information Technology, India"
                    }
                ]
            },
            {
                "given": "Y. Raghu",
                "family": "Reddy",
                "sequence": "first",
                "affiliation": [
                    {
                        "name": "International Institute of Information Technology, India"
                    }
                ]
            }
        ],
        "member": "3171",
        "event": {
            "name": "10th International Conference on Evaluation of Novel Software Approaches to Software Engineering",
            "start": {
                "date-parts": [
                    [
                        2015,
                        4,
                        29
                    ]
                ]
            },
            "location": "Barcelona, Spain",
            "end": {
                "date-parts": [
                    [
                        2015,
                        4,
                        30
                    ]
                ]
            }
        },
        "container-title": [
            "Proceedings of the 10th International Conference on Evaluation of Novel Approaches to Software Engineering"
        ],
        "original-title": [
            "A Defect Dependency based Approach to Improve Software Quality in Integrated Software Products"
        ],
        "deposited": {
            "date-parts": [
                [
                    2015,
                    5,
                    21
                ]
            ],
            "date-time": "2015-05-21T11:01:07Z",
            "timestamp": 1432206067000
        },
        "score": 1,
        "resource": {
            "primary": {
                "URL": "http://www.scitepress.org/DigitalLibrary/Link.aspx?doi=10.5220/0005368801100117"
            }
        },
        "subtitle": [
            ""
        ],
        "short-title": [],
        "issued": {
            "date-parts": [
                [
                    2015
                ]
            ]
        },
        "references-count": 0,
        "URL": "http://dx.doi.org/10.5220/0005368801100117",
        "relation": {},
        "subject": [],
        "published": {
            "date-parts": [
                [
                    2015
                ]
            ]
        }
    }
}
 */

const DoiView: React.FC<Work> = (work: Work) => {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div>
				<h3 className="text-xl font-medium mb-2">Title</h3>
				<p className="text-lg">{work.title}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Authors</h3>
				<ul>
					{work.author?.map((author) => (
						<li
							key={
								author.sequence +
								author.given +
								author.family +
								author.affiliation
							}
						>
							{author.given} {author.family}
						</li>
					))}
				</ul>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Published</h3>
				<p>{work.published?.["date-parts"].join("/")}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">DOI</h3>
				<p>{work.DOI}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Publisher</h3>
				<p>{work.publisher}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">URL</h3>
				<p>
					<a href={work.URL} target="_blank" rel="noreferrer">
						{work.URL}
					</a>
				</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Cited by</h3>
				<p>{work["is-referenced-by-count"]}</p>
			</div>
			<div>
				<h3 className="text-xl font-medium mb-2">Open Access</h3>
				<p>
					{work["free-to-read"] === undefined
						? "Unknown"
						: work["free-to-read"]
							? "Yes"
							: "No"}
				</p>
			</div>
		</div>
	);
};

const DOI: React.FC = () => {
	const [data, setData] = useState<Work>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const query = decodeURIComponent(useParams().doi as string);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`https://api.crossref.org/works/${query}`,
				);
				console.log(response);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);

				await response.json().then((res) => {
					setData(res.message as Work);
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
				<div className="skeleton h-full w-full rounded"></div>
			) : (
				DoiView(data)
			)}
		</div>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export default DOI;
