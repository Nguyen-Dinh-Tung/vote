import React from 'react';

function BaseInput(props) {
  const type = props.type;
  const customCss = props.customCss;
  const placeholder = props.placeholder;
  const handleChange = props.handleChange;
  const name = props.name;
  return (
    <input
      className="base-input"
      type={type && type}
      style={customCss && customCss}
      placeholder={placeholder && placeholder}
      onChange={handleChange}
      name={name && name}
    />
  );
}

export default BaseInput;
