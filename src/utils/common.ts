export const getDownloadUrl = (url: string): string => {
  let result: string = '';
  const patt = /^cloud.*/;
  if(patt.test(url)) {
    const split_array = url.split('/');
    const new_array = ['https://6465-develop-6e54e7-1259274378.tcb.qcloud.la', ...split_array.slice(3)];
    // result = url.replace('cloud://develop-6e54e7.6465-develop-6e54e7', 'https://6465-develop-6e54e7-1259274378.tcb.qcloud.la');
    result = new_array.join('/');
  } else {
    result = url;
  }
  return result;
};