import { GraphWorkerInput, GraphWorkerOutput } from "./models/GraphWorkerIO";

const worker = new Worker(new URL("./worker.ts", import.meta.url));

export function updateGraphNodesAndEdges(data: GraphWorkerInput) {
	return new Promise<GraphWorkerOutput>((resolve, reject) => {
		worker.postMessage(data);
		worker.onmessage = (event) => {
			resolve(event.data as GraphWorkerOutput);
		};
		worker.onerror = (error) => {
			reject(error);
		};
	});
}
