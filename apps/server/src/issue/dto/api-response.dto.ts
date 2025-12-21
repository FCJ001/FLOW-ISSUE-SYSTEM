export interface ApiResponse<T = any> {
  data?: T; // 正常返回的数据
  message: string; // 状态说明
  error?: string; // 错误信息
  statusCode: number; // HTTP 状态码
}
