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
	const hue = ((num + 3) / 7.0) * 359;
	const saturation = 100;
	const lightness = isDarkMode ? 60 : 30;
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

const citationRequestCache = new Map<string, Citation[]>();
const referenceRequestCache = new Map<string, Citation[]>();

async function fetchCitations(doi: string) {
	if (citationRequestCache.has(doi)) {
		return citationRequestCache.get(doi)!;
	}
	const res = await fetch(
		`https://opencitations.net/index/api/v2/citations/doi:${doi}`,
	);
	const data = await res.json();
	citationRequestCache.set(doi, data);
	return data as Citation[];
}

async function fetchReferences(doi: string) {
	if (referenceRequestCache.has(doi)) {
		return referenceRequestCache.get(doi)!;
	}
	const res = await fetch(
		`https://opencitations.net/index/api/v2/references/doi:${doi}`,
	);
	const data = await res.json();
	referenceRequestCache.set(doi, data);
	return data as Citation[];
}

export const DoiNetwork: React.FC<DoiNetworkProps> = ({ doi, n }) => {
	const [citations, setCitations] = useState<Citation[][] | null>(null);
	const [references, setReferences] = useState<Citation[][] | null>(null);
	const [nodes, setNodes] = useState<GraphNode[]>([]);
	const [edges, setEdges] = useState<GraphEdge[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [stage, setStage] = useState<number>(0);
	const [stageProgress, setStageProgress] = useState<number>(0);

	// Fetch citation and reference data
	useEffect(() => {
		setLoading(true);
		setStage(0);
		setStageProgress(0);

		const fetchData = async () => {
			const citationLevels: Citation[][] = [];
			const referenceLevels: Citation[][] = [];
			// Put dois for current level in an array
			let citationDois: string[] = [doi];
			let nextLevelCitationDois: string[] = [];
			let referenceDois: string[] = [doi];
			let nextLevelReferenceDois: string[] = [];

			// Loop through the levels
			for (let i = 0; i < n; i++) {
				setStage(i);
				setStageProgress(0);
				let progress = 0;
				const citationLevel: Citation[] = [];
				const referenceLevel: Citation[] = [];

				// Loop through the dois in the queue
				for (const citationDoi of citationDois) {
					const citations = await fetchCitations(citationDoi);
					citationLevel.push(...citations);
					citations.forEach((citation) => {
						const citingDoi =
							citation.citing
								.split(" ")
								.find((ref) => ref.startsWith("doi:"))
								?.slice(4) || "";
						if (
							citingDoi &&
							!nextLevelCitationDois.includes(citingDoi)
						) {
							nextLevelCitationDois.push(citingDoi);
						}
					});
					++progress;
					setStageProgress(
						(progress * 100.0) /
							(citationDois.length + referenceDois.length),
					);
				}

				// Loop through the dois in the queue
				for (const referenceDoi of referenceDois) {
					const references = await fetchReferences(referenceDoi);
					referenceLevel.push(...references);
					references.forEach((reference) => {
						const citedDoi =
							reference.cited
								.split(" ")
								.find((ref) => ref.startsWith("doi:"))
								?.slice(4) || "";
						if (
							citedDoi &&
							!nextLevelReferenceDois.includes(citedDoi)
						) {
							nextLevelReferenceDois.push(citedDoi);
						}
					});
					++progress;
					setStageProgress(
						(progress * 100.0) /
							(citationDois.length + referenceDois.length),
					);
				}

				citationDois = nextLevelCitationDois;
				nextLevelCitationDois = [];
				referenceDois = nextLevelReferenceDois;
				nextLevelReferenceDois = [];

				citationLevels.push(citationLevel);
				referenceLevels.push(referenceLevel);
			}

			setCitations(citationLevels);
			setReferences(referenceLevels);
			setLoading(false);
		};

		fetchData().catch((err) => {
			console.error(`Failed to fetch data: ${err}`);
		});
	}, [doi, n]);

	// Update graph nodes and edges
	useEffect(() => {
		if (!citations || !references) return;

		const validDOIs: Set<string> = new Set();
		const validEdgeIDs: Set<string> = new Set();
		const newNodes: Set<GraphNode> = new Set();
		const newEdges: GraphEdge[] = [];
		const isDarkMode =
			getComputedStyle(document.documentElement).getPropertyValue(
				"color-scheme",
			) === "dark";

		console.log("citations");
		console.dir(citations);
		console.log("references");
		console.dir(references);

		if (!validDOIs.has(doi)) {
			newNodes.add({
				id: doi,
				label: doi,
				fill: isDarkMode ? "#ffffff" : "#000000",
				size: 10,
			});
			validDOIs.add(doi);
		}

		citations.forEach((citationLevel, level) => {
			const fillColour = colourFromNumber(level + 1, isDarkMode);
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
					if (!validDOIs.has(citingDoi)) {
						newNodes.add({
							id: citingDoi,
							label: citingDoi,
							fill: fillColour,
						});
						validDOIs.add(citingDoi);
					}
					if (!validDOIs.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: fillColour,
						});
						validDOIs.add(citedDoi);
					}

					if (!validEdgeIDs.has(`${citedDoi}-${citingDoi}`)) {
						newEdges.push({
							source: citedDoi,
							target: citingDoi,
							id: `${citedDoi}-${citingDoi}`,
							label: `${citedDoi}->${citingDoi}`,
							fill: colourFromNumber(3, isDarkMode),
						});
						validEdgeIDs.add(`${citedDoi}-${citingDoi}`);
					}
				}
			});
		});

		references.forEach((referenceLevel, level) => {
			const fillColour = colourFromNumber(-(level + 1), isDarkMode);
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
					if (!validDOIs.has(citingDoi)) {
						newNodes.add({
							id: citingDoi,
							label: citingDoi,
							fill: fillColour,
						});
						validDOIs.add(citingDoi);
					}
					if (!validDOIs.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: fillColour,
						});
						validDOIs.add(citedDoi);
					}

					if (!validEdgeIDs.has(`${citedDoi}-${citingDoi}`)) {
						newEdges.push({
							source: citedDoi,
							target: citingDoi,
							id: `${citedDoi}-${citingDoi}`,
							label: `${citedDoi}->${citingDoi}`,
							fill: colourFromNumber(0, isDarkMode),
						});
						validEdgeIDs.add(`${citedDoi}-${citingDoi}`);
					}
				}
			});
		});

		console.dir(newNodes);
		console.dir(newEdges);
		setNodes(Array.from(newNodes));
		setEdges(newEdges);
	}, [doi, citations, references]);

	const graphWidth = "100%";
	const graphHeight = 720;

	return (
		<div>
			{!loading ? (
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
				<div className="h-96 w-full rounded flex flex-col items-center justify-center">
					<ul className="steps">
						{[...Array(n)].map((_, i) => (
							<li
								key={i}
								className={`step ${
									i === stage
										? "step-neutral"
										: i < stage
											? "step-success"
											: ""
								}`}
							>
								Level {i + 1}
							</li>
						))}
					</ul>
					<progress
						className="progress w-56"
						value={stageProgress}
						max="100"
					></progress>
				</div>
			)}
		</div>
	);
};
