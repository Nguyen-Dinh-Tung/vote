import React from 'react';

function BaseSelect(props) {
  const options = props.options;
  const handleChange = props.handleChange;
  return (
    <div>
      <select onChange={handleChange} className="base-select" name="" id="">
        <option defaultChecked>Trạng thái</option>
        {options &&
          options.map((e) => {
            return <option value={e && e.value}>{e && e.desc}</option>;
          })}
      </select>
    </div>
  );
}

export default BaseSelect;
