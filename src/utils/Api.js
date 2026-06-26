class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.status));
  }


  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
    .then(res => res.ok ? res.json() : Promise.reject(res.status));
  }

editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,

      body: JSON.stringify({
        name,
        about,
      }),
    }).then(res => res.ok ? res.json() : Promise.reject(res.status));

  }

deleteCard(id) {
  return fetch(`${this._baseUrl}/cards/${id}`, {
    method: "DELETE",
    headers: this._headers,
  }).then(res => res.ok ? res.json() : Promise.reject(res.status));
}


  getAppInfo() {
  return Promise.all([this.getUserInfo(), this.getInitialCards()]);
}

updateAvatar(avatar) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({ avatar })
  }).then(res => res.ok ? res.json() : Promise.reject(res.status));
}

addCard(data) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify(data)
  })
  .then(res => res.ok ? res.json() : Promise.reject(res.status));
}

handleLikeStatus(id, isLiked) {
  return fetch(`${this._baseUrl}/cards/${id}/likes`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: this._headers,
  }).then(res => res.ok ? res.json() : Promise.reject(res.status));
}

}

export default Api;
