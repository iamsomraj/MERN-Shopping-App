import React from "react";
import "antd/dist/antd.css";

import { Typography } from "antd";
import { Navbar } from "./components/layout/Navbar";

const { Title } = Typography;

const App = () => (
	<div className="App">
		<Navbar />
		<Title>Hello world</Title>
	</div>
);

export default App;
