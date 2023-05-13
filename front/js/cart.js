document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem("cart")) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.forEach((data) => {
      create_product(data);
    });
    Calcul_montant_total_articles_total(cart);
  }

  const cart__order__form = document.querySelector(".cart__order__form");
  cart__order__form.addEventListener("submit", handle_form);
});

function create_product(data) {
  getProductByid(data.id).then((singleproduct) => {
    var cart__items = document.getElementById("cart__items");
    let itemElement = document.createElement("article");
    itemElement.className = "cart__item";
    itemElement.setAttribute("data-id", data.id);
    itemElement.setAttribute("data-color", data.colors);

    let itemImg = document.createElement("div");
    itemImg.className = "cart__item__img";
    let itemImgElement = document.createElement("img");
    itemImgElement.src = singleproduct.imageUrl;
    itemImgElement.alt = singleproduct.altTxt;
    itemImg.appendChild(itemImgElement);
    itemElement.appendChild(itemImg);

    let itemContent = document.createElement("div");
    itemContent.className = "cart__item__content";

    let itemContentDescription = document.createElement("div");
    itemContentDescription.className = "cart__item__content__description";
    let itemContentDescriptionHeader = document.createElement("h2");
    itemContentDescriptionHeader.innerText = singleproduct.name;
    let itemContentDescriptionColor = document.createElement("p");
    itemContentDescriptionColor.innerText = data.colors;
    let itemContentDescriptionPrice = document.createElement("p");
    itemContentDescriptionPrice.innerText = singleproduct.price + ",00 €";
    itemContentDescription.appendChild(itemContentDescriptionHeader);
    itemContentDescription.appendChild(itemContentDescriptionColor);
    itemContentDescription.appendChild(itemContentDescriptionPrice);

    let itemContentSettings = document.createElement("div");
    itemContentSettings.className = "cart__item__content__settings";

    let itemContentSettingsQuantity = document.createElement("div");
    itemContentSettingsQuantity.className =
      "cart__item__content__settings__quantity";
    let itemContentSettingsQuantityText = document.createElement("p");
    itemContentSettingsQuantityText.innerText = "Qté : ";
    let itemContentSettingsQuantityInput = document.createElement("input");
    itemContentSettingsQuantityInput.type = "number";
    itemContentSettingsQuantityInput.className = "itemQuantity";
    itemContentSettingsQuantityInput.name = "itemQuantity";
    itemContentSettingsQuantityInput.min = 1;
    itemContentSettingsQuantityInput.max = 100;
    itemContentSettingsQuantityInput.value = data.quantity;
    itemContentSettingsQuantityInput.addEventListener(
      "input",
      handle_update_cart
    );
    itemContentSettingsQuantity.appendChild(itemContentSettingsQuantityText);
    itemContentSettingsQuantity.appendChild(itemContentSettingsQuantityInput);

    let itemContentSettingsDelete = document.createElement("div");
    itemContentSettingsDelete.className =
      "cart__item__content__settings__delete";
    let itemContentSettingsDeleteBtn = document.createElement("p");
    itemContentSettingsDeleteBtn.className = "deleteItem";
    itemContentSettingsDeleteBtn.innerText = "Supprimer";
    itemContentSettingsDeleteBtn.addEventListener("click", handle_delete);
    itemContentSettingsDelete.appendChild(itemContentSettingsDeleteBtn);

    itemContentSettings.appendChild(itemContentSettingsQuantity);
    itemContentSettings.appendChild(itemContentSettingsDelete);

    itemContent.appendChild(itemContentDescription);
    itemContent.appendChild(itemContentSettings);

    itemElement.appendChild(itemContent);
    cart__items.appendChild(itemElement);
  });
}

async function getProductByid(id) {
  var api = `http://localhost:3000/api/products/${id}`;
  const data = await fetch(api);
  const finaldata = await data.json();
  return finaldata ? finaldata : undefined;
}

function Calcul_montant_total_articles_total(calcul_prix) {
  const price = document.getElementById("totalPrice");
  const totalQuantity = document.getElementById("totalQuantity");
  var total_amount = 0;
  var total_articles = 0;
  if (calcul_prix && calcul_prix.length != 0) {
    calcul_prix.forEach((data) => {
      getProductByid(data.id).then((single_product) => {
        total_amount = total_amount + single_product.price * data.quantity;
        total_articles = parseInt(total_articles) + parseInt(data.quantity);

        price.innerHTML = total_amount;
        totalQuantity.innerHTML = total_articles;
      });
    });
  } else if (
    calcul_prix === undefined ||
    calcul_prix.length === 0 ||
    calcul_prix === []
  ) {
    let itemContentDescriptionHeader = document.createElement("h2");
    itemContentDescriptionHeader.innerText = "votre panier est vide :-)";
    itemContentDescriptionHeader.style.textAlign = "center";
    const cart__items = document.getElementById("cart__items");
    cart__items.appendChild(itemContentDescriptionHeader);
    price.innerHTML = 0;
    totalQuantity.innerHTML = 0;
  }
  {
  }
}
function handle_update_cart(element) {
  const quantity = element.target.value;
  const id = element.target.closest("article").dataset.id;
  const color = element.target.closest("article").dataset.color;
  if (localStorage.hasOwnProperty("cart")) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const resultFind1 = cart.find(
      (seul) => seul.id === id && seul.colors == color
    );
    // si objet existe déja dans le panier alors in incrémente
    if (resultFind1) {
      resultFind1.quantity = quantity;
      Calcul_montant_total_articles_total(cart);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } else {
    alert("woops une erreur imprévu s'est produite");
  }
}

function handle_delete(event) {
  const id = event.target.closest("article").dataset.id;
  const color = event.target.closest("article").dataset.color;
  const article = event.target.closest("article");
  const cart = JSON.parse(localStorage.getItem("cart"));
  const resultFind1 = cart.find(
    (seul) => seul.id === id && seul.colors == color
  );
  let index = cart.indexOf(resultFind1);
  if (cart.splice(index, 1)) {
    localStorage.setItem("cart", JSON.stringify(cart));
    article.remove();
    Calcul_montant_total_articles_total(cart);
  }
}
function handle_form(event) {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");
  const cart = JSON.parse(localStorage.getItem("cart"));
  var emailregex =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (
    firstName.value &&
    lastName.value &&
    address.value &&
    city.value &&
    email.value &&
    cart.length != 0
  ) {
    if (
      typeof firstName.value === "string" &&
      typeof lastName.value === "string" &&
      typeof address.value === "string" &&
      typeof city.value === "string" &&
      email.value.match(emailregex)
    ) {
      event.preventDefault();
      window.location.replace(
        `confirmation.html?firstName=${firstName.value}&lastName=${lastName.value}&address=${address.value}&city=${city.value}&email=${email.value}`
      );
    }
  }
  if (cart.length === 0) {
    event.preventDefault();
    alert("votre panier est vide");
  }
}

function generateRandomNumber() {
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
