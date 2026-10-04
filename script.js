const reservasExistentes = new Set();
let duplicadasBloqueadas = 0;
let recordatoriosEnviados = 0;

function reservarCita() {
  const paciente = document.getElementById("paciente-nombre").value;
  const medico = document.getElementById("medico-select").value;
  const hora = document.getElementById("horario-select").value;

  const claveReserva = `${medico}-${hora}`;

  // Control de concurrencia / Solapamiento de horarios
  if (reservasExistentes.has(claveReserva)) {
    duplicadasBloqueadas++;
    document.getElementById("m-duplicadas").innerText = duplicadasBloqueadas;
    alert(`¡Conflicto de Horario! El ${medico} ya tiene una cita reservada a las ${hora}.`);
    return;
  }

  reservasExistentes.add(claveReserva);
  recordatoriosEnviados++;
  document.getElementById("m-recordatorios").innerText = recordatoriosEnviados;

  agregarFilaTabla(hora, paciente, medico, "RESERVADA", "SMS / WhatsApp Encolado (RabbitMQ)", "bg-emerald-100 text-emerald-800");
}

function simularColision() {
  const medico = document.getElementById("medico-select").value;
  const hora = document.getElementById("horario-select").value;
  const claveReserva = `${medico}-${hora}`;

  if (!reservasExistentes.has(claveReserva)) {
    reservarCita(); // Primero crea la primera cita para forzar la colisión en la siguiente
  }

  // Intenta reservar exactamente la misma hora
  duplicadasBloqueadas++;
  document.getElementById("m-duplicadas").innerText = duplicadasBloqueadas;
  agregarFilaTabla(hora, "Segundo Paciente (Intento)", medico, "DENEGADA_DUPLICADA", "Bloqueo por Restricción GiST en DB", "bg-rose-100 text-rose-800");
  alert(`[Demostración de Control de Concurrencia]: Se evitó la reserva duplicada para las ${hora}.`);
}

function agregarFilaTabla(hora, paciente, medico, estado, detalleNotificacion, claseBadge) {
  const tbody = document.getElementById("tabla-citas");
  const tr = document.createElement("tr");
  tr.className = "hover:bg-slate-50";
  tr.innerHTML = `
    <td class="p-2 text-slate-700 font-bold">${hora}</td>
    <td class="p-2 text-slate-800">${paciente}</td>
    <td class="p-2 text-slate-600">${medico}</td>
    <td class="p-2"><span class="px-2 py-0.5 rounded text-xs font-semibold ${claseBadge}">${estado}</span></td>
    <td class="p-2 text-slate-500">${detalleNotificacion}</td>
  `;
  tbody.insertBefore(tr, tbody.firstChild);
}
