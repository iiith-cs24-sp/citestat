import React, { useEffect, useState } from "react";
import { Work } from "../types";
import { GraphExample } from "./NetworkGraph";
import { GraphEdge, GraphNode } from "reagraph";

/**
 * DOI page component that shows the works associated with a DOI
 * @returns JSX.Element
 */
export const DoiNetwork: React.FC<string> = (doi: string) => {
	const [work, setWork] = useState<Work | null>(null);
	const [nodes, setNodes] = useState<GraphNode[]>([]);
	const [edges, setEdges] = useState<GraphEdge[]>([]);

	useEffect(() => {
		fetch(`https://api.crossref.org/works/${doi}`)
			.then((res) => res.json())
			.then((data) => {
				setWork(data.message as Work);
			});
	}, [doi]);

	useEffect(() => {
		if (!work || !work.reference) return;

		const validReferences = work.reference
			.filter((ref) => ref.DOI)
			// remove duplicates
			.filter(
				(ref, index, self) =>
					self.findIndex((r) => r.DOI === ref.DOI) === index,
			);
		console.dir(validReferences);

		const newNodes: GraphNode[] = [
			{
				id: work.DOI,
				label: work.title,
			},
			...validReferences.map((ref) => ({
				id: ref.DOI,
				label: ref.DOI,
			})),
		];

		const newEdges: GraphEdge[] = validReferences.map((ref) => ({
			source: ref.DOI,
			target: work.DOI,
			id: `${ref.DOI}-${work.DOI}`,
			label: `${ref.DOI}->${work.DOI}`,
		}));

		setNodes(newNodes);
		setEdges(newEdges);
	}, [work]);

	const graphWidth = "100%";
	const graphHeight = 720;

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
