export const generateNavbarListTemplate = (route) => {
  const user = JSON.parse(localStorage.getItem("loginResult"));
  const token = user?.token;

  if (token) {
    if (route == "/addstory") {
      return `
      <ul id="nav-list" class="nav-list">
        <li><a href="#">Home</a></li>
        <li><a href="#">Cerita Saya</a></li>
        <li><a href="#/logout" id="logout-button">Logout</a></li>
      </ul>
    `;
    } else {
      return `
      <ul id="nav-list" class="nav-list">
        <li><a href="#/addstory">Tambah Cerita</a></li>
        <li><a href="#">Cerita Saya</a></li>
        <li><a href="#/logout" id="logout-button">Logout</a></li>
      </ul>
    `;
    }
  } else {
    if (route !== "/login") {
      return `
        <ul id="nav-list" class="nav-list">
          <li><a href="#/login">Login</a></li>
        </ul>
      `;
    } else {
      return `
      <ul id="nav-list" class="nav-list">
        <li><a href="#/register">Register</a></li>
      </ul>
    `;
    }
  }
};

export const loaderCircleTemplate = () => {
  return `
    <div id="child-loader">
      <div class="loading-spinner"></div>
    </div>
`;
};

export const fullscreenLoaderTemplate = () => `
  <div id="fullscreen-loader">
    <div class="loading-spinner"></div>
    <p>Mohon tunggu...</p>
  </div>
`;
