export function openModal(popup) {
  popup.classList.add("popup_is-opened");
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

export function closeModalByOverlay(event, popup){
  if (event.target == popup) closeModal(popup);
}
