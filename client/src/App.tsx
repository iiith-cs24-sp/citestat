import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import AuthorSearch from "./AuthorSearch";

function App() {
	return (
		<Router>
			<div className="container mx-auto px-4 font-jost">
				<div className="navbar bg-base-300">
					<Link className="btn btn-ghost text-4xl font-medium" to="/">
						Citestat
					</Link>
				</div>
				<div>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search" element={<AuthorSearch />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
