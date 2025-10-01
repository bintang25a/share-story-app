import LoginPage from "../pages/auth/login/login-page.js";
import { getActiveRoute } from "../routes/url-parser.js";

const unauthenticatedRoutesOnly = ["/login", "/register"];

export function getAccessToken() {
  try {
    const rawData = localStorage.getItem("loginResult");
    console.log(rawData);
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

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = "/";
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = false;
  console.log(isLogin);

  if (!isLogin) {
    location.hash = "/login";
    return page;
  }

  return page;
}

export function getLogout() {
  localStorage.removeItem("loginResult");
}
