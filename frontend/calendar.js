document.addEventListener("DOMContentLoaded", () => {
  let recuerdosPorFecha = {};
  let currentDate = new Date();

  // ===============================
  // ➕ Volver al index
  // ===============================
  window.goToIndex = function () {
    window.location.href = "/index";
  };

  // ===============================
  // 🎵 Música del calendario
  // ===============================
  const calendarMusic = document.getElementById("calendar-music");
  const calendarMusicBtn = document.getElementById("calendarMusicBtn");

  if (calendarMusic && calendarMusicBtn) {
    calendarMusic.volume = 0.25;

    calendarMusicBtn.addEventListener("click", () => {
      calendarMusic.play()
        .then(() => {
          calendarMusicBtn.innerText = "🎵 Música sonando...";
          calendarMusicBtn.disabled = true;
        })
        .catch(err => {
          console.error(err);
          alert("El navegador bloqueó la música 😢");
        });
    });
  }

  // ===============================
  // 📥 Cargar recuerdos
  // ===============================
  fetch("/recuerdos")
    .then(res => res.json())
    .then(data => {
      data.forEach(r => {
        if (!recuerdosPorFecha[r.fecha]) {
          recuerdosPorFecha[r.fecha] = [];
        }
        recuerdosPorFecha[r.fecha].push(r);
      });
      renderCalendar(currentDate);
    });

  // ===============================
  // 📅 Render calendario
  // ===============================
  function renderCalendar(date) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    document.getElementById("month-title").textContent =
      date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.createElement("div");
    grid.className = "calendar-grid";

    ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].forEach(d => {
      const h = document.createElement("div");
      h.className = "day-header";
      h.textContent = d;
      grid.appendChild(h);
    });

    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "day";

      const fecha = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
      cell.textContent = day;

      if (recuerdosPorFecha[fecha]) {
        cell.classList.add("has-memory");
      }

      cell.onclick = () => showMemories(fecha);
      grid.appendChild(cell);
    }

    calendar.appendChild(grid);
  }

  // ===============================
  // 💖 Mostrar recuerdos del día
  // ===============================
  function showMemories(fecha) {
    const container = document.getElementById("memories");
    document.getElementById("selected-date").textContent =
      `💖 Recuerdos del ${fecha}`;

    container.innerHTML = "";

    const recuerdos = recuerdosPorFecha[fecha];

    if (!recuerdos) {
      container.innerHTML = "<p>No hay recuerdos este día 💔</p>";
      return;
    }

    recuerdos.forEach(r => {
      const card = document.createElement("div");
      card.className = "memory-card";
      card.innerHTML = `
        ${r.image ? `<img src="${r.image}">` : ""}
        <p>${r.nota || ""}</p>
      `;
      container.appendChild(card);
    });
  }

  // ===============================
  // ⬅️➡️ Navegación meses
  // ===============================
  document.getElementById("prev-month").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  };

  document.getElementById("next-month").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  };
});

