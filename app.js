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
        alert("Ism va telefonni kiriting!");
    }
}

// 2. Kategoriyalar
function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')"><h3>${cat}</h3></div>
    `).join('');
}

// 3. Mahsulotlar
function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" style="background:#888; width:90%; margin:10px 5%;">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name}', ${p.price})">Savatga qo'shish</button>
            </div>
        `).join('')}
    `;
}

// 4. Savatga qo'shish
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartButton();
    alert(name + " qo'shildi!");
}

function updateCartButton() {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-btn').innerText = `🛒 Savat (${totalQty} ta)`;
}

// 5. Savatni ko'rsatish
function showCart() {
    let list = document.getElementById('product-list');
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (cart.length === 0) return alert("Savat bo'sh!");
    
    list.innerHTML = `<h3>Sizning savatingiz:</h3>`;
    cart.forEach((item, index) => {
        list.innerHTML += `
            <div class="product-card">
                <p>${item.name} - ${item.price} so'm x ${item.qty}</p>
                <button onclick="changeQty(${index}, -1)">-</button>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
        `;
    });
    list.innerHTML += `
        <p>Jami: ${total} so'm</p>
        <select id="payment-method">
            <option value="Naqd">Naqd pul</option>
            <option value="Click/Payme">Click / Payme</option>
        </select>
        <button onclick="checkout()" style="background:#27ae60;">Buyurtmani yuborish</button>
        <button onclick="renderCategories()" style="background:#888;">⬅️ Do'konga qaytish</button>
    `;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartButton();
    showCart();
}

// 6. Buyurtmani yuborish
function checkout() {
    let payment = document.getElementById('payment-method').value;
    let items = cart.map(i => `${i.name} (${i.qty} ta)`).join(', ');
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    Telegram.WebApp.sendData(`Buyurtma: ${items}\nTo'lov: ${payment}\nJami: ${total} so'm`);
}