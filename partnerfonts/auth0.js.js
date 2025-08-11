<script src="https://cdn.auth0.com/js/auth0-spa-js/1.20/auth0-spa-js.production.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 DOM fully loaded and script starting...");

    // Initialize Auth0 client
    const auth0 = await createAuth0Client({
      domain: "dev-z80rqhfn4w1s2s68.us.auth0.com",
      client_id: "Bb8e8EmFV0C0CWfamvjjONUS2Fg6yWxW",
      cacheLocation: "localstorage",
      useRefreshTokens: true
    });
    console.log("✅ Auth0 client initialized");

    // Handle redirect callback (only runs if returning from Auth0 login)
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      try {
        console.log("🔁 Handling redirect callback...");
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, window.location.pathname); // clean up URL
        console.log("✅ Redirect handled successfully");
      } catch (e) {
        console.error("❌ Redirect handling error", e);
      }
    }

    // Check authentication state
    const isAuthenticated = await auth0.isAuthenticated();
    console.log(`🔐 Authenticated? ${isAuthenticated}`);

    // Show/hide UI blocks
    const showAuthenticated = () => {
      console.log("👤 Showing authenticated UI");
      document.querySelectorAll('.visible_authenticated').forEach(el => {
        el.style.display = 'block';
      });
      document.querySelectorAll('.hidden_unauthenticated').forEach(el => {
        el.style.display = 'none';
      });
    };

    const showUnauthenticated = () => {
      console.log("🚪 Showing unauthenticated UI");
      document.querySelectorAll('.visible_authenticated').forEach(el => {
        el.style.display = 'none';
      });
      document.querySelectorAll('.hidden_unauthenticated').forEach(el => {
        el.style.display = 'block';
      });
    };

    if (isAuthenticated) {
      document.body.classList.add('authenticated');
      showAuthenticated();

      const user = await auth0.getUser();
      console.log("👋 Logged in user:", user);

      const welcomeEl = document.getElementById('login_welcome-message');
      const avatarEl = document.getElementById('login_user-avatar');

      if (welcomeEl) {
        welcomeEl.textContent = `Welcome, ${user.name || user.email}`;
        console.log("✅ Updated welcome message");
      }

      if (avatarEl && user.picture) {
        avatarEl.src = user.picture;
        console.log("✅ Updated avatar image");
      }

    } else {
      document.body.classList.add('unauthenticated');
      showUnauthenticated();
      console.log("👤 User is not logged in");
    }

 /**
 * Add click events
 */
const updateDom = () => {
  const loginBtn = document.querySelector("#social-login");
  const logoutBtn = document.querySelector("#social-logout");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      console.log("🔑 Login button clicked");
      await auth0.loginWithRedirect({ redirect_uri: window.location.origin });
    });
  } else {
    console.warn("⚠️ Login button (#social-login) not found");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log("🚪 Logout button clicked");
      auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    });
  } else {
    console.warn("⚠️ Logout button (#social-logout) not found");
  }
};

   
</script>
