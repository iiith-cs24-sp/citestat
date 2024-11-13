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
 * Generate a colour based on a number, e.g., -2, -1, 0, 1, 2, 3, ...
 * @param num Number to generate a colour from
 * @param isDarkMode Whether the colour should be generated for dark mode
 * @returns Colour string
 */
const colourFromNumber = (num: number, isDarkMode: boolean = false): string => {
	const hue = ((num + 4) / 9.0) * 359;
	const saturation = 100;
	const lightness = isDarkMode ? 60 : 40;
	const colorString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	return colorString;
};

/**
 * DOI page component that shows the works associated with a DOI
 * @returns JSX.Element
 */
interface DoiNetworkProps {
	doi: string;
	n: number;
}

export const DoiNetwork: React.FC<DoiNetworkProps> = ({ doi, n }) => {
	const [citations, setCitations] = useState<Citation[][] | null>(null);
	const [references, setReferences] = useState<Citation[][] | null>(null);
	const [nodes, setNodes] = useState<GraphNode[]>([]);
	const [edges, setEdges] = useState<GraphEdge[]>([]);

	// Fetch citation and reference data
	useEffect(() => {
		const fetchCitations = async (doi: string) => {
			const res = await fetch(
				`https://opencitations.net/index/api/v2/citations/doi:${doi}`,
			);
			const data = await res.json();
			return data as Citation[];
		};

		const fetchReferences = async (doi: string) => {
			const res = await fetch(
				`https://opencitations.net/index/api/v2/references/doi:${doi}`,
			);
			const data = await res.json();
			return data as Citation[];
		};

		const fetchData = async () => {
			let citationLevels: Citation[][] = [];
			let referenceLevels: Citation[][] = [];
			let currentDoi = doi;

			for (let i = 0; i < n; i++) {
				const citations = await fetchCitations(currentDoi);
				const references = await fetchReferences(currentDoi);
				citationLevels.push(citations);
				referenceLevels.push(references);

				if (citations.length > 0) {
					currentDoi =
						citations[0].citing
							.split(" ")
							.find((ref) => ref.startsWith("doi:"))
							?.slice(4) || "";
				}
			}

			setCitations(citationLevels);
			setReferences(referenceLevels);
		};

		fetchData().catch((err) => {
			console.error(`Failed to fetch data: ${err}`);
		});
	}, [doi, n]);

	// Update graph nodes and edges
	useEffect(() => {
		if (!citations || !references) return;

		const validNodes: Set<string> = new Set();
		const validEdges: Set<string> = new Set();
		const newNodes: Set<GraphNode> = new Set();
		const newEdges: GraphEdge[] = [];
		const isDarkMode =
			getComputedStyle(document.documentElement).getPropertyValue(
				"color-scheme",
			) === "dark";

		console.dir(citations);
		console.dir(references);

		if (!validNodes.has(doi)) {
			newNodes.add({
				id: doi,
				label: doi,
				fill: isDarkMode ? "#ffffff" : "#000000",
				size: 10,
			});
			validNodes.add(doi);
		}

		citations.forEach((citationLevel, level) => {
			++level;
			citationLevel.forEach((citation) => {
				const citingDoi =
					citation.citing
						.split(" ")
						.find((ref) => ref.startsWith("doi:"))
						?.slice(4) || "";
				const citedDoi =
					citation.cited
						.split(" ")
						.find((ref) => ref.startsWith("doi:"))
						?.slice(4) || "";

				if (citingDoi && citedDoi) {
					if (!validNodes.has(citingDoi)) {
						newNodes.add({
							id: citingDoi,
							label: citingDoi,
							fill: colourFromNumber(level),
						});
						validNodes.add(citingDoi);
					}
					if (!validNodes.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: colourFromNumber(level),
						});
						validNodes.add(citedDoi);
					}

					if (!validEdges.has(`${citedDoi}-${citingDoi}`)) {
						newEdges.push({
							source: citedDoi,
							target: citingDoi,
							id: `${citedDoi}-${citingDoi}`,
							label: `${citedDoi}->${citingDoi}`,
							fill: "#ffff00",
						});
						validEdges.add(`${citedDoi}-${citingDoi}`);
					}
				}
			});
		});

		references.forEach((referenceLevel, level) => {
			++level;
			referenceLevel.forEach((reference) => {
				const citingDoi =
					reference.citing
						.split(" ")
						.find((ref) => ref.startsWith("doi:"))
						?.slice(4) || "";
				const citedDoi =
					reference.cited
						.split(" ")
						.find((ref) => ref.startsWith("doi:"))
						?.slice(4) || "";

				if (citingDoi && citedDoi) {
					if (!validNodes.has(citingDoi)) {
						newNodes.add({
							id: citingDoi,
							label: citingDoi,
							fill: colourFromNumber(-level),
						});
						validNodes.add(citingDoi);
					}
					if (!validNodes.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: colourFromNumber(-level),
						});
						validNodes.add(citedDoi);
					}

					if (!validEdges.has(`${citedDoi}-${citingDoi}`)) {
						newEdges.push({
							source: citedDoi,
							target: citingDoi,
							id: `${citedDoi}-${citingDoi}`,
							label: `${citedDoi}->${citingDoi}`,
							fill: "#ff0000",
						});
						validEdges.add(`${citedDoi}-${citingDoi}`);
					}
				}
			});
		});

		setNodes(Array.from(newNodes));
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
