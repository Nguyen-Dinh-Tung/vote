import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
let token = localStorage.getItem('token')
export const socket = io(URL , {
    auth : {
        token : token
    }
}); 