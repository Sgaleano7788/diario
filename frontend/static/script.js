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

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    music.play()
      .then(() => {
        musicBtn.innerText = "🎵 Música sonando...";
        musicBtn.disabled = true;
      })
      .catch(err => {
        console.error(err);
        alert("El navegador bloqueó la música 😢");
      });
  });
}

// ===============================
// 💖 GUARDAR RECUERDO
// ===============================

const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

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
      uploadForm.reset();

      // 🔄 Recargar calendario si existe
      if (typeof loadMemories === "function") {
        loadMemories();
      }

    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}

