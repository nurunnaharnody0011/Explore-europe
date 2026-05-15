const destinations = [
  {
    name: "Paris",
    country: "France",
    description: "Explore iconic museums, romantic streets, and world-class cuisine.",
    category: "City",
    hotels: ["Hotel du Louvre", "Saint-Germain Boutique Hotel", "Rivoli Palace"],
    flights: ["Direct flight from London - 2h", "Direct flight from Berlin - 1h 45m", "Direct flight from Madrid - 2h 15m"],
  },
  {
    name: "Rome",
    country: "Italy",
    description: "Visit ancient ruins, basilicas, and vibrant piazzas full of charm.",
    category: "Historic",
    hotels: ["Colosseum View Hotel", "Trastevere Retreat", "Vatican Comfort Suites"],
    flights: ["Direct flight from Paris - 2h", "Direct flight from Barcelona - 1h 55m", "Direct flight from Vienna - 1h 50m"],
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    description: "Cruise canals, admire museums, and enjoy relaxed European city life.",
    category: "Canals",
    hotels: ["Canal Side Inn", "Jordaan Boutique Hotel", "Museum Quarter Suites"],
    flights: ["Direct flight from Lisbon - 2h 45m", "Direct flight from Berlin - 1h 10m", "Direct flight from Dublin - 1h 50m"],
  },
  {
    name: "Santorini",
    country: "Greece",
    description: "Take in volcanic cliffs, blue domes, and sunsets over the Aegean.",
    category: "Coastal",
    hotels: ["Sunset Cliff Resort", "Oia Luxury Suites", "Caldera Breeze Hotel"],
    flights: ["Direct flight from Athens - 45m", "1-stop flight from Rome - 4h 10m", "1-stop flight from Paris - 5h"],
  },
  {
    name: "Barcelona",
    country: "Spain",
    description: "Enjoy artful architecture, seaside boulevards, and tapas culture.",
    category: "City",
    hotels: ["Gothic Quarter Hotel", "Sagrada Familia Suites", "Barceloneta Beach Hotel"],
    flights: ["Direct flight from London - 2h 5m", "Direct flight from Rome - 1h 50m", "Direct flight from Paris - 1h 45m"],
  },
  {
    name: "Prague",
    country: "Czech Republic",
    description: "Wander historic squares, bridges, and majestic castles.",
    category: "Historic",
    hotels: ["Old Town Plaza Hotel", "Castle View Residence", "Charles Bridge Inn"],
    flights: ["Direct flight from Vienna - 1h", "Direct flight from Amsterdam - 1h 20m", "Direct flight from Berlin - 1h 10m"],
  },
];

const cardsContainer = document.getElementById("destinationCards");
const detailCard = document.getElementById("detailCard");
const hotelList = document.getElementById("hotelList");
const flightList = document.getElementById("flightList");
const searchInput = document.getElementById("searchInput");
const topSearchInput = document.getElementById("topSearchInput");
const flightBookBtn = document.getElementById("flightBookBtn");
const hotelBookBtn = document.getElementById("hotelBookBtn");
const authLink = document.getElementById("authLink");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");
const userStatus = document.getElementById("userStatus");

function getCurrentUser() {
  const stored = localStorage.getItem("europeExploreUser");
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("europeExploreUser", JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem("europeExploreUser");
}

function getSavedTheme() {
  return localStorage.getItem("europeExploreTheme") || "light";
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

function toggleTheme() {
  const current = getSavedTheme();
  const nextTheme = current === "dark" ? "light" : "dark";
  localStorage.setItem("europeExploreTheme", nextTheme);
  applyTheme(nextTheme);
}

function updateAuthStatus() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    userStatus.classList.remove("hidden");
    userStatus.textContent = `Hi, ${currentUser.name}`;
    logoutBtn.classList.remove("hidden");
    authLink.classList.add("hidden");
  } else {
    userStatus.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    authLink.classList.remove("hidden");
  }
}

