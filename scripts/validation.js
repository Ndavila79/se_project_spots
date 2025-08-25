const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg, settings) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add(settings.inputErrorClass);
  errorMsgEl.classList.add(settings.errorClass);
};

const hideInputError = (formEl, inputEl, settings) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove(settings.inputErrorClass);
  errorMsgEl.classList.remove(settings.errorClass);
};

const checkInputValidity = (formEl, inputEl, settings) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, settings);
  } else {
    hideInputError(formEl, inputEl, settings);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl, settings) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl, settings);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(settings.inactiveButtonClass);
  }
};

const disabledButton = (buttonEl, settings) => {
  buttonEl.disabled = true;
  buttonEl.classList.add(settings.inactiveButtonClass);
};

const resetValidation = (formEl, inputList, settings) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

const setEventListeners = (formEl, config, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(".modal__submit-btn");

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement, settings) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
