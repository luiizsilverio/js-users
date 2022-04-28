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
      }
      else if (field.name === "admin") {
        userdata[field.name] = field.checked
      }
      else {
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

      this.getImage()
        .then((content) => {
          user.photo = content
          this.addUser(user, this.tableId)
        })
        .catch((err) => {
          console.error(err)
        })

    })
  }

  getImage() {
    return new Promise((resolve, reject) => {

      let fileReader = new FileReader()

      let elFoto = Array.from(this.formEl.elements).filter(item => item.name === 'photo')

      let file = elFoto[0].files[0]

      fileReader.onload = () => {
        resolve(fileReader.result) // retorna a URL do arquivo
      }

      fileReader.onerror = (ev) => {
        reject(ev)
      }

      if (file) {
        fileReader.readAsDataURL(file)
      } else {
        resolve('dist/img/boxed-bg.jpg') // retorna foto padrão
      }
    })
  }

  addUser(user) {
    let trUser = document.createElement('tr')

    trUser.innerHTML = `
      <tr>
        <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin ? "Sim" : "Não"}</td>
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