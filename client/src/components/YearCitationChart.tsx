import Chart, { ChartItem } from "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Citation } from "../models/Citation";

interface CitationAndYear {
	year: number;
	count: number;
}

/**
 * Interface to pass doi string to react component
 */
interface YearCitationChartProps {
	doi: string;
}

/**
 * Gets a doi string in prop , uses it to perform fetch request of citation data from Open Citation API , use resulting
 * json to generate chart.
 * @param props A DOI string corresponding to some publication
 * @property loading : loading status
 * @property error: whether there was some error in fetching api results
 * @returns React component displaying a single Chart showing citations per year
 */
export const YearCitationChart: React.FC<YearCitationChartProps> = (props) => {
	const currentYear: number = new Date().getFullYear();
	console.log(currentYear);
	const [data, setData] = useState<Citation[]>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const query = props.doi;

	useEffect(() => {
		const fetchopenCitationsResults = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`https://opencitations.net/index/api/v2/citations/doi:${query}`,
				);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);

				await response.json().then((dataObtained) => {
					setData(dataObtained);
				});
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};
		if (query) fetchopenCitationsResults();
	}, [query]);

	useEffect(() => {
		if (!data) return;
		console.debug(data);
		const yearMap = new Map<number, number>();
		data.forEach((citation) => {
			const year = new Date(citation.creation).getFullYear();
			const val = yearMap.get(year);
			if (val) {
				yearMap.set(year, val + 1);
			} else {
				yearMap.set(year, 1);
			}
		});
		console.log(yearMap);
		const yearObj = Object.fromEntries(yearMap);
		const dataTemp: CitationAndYear[] = [];
		Object.keys(yearObj).map((k) => {
			dataTemp.push({
				year: Number.parseInt(k),
				count: yearObj[k],
			});
		});
		const canvas = document.getElementById("citations");
		const chart = new Chart(canvas as ChartItem, {
			type: "bar",
			data: {
				labels: dataTemp.map((row) => row.year),
				datasets: [
					{
						label: "Citations by year",
						backgroundColor: getComputedStyle(
							canvas!,
						).getPropertyValue("color"),
						data: dataTemp.map((row) => row.count),
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
		});
		return () => {
			chart.destroy();
		};
	}, [data]);

	if (error)
		return <p className="text-3xl font-medium mb-6">Error: {error}</p>;
	return (
		<div className="p-8">
			{loading ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				<></>
			)}
			<canvas
				id="citations"
				className="max-h-96 w-full rounded text-secondary"
			></canvas>
		</div>
	);
};
