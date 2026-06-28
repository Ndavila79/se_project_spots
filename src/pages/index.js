import "core-js/stable";
import "regenerator-runtime/runtime";

import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { renderLoading } from "../utils/helpers.js";

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const avatarBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImageInput = newPostModal.querySelector("#card-image-input");
const newPostTitleInput = newPostModal.querySelector("#caption-text-input");

const deletePostModal = document.querySelector("#delete_post-modal");
const deleteForm = deletePostModal.querySelector(".modal__form");
const confirmDeleteBtn = document.querySelector("#confirm_delete-btn");
const cancelDeleteBtn = document.querySelector("#cancel_delete-btn");

const postImageEl = document.querySelector(".card__image");
const postTitleEl = document.querySelector(".card__title");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileImageEl = document.querySelector(".profile__avatar");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let currentUserId = null;
let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f5fed1b3-0e3f-45d0-b2ec-78859ef89c2f",
    "Content-Type": "application/json",
  },
});

function handleLikeBtn(evt, id) {
  evt.preventDefault();
  const likeBtn = evt.target;
  const isLiked = likeBtn.classList.contains("card__like-btn_active");

  api
    .handleLikeStatus(id, isLiked)
    .then(() => {
      likeBtn.classList.toggle("card__like-btn_active");
    })
    .catch((err) => console.error(err));
}

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    closeModal(openedModal);
  }
}

function closeModal(modal) {
  document.removeEventListener("keyup", handleEscape);
  modal.classList.remove("modal_is-opened");
}

function openModal(modal) {
  document.addEventListener("keyup", handleEscape);
  modal.classList.add("modal_is-opened");
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deletePostModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn,  "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
    })
    .catch(console.error())
    .finally(() => {
      renderLoading(false, submitBtn, "Delete");
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardElement.dataset.id = data._id;

  cardDeleteBtnEl.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id),
  );

  cardLikeBtnEl.addEventListener("click", (evt) => {
    handleLikeBtn(evt, data._id);
  });

  cardImageEl.addEventListener("click", () => handleImageClick(data));

  const isLiked = data.isLiked;

  if (isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  return cardElement;
}

cancelDeleteBtn.addEventListener("click", () => {
  selectedCard = null;
  closeModal(deletePostModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );

  openModal(editProfileModal);
});

avatarBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn, "Save", "Saving...");

  const avatarLink = avatarLinkInput.value;

  api
    .updateAvatar(avatarLink)
    .then((updatedUser) => {
      profileImageEl.src = updatedUser.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      renderloading(submitBtn);
    });
});

api
  .getAppInfo()
  .then(([user, cards]) => {
    currentUserId = user._id;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileImageEl.src = user.avatar;
  })
  .catch((err) => console.error(err));

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");

  button.addEventListener("click", () => closeModal(modal));
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn, "Save", "Saving...");

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  api
    .editUserInfo({ name, about })
    .then((updatedUser) => {
      profileNameEl.textContent = updatedUser.name;
      profileDescriptionEl.textContent = updatedUser.about;
      profileImageEl.src = updatedUser.avatar;

      closeModal(editProfileModal);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      renderLoading(submitBtn);
    });
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  renderLoading(true, submitBtn, "Save", "Saving...");

  const name = newPostTitleInput.value;
  const link = newPostImageInput.value;

  api
    .addCard({ name, link })
    .then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      newPostForm.reset();
      disableButton(newPostSubmitBtn, settings);
    })
    .catch((err) => console.error(err))
    .finally(() => {
      renderLoading(submitBtn);
    });
});

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});
