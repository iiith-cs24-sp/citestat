import React, { useEffect } from "react";
import Chart, { ChartItem } from "chart.js/auto";
import { Work } from "../types";

interface WorkChartsProps {
	works: Work[];
}

/**
 *
 * @param props.works : an array of author's publications
 * @returns
 */
export const WorkCharts: React.FC<WorkChartsProps> = ({ works }) => {
	const gridColor = "#777777";

	useEffect(() => {
		const charts: Chart[] = [];
		const destroyCharts = () => {
			charts.forEach((chart) => chart.destroy());
			charts.length = 0;
		};

		// Helper: Group works by year
		function groupByYear() {
			const yearMap = new Map<number, number>();
			works.forEach((work) => {
				const year =
					work.issued?.["date-parts"]?.[0]?.[0] || // Use issued date
					work.created["date-parts"]?.[0]?.[0]; // Fall back to created date
				yearMap.set(year, (yearMap.get(year) || 0) + 1);
			});
			// Now, mark years with no publications as 0
			const minYear = Math.min(...yearMap.keys());
			const maxYear = Math.max(...yearMap.keys());
			for (let year = minYear; year <= maxYear; year++) {
				if (!yearMap.has(year)) {
					yearMap.set(year, 0);
				}
			}
			return Object.fromEntries(yearMap);
		}

		// Helper: Group works by publisher
		function groupByPublisher() {
			const publisherMap = new Map<string, number>();
			works.forEach((work) => {
				if (work.publisher) {
					publisherMap.set(
						work.publisher,
						(publisherMap.get(work.publisher) || 0) + 1,
					);
				}
			});
			return Object.fromEntries(publisherMap);
		}

		// Helper: Top works by citation count
		function getTopCitations(count: number) {
			return works
				.filter((work) => work["is-referenced-by-count"])
				.sort(
					(a, b) =>
						(b["is-referenced-by-count"] || 0) -
						(a["is-referenced-by-count"] || 0),
				)
				.slice(0, count);
		}

		// Publications Over Time Chart
		const yearData = groupByYear();
		const years = Object.keys(yearData).map(Number);
		const yearCounts = Object.values(yearData);

		const yearCanvas = document.getElementById("yearChart");
		if (yearCanvas) {
			charts.push(
				new Chart(yearCanvas as ChartItem, {
					type: "line",
					data: {
						labels: years,
						datasets: [
							{
								label: "Publications",
								data: yearCounts,
								borderColor: getComputedStyle(
									yearCanvas!,
								).getPropertyValue("color"),
								fill: false,
							},
						],
					},
					options: {
						responsive: true,
						scales: {
							x: {
								ticks: { stepSize: 1 },
								grid: { color: gridColor },
							},
							y: { min: 0, grid: { color: gridColor } },
						},
					},
				}),
			);
		}

		// Works by Publisher Chart
		const publisherData = groupByPublisher();
		const publishers = Object.keys(publisherData);
		const publisherCounts = Object.values(publisherData);

		const publisherCanvas = document.getElementById("publisherChart");
		if (publisherCanvas) {
			charts.push(
				new Chart(publisherCanvas as ChartItem, {
					type: "bar",
					data: {
						labels: publishers.slice(0, 10), // Top 10 publishers
						datasets: [
							{
								label: "Works",
								data: publisherCounts.slice(0, 10),
								backgroundColor: getComputedStyle(
									publisherCanvas!,
								).getPropertyValue("color"),
							},
						],
					},
					options: {
						responsive: true,
						scales: {
							x: { ticks: { display: false } },
							y: { min: 0, grid: { color: gridColor } },
						},
					},
				}),
			);
		}

		// Top Works by Citation Count Chart
		const topCitations = getTopCitations(10);
		const topTitles = topCitations.map((work) => work.title || "Unknown");
		const topCitationCounts = topCitations.map(
			(work) => work["is-referenced-by-count"] || 0,
		);

		const referenceCanvas = document.getElementById("citationChart");
		if (referenceCanvas) {
			charts.push(
				new Chart(referenceCanvas as ChartItem, {
					type: "bar",
					data: {
						labels: topTitles,
						datasets: [
							{
								label: "Citation Count",
								data: topCitationCounts,
								backgroundColor: getComputedStyle(
									referenceCanvas!,
								).getPropertyValue("color"),
							},
						],
					},
					options: {
						responsive: true,
						plugins: {
							legend: { display: true },
						},
						scales: {
							x: {
								ticks: {
									autoSkip: false,
									maxRotation: 45,
									minRotation: 45,
									display: false,
								},
								grid: { color: gridColor },
							},
							y: { min: 0, grid: { color: gridColor } },
						},
					},
				}),
			);
		}

		// Cleanup on unmount
		return () => {
			destroyCharts();
		};
	}, [works]);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="chart-container">
				<h2 className="text-lg font-medium mb-2">
					Publications Over Time
				</h2>
				<canvas
					id="yearChart"
					className="text-secondary accent-primary"
				></canvas>
			</div>
			<div className="chart-container">
				<h2 className="text-lg font-medium mb-2">Works by Publisher</h2>
				<canvas
					id="publisherChart"
					className="text-secondary accent-primary"
				></canvas>
			</div>
			<div className="chart-container">
				<h2 className="text-lg font-medium mb-2">
					Top Works by Citation Count
				</h2>
				<canvas
					id="citationChart"
					className="text-secondary accent-primary"
				></canvas>
			</div>
		</div>
	);
};
