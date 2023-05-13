document.addEventListener("DOMContentLoaded", (event) => {
  const orderId = document.getElementById("orderId");
  const cart = JSON.parse(localStorage.getItem("cart"));

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let prodcuts = [];
  orderId.innerHTML = JSON.parse(localStorage.getItem("order_id")).order_id;
  localStorage.setItem("order_id", JSON.stringify([]));

  if (cart.length != 0) {
    cart.forEach((product) => {
      prodcuts.push(product.id);
    });
    if (
      urlParams.get("firstName") &&
      urlParams.get("lastName") &&
      urlParams.get("address") &&
      urlParams.get("city") &&
      urlParams.get("email")
    ) {
      create_order(
        urlParams.get("firstName"),
        urlParams.get("lastName"),
        urlParams.get("address"),
        urlParams.get("city"),
        urlParams.get("email"),
        prodcuts
      );
    }
  }
});

async function create_order(
  firstName,
  lastName,
  address,
  city,
  email,
  prodcuts
) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email,
      },
      products: prodcuts,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      localStorage.setItem("cart", JSON.stringify([]));
      orderId.innerHTML = response.orderId;
    });
}
