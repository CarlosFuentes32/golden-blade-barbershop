# Golden Blade Barbershop

Demo web profesional para una barberia moderna con reservas online, panel administrador y confirmacion por correo.

## Vista General

Golden Blade Barbershop es una landing page orientada a ventas para barberias premium. Incluye una experiencia visual oscura, elegante y responsive, con identidad estilo barbershop, equipo profesional, servicios con precios y un flujo de reserva completo.

## Funcionalidades

- Hero comercial con logo personalizado y llamada a reservar.
- Servicios con precio y descripcion.
- Equipo de barberos/as con imagenes uniformes.
- Formulario de reserva con servicio, profesional, fecha, hora, nombre, telefono y correo.
- Horarios en intervalos de 30 minutos.
- Bloqueo de fechas pasadas.
- Validacion de campos obligatorios.
- Guardado de reservas en `localStorage`.
- Panel administrador separado con login demo.
- Cambio de estado: pendiente, confirmada o cancelada.
- Envio de confirmacion por EmailJS.
- Boton de confirmacion por WhatsApp.
- Descarga de reservas en CSV.
- Diseno responsive para escritorio y movil.

## Acceso Admin

```text
Usuario: admin
Clave: 1234
```

## Configuracion EmailJS

El proyecto ya tiene configurado EmailJS en `script.js`:

```js
const emailConfig = {
  publicKey: "-nU5OvFRPuc2sn1FK",
  serviceId: "service_03v6fcv",
  templateId: "template_2rwbebj"
};
```

El template debe usar `{{to_email}}` como destinatario.

## Archivos

```text
index.html
admin.html
style.css
script.js
assets/
```

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage
- EmailJS
- GitHub Pages

