export const normalizeVI = ( str:string ): string => {
  str = str.toLowerCase();
  str = str.normalize('NFD');
  str = str.replace(/[\u0300-\u036f]/g, '');
  str = str.replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D');

  return str;
}

export const toSlug = ( str: string): string => {
  str = normalizeVI(str);

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, '');
 
  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, '-');
  
  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, '-');

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, '');

  // return
  return str;
}