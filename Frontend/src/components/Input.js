export default function TextInput({label, type, id, className="", labelClassName="", ...props}) {
    return (
        <>
        <label className={labelClassName} htmlFor={id}>{label}</label>
        <input type={type} id={id} className={"border-2 rounded-md border-gray-300 border-solid px-2 py-2 outline-none "+className} {...props} />
        </>
    )
}