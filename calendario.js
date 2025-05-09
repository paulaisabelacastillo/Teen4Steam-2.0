function showTab(tabId, event) {
  // Ocultar todas las secciones
  document.querySelectorAll('.activities').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  // Quitar clase activa de todos los botones
  document.querySelectorAll('.tab').forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
}

function updateTodayDate() {
  const today = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  document.getElementById('today-date').innerText = `- ${today.toLocaleDateString(language === "es" ? 'es-PA' : 'en-US', options)}`;
}

function activityTemplate(name, flagUrl, linkUrl) {
  return `
    <div class="activity">
      <div class="activity-content">
        <img src="${flagUrl}" alt="Flag" class="flag">
        <span>${name}</span>
      </div>
      <a href="${linkUrl}" target="_blank" class="link-button">Link</a>
    </div>
  `;
}

function loadActivities() {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const isTodayTechnovation = currentDay === 10 && currentMonth === 5 && currentYear === 2025;
  const isThisWeekTechnovation = (currentDay <= 10 && currentMonth === 5 && currentYear === 2025);
  const isThisMonthTechnovation = (currentMonth === 5 && currentYear === 2025);

  const dayContainer = document.getElementById('day-activities');
  const weekContainer = document.getElementById('week-activities');
  const monthContainer = document.getElementById('month-activities');

  // Día
  dayContainer.innerHTML = '';
  if (isTodayTechnovation) {
    dayContainer.innerHTML += activityTemplate(
      "Evento Regional Technovation Girls Panamá 2025",
      "img/panama.png",
      "https://www.instagram.com/p/DJUYD1upndg/"
    );
  } else {
    dayContainer.innerHTML = `<div class="activity">No activities today. Check back soon!</div>`;
  }

  // Semana
  weekContainer.innerHTML = '';
  if (isThisWeekTechnovation) {
    weekContainer.innerHTML += activityTemplate(
      "Evento Regional Technovation Girls Panamá 2025",
      "img/panama.png",
      "https://www.instagram.com/p/DJUYD1upndg/"
    );
  }

  // Mes
  monthContainer.innerHTML = '';
  if (isThisMonthTechnovation) {
    monthContainer.innerHTML += activityTemplate(
      "Evento Regional Technovation Girls Panamá 2025",
      "img/panama.png",
      "https://www.instagram.com/p/DJUYD1upndg/"
    );
  } else {
    monthContainer.innerHTML = `<div class="activity">No major events this month yet!</div>`;
  }
}

// 🌐 Idioma
let language = "en";

function toggleLanguage() {
  language = language === "en" ? "es" : "en";

  document.getElementById('calendar-title').innerText =
    language === "es" ? "Xperience - Calendario de Actividades" : "Xperience - Activities Calendar";
  document.getElementById('today-title').innerHTML =
    language === "es" ? "Hoy <span id='today-date'></span>" : "Today <span id='today-date'></span>";
  document.getElementById('week-title').innerText =
    language === "es" ? "Esta Semana" : "This Week";
  document.getElementById('month-title').innerText =
    language === "es" ? "Este Mes" : "This Month";
  document.getElementById('searchInput').placeholder =
    language === "es" ? "Buscar..." : "Search...";

  updateTodayDate();
}

// Ejecutar al cargar
updateTodayDate();
loadActivities();
