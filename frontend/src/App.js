import React from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "reactstrap";
import Landing from "./components/layout/Landing";

const App = () => {
	return (
		<div>
			<Router>
				<Navbar />
				<Container>
					<Landing />
				</Container>
			</Router>
		</div>
	);
};

export default App;
