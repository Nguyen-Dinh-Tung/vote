import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function Popup(props) {
  const handleClose = props.handleClose;
  const open = props.open;
  const Content = props.Content;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ padding: 0 }}>
          {Content && <Content handleClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
