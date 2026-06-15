const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

// 1. Kirish funksiyasi
async function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if (name && phone) {
        document.getElementById('reg-page').classList.remove('active');
        document.getElementById('shop-page').classList.add('active');
        
        // Ma'lumotlarni yuklash
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } else {
        alert("Ism va telefonni kiriting!");
    }
}

// 2. Kategoriyalarni chiqarish
function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')"><h3>${cat}</h3></div>
    `).join('');
}

// 3. Kategoriyaga kirganda rasmlarni chiqarish
function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" style="background:#888; width:90%; margin:10px 5%;">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <img src="${p.image}" style="width:100px; height:100px; border-radius:10px;">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name}', ${p.price})">🛒 Qo'shish</button>
            </div>
        `).join('')}
    `;
}

// 4. Savat mantiqi
function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    item ? item.qty++ : cart.push({ name, price, qty: 1 });
    let totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-btn').innerText = `🛒 Savat (${totalQty} ta)`;
    alert(name + " qo'shildi!");
}

function showCart() {
    let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('product-list').innerHTML = `<h3>Savat:</h3>` + cart.map((i, idx) => `
        <p>${i.name} - ${i.qty} ta</p>
    `).join('') + `<p>Jami: ${total} so'm</p>
    <select id="pay-type"><option>Naqd</option><option>Click/Payme</option></select>
    <button onclick="checkout()">Buyurtmani yuborish</button>`;
}

function checkout() {
    let items = cart.map(i => `${i.name} (${i.qty} ta)`).join(', ');
    Telegram.WebApp.sendData("Buyurtma: " + items + " | Jami: " + document.getElementById('pay-type').value);
}