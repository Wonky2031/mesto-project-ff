import { createCard, deleteCard, likeCard } from "./components/card";
import { openModal, closeModal, closeModalByOverlay } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  getAllCardsDataRequest,
  getCardDataRequest,
  getCardLikesCount,
  getUserDataRequest,
  deleteCardLikeRequest,
  addCardLikeRequest,
  deleteCardDataRequest,
  updateAvatarRequest,
  addCardDataRequest,
  updateProfileInformation,
} from "./api";
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

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const inputPatternError =
  "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
const popups = document.querySelectorAll(".popup");

enableValidation(validationSettings);

nameInput.minLength = 2;
nameInput.maxLength = 40;
nameInput.dataset.pattern = "^[A-Za-zА-Яа-я\\s-]+$";
nameInput.dataset.patternError = inputPatternError;
descriptionInput.minLength = 2;
descriptionInput.maxLength = 200;
descriptionInput.dataset.pattern = "^[A-Za-zА-Яа-я\\s-]+$";
descriptionInput.dataset.patternError = inputPatternError;

cardNameInput.minLength = 2;
cardNameInput.maxLength = 30;
cardNameInput.dataset.pattern = "^[A-Za-zА-Яа-я\\s-]+$";
cardNameInput.dataset.patternError = inputPatternError;

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
  getUserDataRequest().then((userData) => {
    newAvatarUrlInput.value = userData.avatar;
    openModal(editProfileImagePopup);
  });
});

editForm.addEventListener("submit", submitEditForm);
newCardForm.addEventListener("submit", submitNewCardForm);
editProfileImageForm.addEventListener("submit", submitNewAvatarForm);

function submitEditForm(evt) {
  evt.preventDefault();

  const inputs = editForm.querySelectorAll(validationSettings.inputSelector);
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.validity.valid) {
      isValid = false;
    }
  });

  if (isValid) {
    evt.submitter.textContent = "Сохранение...";
    updateProfileInformation(nameInput.value, descriptionInput.value)
      .then((newProfileData) => {
        profileName.textContent = newProfileData.name;
        profileDescription.textContent = newProfileData.about;
      })
      .finally(() => {
        evt.submitter.textContent = submitButtonText;
        closeModal(evt.target.closest(".popup"));
        clearValidation(editForm, validationSettings);
      });
  }
}

function submitNewCardForm(evt) {
  evt.preventDefault();
  const form = evt.target.closest(".popup__form");

  const inputs = form.querySelectorAll(validationSettings.inputSelector);
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.validity.valid) {
      isValid = false;
    }
  });

  if (isValid) {
    evt.submitter.textContent = "Сохранение...";

    Promise.all([
      getUserDataRequest(),
      addCardDataRequest(cardNameInput.value, cardImageUrl.value),
    ])
      .then(([userData, newCardData]) => {
        const newCard = createCard(
          cardTemplate,
          newCardData,
          deleteCard,
          likeCard,
          updateCardLikes,
          openImagePopup,
          userData,
          openConfirmPopup,
        );
        form.reset();
        placesList.prepend(newCard);
      })
      .finally(() => {
        evt.submitter.textContent = submitButtonText;
        closeModal(evt.target.closest(".popup"));
        clearValidation(form, validationSettings);
      });
  }
}

function submitNewAvatarForm(evt) {
  evt.preventDefault();
  const inputs = editProfileImageForm.querySelectorAll(
    validationSettings.inputSelector,
  );
  let isValid = true;
  inputs.forEach((input) => {
    if (!input.validity.valid) {
      isValid = false;
    }
  });

  if (isValid) {
    evt.submitter.textContent = "Сохранение...";
    updateAvatarRequest(newAvatarUrlInput.value)
      .then((profileData) => {
        profileImage.style.backgroundImage = `url("${profileData.avatar}")`;
      })
      .finally(() => {
        evt.submitter.textContent = submitButtonText;
        closeModal(editProfileImagePopup);
        clearValidation(editProfileImageForm, validationSettings);
      });
  }
}

function openImagePopup(event) {
  const image = event.target;
  const title = image.closest(".places__item").querySelector(".card__title");
  popupImage.src = image.src;
  popupImage.alt = title.textContent;
  imageTitle.textContent = title.textContent;
  openModal(imagePopup);
}

function openConfirmPopup(event, cardId, deleteFunction) {
  const cardToDelete = event.target.closest(".places__item");
  openModal(confirmPopup);
  confirmPopupButton.addEventListener("click", () => {
    deleteCardDataRequest(cardId).then((res) => {
      if (res.ok) {
        deleteFunction(cardToDelete);
        closeModal(confirmPopup);
      }
    });
  });
}

function updateCardLikes(likeButton, cardId, likeFunction) {
  const likesCount =
    likeButton.parentElement.querySelector(".card__like-count");

  Promise.all([getUserDataRequest(), getCardDataRequest(cardId)]).then(
    ([userData, cardData]) => {
      const likedUsersJson = cardData.likes;
      const isAlreadyLiked = likedUsersJson.some(
        (user) => user._id === userData._id,
      );
      if (isAlreadyLiked) {
        deleteCardLikeRequest(cardId).then((res) => {
          if (res.ok) {
            getCardLikesCount(cardId).then((length) => {
              console.log(length);
              likeFunction(likeButton, likesCount, false, length);
            });
          }
        });
      } else {
        addCardLikeRequest(cardId).then((res) => {
          if (res.ok) {
            getCardLikesCount(cardId).then((length) => {
              console.log(length);
              likeFunction(likeButton, likesCount, true, length);
            });
          }
        });
      }
    },
  );
}

Promise.all([getUserDataRequest(), getAllCardsDataRequest()]).then(
  ([userData, cardsData]) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url("${userData.avatar}")`;

    cardsData.forEach((itemData) => {
      const card = createCard(
        cardTemplate,
        itemData,
        deleteCard,
        likeCard,
        updateCardLikes,
        openImagePopup,
        userData,
        openConfirmPopup,
      );
      placesList.append(card);
    });
  },
);
