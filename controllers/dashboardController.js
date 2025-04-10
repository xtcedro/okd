// /controllers/dashboardController.js

export const getDashboardOverview = (req, res) => {
  res.status(200).json({
    welcomeMessage: "Welcome to the OKDevs Admin Dashboard!",
    contentSections: [
      { label: "📂 Project Submissions", link: "projects.html" },
      { label: "📅 Manage Appointments", link: "public-appointments.html" },
      { label: "✏️ Update Developer Directory", link: "developers.html" }
    ],
    systemTools: [
      { label: "⚙️ Site Settings", link: "settings.html" },
      { label: "📨 View Inquiries", link: "user-messages.html" },
      { label: "📈 Website Analytics", link: "site-analytics.html" }
    ]
  });
};