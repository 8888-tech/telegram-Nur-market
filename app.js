const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

async function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if (name && phone) {
        document.getElementById('reg-page').classList.remove('active');
        document.getElementById('shop-page').classList.add('active');
        try {
            const res = await fetch(URL);
            allProducts = await res.json();
            renderCategories();
        } catch (e) { alert("Xatolik: Ma'lumot yuklanmadi"); }
    } else { alert("Iltimos, ma'lumotlarni to'liq kiriting!"); }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')"><h3>${cat}</h3></div>
    `).join('');
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `<button onclick="renderCategories()">⬅️ Orqaga</button>` + 
    prods.map(p => `
        <div class="product-card">
            <p>${p.name} - ${p.price} so'm</p>
            <button onclick="addToCart('${p.name}', ${p.price})">Savatga qo'shish</button>
        </div>
    `).join('');
}

function addToCart(name, price) {
    cart.push({ name, price });
    document.getElementById('cart-btn').innerText = `🛒 Savat (${cart.length} ta)`;
    alert(name + " savatga qo'shildi!");
}

function checkout() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    Telegram.WebApp.sendData(`Buyurtma: ${cart.map(i=>i.name).join(', ')}`);
}