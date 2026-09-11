import {
  createCard,
  deleteCard,
  isCardLiked,
  updateCardLikeState,
} from "./components/card";
import { openModal, closeModal, closeModalByOverlay } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  getAllCardsDataRequest,
  getUserDataRequest,
  deleteCardLikeRequest,
  addCardLikeRequest,
  deleteCardDataRequest,
  updateAvatarRequest,
  addCardDataRequest,
  updateProfileInformation,
} from "./components/api";
import "./index.css";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

const editProfileButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

const editPopup = document.querySelector(".popup_type_edit");
const editForm = document.forms["edit-profile"];
const nameInput = editForm.querySelector(".popup__input_type_name");
const descriptionInput = editForm.querySelector(
  ".popup__input_type_description",
);

const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = document.forms["new-place"];
const cardNameInput = newCardForm.querySelector(".popup__input_type_card-name");
const cardImageUrl = newCardForm.querySelector(".popup__input_type_url");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const imageTitle = imagePopup.querySelector(".popup__caption");

const confirmPopup = document.querySelector(".popup_type_delete-card");
const confirmPopupButton = confirmPopup.querySelector(".popup__button");

const editProfileImagePopup = document.querySelector(
  ".popup_type_edit-profile-image",
);
const editProfileImageForm = document.forms["edit-profile-image"];
const newAvatarUrlInput = editProfileImageForm.querySelector(
  ".popup__input_type_url",
);

const submitButtonText = "Сохранить";

let currentUserId = null;

let cardToDelete = null;
let cardIdToDelete = null;

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
};

const popups = document.querySelectorAll(".popup");

enableValidation(validationSettings);

popups.forEach(function (popup) {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("click", (event) => {
    closeModalByOverlay(event, popup);
  });
  popup.querySelector(".popup__close").addEventListener("click", (event) => {
    event.stopPropagation();
    const mainPopup = event.target.closest(".popup");
    closeModal(mainPopup);
  });
});

editProfileButton.addEventListener("click", (evt) => {
  if (editForm != null) editForm.reset();
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editForm, validationSettings);
  openModal(editPopup);
});

profileAddButton.addEventListener("click", (evt) => {
  if (newCardForm != null) newCardForm.reset();
  clearValidation(newCardForm, validationSettings);
  openModal(newCardPopup);
});

profileImage.addEventListener("click", () => {
  if (editProfileImageForm != null) editProfileImageForm.reset();
  clearValidation(editProfileImageForm, validationSettings);
  openModal(editProfileImagePopup);
});

confirmPopupButton.addEventListener("click", () => {
  deleteCardDataRequest(cardIdToDelete)
    .then(() => {
      deleteCard(cardToDelete);
      closeModal(confirmPopup);
      cardToDelete = null;
      cardIdToDelete = null;
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
});

editForm.addEventListener("submit", submitEditForm);
newCardForm.addEventListener("submit", submitNewCardForm);
editProfileImageForm.addEventListener("submit", submitNewAvatarForm);

function submitEditForm(evt) {
  evt.preventDefault();
  evt.submitter.textContent = "Сохранение...";

  updateProfileInformation(nameInput.value, descriptionInput.value)
    .then((newProfileData) => {
      profileName.textContent = newProfileData.name;
      profileDescription.textContent = newProfileData.about;
      clearValidation(editForm, validationSettings);
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      evt.submitter.textContent = submitButtonText;
    });
}

function submitNewCardForm(evt) {
  evt.preventDefault();
  evt.submitter.textContent = "Сохранение...";

  addCardDataRequest(cardNameInput.value, cardImageUrl.value)
    .then((newCardData) => {
      const newCard = createCard(
        cardTemplate,
        newCardData,
        handleLike,
        updateCardLikeState,
        openImagePopup,
        currentUserId,
        openConfirmPopup,
      );
      newCardForm.reset();
      placesList.prepend(newCard);
      closeModal(newCardPopup);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      evt.submitter.textContent = submitButtonText;
    });
}

function submitNewAvatarForm(evt) {
  evt.preventDefault();
  evt.submitter.textContent = "Сохранение...";

  updateAvatarRequest(newAvatarUrlInput.value)
    .then((profileData) => {
      profileImage.style.backgroundImage = `url("${profileData.avatar}")`;
      closeModal(editProfileImagePopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      evt.submitter.textContent = submitButtonText;
    });
}

function openImagePopup(link, name) {
  popupImage.src = link;
  popupImage.alt = name;
  imageTitle.textContent = name;
  openModal(imagePopup);
}

function openConfirmPopup(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdToDelete = cardId;
  openModal(confirmPopup);
}

function handleLike(
  likeButton,
  likesCount,
  itemData,
  updateCardLikeStateFunction,
) {
  const isLiked = isCardLiked(itemData, currentUserId);
  const request = isLiked
    ? deleteCardLikeRequest(itemData._id)
    : addCardLikeRequest(itemData._id);

  request
    .then((updatedCard) => {
      updateCardLikeStateFunction(
        likeButton,
        likesCount,
        updatedCard.likes,
        currentUserId,
      );
      itemData.likes = updatedCard.likes;
    })
    .catch((err) => {
      console.error("Ошибка при обновлении лайка:", err);
    });
}

Promise.all([getUserDataRequest(), getAllCardsDataRequest()])
  .then(([userData, cardsData]) => {
    currentUserId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;

    cardsData.forEach((itemData) => {
      const card = createCard(
        cardTemplate,
        itemData,
        handleLike,
        updateCardLikeState,
        openImagePopup,
        currentUserId,
        openConfirmPopup,
      );
      placesList.append(card);
    });
  })
  .catch((err) => {
    console.error("Ошибка загрузки карточек:", err);
  });
