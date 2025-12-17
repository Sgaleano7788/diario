// ===============================
// 🎵 MÚSICA DE FONDO (HTML AUDIO)
// ===============================

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

if (music && musicBtn) {
  music.volume = 0.25;

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

      if (!res.ok) {
        throw new Error("Error al guardar el recuerdo");
      }

      const data = await res.json();

      alert(data.message || "💖 Recuerdo guardado con amor");
      uploadForm.reset();

      // (opcional) Si existe calendario en esta página
      if (typeof loadMemories === "function") {
        loadMemories();
      }

    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  });
}
