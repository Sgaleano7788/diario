document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(e.target);

// ===============================
// 🎵 MÚSICA DE FONDO (FORMA SEGURA)
// ===============================

const music = new Audio("/static/audio/musica.mp3");
music.loop = true;
music.volume = 0.25;

const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", () => {
  music.play()
    .then(() => {
      musicBtn.innerText = "🎵 Música sonando...";
      musicBtn.disabled = true;
    })
    .catch(err => {
      alert("El navegador bloqueó la música 😢");
      console.error(err);
    });
});

// ===============================
// 💖 GUARDAR RECUERDO
// ===============================

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (res.ok) {
    alert("💖 Recuerdo guardado con amor");
    e.target.reset();
  } else {
    alert(data.error || "Error al guardar");
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


