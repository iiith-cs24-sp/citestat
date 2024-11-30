import { Citation } from "./Citation";
import { GraphEdge, GraphNode, LayoutTypes } from "reagraph";

// GraphWorker Input Format
export interface GraphWorkerInput {
	doi: string;
	citations: Citation[][];
	references: Citation[][];
	isDarkMode: boolean;
}

// GraphWorker Output Format
export interface GraphWorkerOutput {
	newNodes: GraphNode[];
	newEdges: GraphEdge[];
	recommendedLayout: LayoutTypes;
}
