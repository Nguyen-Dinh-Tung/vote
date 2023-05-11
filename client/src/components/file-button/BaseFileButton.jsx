import React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
function BaseFileButton(props) {
  const handleChange = props.handleChange;
  const customCss = props.customCss;
  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          xs={customCss && customCss}
        >
          <input
            hidden
            accept="image/*"
            type="file"
            name="background"
            onChange={handleChange}
          />
          <PhotoCamera />
        </IconButton>
      </Stack>
    </div>
  );
}

export default BaseFileButton;
