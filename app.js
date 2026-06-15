const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

async function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    if (name && phone) {
        document.getElementById('reg-page').classList.remove('active');
        document.getElementById('shop-page').classList.add('active');
        
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } else {
        alert("Ism va telefonni kiriting!");
    }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('product-list');
    container.innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')"><h3>${cat}</h3></div>
    `).join('');
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" style="background:#888; width:90%; margin:10px 5%;">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name}', ${p.price})">Savatga</button>
            </div>
        `).join('')}
    `;
}

function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-btn').innerText = `🛒 Savat (${cart.length} ta)`;
    alert(name + " qo'shildi!");
}

function checkout() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    Telegram.WebApp.sendData(JSON.stringify(cart));
}