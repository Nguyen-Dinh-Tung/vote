export enum MessageLogin {
    LOGIN_SUCCESS = "Đăng nhập thành công !" ,
    LOGIN_Fail = "Login fail" ,
    PASSWORD_NOT_FOUND  = "Mật khẩu không chính xác !" ,
    USER_NOT_EXISTING  = "Tài khoản không chính xác !" ,
    USER_NOT_ACTIVE = "Tên đăng nhập không chính xác !"
}
export enum MessageUpdate {
    USER_NOTEXISTING  =  "Tài khoản không tồn tại !" ,
    PASSWORD_OLD_NOT_CORRECT = "Mật khẩu cũ không chính xác !" ,
    PASSWORD_NOT_EXIST = "Mật khẩu cũ hoặc mật khẩu mới không tồn tại !" ,
    UPDATE_SUCCESS = "Cập nhật thông tin thành công !",
    PASSWORD_DUPLICATE = "Mật khẩu cũ và mật khẩu mới không được giống nhau ! "
}
export const FORBIDDEN = "Bạn không có quyền thực hiện thao tác này !"
export const USER_FORBIDEN = "Tài khoản của bạn không có quyền thao tác chức năng này !"
export const SERVE_ERROR = "Server lỗi vui lòng liên hệ quản trị viên !"
export const ADD_NEW_UCP_SUCCESS : string =  "Chia sẻ quyền quản lý thành công !"
export const USER_FORBIDEN_COMPANY : string = "Không thể thao tác ! Tổ chức này không thuộc quyền quản lý của bạn !"
export const NOT_PERMISSION_SHARE : string = "Bạn không có quyền sử dụng chức năng này !"
export const ADD_TICKET_SUCCESS : string = "Thêm thí sinh vào cuộc thi thành công !"
export const ADD_NEW_UCO_SUCCESS : string = "Chia sẻ quyền quản lý cuộc thi thành công !"
export const ADD_NEW_UCA_SUCCESS : string = "Chia sẻ quyền quản lý thí sinh thành công !"
export const ADD_NEW_UCA_FAIL : string = "Chia sẻ quyền quản lý thí sinh không thành công !"
export const ADD_NEW_ASCO_FAIL : string = "Thêm thí sinh vào cuộc thi thất bại"

export const USER_CREATE_ROOM_NOT_FOUND : string = "Tài khoản của bạn không tồn tại !"
export const USER_CONNECT_ROOM_NOT_FOUND : string = "Tài khoản kết tối chat không tồn tại !"
export const ADD_NEW_ROOM_SUCCESS : string = "Thêm room thành công công !"
export const GET_ROOM_DATA_SUCCESS : string = "Lấy dữ liệu phòng thành công !"
export const ROOM_NOT_FOUND : string = "Phòng chát không tồn tại"
export const CREATE_ROOM_DATA_SUCCESS : string = "Thêm tin nhắn thành công !"