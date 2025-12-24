export class ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;

  constructor(code = 0, message = 'ok', data: T | null = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'ok') {
    return new ApiResponse(0, message, data);
  }

  static error(code: number, message: string) {
    return new ApiResponse(code, message, null);
  }
}
