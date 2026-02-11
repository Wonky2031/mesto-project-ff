const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

function createCard(itemData, deleteFunction) {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  
  cardTitle.textContent = itemData.name;
  cardImage.src = itemData.link;
  deleteButton.addEventListener("click", deleteFunction);

  return cardElement;
}

function deleteCard(event) {
  const cardToDelete = event.target.closest(".places__item");
  cardToDelete.remove();
}

initialCards.forEach((cardData) => {
  const card = createCard(cardData, deleteCard);
  placesList.append(card);
});
