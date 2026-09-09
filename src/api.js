const config = {
  baseUrl: 'https://nomoreparties.co/v1/higher-front-back-dev_cohort_01',
  headers: {
    authorization: '153d703d-a0f2-403f-a112-20a7e49f6cf9',
    'Content-Type': 'application/json'
  }
}

export const getAllCardsDataRequest = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })
  .catch(err => {
    console.log(err);
  });
}

export const getCardDataRequest = (cardId) => {
  return getAllCardsDataRequest()
  .then(cards => cards.find(card => card._id === cardId));
}

export const getCardLikesCount = (cardId) => {
  return getAllCardsDataRequest()
  .then(cards => cards.find(card => card._id === cardId))
  .then(cardData => cardData.likes.length);
}

export const getUserDataRequest = () => {
  return fetch('https://nomoreparties.co/v1/higher-front-back-dev_cohort_01/users/me', {
    headers: config.headers
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })
  .catch(err => {
    console.log(err);
  });
}

export const deleteCardLikeRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  });
}

export const addCardLikeRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  });
}

export const deleteCardDataRequest = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  });
}

export const addCardDataRequest = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      link: link
    })
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  })
}

export const updateAvatarRequest = (url) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: url
    })
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
}

export const updateProfileInformation = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: about
    })
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
}