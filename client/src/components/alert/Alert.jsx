import * as React from 'react';
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../redux/features/show.slice';
import Alert from "@mui/material/Alert";



export default function AlertComponents() {
  const dispatch = useDispatch()
  const open = useSelector(state => state.show.alert)

  const handleClose = (event, reason) => {
    dispatch(setAlert({...open , status : false}))
  };
  return (
    <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={open && open.status} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={open && open.type} sx={{ width: "100%" }}>
          {open && open.message}
        </Alert>
    </Snackbar>
  );
}