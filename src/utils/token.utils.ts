/**
 * 前台要先拿取 queryString 的 token 並存入 sessionStorage，後台直接拿取 sessionStorage。
 */
export const getToken = () => {
  // CMS（後台系統）
  const isCMS = location.href.includes("admin");

  if (!isCMS) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      sessionStorage.setItem("token", token);
    }
  }
  return sessionStorage.getItem("token");
};
