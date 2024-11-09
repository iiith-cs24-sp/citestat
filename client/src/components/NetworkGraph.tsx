import React from "react";
import {
	GraphCanvas,
	GraphEdge,
	GraphNode,
	lightTheme,
	darkTheme,
} from "reagraph";

interface GraphExampleProps {
	width: number | string;
	height: number | string;
	nodes: GraphNode[];
	edges: GraphEdge[];
	onNodeClick?: (node: GraphNode) => void;
}

export const GraphExample: React.FC<GraphExampleProps> = ({
	width,
	height,
	nodes,
	edges,
	onNodeClick,
}) => {
	return (
		<div style={{ position: "relative", width: width, height: height }}>
			<GraphCanvas
				nodes={nodes}
				edges={edges}
				cameraMode="pan"
				onNodeClick={onNodeClick}
				theme={
					getComputedStyle(document.documentElement).getPropertyValue(
						"color-scheme",
					) === "dark"
						? darkTheme
						: lightTheme
				}
			/>
		</div>
	);
};
