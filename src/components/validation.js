function enableValidation(settings) {
  const {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
  } = settings;

  const forms = document.querySelectorAll(formSelector);

  forms.forEach((form) => {
    const inputs = form.querySelectorAll(inputSelector);
    const submitButton = form.querySelector(submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        checkInputValidity(this, inputErrorClass);
        toggleButtonState(
          form,
          inputSelector,
          submitButtonSelector,
          inactiveButtonClass,
        );
      });
    });

    toggleButtonState(
      form,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
    );
  });
}

function checkInputValidity(input, inputErrorClass) {
  const errorId = `${input.id || input.name}-error`;
  const errorElement = document.getElementById(errorId);

  if (!input.validity.valid) {
    showInputError(input, errorElement, inputErrorClass);
  } else {
    hideInputError(input, errorElement, inputErrorClass);
  }
}

function showInputError(input, errorElement, inputErrorClass) {
  input.classList.add(inputErrorClass);

  if (errorElement) {
    errorElement.textContent = getErrorMessage(input);
  }
}

function hideInputError(input, errorElement, inputErrorClass) {
  input.classList.remove(inputErrorClass);

  if (errorElement) {
    errorElement.textContent = "";
  }
}

function getErrorMessage(input) {
  if (input.validity.patternMismatch) {
    return input.dataset.patternError;
  }

  return input.validationMessage;
}

function toggleButtonState(
  form,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
) {
  const submitButton = form.querySelector(submitButtonSelector);
  const inputs = form.querySelectorAll(inputSelector);
  const isFormValid = Array.from(inputs).every((input) => input.validity.valid);

  if (isFormValid) {
    submitButton.classList.remove(inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  }
}

function clearValidation(form, settings) {
  const {
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
  } = settings;

  const inputs = form.querySelectorAll(inputSelector);

  inputs.forEach((input) => {
    const errorElement = document.getElementById(
      `${input.id || input.name}-error`,
    );

    hideInputError(input, errorElement, inputErrorClass);
  });

  toggleButtonState(
    form,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
  );
}

export { enableValidation, clearValidation };
