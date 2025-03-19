export class ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timesatmp: Date;

  constructor(data: T, message: string, statusCode: number) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timesatmp = new Date();
  }
}
