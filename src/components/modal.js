import { createCard, deleteCard, likeCard } from "./card";

export function openModal(evt, popup) {
  const form = popup.querySelector('.popup__form');
  if (form != null) form.reset();
  if (popup.classList.contains("popup_type_edit")) {
    const profileTitle = document.querySelector(".profile__title");
    const profileDescription = document.querySelector(".profile__description");

    popup.querySelector(".popup__input_type_name").value = profileTitle.textContent;
    popup.querySelector(".popup__input_type_description").value = profileDescription.textContent;
  } else if (popup.classList.contains("popup_type_image")) {
    popup.querySelector(".popup__image").src = evt.target.src;
    popup.querySelector(".popup__caption").textContent = evt.target.closest(".places__item").querySelector(".card__title").textContent;
  }

  popup.classList.add("popup_is-animated");
  setTimeout(() => {
    popup.classList.add("popup_is-opened");
  }, 20);

  document.addEventListener("keydown", addEscapeListener);
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", addEscapeListener);
}

function addEscapeListener(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

export function submitEditForm(
  evt,
  profileName,
  profileDescription,
  nameInput,
  descriptionInput,
) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(evt.target.closest(".popup"));
}

export function submitNewCardForm(
  evt,
  cardNameInput,
  cardImageUrl,
  cardTemplate,
  imagePopup,
) {
  evt.preventDefault();
  const form = evt.target.closest(".popup__form");
  const newCardData = {
    name: cardNameInput.value,
    link: cardImageUrl.value,
  };
  const newCard = createCard(
    cardTemplate,
    newCardData,
    deleteCard,
    likeCard,
    imagePopup,
  );
  form.reset();
  closeModal(evt.target.closest(".popup"));
  return newCard;
}

export function closeModalByOverlay(event, popup){
  if (event.target == popup) closeModal(popup);
}
