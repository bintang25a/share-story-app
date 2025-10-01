export const navbarList = () => {
  const navigationDrawer = document.getElementById("navigation-drawer");
  const user = JSON.parse(localStorage.getItem("loginResult") || "null");
  const token = user?.token;

  if (token) {
    navigationDrawer.innerHTML = `
      <ul id="nav-list" class="nav-list">
        <li><a href="#/addstory">Tambah Cerita</a></li>
        <li><a href="#/mystory">Cerita Saya</a></li>
        <li><a href="#/logout">Logout</a></li>
      </ul>
    `;
  } else {
    navigationDrawer.innerHTML = `
    <ul id="nav-list" class="nav-list">
      <li><a href="#/mystory">Register</a></li>
      <li><a href="#/logout">Login</a></li>
    </ul>
  `;
  }
};

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateReportItemTemplate({
  id,
  title,
  description,
  evidenceImages,
  reporterName,
  createdAt,
  location,
}) {
  return `
    <div tabindex="0" class="report-item" data-reportid="${id}">
      <img class="report-item__image" src="${evidenceImages[0]}" alt="${title}">
      <div class="report-item__body">
        <div class="report-item__main">
          <h2 id="report-title" class="report-item__title">${title}</h2>
          <div class="report-item__more-info">
            <div class="report-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(
                createdAt,
                "id-ID"
              )}
            </div>
            <div class="report-item__location">
              <i class="fas fa-map"></i> ${Object.values(location)}
            </div>
          </div>
        </div>
        <div id="report-description" class="report-item__description">
          ${description}
        </div>
        <div class="report-item__more-info">
          <div class="report-item__author">
            Dilaporkan oleh: ${reporterName}
          </div>
        </div>
        <a class="btn report-item__read-more" href="#/reports/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}
