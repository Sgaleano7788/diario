document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(e.target);

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
