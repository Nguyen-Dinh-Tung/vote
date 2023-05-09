import React, { useEffect, useState } from 'react';
import { ApiBase } from '../../api/api.base';
import Profile from '../../components/profile/Profile';

function Friend(props) {
  const [friends, setFriends] = useState();
  useEffect(() => {
    const urlGetFriends = '/friends/10/1';
    ApiBase.get(urlGetFriends)
      .then((res) => {
        console.log(res);
        setFriends(res.data.friends);
      })
      .catch((e) => {
        if (e) console.log(e);
      });
  }, []);
  return (
    <div>
      {friends &&
        friends.map((e, index) => {
          return <Profile />;
        })}
    </div>
  );
}

export default Friend;
