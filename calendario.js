function showTab(tabId) {
    document.querySelectorAll('.activities').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  
    document.querySelectorAll('.tab').forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
  }
  
  function updateTodayDate() {
    const today = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    document.getElementById('today-date').innerText = `- ${today.toLocaleDateString('en-US', options)}`;
  }
  
  function loadActivities() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
  
    // Día
    const dayContainer = document.getElementById('day-activities');
    dayContainer.innerHTML = '';
  
    if (day === 11) {
      dayContainer.innerHTML += activityTemplate("Technofest - The Power of New Generations", "img/panama.png", "https://technofest.swtickets.com/");
      dayContainer.innerHTML += activityTemplate("Computational Thinking Workshop", "img/panama.png", "https://docs.google.com/forms/");
    } else if (day === 26) {
      dayContainer.innerHTML += activityTemplate("Dia de las Niñas en las TIC", "img/panama.png", "arcg.is/0SP9HL");
    } else {
      dayContainer.innerHTML = `<div class="activity">No activities today. Check back soon!</div>`;
    }
  
    // Semana
    const weekContainer = document.getElementById('week-activities');
    weekContainer.innerHTML = '';
    weekContainer.innerHTML += activityTemplate("Tech Day - Expo Forum / Sheraton Grand Panama", "img/panama.png", "https://forms.gle/");
  
    // Mes
    const monthContainer = document.getElementById('month-activities');
    monthContainer.innerHTML = '';
    if (month === 3) {
      monthContainer.innerHTML += activityTemplate("Cybersecurity for Girls - March 26", "img/panama.png", "#");
    } else {
      monthContainer.innerHTML = `<div class="activity">No major events this month yet!</div>`;
    }
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
  
  let language = "en";
  
  function toggleLanguage() {
    if (language === "en") {
      document.getElementById('calendar-title').innerText = "Xperience - Calendario de Actividades";
      document.getElementById('today-title').innerHTML = "Hoy <span id='today-date'></span>";
      document.getElementById('week-title').innerText = "Esta Semana";
      document.getElementById('month-title').innerText = "Este Mes";
      document.getElementById('searchInput').placeholder = "Buscar...";
      language = "es";
    } else {
      document.getElementById('calendar-title').innerText = "Xperience - Activities Calendar";
      document.getElementById('today-title').innerHTML = "Today <span id='today-date'></span>";
      document.getElementById('week-title').innerText = "This Week";
      document.getElementById('month-title').innerText = "This Month";
      document.getElementById('searchInput').placeholder = "Search...";
      language = "en";
    }
    updateTodayDate();
  }
  
  updateTodayDate();
  loadActivities();
  