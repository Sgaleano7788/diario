document.addEventListener("DOMContentLoaded", async function () {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Validar login
  await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });

  const res = await fetch("http://127.0.0.1:5000/recuerdos");
  const recuerdos = await res.json();

  const events = recuerdos.map(r => ({
    title: "💖 Recuerdo",
    start: r.fecha,
    extendedProps: r
  }));

  const calendar = new FullCalendar.Calendar(
    document.getElementById("calendar"),
    {
      initialView: "dayGridMonth",
      events,
      eventClick: function(info) {
        const r = info.event.extendedProps;
        alert(
          "💌 " + r.nota
        );
        window.open(
          "http://127.0.0.1:5000/uploads/" + r.filename,
          "_blank"
        );
      }
    }
  );
  function goToIndex() {
  window.location.href = "/index";
}


  calendar.render();
});

