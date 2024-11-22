import React, { useRef, forwardRef } from "react";
import {
	GraphCanvas,
	GraphCanvasRef,
	GraphEdge,
	GraphNode,
	lightTheme,
	darkTheme,
	recommendLayout,
	LayoutTypes,
	CameraMode,
	useSelection,
} from "reagraph";

interface GraphControlsProps {
	setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}

const GraphControls = forwardRef<GraphCanvasRef, GraphControlsProps>(
	(props, ref) => {
		return (
			<div className="flex flex-row justify-between items-center">
				<button
					onClick={() => {
						const data = (
							ref as React.RefObject<GraphCanvasRef>
						).current?.exportCanvas();
						const link = document.createElement("a");
						link.setAttribute("href", data ?? "");
						link.setAttribute("target", "_blank");
						link.setAttribute("download", "network_graph.png");
						link.click();
					}}
					className="btn btn-outline btn-neutral z-50 relative m-1"
				>
					Save as Image
				</button>
				<button
					onClick={() => {
						const data = (
							ref as React.RefObject<GraphCanvasRef>
						).current
							?.getGraph()
							.export();
						console.log(data);
						const JsonData = JSON.stringify(data, null, 4);
						const link = document.createElement("a");
						link.setAttribute(
							"href",
							`data:text/json;charset=utf-8,${encodeURIComponent(JsonData)}`,
						);
						link.setAttribute("download", "network_graph.json");
						link.click();
					}}
					className="btn btn-outline btn-neutral z-50 relative m-1"
				>
					Export to JSON
				</button>
			</div>
		);
	},
);

interface NetworkGraphProps {
	width: number | string;
	height: number | string;
	nodes: GraphNode[];
	edges: GraphEdge[];
	onNodeClick?: (node: GraphNode) => void;
	darkMode?: boolean;
}
/**
 *
 * @param props.width
 * @param props.height
 * @param props.nodes : nodes in the network graph
 * @param props.edges: edges in the network graph
 * @returns
 */
export const NetworkGraph: React.FC<NetworkGraphProps> = ({
	width,
	height,
	nodes,
	edges,
	onNodeClick,
	darkMode = false,
}) => {
	const graphRef = useRef<GraphCanvasRef | null>(null);
	const layout: LayoutTypes = recommendLayout(nodes, edges);
	console.log(layout);
	const [cameraMode, setCameraMode] = React.useState<CameraMode>("pan");
	const { selections, actives, onNodePointerOver, onNodePointerOut } =
		useSelection({
			ref: graphRef,
			nodes: nodes,
			edges: edges,
			pathHoverType: "all",
		});

	return (
		<div style={{ position: "relative", width: width, height: height }}>
			<GraphControls setCameraMode={setCameraMode} ref={graphRef} />
			<GraphCanvas
				ref={graphRef}
				nodes={nodes}
				edges={edges}
				layoutType={layout}
				sizingType="centrality"
				cameraMode={cameraMode}
				selections={selections}
				actives={actives}
				onNodePointerOver={onNodePointerOver}
				onNodePointerOut={onNodePointerOut}
				onNodeClick={onNodeClick}
				theme={darkMode ? darkTheme : lightTheme}
			/>
		</div>
	);
};
