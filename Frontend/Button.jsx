import React from 'react';

export default function Button ({variant, label, onClick, disabled}) {
	const variants = {
	}
	return (
		<button className={variants[variant]} onClick={onClick} disabled={disabled} />
	)
}
