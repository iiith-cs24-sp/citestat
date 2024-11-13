import React, { useEffect, useState } from "react";
import { GraphExample } from "./NetworkGraph";
import { GraphEdge, GraphNode } from "reagraph";

/**
 * Citation object from the OpenCitations API
 * @example
  {
    "timespan": "P1Y2M21D",
    "oci": "061202325243-062403150807",
    "journal_sc": "no",
    "cited": "omid:br/062403150807 doi:10.1145/3452383.3452391 openalex:W3159497091",
    "creation": "2022-05-16",
    "author_sc": "no",
    "citing": "omid:br/061202325243 doi:10.1145/3535511.3535541 openalex:W4283735155"
  },
 */
interface Citation {
	timespan: string;
	oci: string;
	journal_sc: string;
	cited: string;
	creation: string;
	author_sc: string;
	citing: string;
}

/**
 * DOI page component that shows the works associated with a DOI
 * @returns JSX.Element
 */
export const DoiNetwork: React.FC<string> = (doi: string) => {
	const [citations, setCitations] = useState<Citation[] | null>(null);
	const [references, setReferences] = useState<Citation[] | null>(null);
	const [nodes, setNodes] = useState<GraphNode[]>([]);
	const [edges, setEdges] = useState<GraphEdge[]>([]);

	useEffect(() => {
		fetch(`https://opencitations.net/index/api/v2/citations/doi:${doi}`)
			.then((res) => res.json())
			.then((data) => {
				setCitations(data as Citation[]);
			})
			.catch((err) => {
				console.error(`Failed to fetch citations: ${err}`);
			});
		fetch(`https://opencitations.net/index/api/v2/references/doi:${doi}`)
			.then((res) => res.json())
			.then((data) => {
				setReferences(data as Citation[]);
			})
			.catch((err) => {
				console.error(`Failed to fetch references: ${err}`);
			});
	}, [doi]);

	useEffect(() => {
		if (!citations || !references) return;

		const validCitations: Set<string> = new Set(
			citations
				.map((citation) =>
					citation.citing
						.split(" ")
						.filter((ref) => ref.startsWith("doi:"))
						.map((ref) => ref.slice(4)),
				)
				.flat(),
		);
		console.dir(validCitations);

		const validReferences: Set<string> = new Set(
			references
				.map((reference) =>
					reference.cited
						.split(" ")
						.filter((ref) => ref.startsWith("doi:"))
						.map((ref) => ref.slice(4)),
				)
				.flat(),
		);
		console.dir(validReferences);

		const newNodes: GraphNode[] = [
			{
				id: doi,
				label: doi,
				fill: "#00ff00",
				size: 5,
			},
			...Array.from(validCitations).map((citer) => ({
				id: citer,
				label: citer,
				fill: "#ff0000",
				size: 5 / validCitations.size + 1,
			})),
			...Array.from(validReferences).map((ref) => ({
				id: ref,
				label: ref,
				fill: "#0000ff",
				size: 5 / validReferences.size + 1,
			})),
		];

		const newEdges: GraphEdge[] = Array.from(validCitations)
			.map((citer) => ({
				source: doi,
				target: citer,
				id: `${doi}-${citer}`,
				label: `${doi}->${citer}`,
			}))
			.concat(
				Array.from(validReferences).map((ref) => ({
					source: ref,
					target: doi,
					id: `${ref}-${doi}`,
					label: `${ref}->${doi}`,
				})),
			);

		setNodes(newNodes);
		setEdges(newEdges);
	}, [doi, citations, references]);

	const graphWidth = "100%";
	const graphHeight = 720;

	return (
		<div>
			<h3 className="text-2xl font-medium m-6">Network Graph</h3>
			{citations ? (
				<GraphExample
					width={graphWidth}
					height={graphHeight}
					nodes={nodes}
					edges={edges}
					onNodeClick={(node) => {
						// Visit the DOI page if not the current DOI
						if (node.id !== doi)
							window.location.href = `/doi/${encodeURIComponent(node.id)}`;
					}}
				/>
			) : (
				<div className="skeleton h-96 w-full rounded"></div>
			)}
		</div>
	);
};
