import React from 'react';
import Button from '@mui/material/Button';

function BtnOutLine(props) {
    let desc = props.desc ;
    let css = props.css
    return (
        <Button variant="outlined" sx={css}>{desc}</Button>
    );
}

export default BtnOutLine;