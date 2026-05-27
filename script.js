// Datos base de la demo. En una app real vendrian desde una base de datos.
const services = [
  {
    id: "corte",
    name: "Corte de cabello",
    price: "$15.000",
    description: "Corte moderno con asesoria de estilo, lavado y terminacion profesional.",
    icon: "CUT"
  },
  {
    id: "barba",
    name: "Perfilado de barba",
    price: "$10.000",
    description: "Diseno, rebaje, toalla caliente y productos premium para barba.",
    icon: "BRD"
  },
  {
    id: "cejas",
    name: "Perfilado de cejas",
    price: "$6.000",
    description: "Limpieza sutil y simetrica para una mirada mas ordenada.",
    icon: "BRW"
  },
  {
    id: "facial",
    name: "Limpieza facial",
    price: "$18.000",
    description: "Limpieza express, exfoliacion suave e hidratacion para rostro fresco.",
    icon: "SPA"
  },
  {
    id: "combo",
    name: "Combo premium",
    price: "$28.000",
    description: "Corte, barba, cejas y acabado final para una experiencia completa.",
    icon: "PRO"
  }
];

const barbers = [
  {
    id: "matias",
    name: "Matias Rojas",
    specialty: "Cortes, barba, cejas, facial y combos",
    availability: "Lun a sab",
    photo: "assets/barber-matias.png",
    tags: ["Fade", "Barba", "Facial"]
  },
  {
    id: "camila",
    name: "Camila Vega",
    specialty: "Cortes, barba, cejas, facial y combos",
    availability: "Lun a sab",
    photo: "assets/barber-camila.png",
    tags: ["Navaja", "Corte", "Cejas"]
  },
  {
    id: "diego",
    name: "Diego Alvarez",
    specialty: "Cortes, barba, cejas, facial y combos",
    availability: "Lun a sab",
    photo: "assets/barber-diego.png",
    tags: ["Textura", "Barba", "Combo"]
  }
];

// Referencias a elementos del HTML. Algunas existen solo en index.html o admin.html.
const servicesGrid = document.querySelector("#servicesGrid");
const barbersGrid = document.querySelector("#barbersGrid");
const serviceSelect = document.querySelector("#serviceSelect");
const barberSelect = document.querySelector("#barberSelect");
const dateInput = document.querySelector("#dateInput");
const timeSelect = document.querySelector("#timeSelect");
const nameInput = document.querySelector("#nameInput");
const phoneInput = document.querySelector("#phoneInput");
const emailInput = document.querySelector("#emailInput");
const bookingForm = document.querySelector("#bookingForm");
const formMessage = document.querySelector("#formMessage");
const reservationsList = document.querySelector("#reservationsList");
const adminCounter = document.querySelector("#adminCounter");
const clearReservations = document.querySelector("#clearReservations");
const openCalendar = document.querySelector("#openCalendar");
const loginPanel = document.querySelector("#loginPanel");
const dashboardPanel = document.querySelector("#dashboardPanel");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const adminUser = document.querySelector("#adminUser");
const adminPass = document.querySelector("#adminPass");
const logoutButton = document.querySelector("#logoutButton");
const downloadReservations = document.querySelector("#downloadReservations");

const storageKey = "goldenBladeReservations";
const adminSessionKey = "goldenBladeAdminLogged";

// Configuracion EmailJS. Reemplaza estos valores con los de tu cuenta EmailJS.
const emailConfig = {
  publicKey: "-nU5OvFRPuc2sn1FK",
  serviceId: "service_03v6fcv",
  templateId: "template_2rwbebj"
};

// Pinta las tarjetas comerciales de servicios.
function renderServices() {
  if (!servicesGrid) return;

  servicesGrid.innerHTML = services.map(service => `
    <article class="service-card reveal">
      <span class="service-icon">${service.icon}</span>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <strong class="service-price">${service.price}</strong>
    </article>
  `).join("");
}

