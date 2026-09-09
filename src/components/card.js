export function createCard(
  cardTemplate,
  itemData,
  deleteFunction,
  likeFunction,
  updateLikesFunction,
  openImageFunction,
  userData,
  openConfirmPopupFunction,
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  cardTitle.textContent = itemData.name;
  cardImage.src = itemData.link;
  cardImage.alt = itemData.name;
  cardLikeCount.textContent = itemData.likes.length;

  if (itemData.owner._id == userData._id) {
    deleteButton.style.display = "block";
    deleteButton.addEventListener("click", (event) =>
      openConfirmPopupFunction(event, itemData._id, deleteFunction),
    );
  } else {
    deleteButton.style.display = "none";
  }

  if (itemData.likes.some((user) => user._id === userData._id))
    likeButton.classList.add("card__like-button_is-active");
  likeButton.addEventListener("click", (event) =>
    updateLikesFunction(event.target, itemData._id, likeFunction),
  );

  cardImage.addEventListener("click", openImageFunction);
  return cardElement;
}

export function deleteCard(card) {
  card.remove();
}

export function likeCard(likeButton, likesCount, state, likesValue) {
  if (state) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }
  likesCount.textContent = likesValue;
}
