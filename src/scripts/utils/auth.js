import { getActiveRoute } from "../routes/url-parser.js";

export function getAccessToken() {
  try {
    const rawData = localStorage.getItem("loginResult");
    if (!rawData) return null;

    const userData = JSON.parse(rawData);
    const accessToken = userData?.token;

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error("getAccessToken: error:", error);
    return null;
  }
}

const unauthenticatedRoutesOnly = ["/login", "/register"];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = "/";
    return page;
  }

  return page;
}

export function checkAuthenticatedRoute(page, backPage) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = "/login";
    return backPage;
  }

  return page;
}

export function getLogout() {
  localStorage.removeItem("loginResult");
}
