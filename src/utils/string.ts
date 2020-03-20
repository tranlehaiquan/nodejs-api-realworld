export const normalizeVI = (str: string): string => {
  let resultStr = str.toLowerCase();
  resultStr = resultStr.normalize('NFD');
  resultStr = resultStr.replace(/[\u0300-\u036f]/g, '');
  resultStr = resultStr.replace(/[đĐ]/g, m => (m === 'đ' ? 'd' : 'D'));

  return resultStr;
};

export const toSlug = (str: string): string => {
  let resultStr = normalizeVI(str);

  // Xóa ký tự đặc biệt
  resultStr = resultStr.replace(/([^0-9a-z-\s])/g, '');

  // Xóa khoảng trắng thay bằng ký tự -
  resultStr = resultStr.replace(/(\s+)/g, '-');

  // Xóa ký tự - liên tiếp
  resultStr = resultStr.replace(/-+/g, '-');

  // xóa phần dư - ở đầu & cuối
  resultStr = resultStr.replace(/^-+|-+$/g, '');

  // return
  return resultStr;
};
