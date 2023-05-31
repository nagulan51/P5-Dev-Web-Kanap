document.addEventListener("DOMContentLoaded", (event) => {
  const orderId = document.getElementById("orderId");
  const order_id = JSON.parse(localStorage.getItem("order_id"));

  orderId.innerHTML = order_id;
  localStorage.setItem("order_id", JSON.stringify([]));
  localStorage.setItem("cart", JSON.stringify([]));
});
