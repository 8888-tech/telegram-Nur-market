const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let cart = []; let allProds = [];

async function load() {
    const res = await fetch(URL);
    allProds = await res.json();
    renderCats(); renderProds(allProds);
}

function renderCats() {
    const cats = ['Barchasi', ...new Set(allProds.map(p => p.category))];
    document.getElementById('cat-bar').innerHTML = cats.map(c => 
        `<button onclick="filter('${c}')">${c}</button>`).join('');
}

function renderProds(list) {
    document.getElementById('product-list').innerHTML = list.map(p => `
        <div class="card">
            <img src="${p.image}">
            <p>${p.name}</p>
            <button onclick="cart.push('${p.name}'); alert('${p.name} qo\'shildi')">Savatga</button>
        </div>`).join('');
}

function filter(cat) {
    renderProds(cat === 'Barchasi' ? allProds : allProds.filter(p => p.category === cat));
}

function saveUser() {
    document.getElementById('reg-page').classList.remove('active');
    document.getElementById('shop-page').classList.add('active');
    load();
}

function checkout() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    Telegram.WebApp.sendData(`Buyurtma:\nMijoz: ${name}\nTel: ${phone}\nTovar: ${cart.join(', ')}`);
}