import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export default function Loadding() {
  return (
    <div style={{ position : 'absolute' ,
     top : '50%' , transform : "translateY(-50%)",
     display : 'flex' ,
     justifyContent : 'center' ,
     width : '100%' ,
     marginLeft : '-10px'
     }}>
      <CircularProgress />
    </div>
  );
}