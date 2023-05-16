import jwt_decode from 'jwt-decode';

const getUserByReq = (headers: any) => {
  const token: any = jwt_decode(headers.authorization);
  const username = token.username;
  return username;
};

export default getUserByReq;
