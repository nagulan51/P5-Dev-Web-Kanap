document.addEventListener("DOMContentLoaded", (event) => {
  const orderId = document.getElementById("orderId");
  orderId.innerHTML = JSON.parse(localStorage.getItem("order_id")).order_id;
  localStorage.setItem("order_id", JSON.stringify([]));
});
