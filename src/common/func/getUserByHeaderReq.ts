import  jwt_decode  from 'jwt-decode';

const getUserByReq = (headers : any) => {
    let token : any = jwt_decode(headers.authorization)
    let username = token.username
    return username
}

export default getUserByReq