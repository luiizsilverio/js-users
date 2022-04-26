class UserController {

  constructor(formId, tableId) {
    this.formEl = document.getElementById(formId)
    this.tableEl = document.getElementById(tableId)
    this.onSubmit()
  }


  getValues() {
    const userData = {}

    Array.from(this.formEl.elements).forEach((field, index) => {
      if (field.name === "gender") {
        if (field.checked) {
          userData[field.name] = field.value
        }
      } else {
        userData[field.name] = field.value
      }
    })

    const objUser = new User(
      userData.name,
      userData.gender,
      userData.birth,
      userData.country,
      userData.email,
      userData.password,
      userData.photo,
      userData.admin
    )

    return objUser
  }


  onSubmit() {

    this.formEl.addEventListener("submit", (event) => {

      event.preventDefault()

      let user = this.getValues()

      this.addUser(user, this.tableId)

    })
  }


  addUser(user) {
    let trUser = document.createElement('tr')

    trUser.innerHTML = `
      <tr>
        <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin}</td>
        <td>${user.birth}</td>
        <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
      </tr>
    `
    this.tableEl.append(trUser)
  }
}