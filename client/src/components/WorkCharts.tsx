import React, { useEffect } from "react";
import Chart, { ChartItem } from "chart.js/auto";
import { Work } from "../types";

interface WorkChartsProps {
    works: Work[];
}

export const WorkCharts: React.FC<WorkChartsProps> = ({ works }) => {
    const charts: Chart[] = [];

    useEffect(() => {
        const destroyCharts = () => {
            charts.forEach((chart) => chart.destroy());
            charts.length = 0;
        };

        // Helper: Group works by year
        const groupByYear = () => {
            const yearMap = new Map<number, number>();
            works.forEach((work) => {
                const year =
                    work.issued?.["date-parts"]?.[0]?.[0] || // Use issued date
                    work.created.getYear() // Fallback to created date
                yearMap.set(year, (yearMap.get(year) || 0) + 1);
            });
            return Object.fromEntries(yearMap);
        };

        // Helper: Group works by publisher
        const groupByPublisher = () => {
            const publisherMap = new Map<string, number>();
            works.forEach((work) => {
                if (work.publisher) {
                    publisherMap.set(
                        work.publisher,
                        (publisherMap.get(work.publisher) || 0) + 1
                    );
                }
            });
            return Object.fromEntries(publisherMap);
        };

        // Helper: Top works by reference count
        const getTopReferences = (count: number) => {
            return works
                .filter((work) => work["reference-count"])
                .sort((a, b) => (b["reference-count"] || 0) - (a["reference-count"] || 0))
                .slice(0, count);
        };

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
                                label: "Publications Over Time",
                                data: yearCounts,
                                borderColor: "#42A5F5",
                                fill: false,
                            },
                        ],
                    },
                    options: { responsive: true },
                })
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
                                label: "Works by Publisher",
                                data: publisherCounts.slice(0, 10),
                                backgroundColor: "#36A2EB",
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { ticks: { display: false } }
                        }
                    },
                })
            );
        }

        // Top Works by Reference Count Chart
        const topReferences = getTopReferences(10);
        const topTitles = topReferences.map((work) => work.title || "Unknown");
        const topReferenceCounts = topReferences.map(
            (work) => work["reference-count"] || 0
        );

        const referenceCanvas = document.getElementById("referenceChart");
        if (referenceCanvas) {
            charts.push(
                new Chart(referenceCanvas as ChartItem, {
                    type: "bar",
                    data: {
                        labels: topTitles,
                        datasets: [
                            {
                                label: "Top Works by Reference Count",
                                data: topReferenceCounts,
                                backgroundColor: "#FF6384",
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                        },
                        scales: {
                            x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45, display: false } },
                        },
                    },
                })
            );
        }

        // Cleanup on unmount
        return () => {
            destroyCharts();
        };
    }, [works]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Work Charts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="chart-container">
                    <h3 className="text-lg font-medium mb-2">Publications Over Time</h3>
                    <canvas id="yearChart"></canvas>
                </div>
                <div className="chart-container">
                    <h3 className="text-lg font-medium mb-2">Works by Publisher</h3>
                    <canvas id="publisherChart"></canvas>
                </div>
                <div className="chart-container">
                    <h3 className="text-lg font-medium mb-2">
                        Top Works by Reference Count
                    </h3>
                    <canvas id="referenceChart"></canvas>
                </div>
            </div>
        </div>
    );
};
