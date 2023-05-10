import React from 'react';

function BaseSelect(props) {
  const options = props.options;
  return (
    <div>
      <select name="" id="">
        <option defaultChecked>Lọc</option>
        {options &&
          options.map((e) => {
            return <option value={e && e.value}>{e && e.desc}</option>;
          })}
      </select>
    </div>
  );
}

export default BaseSelect;
