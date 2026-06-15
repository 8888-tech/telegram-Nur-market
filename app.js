const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let cart = [];

async function loadProducts() {
    const list = document.getElementById('product-list');
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    list.innerHTML = data.map(p => `
        <div class="card">
            <img src="${p.image}">
            <p>${p.name}</p>
            <button onclick="addToCart('${p.name}')">Savatga</button>
        </div>
    `).join('');
}

function registerUser() {
    document.getElementById('reg-page').classList.remove('active');
    document.getElementById('shop-page').classList.add('active');
    loadProducts();
}

function addToCart(name) {
    cart.push(name);
    alert(name + " savatda!");
}

function checkout() {
    alert("Zakaz yuborildi: " + cart.join(", "));
}