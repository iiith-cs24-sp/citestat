import Chart, { ChartItem } from "chart.js/auto";
import { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
//import { OpencitationsResponse, Citation } from "../types";
interface CitationAndYear {
	year: number;
	count: number;
}
/**
 * Interface to pass Citation and year to sample chart component (sample chart not in  use at present)
 */

/**
 * Interface to pass doi string to react component
 */
interface PassString
{
	data:string;
}

/**
 * Gets a doi string in prop , uses it to perform fetch request of citation data from Open Citation API , use resulting
 * json to generate chart.
 * @param props A DOI string corresponding to some publication
 * @property loading : loading status
 * @property error: whether there was some error in fetching api results
 * @returns React component displaying a single Chart showing citations per year
 */
export const YearCitationChart = (props: PassString) => {
	let { data: doiParameter } = props;
	const currentYear: number = new Date().getFullYear();
	console.log(currentYear);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const query = doiParameter;
	useEffect(() => {
		const fetchopenCitationsResults = async () => {
			try {
				setLoading(true);
				const response = await fetch(
					`https://opencitations.net/index/coci/api/v1/citations/${query}`,
				);
				console.log(response);
				if (!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);
				const dataObtained = await response.json();
				let yearMap = new Map<number, number>();
				dataObtained.forEach((citation: { creation: string }) => {
					const year = new Date(citation.creation).getFullYear();
					let val = yearMap.get(year);
					if (val) {
						yearMap.set(year, val + 1);
					} else {
						yearMap.set(year, 1);
					}
				});
				console.log(yearMap);
				let yearObj = Object.fromEntries(yearMap);
				let dataTemp: CitationAndYear[] = [];
				Object.keys(yearObj).map((k) => {
					dataTemp.push({
						year: Number.parseInt(k),
						count: yearObj[k],
					});
				});
				let chart = new Chart(
					document.getElementById("citations") as ChartItem,
					{
						type: "bar",
						data: {
							labels: dataTemp.map((row) => row.year),
							datasets: [
								{
									label: "Citations by year",
									data: dataTemp.map((row) => row.count),
								},
							],
						},
					},
				);
				return () => {
					chart.destroy();
				};
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};
		if (query) fetchopenCitationsResults();
	}, [query]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;
	return (
		<div className="p-8">
			<h2 className="text-3xl font-medium mb-6">
				Citations per year for doi= "{doiParameter}"{" "}
			</h2>
			{loading || !doiParameter ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				<div style={{ width: 800 }}>
					<canvas id="citations"></canvas>
				</div>
			)}
		</div>
	);
};
