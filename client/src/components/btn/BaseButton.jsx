import React from 'react';

function BaseButton(props) {
  const content = props.content;
  const customCss = props.customCss;
  const handleClick = props.handleClick;
  return (
    <button
      className="base-button"
      style={customCss && customCss}
      onClick={handleClick}
    >
      {content && content}
    </button>
  );
}

export default BaseButton;
