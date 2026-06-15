const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

// 1. Registratsiyadan o'tish
function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;

    if (name && phone) {
        document.getElementById('reg-page').style.display = 'none';
        document.getElementById('shop-page').style.display = 'block';
        loadData();
    } else {
        alert("Iltimos, ism va telefon raqamingizni kiriting!");
    }
}

// 2. Ma'lumotlarni yuklash
async function loadData() {
    const res = await fetch(URL);
    allProducts = await res.json();
    renderCategories();
}

// 3. Kategoriyalarni ko'rsatish
function renderCategories() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = `<h3>Kategoriyalar:</h3>` + categories.map(cat => `
        <button class="cat-btn" onclick="showProducts('${cat}')">${cat}</button>
    `).join('');
}

// 4. Mahsulotlarni ko'rsatish
function showProducts(cat) {
    const filtered = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()">⬅️ Orqaga</button>
        ${filtered.map(p => `
            <div class="card">
                <img src="${p.image}" width="100">
                <p>${p.name}</p>
                <button onclick="addToCart('${p.name}')">🛒 Savatga qo'shish</button>
            </div>
        `).join('')}
    `;
}

// 5. Savatga qo'shish va tugmani yangilash
function addToCart(name) {
    cart.push(name);
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.innerText = `🛒 Zakazni yuborish (${cart.length})`;
    alert(name + " savatga qo'shildi!");
}

// 6. Buyurtmani yuborish
function checkout() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    Telegram.WebApp.sendData(`Yangi buyurtma!\nMijoz: ${name}\nTel: ${phone}\nMahsulotlar: ${cart.join(', ')}`);
}