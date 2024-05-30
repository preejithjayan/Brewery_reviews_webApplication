import React from 'react';
import { Button } from '../components';

export default function Login() {
	const handleValidation = (values) => {
		const errors = {};
		if (!values.email) {
			errors.email = 'Required';
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
		) {
			errors.email = 'Invalid email address';
		}

		if(!values.password)
			errors.password = 'Required';
		return errors;
	}
	const handleSubmit = async(values, {setSubmitting}) => {
		await dispatch(login({email: values.email, password: values.password}));
		setSubmitting(false);
	}
	return (
		<div className="center-container">
		<div className="login-page">
		<Formik
			initialValues={{ email: '', password: '' }}
		validate={handleValidation}
		onSubmit={handleSubmit}
		>
		{({
			values,
			errors,
			touched,
			handleChange,
			handleBlur,
			handleSubmit: formikHandleSubmit,
			isSubmitting,
		}) => (
			<form id="login" onSubmit={formikHandleSubmit}>
				<div className="">Breweries</div>
				<label htmlFor="email">Email Address</label>
				<input type="email" id="email" name="email" />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" />
				<Button label="Login" variant="primary" onClick={() => handleLogin()} disabled={isSubmitting} />
			</form>
		)}
			</Formik>
			</div>
			</div>
		)
		}
