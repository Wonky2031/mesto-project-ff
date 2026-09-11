export function createCard(
  cardTemplate,
  itemData,
  updateLikesFunction,
  updateCardLikeStateFunction,
  openImageFunction,
  userId,
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

  if (itemData.owner._id == userId) {
    deleteButton.addEventListener("click", (event) =>
      openConfirmPopupFunction(cardElement, itemData._id),
    );
  } else {
    deleteButton.remove();
  }

  if (isCardLiked(itemData, userId))
    likeButton.classList.add("card__like-button_is-active");

  likeButton.addEventListener("click", () =>
    updateLikesFunction(
      likeButton,
      cardLikeCount,
      itemData,
      updateCardLikeStateFunction,
    ),
  );

  cardImage.addEventListener("click", () => {
    openImageFunction(itemData.link, itemData.name);
  });
  return cardElement;
}

export function deleteCard(card) {
  card.remove();
}

export function isCardLiked(cardData, userId) {
  return cardData.likes.some((user) => user._id === userId);
}

export function updateCardLikeState(likeButton, likesCount, likes, userId) {
  const isLiked = likes.some((user) => user._id === userId);

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }

  likesCount.textContent = likes.length;
}
