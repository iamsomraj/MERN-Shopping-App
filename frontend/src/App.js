import React from "react";
import Navbar from "./components/layout/Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Landing from "./components/layout/Landing";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const App = () => {
	return (
		<div>
			<Router>
				<Navbar />
				<Container className="mt-3">
					<Switch>
						<Route path="/" exact component={Landing} />
						<Route path="/login" exact component={Login} />
						<Route path="/register" exact component={Register} />
					</Switch>
				</Container>
			</Router>
		</div>
	);
};

export default App;
