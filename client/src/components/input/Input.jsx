import React from 'react';

function Input(props) {
    const handleChange = props.handleChange ;
    const name = props.name ;
    const type = props.type ;
    const accept = props.accept ;
    const placeholder = props.placeholder;
    return (
        <>
            <input id={name} onChange={handleChange} className="info-register" type={type} name={name} 
            placeholder={placeholder} accept={accept && accept} />
        </>
    );
}

export default Input;