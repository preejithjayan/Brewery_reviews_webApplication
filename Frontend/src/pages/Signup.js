import { Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import TextInput from '../components/Input'
import Button from '../components/Button'
import FormikError from '../components/FormikError'
import { signup } from '../redux/auth'
import { useDispatch } from 'react-redux'
import api from '../utils/api'
import { Link } from 'react-router-dom'


export default function Signup() {
    const validationSchema = yup.object({
        name: yup.string().required("Required"),
        email: yup.string().email("Should be a valid email address").required("Required"),
        password: yup.string().min(6, "Should have atleast 6 characters").required("Required"),
        confirm: yup.string().oneOf([yup.ref("password"), null], "Passwords should match").required("Required"),
    })
    const [signupError, setSignupError] = useState("")
    const dispatch = useDispatch();
    const handleFormSubmit = async(values, { setSubmitting}) => {
        setSignupError("")
        const res = await dispatch(signup(values))
        if(res.error) {
            setSignupError(res.error.message)
        } else {
            api.defaults.headers.common.Authorization = "Bearer "+res.payload.token;
            localStorage.setItem("token", res.payload.token)
        }
        setSubmitting(false)
    }
    return (
        <div className="h-screen w-screen bg-neutral-100 flex items-center justify-center">
            <Formik
                initialValues={{email: "", name: "", password: "", confirm: ""}}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
            >
                {({handleSubmit, values, handleBlur, handleChange, isSubmitting}) => (
                    <form onSubmit={handleSubmit} id="login" className="flex flex-col p-8 bg-white rounded-lg min-w-96 max-w-[600px] w-full sm:w-1/2">
                        <h1 className="text-center text-2xl font-bold mb-4">Breweries</h1>
                        <TextInput name="name" id="name" label="Name" onChange={handleChange} value={values.name} onBlur={handleBlur} />
                        <FormikError name="name" />
                        <TextInput name="email" id="email" type="email" label="Email" labelClassName="mt-4" onChange={handleChange} value={values.email} onBlur={handleBlur} />
                        <FormikError name="email" />
                        <TextInput name="password" id="password" type="password" label="Password" labelClassName="mt-4" onChange={handleChange} value={values.password} onBlur={handleBlur} />
                        <FormikError name="password" />
                        <TextInput name="confirm" id="confirm" type="password" label="Confirm Password" labelClassName="mt-4" onChange={handleChange} value={values.confirm} onBlur={handleBlur} />
                        <FormikError name="confirm" />
                        <div className="text-red-500 mt-2 text-center">{signupError}</div>
                        <Button type="submit" disabled={isSubmitting} label="Sign Up" className="mt-2" />
                        <div className="text-center mt-4">
                            Already have an account? <Link to="/login" className="text-blue-800">Log In</Link>.
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}