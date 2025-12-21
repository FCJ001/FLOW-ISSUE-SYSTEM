// 通用 API 请求函数
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }
    return data;
  } catch (err) {
    console.error("API call error:", err);
    throw err;
  }
}
