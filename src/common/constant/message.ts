export enum MessageLogin {
    LOGIN_SUCCESS = "Đăng nhập thành công !" ,
    LOGIN_Fail = "Login fail" ,
    PASSWORD_NOT_FOUND  = "Mật khẩu không chính xác !" ,
    USER_NOT_EXISTING  = "Tài khoản không chính xác !" ,
    USER_NOT_ACTIVE = "Tên đăng nhập không chính xác !"
}
export enum MessageUpdate {
    USER_NOTEXISTING  =  "Tài khoản không tồn tại !" ,
    PASSWORD_OLD_NOT_CORRECT = "Mật khuẩ cũ không chính xác !" ,
    PASSWORD_NOT_EXIST = "Mật khẩu cũ hoặc mật khẩu mới không tồn tại !" ,
    UPDATE_SUCCESS = "Cập nhật thông tin thành công !",
    PASSWORD_DUPLICATE = "Mật khẩu cũ và mật khẩu mới không được giống nhau ! "
}
export const FORBIDDEN = "Bạn không có quyền thực hiện thao tác này !"
export const USER_FORBIDEN = "Tài khoản của bạn không có quyền thao tác chức năng này !"
export const SERVE_ERROR = "Server lỗi vui lòng liên hệ quản trị viên !"
export const ADD_NEW_UCP_SUCCESS : string =  "Chia sẻ quyền quản lý thành công !"