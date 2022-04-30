class UserController {

  constructor(formId, tableId) {
    this.formEl = document.getElementById(formId)
    this.tableEl = document.getElementById(tableId)
    this.userSel = {}
    this.userIndex = -1
    this.onSubmit()
    this.selectAll()
  }


  getValues() {
    const userData = {}

    Array.from(this.formEl.elements).forEach((field, index) => {

      if (field.name === "gender") {
        if (field.checked) {
          if (field.id === "exampleInputGenderM") {
            userData[field.name] = "M"
          } else {
            userData[field.name] = "F"
          }
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

  setValues(user) {
    if (!user) return

    Array.from(this.formEl.elements).forEach((field, index) => {

      if (field.name === "gender") {
        if (field.id === "exampleInputGenderM" && user.gender === "M" ) {
          field.checked = true
        }
        else if (field.id === "exampleInputGenderF" && user.gender === "F" ) {
          field.checked = true
        }
      }
      else if (field.name === "admin") {
        field.checked = user.admin
      }
      else if (field.name === "photo" && user.photo) {
        // TODO
      }
      else {
        field.value = user[field.name]
      }
    })

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


  onEdit(trUser) {
    const btnEdt = trUser.querySelectorAll("button.btn-edit")

    this.reset()

    if (btnEdt.length > 0) {
      btnEdt[0].addEventListener("click", (event) => {
        const td = event.currentTarget.parentElement
        const tr = td.parentElement
        const user = JSON.parse(tr.dataset.user)
        this.userSel = user
        this.userIndex = tr.rowIndex
        this.setValues(user)
      })
    }
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

          if (this.userSel.name) {
            this.editUser(user)
          } else {
            this.addUser(user)
          }

          this.reset()
          btn.disabled = false
        })
        .catch((err) => {
          console.error(err)
        })
    })

    this.formEl.addEventListener("reset", (event) => {
      this.reset()
    })
  }


  reset() {
    this.formEl.reset()
    this.userSel = {}
    this.userIndex = -1
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
      }
      else if (this.userIndex >= 0) {
        resolve(this.userSel.photo)
      }
      else {
        resolve('dist/img/boxed-bg.jpg') // retorna foto padrão
      }
    })
  }


  getUsersStorage() {
    let users = []

    if (sessionStorage.getItem("hcode:users")) {
      users = JSON.parse(sessionStorage.getItem("hcode:users"))
    }

    return users
  }


  selectAll() {
    let users = this.getUsersStorage()

    users.forEach((user) => {
      user.dtcad = new Date(user.dtcad)
      this.addUser(user, false)
    })
  }


  store(data) {
    let users = this.getUsersStorage()

    users.push(data)
    sessionStorage.setItem("hcode:users", JSON.stringify(users))
  }


  addUser(user, storeUser = true) {
    let trUser = document.createElement('tr')

    const objUser = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      birth: user.birth,
      country: user.country,
      password: user.password,
      photo: user.photo,
      admin: user.admin,
      dtcad: user.dtcad
    }

    if (storeUser) {
      this.store(objUser)
    }

    trUser.dataset.user = JSON.stringify(objUser)

    trUser.innerHTML = `
      <tr>
        <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin ? "Sim" : "Não"}</td>
        <td>${Utils.dateFormat(user.dtcad)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
        </td>
      </tr>
    `

    this.tableEl.append(trUser)
    this.countUsers()
    this.onDelete()
    this.onEdit(trUser)
  }


  countUsers() {
    let totUsers = 0
    let totAdmin = 0

    Array.from(this.tableEl.children).forEach((tr) => {
      const user = JSON.parse(tr.dataset.user)
      if (user.admin) totAdmin ++
      totUsers ++
    })

    document.querySelector("h3.tot-users").innerText = totUsers
    document.querySelector("h3.tot-admin").innerText = totAdmin
  }

  editUser(user) {
    const trUsers = document.querySelectorAll('tr')
    const trUser = trUsers[this.userIndex]
    const oldUser = JSON.parse(trUser.dataset.user)

    const objUser = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      birth: user.birth,
      country: user.country,
      password: user.password,
      photo: user.photo,
      admin: user.admin,
      dtcad: user.dtcad
    }

    if (!user.photo && oldUser.photo) {
      objUser.photo = oldUser.photo
      user.photo = oldUser.photo
    }

    trUser.innerHTML = `
      <tr>
        <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin ? "Sim" : "Não"}</td>
        <td>${Utils.dateFormat(user.dtcad)}</td>
        <td>
          <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
          <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
        </td>
      </tr>
    `

    trUser.dataset.user = JSON.stringify(objUser)
    this.countUsers()
    this.onDelete()
    this.onEdit(trUser)
  }

}