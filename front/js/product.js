// check if DOM is loaded
document.addEventListener("DOMContentLoaded", (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  const add_to_cart_btn = document.getElementById("addToCart");
  add_to_cart_btn.addEventListener("click", () => {
    handle_add_to_cart(id);
  });

  //  Load product at startup
  getSingleProduct(id).then((data) => {
    Load_product(data);
  });
});

async function getSingleProduct(id) {
  var api = `http://localhost:3000/api/products/${id}`;
  const data = await fetch(api);
  const finaldata = await data.json();
  return finaldata ? finaldata : undefined;
}
// charger le produit
function Load_product(data) {
  //   console.log(data);
  const item__img = document.querySelector(".item__img");
  const title = document.getElementById("title");
  const price = document.getElementById("price");
  const color_options = document.getElementById("colors");
  const description = document.getElementById("description");
  document.title = data.name;
  data.colors.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    option.text = element;
    color_options.add(option, null);
  });

  // add image
  let img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.altTxt;
  item__img.appendChild(img);
  // add product title
  title.innerHTML = data.name;
  // add product price
  price.innerHTML = data.price;
  description.innerHTML = data.description;
}
// gerer le ajout dans le panier
function handle_add_to_cart(id) {
  const color_options = document.getElementById("colors");
  const itemQuantity = document.getElementsByName("itemQuantity")[0].value;

  if (color_options.selectedIndex <= 0 || itemQuantity <= 0) {
    if (color_options.selectedIndex <= 0 && itemQuantity <= 0) {
      alert("merci de bien vouloir choisir une couleur et la quantité");
    } else if (color_options.selectedIndex <= 0) {
      alert("merci de bien vouloir choisir une couleur");
    } else if (itemQuantity <= 0) {
      alert("merci de bien vouloir choisir la quantité");
    }
  } else if (!color_options.selectedIndex <= 0 && !itemQuantity <= 0) {
    console.log(localStorage.getItem("cart"));
    console.log("cart");
    var cart_item = [
      {
        id: id,
        quantity: itemQuantity,
        colors: color_options.value,
      },
    ];
    if (localStorage.hasOwnProperty("cart")) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const resultFind1 = cart.find(
        (seul) => seul.id === id && seul.colors == color_options.value
      );
      // si objet existe déja dans le panier alors in incrémente
      if (resultFind1) {
        resultFind1.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("produit rajouté dans le panier !");
      } else {
        cart.push({
          id: id,
          quantity: 1,
          colors: color_options.value,
        });
        alert("produit rajouté dans le panier !");
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    } else {
      console.log("vous avez rien dans le panier");
      localStorage.setItem("cart", JSON.stringify(cart_item));
    }
  }
}
