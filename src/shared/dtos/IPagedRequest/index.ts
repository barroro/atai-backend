export interface IPagedRequest {
  page: number;
  pageSize: number;
  keyword: string;
  orderKey: string;
  orderDirection: "ASC" | "DESC";
}
