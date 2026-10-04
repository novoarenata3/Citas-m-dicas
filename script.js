let contadorProcesados = 0;
let contadorCola = 0;

function generarUUID() {
  return 'e3-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
}

function generarNuevaClave() {
  document.getElementById("idempotency-key").value = generarUUID();
}

function ejecutarOperacion() {
  const key = document.getElementById("idempotency-key").value;
  const entidad = document.getElementById("entidad-id").value;
  const tipo = document.getElementById("tipo-evento").value;
  const timestamp = new Date().toLocaleTimeString();

  if (!key) {
    alert("Genera una clave válida.");
    return;
  }

  contadorProcesados++;
  contadorCola++;
  document.getElementById("m-procesados").innerText = contadorProcesados;
  document.getElementById("m-cola").innerText = contadorCola;

  agregarFila(timestamp, key, tipo, "COMPLETADO", "Enviado a RabbitMQ", "bg-emerald-100 text-emerald-800");

  // Simular procesamiento del worker en segundo plano
  setTimeout(() => {
    if (contadorCola > 0) {
      contadorCola--;
      document.getElementById("m-cola").innerText = contadorCola;
    }
  }, 3000);

  generarNuevaClave();
}

function agregarFila(time, key, tipo, estado, detalle, claseBadge) {
  const tbody = document.getElementById("tabla-eventos");
  const tr = document.createElement("tr");
  tr.className = "hover:bg-slate-50";
  tr.innerHTML = `
    <td class="p-2 text-slate-500">${time}</td>
    <td class="p-2 font-bold text-slate-700">${key.substring(0, 14)}...</td>
    <td class="p-2 text-slate-600">${tipo}</td>
    <td class="p-2"><span class="px-2 py-0.5 rounded text-xs font-semibold ${claseBadge}">${estado}</span></td>
    <td class="p-2 text-slate-500">${detalle}</td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  generarNuevaClave();
});
