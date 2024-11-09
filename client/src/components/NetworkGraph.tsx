import React from "react";
import { GraphCanvas } from "reagraph";

export interface GraphNode {
	id: string;
	label: string;
}

export interface GraphEdge {
	source: string;
	target: string;
	id: string;
	label: string;
}
interface GraphExampleProps {
	width: number | string;
	height: number | string;
	nodes: GraphNode[];
	edges: GraphEdge[];
}

export const GraphExample: React.FC<GraphExampleProps> = ({
	width,
	height,
	nodes,
	edges,
}) => {
	return (
		<div style={{ position: "relative", width: width, height: height }}>
			<GraphCanvas nodes={nodes} edges={edges} />
		</div>
	);
};
