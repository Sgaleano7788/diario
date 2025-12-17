document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // ===============================
// 🎵 MÚSICA DE FONDO
// ===============================

let musicStarted = false;
const music = new Audio("/audio/musica.mp3");
music.loop = true;
music.volume = 0.25;

// Iniciar música al primer click del usuario
document.addEventListener("click", () => {
  if (!musicStarted) {
    music.play().catch(() => {});
    musicStarted = true;
  }
});

// ===============================
// 💖 GUARDAR RECUERDO
// ===============================

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  if (response.ok) {
    alert("💖 Recuerdo guardado con amor");
    e.target.reset();
  } else {
    alert(result.error || "Error al guardar recuerdo");
  }
});


  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al guardar el recuerdo");
    }

    alert("💖 Recuerdo guardado con amor");

    e.target.reset();

    // 🔄 Recargar recuerdos en el calendario
    if (typeof loadMemories === "function") {
      loadMemories();
    }

  } catch (err) {
    alert("❌ " + err.message);
  }
});

