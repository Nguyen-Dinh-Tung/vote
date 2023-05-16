export const randomPassword = (length) => {
  const wishlist =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += wishlist[Math.ceil(Math.random() * wishlist.length)];
  }
  return password;
};
