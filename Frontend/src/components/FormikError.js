import { ErrorMessage } from "formik";

export default function FormikError ({name, className=""}) {
    return (
        <ErrorMessage name={name}>{msg => <div className={"text-red-500 "+className}>{msg}</div>}</ErrorMessage>
    )
}