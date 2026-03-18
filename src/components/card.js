export function createCard(cardTemplate, itemData, deleteFunction, likeFunction, openImageFunction) {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  const cardTitle = cardElement.querySelector('.card__title');
  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardTitle.textContent = itemData.name;
  cardImage.src = itemData.link;
  cardImage.alt = itemData.name;


  deleteButton.addEventListener('click', deleteFunction);
  likeButton.addEventListener('click', likeFunction);
  cardImage.addEventListener('click', openImageFunction);
  return cardElement;
}

export function deleteCard(event) {
  const cardToDelete = event.target.closest('.places__item');
  cardToDelete.remove();
}

export function likeCard(event) {
  event.target.classList.toggle('card__like-button_is-active');
}
