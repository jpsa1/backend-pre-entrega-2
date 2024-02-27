const socket = io()

const userName = document.querySelector('.userName')
let nameUser = "Ingrese nombre de usuario:"
userName.textContent = nameUser

//Solicita el ingreso al usuario
Swal.fire({
  title: "Ingrese su nombre",
  input: "text",
  inputAttributes: {
    autocapitalize: "on"
  },
  showCancelButton: false,
  confirmButtonText: "Ingresar",
}).then((result) => {
  userName.textContent = result.value
  nameUser = result.value
  socket.emit('userConnection', {
    user: result.value
  })
})

const inputMessage = document.getElementById("inputMessage")
const btnMessage = document.getElementById("btnMessage")
const chatMessage = document.querySelector('.chatMessage')

btnMessage.addEventListener('click', (e) => {
  e.preventDefault()
  console.log("hizo clic")
  socket.emit('userMessage', {
    user: nameUser,
    message: inputMessage.value
  })
  inputMessage.value = ""
})

socket.on("userMessage", (data) => {
  console.log(data)
  
  let element = ''
  chatMessage.innerHTML = ''
  for(let clave in data) {
      element = document.createElement('li') 
      element.textContent = `${data[clave].user}: ${data[clave].message}`
      chatMessage.appendChild(element)
  } 

  })

