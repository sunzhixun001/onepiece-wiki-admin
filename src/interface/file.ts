interface File {
  fileid: string,
};

export interface FileValue extends File{
  download_url: string
};

export interface FileRequestValue extends File {
  max_age: number
};

export interface FileResponseValue extends FileValue {
  status: number,
  errmsg: string
};