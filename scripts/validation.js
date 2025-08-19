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
  inputEl.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputEl, settings) => {
  const errorMsgID = inputEl.id + "-error";
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.add("modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl, settings) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList, settings) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl, settings) => {
  if (hasInvalidInput(inputList)) {
    disabledButton(buttonEl);
  } else {
    buttonEl.disabled = false;
  }
};

const disabledButton = (buttonEl, config, settings) => {
  debugger;
  buttonEl.disabled = true;
};

const resetValidation = (formEl, inputList, settings) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

const setEventListeners = (formEl, config, settings) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(".modal__submit-btn");
  const profileNameEl = formEl.querySelector("#profile-name-input");
  const captionTextEl = formEl.querySelector("#caption-text-input");
  const profileTextEl = formEl.querySelector("#profile-description-input");

  toggleButtonState(inputList, buttonElement, config, settings);

  inputList.forEach((inputElement, settings) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (settings) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
