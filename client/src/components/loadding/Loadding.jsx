import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export default function Loadding() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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