import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router";
import { Home } from "./pages/Home";
import React from "react";
const AuthorSearch = React.lazy(() => import("./pages/AuthorSearch"));
const DOI = React.lazy(() => import("./pages/DOI"));
const ORCID = React.lazy(() => import("./pages/ORCID"));
const AuthorPage = React.lazy(() => import("./pages/AuthorPage"));

/**
 * Main App object with frontend routes
 */
function App() {
	return (
		<BrowserRouter>
			<header className="navbar bg-neutral justify-evenly">
				<Link
					className="btn btn-ghost text-4xl text-neutral-content font-medium"
					to="/"
				>
					Citestat
				</Link>
			</header>
			<main className="container mx-auto px-4 font-jost">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<AuthorSearch />} />
					<Route path="/doi/:doi" element={<DOI />} />
					<Route path="/author/:orcid" element={<ORCID />} />
					<Route path="/author" element={<AuthorPage />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</main>
		</BrowserRouter>
	);
}

export default App;

navigator.storage.estimate().then((estimate: StorageEstimate) => {
	if (estimate.usage == undefined || estimate.quota == undefined) return;
	const usage = (estimate.usage * 100) / estimate.quota; // percentage
	if (usage > 80) {
		console.warn(
			`Using ${usage.toFixed(3)}% of storage, consider clearing cache`,
		);
	} else {
		console.info(
			`Using ${usage.toFixed(3)}% of ${(estimate.quota / 1024 / 1024).toFixed(1) + "MB"} bytes of storage`,
		);
	}
});
