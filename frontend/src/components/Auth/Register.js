import React, { Fragment, useState } from "react";
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";

const Register = (props) => {
	const [registerForm, setRegisterForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { name, email, password, confirmPassword } = registerForm;

	const onChange = (e) => {
		setRegisterForm({
			...registerForm,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		console.log(registerForm);
	};

	return (
		<Fragment>
			<div className="pt-3 pb-3 display-4">Sign Up</div>
			<div className="pt-3 pb-3 lead">Create your new account</div>
			<Form onSubmit={(e) => onSubmit(e)}>
				<FormGroup>
					<Label for="name">Name</Label>
					<Input
						type="text"
						name="name"
						id="name"
						value={name}
						onChange={(e) => onChange(e)}
						placeholder="Your Name"
					/>
				</FormGroup>
				<FormGroup>
					<Label for="email">Email</Label>
					<Input
						type="email"
						name="email"
						id="email"
						value={email}
						onChange={(e) => onChange(e)}
						placeholder="Your Email"
					/>
					<FormText>We'll never share your email with anyone else</FormText>
				</FormGroup>
				<FormGroup>
					<Label for="password">Password</Label>
					<Input
						type="password"
						name="password"
						id="password"
						value={password}
						onChange={(e) => onChange(e)}
						placeholder="Your Password"
					/>
				</FormGroup>
				<FormGroup>
					<Label for="confirmPassword">Confirm Password</Label>
					<Input
						name="confirmPassword"
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => onChange(e)}
						placeholder="Confirm Your Password"
					/>
					<FormText>
						Password and Confirm Password should match with one another
					</FormText>
				</FormGroup>
				<Button>Register</Button>
			</Form>
		</Fragment>
	);
};

export default Register;