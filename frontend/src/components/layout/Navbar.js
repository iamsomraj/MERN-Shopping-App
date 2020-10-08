import Title from "antd/lib/skeleton/Title";
import React, { Component } from "react";
import { connect } from "react-redux";

export const Navbar = () => {
	return <div>Navbar</div>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
