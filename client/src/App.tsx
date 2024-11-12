import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	Navigate,
} from "react-router-dom";
import {Home} from "./pages/Home";
import {AuthorSearch} from "./pages/AuthorSearch";
import {DOI} from "./pages/DOI";
import {ORCID} from "./pages/ORCID";
import {AuthorPage} from "./pages/AuthorPage";
import {SampleChartParent} from "./pages/SampleChart";

/**
 * Main App object
 */
//const doi ="10.1002/adfm.201505328";
function App() {
	return (
		<Router>
			<div className="navbar bg-primary justify-evenly">
				<Link
					className="btn btn-ghost text-4xl text-primary-content font-medium"
					to="/"
				>
					Citestat
				</Link>
			</div>
			<div className="container mx-auto px-4 font-jost">
				<div>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search" element={<AuthorSearch />} />
						<Route path="/doi/:doi" element={<DOI />} />
						<Route path="/author/:orcid" element={<ORCID />} />
						<Route path="/author" element={<AuthorPage />} />
						<Route path="*" element={<Navigate to="/" />} />
						<Route path="/sample" element= {<SampleChartParent data={"10.1002/adfm.201505328"}/>}/>
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
