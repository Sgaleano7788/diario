document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
// ===============================
// 🎵 MÚSICA DE FONDO (HTML AUDIO)
// ===============================

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

if (music && musicBtn) {
  musicBtn.addEventListener("click", () => {
    music.volume = 0.25;

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
        throw new Error(data.error || "Error al guardar");
      }

      alert("💖 Recuerdo guardado con amor");
      uploadForm.reset();

    } catch (err) {
      alert("❌ " + err.message);
    }
  });
}
