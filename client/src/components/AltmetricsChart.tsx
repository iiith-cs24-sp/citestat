import React, { useEffect, useState } from "react";
import Chart, { ChartItem } from "chart.js/auto";

interface AltmetricsData {
	cohorts: {
		sci: number;
		pub: number;
		com: number;
		doc: number;
	};
	history: {
		[key: string]: number;
	};
	cited_by: {
		tweeters: number;
		news: number;
		feeds: number;
		facebook: number;
		reddit: number;
		wikipedia: number;
		policies: number;
	};
}

interface AltmetricsChartProps {
	doi: string;
}

export const AltmetricsChart: React.FC<AltmetricsChartProps> = ({ doi }) => {
	const [data, setData] = useState<AltmetricsData | null>(null);
	const [show, setShow] = useState<boolean>(true);

	useEffect(() => {
		const fetchAltmetricsData = async () => {
			try {
				const response = await fetch(
					`https://api.altmetric.com/v1/doi/${doi}`,
				);
				if (!response.ok) {
					throw new Error(
						`Error fetching data: ${response.statusText}`,
					);
				}
				const altmetrics = await response.json();

				// Transform the data into the required structure
				const transformedData: AltmetricsData = {
					cohorts: altmetrics.cohorts,
					history: altmetrics.history,
					cited_by: {
						tweeters: altmetrics.cited_by_tweeters_count || 0,
						news: altmetrics.cited_by_msm_count || 0,
						feeds: altmetrics.cited_by_feeds_count || 0,
						facebook: altmetrics.cited_by_fbwalls_count || 0,
						reddit: altmetrics.cited_by_rdts_count || 0,
						wikipedia: altmetrics.cited_by_wikipedia_count || 0,
						policies: altmetrics.cited_by_policies_count || 0,
					},
				};

				setData(transformedData);
				setShow(true);
			} catch (err) {
				console.error(err);
				setShow(false);
			}
		};

		fetchAltmetricsData();
	}, [doi]);

	useEffect(() => {
		if (!data) {
			setShow(false);
			return;
		}
		// Cohorts Breakdown Chart
		const cohortsCanvas = document.getElementById("cohortsChart");

		const cohortsChart = new Chart(cohortsCanvas as ChartItem, {
			type: "pie",
			data: {
				labels: ["Scientists", "Public", "Community", "Doctors"],
				datasets: [
					{
						data: [
							data!.cohorts.sci,
							data!.cohorts.pub,
							data!.cohorts.com,
							data!.cohorts.doc,
						],
						backgroundColor: [
							"#FF6384",
							"#36A2EB",
							"#FFCE56",
							"#4BC0C0",
						],
					},
				],
			},
			options: {
				responsive: true,
			},
		});

		// History (Citations Over Time) Chart
		const historyCanvas = document.getElementById("historyChart");

		const historyChart = new Chart(historyCanvas as ChartItem, {
			type: "line",
			data: {
				labels: Object.keys(data!.history).map((key) => key),
				datasets: [
					{
						label: "Citations Over Time",
						data: Object.values(data!.history),
						borderColor: "#42A5F5",
						fill: false,
						tension: 0.1,
					},
				],
			},
			options: {
				responsive: true,
			},
		});

		// Cited By Platforms Chart
		const citedByCanvas = document.getElementById("citedByChart");
		const citedByChart = new Chart(citedByCanvas as ChartItem, {
			type: "bar",
			data: {
				labels: [
					"Tweeters",
					"News",
					"Feeds",
					"Facebook",
					"Reddit",
					"Wikipedia",
					"Policies",
				],
				datasets: [
					{
						label: "Citations by Platform",
						data: [
							data!.cited_by.tweeters,
							data!.cited_by.news,
							data!.cited_by.feeds,
							data!.cited_by.facebook,
							data!.cited_by.reddit,
							data!.cited_by.wikipedia,
							data!.cited_by.policies,
						],
						backgroundColor: [
							"#FF6384",
							"#36A2EB",
							"#FFCE56",
							"#4BC0C0",
							"#9966FF",
							"#FF9F40",
							"#C9CBCF",
						],
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: true,
					},
				},
			},
		});

		// Cleanup Charts on Unmount
		return () => {
			historyChart?.destroy();
			citedByChart?.destroy();
			cohortsChart?.destroy();
		};
	}, [data]);

	return (
		<div className="p-8">
			{show && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="chart-container">
						<h3 className="text-lg font-medium mb-2">
							Cohorts Breakdown
						</h3>
						<canvas id="cohortsChart"></canvas>
					</div>
					<div className="chart-container">
						<h3 className="text-lg font-medium mb-2">
							Citations Over Time
						</h3>
						<canvas id="historyChart"></canvas>
					</div>
					<div className="chart-container">
						<h3 className="text-lg font-medium mb-2">
							Cited By Platforms
						</h3>
						<canvas id="citedByChart"></canvas>
					</div>
				</div>
			)}
			{!show && <h1>No Altmetrics found for this publication</h1>}
		</div>
	);
};
