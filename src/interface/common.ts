export interface Atom {
  id: string
};
export interface Biological {
  avator: string
}
export interface Pager {
  Offset: number,
  Limit: number,
  Total: number
};
export interface QueryResult {
  data: string[],
  pager: Pager
}
export interface QueryResponseValue extends QueryResult {
  errcode: number, 
  errmsg: string
};
