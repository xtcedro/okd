document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector(".settings-form");

  // Determine site key based on domain or path (adjust as needed)
  const hostname = window.location.hostname;
  let siteKey = "domtech"; // Default

  if (hostname.includes("heavenly")) {
    siteKey = "heavenly";
  } else if (hostname.includes("okdevs")) {
    siteKey = "okdevs";
  }

  // Prefill form with current settings
  try {
    const res = await fetch(`/api/settings?site=${siteKey}`);
    const data = await res.json();

    form.siteTitle.value = data.site_title;
    form.contactEmail.value = data.contact_email;
    form.businessPhone.value = data.business_phone;
    form.homepageBanner.value = data.homepage_banner;
  } catch (err) {
    alert("⚠️ Failed to load settings.");
    console.error(err.message);
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedSettings = {
      siteTitle: form.siteTitle.value,
      contactEmail: form.contactEmail.value,
      businessPhone: form.businessPhone.value,
      homepageBanner: form.homepageBanner.value
    };

    try {
      const res = await fetch(`/api/settings?site=${siteKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });

      const data = await res.json();
      alert("✅ Settings saved successfully.");
      location.reload();
    } catch (err) {
      alert("❌ Failed to save settings.");
      console.error(err.message);
    }
  });
});