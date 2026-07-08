const URL = "https://script.google.com/macros/s/AKfycbwK9dObMKVE52rUUbCSbtE5VHZPy0nWreIfQSNuuYc_CGFBX0DKaBYDQANzyrA9XhUzaQ/exec";
let allProducts = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isRegistered') === 'true') {
        document.getElementById('reg-page').style.display = 'none';
        document.getElementById('shop-page').style.display = 'block';
        loadProducts();
    }
});

async function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    if (name && phone) {
        sessionStorage.setItem('isRegistered', 'true');
        sessionStorage.setItem('userName', name);
        await loadProducts();
        document.getElementById('reg-page').style.display = 'none';
        document.getElementById('shop-page').style.display = 'block';
    } else {
        alert("Ism va telefonni kiriting!");
    }
}

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (e) { alert("Xatolik yuz berdi!"); }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = `<h3>Kategoriyalar</h3>` + cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>
    `).join('');
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">🛒 Qo'shish</button>
            </div>
        `).join('')}
    `;
}

function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    item ? item.qty++ : cart.push({ name, price, qty: 1 });
    document.getElementById('cart-btn').innerText = `🛒 Savat (${cart.reduce((s, i) => s + i.qty, 0)} ta)`;
    alert(name + " qo'shildi!");
}

function showCart() {
    let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Do'konga qaytish</button>
        <h3>Savatdagi mahsulotlar:</h3>
        ${cart.map(i => `<p>${i.name} - ${i.qty} ta <button onclick="removeFromCart('${i.name}')">❌</button></p>`).join('')}
        <p><b>Jami: ${total} so'm</b></p>
        <select id="pay-type" style="width:100%; padding:10px; margin:10px 0;"><option>Naqd</option><option>Click/Payme</option></select>
        <button onclick="checkout()" class="order-btn">✅ Buyurtmani tasdiqlash</button>
    `;
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    showCart();
    document.getElementById('cart-btn').innerText = `🛒 Savat (${cart.reduce((s, i) => s + i.qty, 0)} ta)`;
}

function checkout() {
    let orderData = {
        ism: sessionStorage.getItem('userName'),
        buyurtma: cart.map(i => `${i.name} (${i.qty})`).join(', '),
        jami: cart.reduce((s, i) => s + (i.price * i.qty), 0) + " so'm",
        tolov: document.getElementById('pay-type').value
    };
    Telegram.WebApp.sendData(JSON.stringify(orderData));
    alert("Buyurtma yuborildi!");
    cart = [];
    renderCategories();
}