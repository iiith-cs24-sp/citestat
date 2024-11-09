import React, { useEffect, useState } from "react";
import { Work } from "../types";
import { GraphExample } from "./NetworkGraph";

/**
 * DOI page component that shows the works associated with a DOI
 * @returns JSX.Element
 */
export const DoiNetwork: React.FC<string> = (doi: string) => {
	const [work, setWork] = useState<Work | null>(null);

	useEffect(() => {
		fetch(`https://api.crossref.org/works/${doi}`)
			.then((res) => res.json())
			.then((data) => {
				setWork(data.message as Work);
			});
	}, [doi]);

	const graphWidth = "100%";
	const graphHeight = 360;

	const nodes = [
		{
			id: "1",
			label: "1",
		},
		{
			id: "2",
			label: "2",
		},
	];

	const edges = [
		{
			source: "1",
			target: "2",
			id: "1-2",
			label: "1-2",
		},
	];

	return (
		<div>
			<h3 className="text-2xl font-medium m-6">Network Graph</h3>
			{work ? (
				<GraphExample
					width={graphWidth}
					height={graphHeight}
					nodes={nodes}
					edges={edges}
				/>
			) : (
				<div className="skeleton h-96 w-full rounded"></div>
			)}
		</div>
	);
};
