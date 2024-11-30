import React, { useEffect, useState } from "react";
import { NetworkGraph } from "./NetworkGraph";
import { GraphEdge, GraphNode, LayoutTypes } from "reagraph";
import { Citation } from "../models/Citation";
import * as ComLink from "comlink";
import { GraphWorkerInput } from "../models/GraphWorkerIO";
import type { WorkerApi } from "../workers/workerApi";

const worker = new Worker(new URL("../workers/worker.js", import.meta.url), {
	type: "module",
});
const workerApi = ComLink.wrap<typeof WorkerApi>(worker);

/**
 * DOI page component that shows the works associated with a DOI
 * @returns JSX.Element
 */
interface DoiNetworkProps {
	doi: string;
	n: number;
}

async function fetchWithCache(url: string, abortController: AbortController) {
	let cache: Cache | null = null;
	// Cache is available only in secure contexts
	if (window.isSecureContext) {
		cache = await caches.open("doi-network-cache");
		const cachedResponse = await cache.match(url);
		const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
		const expiresIn = oneDayInMilliseconds;

		if (cachedResponse) {
			const cachedDate = new Date(
				cachedResponse.headers.get("sw-cache-date") || 0,
			);
			const now = new Date();

			if (now.getTime() - cachedDate.getTime() < expiresIn) {
				return cachedResponse.json();
			} else {
				// Cache is stale, delete it
				await cache.delete(url);
			}
		}
	}

	const response = await fetch(url, { signal: abortController.signal });
	if (response.ok) {
		const clonedResponse = response.clone();
		const headers = new Headers(clonedResponse.headers);
		headers.append("sw-cache-date", new Date().toISOString());

		const responseWithHeaders = new Response(clonedResponse.body, {
			status: clonedResponse.status,
			statusText: clonedResponse.statusText,
			headers: headers,
		});

		await cache?.put(url, responseWithHeaders);
		return response.json();
	}

	throw new Error("Network response was not ok.");
}

async function fetchCitations(doi: string, abortController: AbortController) {
	const url = `https://opencitations.net/index/api/v2/citations/doi:${doi}`;
	return fetchWithCache(url, abortController);
}

async function fetchReferences(doi: string, abortController: AbortController) {
	const url = `https://opencitations.net/index/api/v2/references/doi:${doi}`;
	return fetchWithCache(url, abortController);
}

/**
 * DOI Network graph corresponding to DOI for a publication
 * @param props.doi doi string pointing to the publication
 * @param props.n  number of levels to be displayed in the citation network graph
 * @returns
 */
export const DoiNetwork: React.FC<DoiNetworkProps> = ({ doi, n }) => {
	const [citations, setCitations] = useState<Citation[][] | null>(null);
	const [references, setReferences] = useState<Citation[][] | null>(null);
	const [nodes, setNodes] = useState<GraphNode[]>([]);
	const [edges, setEdges] = useState<GraphEdge[]>([]);
	const [layout, setLayout] = useState<LayoutTypes>("hierarchicalTd");
	const [loading, setLoading] = useState<boolean>(true);
	const [computing, setComputing] = useState<boolean>(true);
	const [stage, setStage] = useState<number>(0);
	const [stageProgress, setStageProgress] = useState<number>(0);
	const [isDarkMode, setDarkMode] = useState<boolean>(
		getComputedStyle(document.documentElement).getPropertyValue(
			"color-scheme",
		) === "dark",
	);

	// Fetch citation and reference data
	useEffect(() => {
		setLoading(true);
		setStage(0);
		setStageProgress(0);
		const abortController = new AbortController(); // Abort controller for cancelling requests

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
					const citations = await fetchCitations(
						citationDoi,
						abortController,
					);
					citationLevel.push(...citations);
					citations.forEach((citation: Citation) => {
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
					const references = await fetchReferences(
						referenceDoi,
						abortController,
					);
					referenceLevel.push(...references);
					references.forEach((reference: Citation) => {
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

		return () => {
			abortController.abort(); // Cancel any existing requests
		};
	}, [doi, n]);

	// Update graph nodes and edges
	useEffect(() => {
		if (!citations || !references) return;
		const darkMode =
			getComputedStyle(document.documentElement).getPropertyValue(
				"color-scheme",
			) === "dark";
		setDarkMode(darkMode);

		setComputing(true);
		const data: GraphWorkerInput = {
			doi,
			citations,
			references,
			isDarkMode: darkMode,
		};
		console.log("Calling worker");
		workerApi
			.buildGraph(data)
			.then(({ newNodes, newEdges, recommendedLayout }) => {
				setNodes(newNodes);
				setEdges(newEdges);
				setLayout(recommendedLayout);
				setComputing(false);
			}, console.error);
	}, [doi, citations, references]);

	const graphWidth = "100%";
	const graphHeight = 720;

	return (
		<div>
			{!(loading || computing) ? (
				<NetworkGraph
					width={graphWidth}
					height={graphHeight}
					nodes={nodes}
					edges={edges}
					layout={layout}
					onNodeClick={(node) => {
						if (node.id !== doi)
							window.open(
								`/doi/${encodeURIComponent(node.id)}`,
								"_blank",
							);
					}}
					darkMode={isDarkMode}
				/>
			) : (
				<div
					style={{ width: graphWidth, height: graphHeight }} // Avoid layout shift
					className="rounded flex flex-col items-center justify-center"
				>
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

export default DoiNetwork;
