import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Paginations(props) {
  const handleChange = props.handleChange;
  const totalPage = props.totalPage;
  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPage && totalPage ? totalPage : 5}
        color="secondary"
        onChange={handleChange}
      />
    </Stack>
  );
}