// Pinta los profesionales disponibles con informacion comparable.
function renderBarbers() {
  if (!barbersGrid) return;

  barbersGrid.innerHTML = barbers.map(barber => `
    <article class="barber-card reveal">
      <img src="${barber.photo}" alt="Foto de ${barber.name}">
      <div class="barber-info">
        <h3>${barber.name}</h3>
        <p>${barber.specialty}</p>
        <span class="availability">${barber.availability}</span>
        <div class="barber-tags">
          ${barber.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

// Llena los select con servicios, barberos y horas.
function fillFormOptions() {
  if (!serviceSelect || !barberSelect || !timeSelect) return;

  services.forEach(service => {
    serviceSelect.add(new Option(`${service.name} - ${service.price}`, service.id));
  });

  barbers.forEach(barber => {
    barberSelect.add(new Option(`${barber.name} - ${barber.specialty}`, barber.id));
  });

  createTimeSlots("09:00", "20:00").forEach(time => {
    timeSelect.add(new Option(time, time));
  });
}

// Crea horarios cada 30 minutos entre la apertura y el cierre.
function createTimeSlots(start, end) {
  const slots = [];
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const current = new Date();
  const limit = new Date();

  current.setHours(startHour, startMinute, 0, 0);
  limit.setHours(endHour, endMinute, 0, 0);

  while (current <= limit) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
}

// Lee las reservas guardadas en localStorage.
function getReservations() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}

// Guarda el arreglo completo de reservas en localStorage.
function saveReservations(reservations) {
  localStorage.setItem(storageKey, JSON.stringify(reservations));
}

// Busca el texto visible de un servicio por su id.
function getServiceName(serviceId) {
  return services.find(service => service.id === serviceId)?.name || serviceId;
}

// Busca el texto visible de un barbero por su id.
function getBarberName(barberId) {
  return barbers.find(barber => barber.id === barberId)?.name || barberId;
}

// Convierte los datos del formulario en una reserva lista para guardar.
function buildReservation() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    serviceId: serviceSelect.value,
    serviceName: getServiceName(serviceSelect.value),
    barberId: barberSelect.value,
    barberName: getBarberName(barberSelect.value),
    date: dateInput.value,
    time: timeSelect.value,
    clientName: formatClientName(nameInput.value),
    phone: normalizePhone(phoneInput.value),
    email: emailInput.value.trim(),
    status: "pendiente"
  };
}

// Revisa una fecha escrita manualmente y detecta si ya paso.
function isPastDate(dateValue) {
  if (!dateValue) return false;

  const selected = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected < today;
}

// Fuerza la primera letra del nombre en mayuscula para ordenar los datos.
function formatClientName(name) {
  const cleanName = name.trim().replace(/\s+/g, " ");

  if (!cleanName) return "";

  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
}

// Mantiene el prefijo chileno +569 y limpia caracteres no numericos del resto.
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  const withoutPrefix = (digits.startsWith("569") ? digits.slice(3) : digits.replace(/^0+/, "")).slice(0, 8);

  return `+569${withoutPrefix}`;
}

// Construye el contenido del correo de confirmacion de la demo.
function buildEmailContent(reservation) {
  const subject = "Confirmacion de reserva - Golden Blade Barbershop";
  const body = [
    `Hola ${reservation.clientName},`,
    "",
    "Muchas gracias por reservar en Golden Blade Barbershop.",
    "",
    "Resumen de tu reserva:",
    `Servicio: ${reservation.serviceName}`,
    `Barbero/a: ${reservation.barberName}`,
    `Fecha: ${reservation.date}`,
    `Hora: ${reservation.time}`,
    `Estado: ${reservation.status}`,
    "",
    "Te esperamos. Si necesitas modificar tu hora, contactanos por WhatsApp.",
    "",
    "Golden Blade Barbershop"
  ].join("\n");

  return { subject, body };
}

// Revisa si ya se configuraron credenciales reales de EmailJS.
function hasEmailJsConfig() {
  return !Object.values(emailConfig).some(value => value.startsWith("TU_"));
}

// Envia la confirmacion por EmailJS si esta configurado; si no, usa mailto.
async function sendEmailConfirmation(reservation) {
  const { subject, body } = buildEmailContent(reservation);

  if (window.emailjs && hasEmailJsConfig()) {
    await window.emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      {
        to_email: reservation.email,
        to_name: reservation.clientName,
        client_name: reservation.clientName,
        client_phone: reservation.phone,
        service_name: reservation.serviceName,
        barber_name: reservation.barberName,
        reservation_date: reservation.date,
        reservation_time: reservation.time,
        reservation_status: reservation.status,
        message: body
      },
      {
        publicKey: emailConfig.publicKey
      }
    );

    return "emailjs";
  }

  const mailto = `mailto:${reservation.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  return "mailto";
}

// Valida que ningun campo obligatorio este vacio y que la fecha sea valida.
function validateReservation(reservation) {
  const fieldsAreReady = Object.values({
    service: reservation.serviceId,
    barber: reservation.barberId,
    date: reservation.date,
    time: reservation.time,
    name: reservation.clientName,
    phone: reservation.phone,
    email: reservation.email
  }).every(Boolean);

  return fieldsAreReady && !isPastDate(reservation.date) && emailInput.checkValidity() && phoneInput.checkValidity();
}

// Crea el mensaje que se abre en WhatsApp con wa.me.
function buildWhatsAppUrl(reservation) {
  const message = `Hola ${reservation.clientName}, tu reserva en Golden Blade Barbershop quedo registrada para ${reservation.serviceName} con ${reservation.barberName} el ${reservation.date} a las ${reservation.time}. Estado: ${reservation.status}.`;
  const cleanPhone = reservation.phone.replace(/\D/g, "");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Muestra todas las reservas dentro del panel administrador privado.
function renderReservations() {
  const reservations = getReservations();
  if (!adminCounter || !reservationsList) return;

  adminCounter.textContent = `${reservations.length} ${reservations.length === 1 ? "reserva" : "reservas"}`;

  if (reservations.length === 0) {
    reservationsList.innerHTML = '<p class="empty-state">Aun no hay reservas registradas.</p>';
    return;
  }

  reservationsList.innerHTML = reservations.map(reservation => `
    <article class="reservation-card">
      <div>
        <strong>${reservation.clientName}</strong>
        <span>${reservation.phone}</span>
        <span>${reservation.email || "Sin correo"}</span>
      </div>
      <div>
        <strong>${reservation.serviceName}</strong>
        <span>${reservation.barberName}</span>
      </div>
      <div>
        <strong>${reservation.date}</strong>
        <span>${reservation.time}</span>
      </div>
      <label>
        Estado
        <select class="status-select" data-id="${reservation.id}">
          <option value="pendiente" ${reservation.status === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="confirmada" ${reservation.status === "confirmada" ? "selected" : ""}>Confirmada</option>
          <option value="cancelada" ${reservation.status === "cancelada" ? "selected" : ""}>Cancelada</option>
        </select>
      </label>
      <a class="whatsapp-button" href="${buildWhatsAppUrl(reservation)}" target="_blank" rel="noopener">Enviar WhatsApp</a>
    </article>
  `).join("");
}

// Actualiza el estado de una reserva cuando el administrador cambia el select.
function updateReservationStatus(reservationId, status) {
  const reservations = getReservations().map(reservation => {
    if (reservation.id === reservationId) {
      return { ...reservation, status };
    }

    return reservation;
  });

  saveReservations(reservations);
  renderReservations();
}

// Define la fecha minima local para evitar reservas en dias pasados.
function setMinimumDate() {
  if (!dateInput) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  dateInput.min = `${year}-${month}-${day}`;
}

// Descarga una plantilla CSV con las reservas actuales del administrador.
function downloadReservationsCsv() {
  const reservations = getReservations();
  const headers = ["nombre", "telefono", "correo", "servicio", "barbero", "fecha", "hora", "estado"];
  const rows = reservations.map(reservation => [
    reservation.clientName,
    reservation.phone,
    reservation.email || "",
    reservation.serviceName,
    reservation.barberName,
    reservation.date,
    reservation.time,
    reservation.status
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reservas-golden-blade.csv";
  link.click();
  URL.revokeObjectURL(url);
}

// Muestra u oculta el panel administrador segun el login demo.
function updateAdminAccess() {
  if (!loginPanel || !dashboardPanel) return;

  const isLogged = localStorage.getItem(adminSessionKey) === "true";
  loginPanel.classList.toggle("hidden", isLogged);
  dashboardPanel.classList.toggle("hidden", !isLogged);

  if (isLogged) {
    renderReservations();
  }
}

if (bookingForm) {
  bookingForm.addEventListener("submit", async event => {
    event.preventDefault();

    const reservation = buildReservation();

    if (!validateReservation(reservation)) {
      formMessage.textContent = isPastDate(reservation.date)
        ? "La fecha seleccionada ya paso. Elige una fecha desde hoy en adelante."
        : "Completa todos los campos antes de confirmar la reserva.";
      formMessage.classList.add("error");
      return;
    }

    const reservations = getReservations();
    reservations.push(reservation);
    saveReservations(reservations);

    nameInput.value = reservation.clientName;
    bookingForm.reset();
    phoneInput.value = "+569";
    formMessage.textContent = "Reserva guardada correctamente. El administrador podra verla al iniciar sesion.";
    formMessage.classList.remove("error");

    try {
      const emailMode = await sendEmailConfirmation(reservation);
      formMessage.textContent = emailMode === "emailjs"
        ? "Reserva guardada y correo de confirmacion enviado."
        : "Reserva guardada. Se abrira tu correo con la confirmacion prellenada.";
    } catch (error) {
      formMessage.textContent = "Reserva guardada, pero no se pudo enviar el correo automatico.";
      formMessage.classList.add("error");
    }
  });
}

if (reservationsList) {
  reservationsList.addEventListener("change", event => {
    if (event.target.matches(".status-select")) {
      updateReservationStatus(event.target.dataset.id, event.target.value);
    }
  });
}

if (clearReservations) {
  clearReservations.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderReservations();
  });
}

if (openCalendar && dateInput) {
  openCalendar.addEventListener("click", () => {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}

if (dateInput) {
  dateInput.addEventListener("click", () => {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    }
  });

  dateInput.addEventListener("keydown", event => {
    if (!["Tab", "Shift", "Escape"].includes(event.key)) {
      event.preventDefault();
    }
  });

  dateInput.addEventListener("paste", event => {
    event.preventDefault();
  });

  dateInput.addEventListener("drop", event => {
    event.preventDefault();
  });

  dateInput.addEventListener("change", () => {
    if (isPastDate(dateInput.value)) {
      dateInput.value = "";
      formMessage.textContent = "No puedes reservar en una fecha pasada.";
      formMessage.classList.add("error");
    }
  });
}

if (nameInput) {
  nameInput.addEventListener("blur", () => {
    nameInput.value = formatClientName(nameInput.value);
  });
}

if (phoneInput) {
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith("+569")) {
      phoneInput.value = "+569";
    }
  });

  phoneInput.addEventListener("input", () => {
    phoneInput.value = normalizePhone(phoneInput.value);
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();

    if (adminUser.value.trim() === "admin" && adminPass.value === "1234") {
      localStorage.setItem(adminSessionKey, "true");
      loginForm.reset();
      loginMessage.textContent = "";
      loginMessage.classList.remove("error");
      updateAdminAccess();
      return;
    }

    loginMessage.textContent = "Usuario o clave incorrectos.";
    loginMessage.classList.add("error");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(adminSessionKey);
    updateAdminAccess();
  });
}

if (downloadReservations) {
  downloadReservations.addEventListener("click", downloadReservationsCsv);
}

// Inicializacion general de la demo.
renderServices();
renderBarbers();
fillFormOptions();
setMinimumDate();
renderReservations();
updateAdminAccess();
