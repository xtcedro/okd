document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");
  const messageBox = document.querySelector("#loginMessage");

  if (!form || !usernameInput || !passwordInput || !messageBox) {
    console.warn("Login form elements not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      messageBox.textContent = "❌ Please enter both username and password.";
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        messageBox.textContent = `❌ ${data.error || "Login failed"}`;
        return;
      }

      localStorage.setItem("adminToken", data.token);
      messageBox.textContent = "✅ Login successful. Redirecting...";

      setTimeout(() => {
        window.location.href = "/admin-dashboard.html";
      }, 1200);
    } catch (err) {
      messageBox.textContent = `❌ ${err.message}`;
    }
  });
});