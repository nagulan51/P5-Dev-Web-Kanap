document.addEventListener("DOMContentLoaded", (event) => {
  var items = document.getElementById("items");
  load_products()
    .then((data) => {
      data.forEach((each) => {
        items.appendChild(each);
      });
    })
    .catch((e) => {
      let h3 = document.createElement("h3");
      h3.className = "error_message";
      h3.innerText =
        "nous rencontrons des difficultés pour récupérer les résultats du serveur";
      h3.style.color = "#b30000";
      items.appendChild(h3);
    });
});

async function load_products() {
  var products = [];

  var api = "http://localhost:3000/api/products";
  const data = await fetch(api);
  const finaldata = await data.json();

  for (x = 0; x < finaldata.length; x++) {
    var single_article = finaldata[x];
    console.log(single_article);
    console.log(single_article._id);
    let a = document.createElement("a");
    a.setAttribute("href", `./product.html?id=${single_article._id}`);
    let article = document.createElement("article");

    let img = document.createElement("img");
    img.src = single_article.imageUrl;
    img.alt = single_article.altTxt;

    let h3 = document.createElement("h3");
    h3.className = "productName";
    h3.innerText = single_article.name;

    let p = document.createElement("p");
    p.className = "productDescription";
    p.innerText =
      "Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.";

    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
    products.push(a);
  }
  return products ? products : undefined;
}
