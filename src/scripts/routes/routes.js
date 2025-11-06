import HomePage from "../pages/home/home-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import LoginPage from "../pages/auth/login/login-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import RegisterPage from "../pages/auth/register/register-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage(), new LoginPage()),
  "/bookmark": () =>
    checkAuthenticatedRoute(new BookmarkPage(), new LoginPage()),
  "/addstory": () =>
    checkAuthenticatedRoute(new AddStoryPage(), new LoginPage()),
  "/logout": () => checkAuthenticatedRoute(new LoginPage(), new LoginPage()),

  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
};

export default routes;
