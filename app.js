const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";

let cart = [];

// Tovar yuklash
async function loadProducts() {
    const container = document.getElementById("product-list");
    container.innerHTML = "Yuklanmoqda...";
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const products = await response.json();
        container.innerHTML = "";
        products.forEach(p => {
            container.innerHTML += `
                <div class="product-card">
                    <img src="${p.image}" style="width:100%">
                    <h3>${p.name}</h3>
                    <p class="price">${p.price} so'm</p>
                    <button onclick="addToCart('${p.name}', ${p.price})">Savatga qo'shish +</button>
                </div>
            `;
        });
    } catch (e) { container.innerHTML = "Xatolik yuz berdi."; }
}

// Savat funksiyasi
function addToCart(name, price) {
    cart.push({name, price});
    alert(name + " savatga qo'shildi!");
}

document.addEventListener("DOMContentLoaded", loadProducts);