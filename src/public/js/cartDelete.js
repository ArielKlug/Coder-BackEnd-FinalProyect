const { logger } = require("../../config/logger");

logger
function deleteProduct(cartId, productId) {
   
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            
            location.reload(); 
        } else {
            
            logger.error('Error al eliminar el producto del carrito');
        }
    })
    .catch(error => {
        logger.error('Error al eliminar el producto del carrito:', error);
    });
}
