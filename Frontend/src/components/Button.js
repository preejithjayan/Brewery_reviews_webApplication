import React from 'react'

export default function Button({label, className="", disabled, ...props}) {
    return (
        <button disabled={disabled} {...props} className={"bg-blue-400 p-4 text-white font-bold text-xl "+(disabled?"bg-gray-300 ":"")+className}>{label}</button>
    )
}