export enum MessageLogin {
  LOGIN_SUCCESS = 'Đăng nhập thành công !',
  LOGIN_Fail = 'Login fail',
  PASSWORD_NOT_FOUND = 'Mật khẩu không chính xác !',
  USER_NOT_EXISTING = 'Tài khoản không chính xác !',
  USER_NOT_ACTIVE = 'Tên đăng nhập không chính xác !',
}
export enum MessageUpdate {
  USER_NOTEXISTING = 'Tài khoản không tồn tại !',
  PASSWORD_OLD_NOT_CORRECT = 'Mật khẩu cũ không chính xác !',
  PASSWORD_NOT_EXIST = 'Mật khẩu cũ hoặc mật khẩu mới không tồn tại !',
  UPDATE_SUCCESS = 'Cập nhật thông tin thành công !',
  PASSWORD_DUPLICATE = 'Mật khẩu cũ và mật khẩu mới không được giống nhau ! ',
}
export const FORBIDDEN = 'Bạn không có quyền thực hiện thao tác này !';
export const USER_FORBIDEN =
  'Tài khoản của bạn không có quyền thao tác chức năng này !';
export const SERVE_ERROR = 'Server lỗi vui lòng liên hệ quản trị viên !';
export const ADD_NEW_UCP_SUCCESS = 'Chia sẻ quyền quản lý thành công !';
export const USER_FORBIDEN_COMPANY =
  'Không thể thao tác ! Tổ chức này không thuộc quyền quản lý của bạn !';
export const NOT_PERMISSION_SHARE =
  'Bạn không có quyền sử dụng chức năng này !';
export const ADD_TICKET_SUCCESS = 'Thêm thí sinh vào cuộc thi thành công !';
export const ADD_NEW_UCO_SUCCESS =
  'Chia sẻ quyền quản lý cuộc thi thành công !';
export const ADD_NEW_UCA_SUCCESS =
  'Chia sẻ quyền quản lý thí sinh thành công !';
export const ADD_NEW_UCA_FAIL =
  'Chia sẻ quyền quản lý thí sinh không thành công !';
export const ADD_NEW_ASCO_FAIL = 'Thêm thí sinh vào cuộc thi thất bại';

export const USER_CREATE_ROOM_NOT_FOUND = 'Tài khoản của bạn không tồn tại !';
export const USER_CONNECT_ROOM_NOT_FOUND =
  'Tài khoản kết tối chat không tồn tại !';
export const ADD_NEW_ROOM_SUCCESS = 'Thêm room thành công công !';
export const GET_ROOM_DATA_SUCCESS = 'Lấy dữ liệu phòng thành công !';
export const ROOM_NOT_FOUND = 'Phòng chát không tồn tại';
export const CREATE_ROOM_DATA_SUCCESS = 'Thêm tin nhắn thành công !';
export const DUBLICATE_ID_USER =
  'Tài khoản kết nối không được trùng tải khoản của bạn ';
export const CREATE_GROUP_SUCCESS = 'Tạo mới nhóm chat thành công !';
export const GET_GROUP_CHAT_SUCCESS = 'Lấy danh sách nhóm chát thành công !';
export const GET_ROOM_SUCCESS = 'Lấy danh sách phòng thành công !';
export const ADD_NEW_FRIEND_SUCCESS = 'Thêm bạn bè thành công !';
export const USER_REVEICE_NOT_FOUND = 'Thông tin người nhận không tồn tại ';
export const FRIEND_EXIST =
  'Người trong danh sách đã được thêm vào danh sách bạn bè !';
export const THEY_NOT_FRIEND = 'Tài khoản không phải bạn bè';
export const CANCEL_FRIEND_SUCCESS = 'Hủy kết bạn thành công';
export const GET_UNKNOW_PEOPLE_SUCCESS = 'Lấy danh sách người lạ thành công';
export const GET_NOTIFY_SUCESS = 'Lấy thông báo thành công';
export const TOKEN_WAS_SENT = 'Token đã được gửi vào email của bạn';
export const TOKEN_NOT_FOUND = 'Token không tồn tại trên hệ thống';
export const TOKEN_EXPIRED = 'Token đã hết hạn';
export const TOKEN_INCORRECT = 'Token không chính xác';
export const newPasswordToMail =
  'Mật khẩu khẩumowis đã được gửi vào email của bạn';
export const REPASSWORD_ERROR = 'Mật khẩu nhập lại không chính xác';
export const CHANGE_PASSWORD_SUCCESS = 'Đổi mật khẩu thành công';
