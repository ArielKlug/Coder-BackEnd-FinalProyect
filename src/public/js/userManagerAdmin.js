const { logger } = require("../../config/logger");

function changeRole(userId, newRole) {
  
  if (
    confirm("¿Estás seguro de que deseas modificar el rol de este usuario?")
  ) {
    fetch(`/api/users/${userId}/role/${newRole}`, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Usuario actualizado con éxito");

        location.reload();
      })
      .catch((error) => {
        logger.error("Error al actualizar el rol del usuario:", error);
      });
  }
}

function deleteUser(userId) {
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
    fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Usuario eliminado con éxito");

        location.reload();
      })
      .catch((error) => {
        logger.error("Error al eliminar el usuario:", error);
      });
  }
}

function deleteSelectedUsers() {
  fetch(`/api/users/`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Usuarios inactivos eliminados con éxito");

      location.reload();
    })
    .catch((error) => {
      logger.error("Error al eliminar los usuarios:", error);
    });
}
