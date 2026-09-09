// Функция для включения валидации всех форм
function enableValidation(settings) {
  // Деструктуризируем настройки
  const {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  } = settings;
  
  const forms = document.querySelectorAll(formSelector);
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll(inputSelector);
    const submitButton = form.querySelector(submitButtonSelector);
    
    inputs.forEach(input => {
      createErrorElement(input, errorClass);
      
      input.addEventListener('input', function() {
        checkInputValidity(
          this,
          inputErrorClass,
          errorClass
        );
        toggleButtonState(
          form,
          inputSelector,
          submitButtonSelector,
          inactiveButtonClass
        );
      });
    });
    
    toggleButtonState(
      form,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass
    );
  });
}

// Функция создания элемента для ошибки
function createErrorElement(input, errorClass) {
  const errorId = `${input.id || input.name}-error`;
  let errorElement = document.getElementById(errorId);
  
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.id = errorId;
    errorElement.className = errorClass;
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }
  
  return errorElement;
}

// Функция проверки одного поля ввода
function checkInputValidity(input, inputErrorClass, errorClass) {
  const errorId = `${input.id || input.name}-error`;
  const errorElement = document.getElementById(errorId);
  
  // Проверяем кастомную валидацию через data-атрибут
  if (input.dataset.pattern) {
    const pattern = new RegExp(input.dataset.pattern);
    if (!pattern.test(input.value) && input.value.length > 0) {
      input.setCustomValidity(input.dataset.patternError || 'Некорректный формат');
    } else {
      input.setCustomValidity('');
    }
  }
  
  const isValid = input.validity.valid;
  
  if (!isValid) {
    showInputError(input, errorElement, inputErrorClass, errorClass);
  } else {
    hideInputError(input, errorElement, inputErrorClass, errorClass);
  }
}

// Функция показа ошибки
function showInputError(input, errorElement, inputErrorClass, errorClass) {
  input.classList.add(inputErrorClass);
  
  if (errorElement) {
    errorElement.textContent = getErrorMessage(input);
    errorElement.classList.add(errorClass);
  }
}

// Функция скрытия ошибки
function hideInputError(input, errorElement, inputErrorClass, errorClass) {
  input.classList.remove(inputErrorClass);
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove(errorClass);
  }
}

// Функция получения сообщения об ошибке
function getErrorMessage(input) {
  // Проверяем кастомное сообщение из data-атрибута
  if (input.dataset.errorMessage) {
    return input.dataset.errorMessage;
  }
  
  // Стандартные браузерные сообщения
  if (input.validity.valueMissing) {
    return 'Вы пропустили это поле';
  }
  if (input.validity.tooShort) {
    return `Минимальная длина ${input.minLength} символа`;
  }
  if (input.validity.tooLong) {
    return `Максимальная длина ${input.maxLength} символов`;
  }
  if (input.validity.patternMismatch) {
    return input.dataset.patternError || 'Некорректный формат';
  }
  if (input.validity.customError) {
    return input.dataset.patternError || 'Некорректное значение';
  }
  
  return 'Некорректное значение';
}

// Функция переключения состояния кнопки
function toggleButtonState(form, inputSelector, submitButtonSelector, inactiveButtonClass) {
  const submitButton = form.querySelector(submitButtonSelector);
  const inputs = form.querySelectorAll(inputSelector);
  let isFormValid = true;
  
  inputs.forEach(input => {
    if (!input.validity.valid) {
      isFormValid = false;
    }
  });
  
  if (isFormValid) {
    submitButton.classList.remove(inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// Функция очистки ошибок валидации
function clearValidation(form, settings) {
  // Деструктуризируем настройки
  const {
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
  } = settings;
  
  const inputs = form.querySelectorAll(inputSelector);
  
  inputs.forEach(input => {
    input.classList.remove(inputErrorClass);
    input.setCustomValidity('');
    
    const errorId = `${input.id || input.name}-error`;
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(errorClass);
    }
  });
  
  const submitButton = form.querySelector(submitButtonSelector);
  if (submitButton) {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// Экспортируем функции
export { enableValidation, clearValidation };