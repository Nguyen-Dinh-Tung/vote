import React, { useEffect, useState } from 'react';
import './index.css';
import { Avatar, Box, Container, Grid } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { ApiBase } from '../../api/api.base';
import { useSelector } from 'react-redux';
import { Handle } from './handle';

function NewFriend(props) {
  const [users, setUsers] = useState([]);
  const [reRenderUnknowPeople, setReRenderUnknowPeople] = useState();
  const idUser = useSelector((state) => state.user.id);
  useEffect(() => {
    const urlGetUsers = '/friends/data/unknow/list/1';
    ApiBase.get(urlGetUsers)
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, [reRenderUnknowPeople]);
  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {users &&
            users.map((e, index) => {
              if (e.id !== idUser)
                return (
                  <Grid item xs={2} sm={4} md={4} key={e.id}>
                    <div className="fiend" key={e.id}>
                      <Avatar src={e && e.background} alt="Remy Sharp" />
                      <p>{e && e.username}</p>
                      <PersonAddAlt1Icon
                        className="icons-add-friend"
                        sx={{
                          fontSize: '30px',
                          marginLeft: '10px',
                          ':hover': {
                            color: 'white',
                            cursor: 'pointer',
                          },
                        }}
                        onClick={async () => {
                          let data = {
                            idUser: idUser,
                            idsReveice: e.id,
                          };
                          Handle.addFriend(data, setReRenderUnknowPeople);
                        }}
                      />
                    </div>
                  </Grid>
                );
            })}
        </Grid>
      </Box>
    </Container>
  );
}

export default NewFriend;
{
  /* <div className="list-friend">
{users &&
  users.map((e, index) => {
    if (e.id !== idUser)
      return (
        <div className="fiend" key={e.id}>
          <Avatar src={e && e.background} alt="Remy Sharp" />
          <p>{e && e.username}</p>
          <PersonAddAlt1Icon
            className="icons-add-friend"
            sx={{
              fontSize: '30px',
              marginLeft: '10px',
              ':hover': {
                color: 'white',
                cursor: 'pointer',
              },
            }}
          />
        </div>
      );
  })}
</div> */
}
