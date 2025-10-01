import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login/login-page";
import { checkAuthenticatedRoute } from "../utils/auth";

const routes = {
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/about": () => new AboutPage(),
  "/login": () => new LoginPage(),
  // "/": new HomePage(),
};

export default routes;
