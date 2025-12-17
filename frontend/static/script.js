// ===============================
// 🎵 MÚSICA DE FONDO (HTML AUDIO)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
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

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al guardar el recuerdo");
        }

        // 👉 Indicador Google Fotos / Local
        const msg = data.google_uploaded
          ? "💖 Recuerdo guardado y subido a Google Fotos 📤"
          : "💖 Recuerdo guardado localmente 💾";

        alert(msg);

        uploadForm.reset();

        // ❤️ Animación de corazón
        showHeart();

      } catch (err) {
        console.error(err);
        alert("❌ " + err.message);
      }
    });
  }
});

// ===============================
// ❤️ CORAZÓN ANIMADO
// ===============================

function showHeart() {
  const heart = document.getElementById("heart");
  if (!heart) return;

  heart.classList.add("show");

  setTimeout(() => {
    heart.classList.remove("show");
  }, 1200);
}
