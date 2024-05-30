import { Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import TextInput from '../components/Input'
import Button from '../components/Button'
import FormikError from '../components/FormikError'
import { useDispatch } from 'react-redux'
import { login } from '../redux/auth'
import api from '../utils/api'
import { Link } from 'react-router-dom'

export default function Login() {
    const validationSchema = yup.object({
        email: yup.string().email("Should be a valid email address").required("Required"),
        password: yup.string().min(6, "Should have atleast 6 characters").required("Required"),
    })
    const [loginError, setLoginError] = useState("")
    const dispatch = useDispatch();
    const handleFormSubmit = async(values, { setSubmitting}) => {
        setLoginError("")
        const res = await dispatch(login(values))
        if(res.error) {
            setLoginError(res.error.message)
        } else {
            api.defaults.headers.common.Authorization = "Bearer "+res.payload.token;
            localStorage.setItem("token", res.payload.token)
        }
        setSubmitting(false)
    }
    return (
        <div className="h-screen w-screen bg-neutral-100 flex items-center justify-center">
            <Formik
                initialValues={{email: "", password: ""}}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
            >
                {({handleSubmit, values, handleBlur, handleChange, isSubmitting}) => (
                    <form onSubmit={handleSubmit} id="login" className="flex flex-col p-8 bg-white rounded-lg min-w-96 max-w-[600px] w-full sm:w-1/2">
                        <h1 className="text-center text-2xl font-bold mb-4">Breweries</h1>
                        <TextInput name="email" id="email" type="email" label="Email" labelClassName="mt-4" onChange={handleChange} value={values.email} onBlur={handleBlur} />
                        <FormikError name="email" />
                        <TextInput name="password" id="password" type="password" label="Password" labelClassName="mt-4" onChange={handleChange} value={values.password} onBlur={handleBlur} />
                        <FormikError name="password" />
                        {loginError ? <div className="text-red-500 mt-2 text-center">{loginError}</div> : null}
                        <Button type="submit" disabled={isSubmitting} label="Login" className="mt-2" />
                        <div className="text-center mt-4">
                            Don't have an account? <Link to="/signup" className="text-blue-800">Sign Up</Link>.
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}