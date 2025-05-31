export function setupNavigation() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const isAdmin = !!localStorage.getItem("adminToken");

  const guestNav = `
    <div class="nav-left">
      <button class="hamburger-menu" id="menu-toggle" aria-label="Open navigation">☰</button>
      <span class="nav-title">Oklahoma Developers</span>
    </div>
    <div class="menu-container">
      <div class="sidebar hidden" id="sidebar-menu">
        <div class="sidebar-header">
          <h2>📌 Menu</h2>
          <button class="close-menu" id="close-menu" aria-label="Close navigation">✖</button>
        </div>
        <ul class="nav-links">
          <li><a href="../../pages/home/index.html">🏠 Home</a></li>
          <li><a href="../../pages/about/about.html">👨‍💻 About</a></li>
          <li><a href="../../pages/letter/letter.html">📄 Letter</a></li>
          <li><a href="../../pages/contact/contact.html">📬 Contact</a></li>
          <li><a href="../../pages/appointments/appointment-booker.html">🗓️ Book</a></li>
        </ul>
        <div class="nav-container">
          <a href="../../pages/auth/login.html" class="nav-button" id="login-link">🔐 Admin Login</a>
        </div>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  const adminNav = `
    <div class="nav-left">
      <button class="hamburger-menu" id="menu-toggle" aria-label="Open navigation">☰</button>
      <span class="nav-title">Admin Panel - OKDevs</span>
    </div>
    <div class="menu-container">
      <div class="sidebar hidden" id="sidebar-menu">
        <div class="sidebar-header">
          <h2>🛠️ Admin Menu</h2>
          <button class="close-menu" id="close-menu" aria-label="Close navigation">✖</button>
        </div>
        <ul class="nav-links">
          <li><a href="../../pages/admin/dashboard.html">📊 Dashboard</a></li>
          <li><a href="../../pages/admin/manage-blogs.html">📝 Manage Blogs</a></li>
          <li><a href="../../pages/admin/manage-projects.html">📁 Manage Projects</a></li>
          <li><a href="../../pages/admin/site-settings.html">⚙️ Site Settings</a></li>
        </ul>
        <div class="nav-container">
          <a href="#" class="nav-button" id="logout-link">🚪 Logout</a>
        </div>
      </div>
      <div class="overlay hidden" id="menu-overlay"></div>
    </div>
  `;

  navbar.innerHTML = isAdmin ? adminNav : guestNav;

  const menuButton = document.getElementById("menu-toggle");
  const sidebarMenu = document.getElementById("sidebar-menu");
  const closeButton = document.getElementById("close-menu");
  const overlay = document.getElementById("menu-overlay");

  if (!menuButton || !sidebarMenu || !closeButton || !overlay) return;

  const openMenu = () => {
    sidebarMenu.classList.add("visible");
    sidebarMenu.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    sidebarMenu.classList.remove("visible");
    sidebarMenu.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  };

  menuButton.addEventListener("click", openMenu);
  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebarMenu.classList.contains("visible")) {
      closeMenu();
    }
  });

  // Highlight current page
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  sidebarMenu.querySelectorAll(".nav-links a").forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop().toLowerCase();
    if (currentPage === linkPage) {
      link.classList.add("active");
    }
  });

  // Logout handler
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("adminToken");
      location.href = "../../pages/auth/login.html";
    });
  }
}
