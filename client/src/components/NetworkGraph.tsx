import React, { useRef } from "react";
import {
	GraphCanvas,
	GraphCanvasRef,
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
	const ref = useRef<GraphCanvasRef | null>(null);
	const layout: LayoutTypes = recommendLayout(nodes, edges);
	console.log(layout);

	return (
		<div style={{ position: "relative", width: width, height: height }}>
			<button
				onClick={() => {
					const data = ref.current?.exportCanvas();

					const link = document.createElement("a");
					link.setAttribute("href", data ?? "");
					link.setAttribute("target", "_blank");
					link.setAttribute("download", "network_graph.png");
					link.click();
				}}
				className="btn z-50 relative m-1"
			>
				Save as Image
			</button>
			<GraphCanvas
				ref={ref}
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
