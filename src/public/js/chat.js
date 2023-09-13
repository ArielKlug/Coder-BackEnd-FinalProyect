

const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "identificate",
  input: "text",
  text: "Ingresar nombre de usuario",

  inputValidator: (value) => {
    return !value && "El nombre de usuario es obligatorio";
  },
  allowOutsideClick: false,

  icon: "success",
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatBox.value,
      });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messages");
  let mensajes = "";
  data.forEach(({ user, message }) => {
    mensajes += `<li> ${user} dice: ${message}</li>`;
  });
  log.innerHTML = mensajes;
});

socket.on("newUserConnected", (user) => {
  if (!user) {
    return;
  }
  Swal.fire({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 5000,
    title: `${user} se ah unido al chat`,
    icon: "success",
  });
});

