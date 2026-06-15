const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

// 1. Kirish
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
        alert("Iltimos, ism va telefon raqamni kiriting!");
    }
}

// 2. Kategoriyalarni chiqarish
function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')">
            <h3>${cat}</h3>
        </div>
    `).join('');
}

// 3. Mahsulotlarni chiqarish
function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" style="background:#888">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <img src="${p.image}" width="80">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name}', ${p.price})">Savatga qo'shish</button>
            </div>
        `).join('')}
    `;
}

// 4. Savatga qo'shish
function addToCart(name, price) {
    cart.push({ name, price });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-btn').innerText = `🛒 Savat (${cart.length} ta) - ${total} so'm`;
    alert(name + " savatga qo'shildi!");
}

// 5. Buyurtmani yuborish
function checkout() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    const name = document.getElementById('user-name').value;
    const items = cart.map(i => i.name).join(', ');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    Telegram.WebApp.sendData(`Yangi buyurtma!\nKimdan: ${name}\nMahsulotlar: ${items}\nJami: ${total} so'm`);
}