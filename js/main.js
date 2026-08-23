/**
 * Validación del formulario de leads — Parte 1
 *
 * Qué hace: revisa cada campo en el navegador y muestra errores bajo el input.
 * Qué NO hace: no envía datos a un servidor. preventDefault corta el submit real.
 *
 * Frase de entrevista:
 * “La validación frontend mejora la UX, pero no es seguridad.
 *  Un atacante puede saltarse el JS. En WordPress la seguridad va en PHP
 *  (sanitize, nonce, $wpdb).”
 *
 * novalidate en el <form> apaga los globos nativos para usar estos mensajes.
 */
(function () {
  // IIFE: envuelve todo para no contaminar el scope global (no crea variables sueltas en window).

  const form = document.getElementById("contact-form");
  if (!form) return; // si no hay form en la página, no rompe el resto del script

  const successMessage = document.getElementById("form-success");

  /**
   * Un validador por campo. Recibe el value y:
   * - devuelve "" si está bien
   * - devuelve el texto de error si está mal
   * Así showError solo pinta strings; la regla vive aquí.
   */
  const validators = {
    nombre(value) {
      if (!value.trim()) return "El nombre es obligatorio.";
      if (value.trim().length < 2) return "Ingresa un nombre válido.";
      return "";
    },
    apellido(value) {
      if (!value.trim()) return "El apellido es obligatorio.";
      if (value.trim().length < 2) return "Ingresa un apellido válido.";
      return "";
    },
    email(value) {
      if (!value.trim()) return "El correo es obligatorio.";
      // Regex simple: algo@algo.algo  — no cubre todos los emails RFC, sí el 99% de UX.
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(value.trim())) return "Ingresa un correo electrónico válido.";
      return "";
    },
    telefono(value) {
      // Quita espacios, guiones, paréntesis. Solo quedan dígitos.
      const digits = value.replace(/\D/g, "");
      if (!digits) return "El número de contacto es obligatorio.";
      if (digits.length !== 10) return "Ingresa un celular colombiano de 10 dígitos.";
      return "";
    },
    programa(value) {
      // El <option value=""> cuenta como vacío.
      if (!value) return "Selecciona un programa de interés.";
      return "";
    },
    sede(value) {
      if (!value) return "Selecciona una sede de preferencia.";
      return "";
    },
  };

  /** Pinta o limpia el error de UN campo. */
  function showError(fieldName, message) {
    const input = form.elements[fieldName]; // acceso por name="nombre", etc.
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    // toggle(clase, true/false): pone .invalid si hay mensaje (borde rojo en CSS).
    if (input) input.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message;
  }

  /** Corre el validador, muestra el error y devuelve true si el campo está OK. */
  function validateField(fieldName) {
    const input = form.elements[fieldName];
    if (!input || !validators[fieldName]) return true;
    const message = validators[fieldName](input.value);
    showError(fieldName, message);
    return !message; // "" es falsy → !"" === true (válido)
  }

  /**
   * Eventos por campo:
   * - blur: al salir del input, valida (el usuario ya terminó de escribir).
   * - input: solo revalida SI ya estaba en rojo. Así el error se quita al corregir
   *   y no molesta en el primer tecleo.
   */
  Object.keys(validators).forEach((fieldName) => {
    const input = form.elements[fieldName];
    if (!input) return;
    input.addEventListener("blur", () => validateField(fieldName));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(fieldName);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // no recarga la página; no hay backend en esta prueba
    successMessage.hidden = true;

    // Valida TODOS (no se detiene en el primero) para mostrar todos los errores a la vez.
    const results = Object.keys(validators).map((fieldName) => validateField(fieldName));
    const isValid = results.every(Boolean);

    if (!isValid) {
      // UX: lleva el foco al primer campo en rojo (teclado / lector de pantalla).
      const firstInvalid = form.querySelector(".invalid");
      firstInvalid?.focus();
      return;
    }

    // Demo de éxito: en producción aquí iría fetch() al endpoint / CRM.
    successMessage.hidden = false;
    form.reset();
    // Limpia bordes rojos y textos que pudieran quedar del intento anterior.
    Object.keys(validators).forEach((fieldName) => showError(fieldName, ""));
  });
})();
