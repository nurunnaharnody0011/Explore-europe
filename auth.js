const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const loginSubmit = document.getElementById("loginSubmit");
const signupSubmit = document.getElementById("signupSubmit");
const urlParams = new URLSearchParams(window.location.search);
const redirectTarget = urlParams.get("redirect");

function getStoredAccount() {
  const stored = localStorage.getItem("europeExploreAccount");
  return stored ? JSON.parse(stored) : null;
}

function saveAccount(account) {
  localStorage.setItem("europeExploreAccount", JSON.stringify(account));
}

function getCurrentUser() {
  const stored = localStorage.getItem("europeExploreUser");
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("europeExploreUser", JSON.stringify(user));
}

function setAuthTab(tab) {
  const isLogin = tab === "login";
  loginTab.classList.toggle("active", isLogin);
  signupTab.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("active", isLogin);
  signupForm.classList.toggle("active", !isLogin);
}

function redirectAfterAuth() {
  if (redirectTarget === "booking") {
    window.location.href = "index.html#booking";
  } else {
    window.location.href = "index.html";
  }
}

function handleLogin() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  const account = getStoredAccount();

  if (!email || !password) {
    alert("Enter both email and password to continue.");
    return;
  }

  if (!account || account.email !== email || account.password !== password) {
    alert("No matching account found. Please sign up or check your credentials.");
    return;
  }

  setCurrentUser({ name: account.name, email: account.email });
  alert(`Welcome back, ${account.name}!`);
  redirectAfterAuth();
}

function handleSignup() {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const existingAccount = getStoredAccount();

  if (!name || !email || !password) {
    alert("Complete all signup fields to create your account.");
    return;
  }

  if (existingAccount && existingAccount.email === email) {
    alert("This email is already registered. Please log in instead.");
    return;
  }

  saveAccount({ name, email, password });
  setCurrentUser({ name, email });
  alert(`Account created. Welcome, ${name}!`);
  redirectAfterAuth();
}

loginTab.addEventListener("click", () => setAuthTab("login"));
signupTab.addEventListener("click", () => setAuthTab("signup"));
loginSubmit.addEventListener("click", handleLogin);
signupSubmit.addEventListener("click", handleSignup);

const currentUser = getCurrentUser();
if (currentUser) {
  redirectAfterAuth();
}
