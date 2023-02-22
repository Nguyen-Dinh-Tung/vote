import { useDispatch } from "react-redux"
import { setAlert } from "../redux/features/show.slice"
const useNotifyFunc = () =>{
    const dispatch = useDispatch()
    const notifyFunc = (type , message , status) =>{
        dispatch(setAlert({
            status : status ,
            type : type ,
            message : message
        }))
    }
    return [notifyFunc]
}
export  default useNotifyFunc