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
        userData[field.name] = field.checked
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


  onDelete() {
    const btDel = document.querySelectorAll("button.btn-delete")

    btDel.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        if (confirm("Deseja excluir?")) {
          const td = event.currentTarget.parentElement
          const tr = td.parentElement

          tr.remove()
          this.countUsers()
        }
      })
    })
  }


  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {

      event.preventDefault()

      let user = this.getValues()

      if (!user.name) {
        alert('Informe o nome')
        return
      }

      if (!user.email) {
        alert('Informe o e-mail')
        return
      }

      const btn = this.formEl.querySelector('[type=submit]')

      btn.disabled = true

      this.getImage()
        .then((content) => {
          user.photo = content
          this.addUser(user, this.tableId)
          this.formEl.reset()
          btn.disabled = false
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

    trUser.dataset.admin = user.admin
    // trUser.dataset.user = JSON.stringify(user)

    trUser.innerHTML = `
      <tr>
        <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin ? "Sim" : "Não"}</td>
        <td>${Utils.dateFormat(user.dtcad)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
        </td>
      </tr>
    `

    this.tableEl.append(trUser)
    this.countUsers()
    this.onDelete()
  }

  countUsers() {
    let totUsers = 0
    let totAdmin = 0

    Array.from(this.tableEl.children).forEach((tr) => {
      if (tr.dataset.admin === 'true') totAdmin ++
      totUsers ++
    })

    document.querySelector("h3.tot-users").innerText = totUsers
    document.querySelector("h3.tot-admin").innerText = totAdmin
  }

}