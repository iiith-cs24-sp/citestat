import { GraphEdge, GraphNode, recommendLayout } from "reagraph";
import { GraphWorkerInput, GraphWorkerOutput } from "../models/GraphWorkerIO";

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

export class WorkerApi {
	/**
	 * To generate graph nodes and edges from citation and reference data
	 */
	public static async buildGraph(
		graphWorkerInput: GraphWorkerInput,
	): Promise<GraphWorkerOutput> {
		console.debug("Building graph from worker input", graphWorkerInput);
		const { doi, citations, references, isDarkMode } = graphWorkerInput;

		const validDOIs: Set<string> = new Set();
		const validEdgeIDs: Set<string> = new Set();
		const newNodes: Set<GraphNode> = new Set();
		const newEdges: GraphEdge[] = [];

		if (!validDOIs.has(doi)) {
			newNodes.add({
				id: doi,
				label: doi,
				fill: isDarkMode ? "#ffffff" : "#000000",
				size: 10,
				data: { level: 0 },
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
							data: { level: level + 1 },
						});
						validDOIs.add(citingDoi);
					}
					if (!validDOIs.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: fillColour,
							data: { level: level + 1 },
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
							data: { level: -(level + 1) },
						});
						validDOIs.add(citingDoi);
					}
					if (!validDOIs.has(citedDoi)) {
						newNodes.add({
							id: citedDoi,
							label: citedDoi,
							fill: fillColour,
							data: { level: -(level + 1) },
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

		console.debug("Built graph", newNodes, newEdges);
		const newNodesArray = Array.from(newNodes);
		return {
			newNodes: newNodesArray,
			newEdges,
			// recommendedLayout: recommendLayout(newNodesArray, newEdges),
			// The above line is causing an error
			// ReferenceError: document is not defined hold-event.module.js:153:8
			// KeyboardKeyHold hold-event.module.js:153
			// <anonymous> CameraControls.tsx:121
			recommendedLayout: "forceDirected2d",
		};
	}
}
