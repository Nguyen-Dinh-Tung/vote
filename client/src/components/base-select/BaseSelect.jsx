import React from 'react';

function BaseSelect(props) {
  const options = props.options;
  const handleChange = props.handleChange;
  const customCss = props.customCss;
  const name = props.name;
  return (
    <div className="base-select" style={customCss}>
      <p className="select-desc">{name && name ? name : 'Trạng thái'}</p>
      <div className="drop-down">
        {options &&
          options.map((e, index) => {
            return (
              <div className="base-option" value={e && e.value} key={index}>
                {e && e.desc}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BaseSelect;
