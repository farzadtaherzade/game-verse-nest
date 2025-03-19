export class PaginatedResponse<T> {
  data: T[];
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;

  constructor(data: T[], limit: number, page: number, totalItems: number) {
    this.data = data;
    this.limit = limit;
    this.page = page;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}