function requireLogin(actionMessage) {
  if (!getCurrentUser()) {
    alert(actionMessage);
    window.location.href = "auth.html?redirect=booking";
    return false;
  }

  return true;
}

function renderDestinations(items) {
  cardsContainer.innerHTML = items
    .map(
      (place) => `
      <article class="card" data-name="${place.name}">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <span class="tag">${place.country}</span>
      </article>
    `
    )
    .join("");

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const selected = destinations.find((place) => place.name === card.dataset.name);
      showDetails(selected);
    });
  });
}

function showDetails(place) {
  detailCard.innerHTML = `
    <h3>${place.name}, ${place.country}</h3>
    <p>${place.description}</p>
    <p><strong>Category:</strong> ${place.category}</p>
    <p>Discover top hotels and flight options to plan your stay.</p>
  `;

  hotelList.innerHTML = place.hotels
    .map((hotel) => `<li>${hotel}</li>`)
    .join("");

  flightList.innerHTML = place.flights
    .map((flight) => `<li>${flight}</li>`)
    .join("");
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll("section, .card, .popular-card, .stat-card");

  revealTargets.forEach((element) => {
    element.classList.add("reveal");
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function animateStatistic(element) {
  const target = Number(element.dataset.target) || 0;
  if (!target) return;

  const duration = 1400;
  const startTime = performance.now();
  const startValue = 0;

  const formatValue = (value) => {
    if (target >= 1000) {
      return `${Math.round(value / 100) / 10}K`;
    }
    return Math.round(value).toString();
  };

  const tick = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentNumber = startValue + (target - startValue) * progress;
    element.textContent = formatValue(currentNumber);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (target >= 1000) {
      element.textContent = `${Math.round(target / 1000)}K`;
    }
  };

  requestAnimationFrame(tick);
}

function initStatAnimation() {
  const statSection = document.querySelector(".stats-section");
  const statValues = document.querySelectorAll(".stat-value");
  if (!statSection || statValues.length === 0) return;

  const statObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statValues.forEach((stat) => animateStatistic(stat));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  statObserver.observe(statSection);
}

function filterDestinations() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = destinations.filter(
    (place) =>
      place.name.toLowerCase().includes(query) ||
      place.country.toLowerCase().includes(query) ||
      place.category.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    cardsContainer.innerHTML = `
      <div class="card" style="cursor: default;">
        <h3>No results found</h3>
        <p>Try another city or country from Europe.</p>
      </div>
    `;
    return;
  }

  renderDestinations(filtered);
}

searchInput.addEventListener("input", filterDestinations);

if (topSearchInput) {
  topSearchInput.addEventListener("input", (event) => {
    searchInput.value = event.target.value;
    filterDestinations();
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

logoutBtn.addEventListener("click", () => {
  clearCurrentUser();
  updateAuthStatus();
  alert("You have been logged out.");
});

flightBookBtn.addEventListener("click", () => {
  if (!requireLogin("Please sign in to book a flight.")) {
    return;
  }

  const from = document.getElementById("flightFrom").value.trim();
  const to = document.getElementById("flightTo").value.trim();
  const date = document.getElementById("flightDate").value;

  if (!from || !to || !date) {
    alert("Please fill in all flight booking fields.");
    return;
  }

  alert(`Flight request sent!\nFrom: ${from}\nTo: ${to}\nDate: ${date}`);
});

hotelBookBtn.addEventListener("click", () => {
  if (!requireLogin("Please sign in to request hotel booking.")) {
    return;
  }

  const city = document.getElementById("hotelCity").value.trim();
  const checkin = document.getElementById("hotelCheckin").value;
  const checkout = document.getElementById("hotelCheckout").value;

  if (!city || !checkin || !checkout) {
    alert("Please fill in all hotel booking fields.");
    return;
  }

  alert(`Hotel request received!\nCity: ${city}\nCheck-in: ${checkin}\nCheck-out: ${checkout}`);
});

applyTheme(getSavedTheme());
updateAuthStatus();
renderDestinations(destinations);
showDetails(destinations[0]);
initScrollReveal();
initStatAnimation();
