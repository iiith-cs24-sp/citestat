import React from "react";
import {
	GraphCanvas,
	GraphEdge,
	GraphNode,
	lightTheme,
	darkTheme,
	recommendLayout,
	LayoutTypes,
} from "reagraph";

interface NetworkGraphProps {
	width: number | string;
	height: number | string;
	nodes: GraphNode[];
	edges: GraphEdge[];
	onNodeClick?: (node: GraphNode) => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
	width,
	height,
	nodes,
	edges,
	onNodeClick,
}) => {
	const layout: LayoutTypes = recommendLayout(nodes, edges);
	console.log(layout);

	return (
		<div style={{ position: "relative", width: width, height: height }}>
			<GraphCanvas
				nodes={nodes}
				edges={edges}
				layoutType={layout}
				sizingType="centrality"
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
