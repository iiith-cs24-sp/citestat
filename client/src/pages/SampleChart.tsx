import Chart, { ChartItem } from "chart.js/auto";
import { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
//import { OpencitationsResponse, Citation } from "../types";
interface CitationAndYear
{
	year: number;
	count: number;
}
interface PassData
{
	data:CitationAndYear[];
}

interface PassString
{
	data:string;
}

/**
 * 
 * @param props A json array containing pair of year and count
 * @returns Chart functional component
 */
const SampleChart =(props:PassData) => {
	const {data}=props;
	useEffect(() => {
		let chart = new Chart(
			document.getElementById("citations") as ChartItem,
			{
				type: "bar",
				data: {
					labels: data.map((row) => row.year),
					datasets: [
						{
							label: "Citations by year",
							data: data.map((row) => row.count),
						},
					],
				},
			},
		);
		return () => {
			chart.destroy();
		};
	}, []);

	return (
		<div style={{ width: 800 }}>
			<canvas id="citations"></canvas>
		</div>
	);
};
/**
 * Parent component of sample chart component , obtains years and counts by api query on doi string
 * before passing the counts to sample chart component
 * @param props A DOI string 
 * @returns a parent component of chart component 
 */
export const SampleChartParent = (props:PassString) => {
	let {data}= props;
	
	const currentYear: number = new Date().getFullYear(); console.log(currentYear);
	const [data3, setData3] = useState<CitationAndYear[]>();
	
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	
	const query = data;

	useEffect(() => {
		const fetchopenCitationsResults = async() =>
		{
			try {
				setLoading(true);
				const response = await fetch(`https://opencitations.net/index/coci/api/v1/citations/${query}`)
				console.log(response);
				if(!response.ok)
					throw new Error(
						response.status + " " + response.statusText,
					);
				const dataObtained= await response.json();
				let yearMap= new Map<number,number>();
				dataObtained.forEach((citation: { creation: string }) => 
				{ 
					const year = new Date(citation.creation).getFullYear(); 
					let val=yearMap.get(year);
					if (val) 
					{ 
						yearMap.set(year,val+1); 
					} 
					else 
					{ 
						yearMap.set(year,1) ; 
					} 
				});
				console.log(yearMap);
				let yearObj = Object.fromEntries(yearMap)
				let dataTemp:CitationAndYear[] = [];
				Object.keys(yearObj).map((k)=>{
					dataTemp.push({year: Number.parseInt(k), count: yearObj[k]});
				  }
				)
				setData3(dataTemp);
			}
			catch (err)
			{
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}



		};
		if(query)
			fetchopenCitationsResults();
	},[query]);

	if (error)
		return <h2 className="text-3xl font-medium mb-6">Error: {error}</h2>;

	return (
		<div className="p-8">
			<h2 className="text-3xl font-medium mb-6">Citations per year for doi= "{data}" obtained from OpenCitations API</h2>
			{loading || !data3 ? (
				<div className="skeleton h-96 w-full rounded"></div>
			) : (
				<SampleChart data={data3} />		
			)}
		</div>
		
	)

}