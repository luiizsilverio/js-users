class User {
  #name
  #gender
  #birth
  #country
  #email
  #password
  #photo
  #admin
  #dtcad = new Date()

  constructor(name, gender, birth, country, email, password, photo, admin) {
    this.#name = name
    this.#gender = gender
    this.#birth = birth
    this.#country = country
    this.#email = email
    this.#password = password
    this.#photo = photo
    this.#admin = admin
  }

  get name() {
    return this.#name
  }

  get gender() {
    return this.#gender
  }

  get birth() {
    return this.#birth
  }

  get country() {
    return this.#country
  }

  get email() {
    return this.#email
  }

  get password() {
    return this.#password
  }

  get photo() {
    return this.#photo
  }

  get admin() {
    return this.#admin
  }

  get dtcad() {
    return this.#dtcad
  }

  set photo(value) {
    this.#photo = value
  }
}
