import { initialCards } from './components/cards';
import { createCard, deleteCard, likeCard } from './components/card';
import {openModal, closeModal, closeModalByOverlay} from './components/modal';
import './index.css';

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const editProfileButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editPopup = document.querySelector('.popup_type_edit');
const editForm = document.forms['edit-profile'];
const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector('.popup__input_type_description');

const newCardPopup = document.querySelector('.popup_type_new-card');
const newCardForm = document.forms['new-place'];
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardImageUrl = newCardForm.querySelector('.popup__input_type_url');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const imageTitle = imagePopup.querySelector('.popup__caption');

const popups = document.querySelectorAll('.popup');
popups.forEach(function (popup) {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('click', (event) => {
    closeModalByOverlay(event, popup);
  });
  popup.querySelector('.popup__close').addEventListener('click', (event) => {
    event.stopPropagation();
    const mainPopup = event.target.closest('.popup');
    closeModal(mainPopup);
  });
});

editProfileButton.addEventListener('click', (evt) => {
  if (editForm != null) editForm.reset();
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editPopup);
});
profileAddButton.addEventListener('click', (evt) => {
  if (newCardForm != null) newCardForm.reset();
  openModal(newCardPopup);
});

editForm.addEventListener('submit', submitEditForm);
newCardForm.addEventListener('submit', submitNewCardForm);

function submitEditForm(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(evt.target.closest('.popup'));
}

function submitNewCardForm(evt) {
  evt.preventDefault();
  const form = evt.target.closest('.popup__form');
  const newCardData = {
    name: cardNameInput.value,
    link: cardImageUrl.value,
  };
  const newCard = createCard(
    cardTemplate,
    newCardData,
    deleteCard,
    likeCard,
    openImagePopup
  );
  form.reset();
  closeModal(evt.target.closest('.popup'));
  placesList.prepend(newCard);
}

function openImagePopup(event){
  const image = event.target;
  const title = image.closest('.places__item').querySelector('.card__title');
  popupImage.src = image.src;
  popupImage.alt = title.textContent;
  imageTitle.textContent = title.textContent;
  openModal(imagePopup);
}

initialCards.forEach((cardData) => {
  const card = createCard(
    cardTemplate,
    cardData,
    deleteCard,
    likeCard,
    openImagePopup
  );
  placesList.append(card);
});
