/**
 * Validación del formulario de contacto (cliente).
 * No sustituye validación en servidor.
 */
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const successMessage = document.getElementById("form-success");

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
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(value.trim())) return "Ingresa un correo electrónico válido.";
      return "";
    },
    telefono(value) {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "El número de contacto es obligatorio.";
      if (digits.length !== 10) return "Ingresa un celular colombiano de 10 dígitos.";
      return "";
    },
    programa(value) {
      if (!value) return "Selecciona un programa de interés.";
      return "";
    },
    sede(value) {
      if (!value) return "Selecciona una sede de preferencia.";
      return "";
    },
  };

  function showError(fieldName, message) {
    const input = form.elements[fieldName];
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (input) input.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message;
  }

  function validateField(fieldName) {
    const input = form.elements[fieldName];
    if (!input || !validators[fieldName]) return true;
    const message = validators[fieldName](input.value);
    showError(fieldName, message);
    return !message;
  }

  Object.keys(validators).forEach((fieldName) => {
    const input = form.elements[fieldName];
    if (!input) return;
    input.addEventListener("blur", () => validateField(fieldName));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) validateField(fieldName);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    const results = Object.keys(validators).map((fieldName) => validateField(fieldName));
    const isValid = results.every(Boolean);

    if (!isValid) {
      form.querySelector(".invalid")?.focus();
      return;
    }

    successMessage.hidden = false;
    form.reset();
    Object.keys(validators).forEach((fieldName) => showError(fieldName, ""));
  });
})();
