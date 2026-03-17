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
  const form = editPopup.querySelector('.popup__form');
  if (form != null) form.reset();
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editPopup);
});
profileAddButton.addEventListener('click', (evt) => {
  const form = newCardPopup.querySelector('.popup__form');
  if (form != null) form.reset();
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
    imagePopup,
    openModal
  );
  form.reset();
  closeModal(evt.target.closest('.popup'));
  placesList.prepend(newCard);
}

initialCards.forEach((cardData) => {
  const card = createCard(
    cardTemplate,
    cardData,
    deleteCard,
    likeCard,
    imagePopup,
    openModal
  );
  placesList.append(card);
});
