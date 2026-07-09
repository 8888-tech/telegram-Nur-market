const URL = "https://script.google.com/macros/s/AKfycbxcN4yMMi386PYjbZd7mGk8YwYzYWscaeqlF67GQRPFTa6to_L5qu8UMa2g68fkrKV56w/exec"; // Yangi URL ni yozing!
let allProducts = [], cart = [];

async function loadProducts() {
    const res = await fetch(URL);
    allProducts = await res.json();
    renderCategories();
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.Kategoriya).filter(c => c))];
    document.getElementById('product-list').innerHTML = `
        <h3 style="text-align:center;">Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button class="back-btn" onclick="showCart()">🛒 Savatcha (${cart.length})</button>
        <button class="back-btn" onclick="showOrderHistory()">📋 Buyurtmalar tarixi</button>
        <div style="text-align:center; margin-top:20px;">
            <a href="tel:+998993958888" style="padding:10px; background:#0088cc; color:white; border-radius:8px; text-decoration:none;">📞 Biz bilan bog'lanish</a>
        </div>
    `;
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.Kategoriya === cat);
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <div class="product-grid">
            ${prods.map(p => `
                <div class="product-card">
                    <img src="${p.Rasim}" onerror="this.src='https://via.placeholder.com/100'">
                    <p><b>${p.Nomi}</b></p>
                    <p>${p.Narxi} so'm / ${p.Birlik}</p>
                    <button class="add-btn" onclick="addToCart('${p.Nomi.replace(/'/g, "\\'")}', ${parseFloat(p.Narxi)})">+</button>
                </div>
            `).join('')}
        </div>
    `;
}

function addToCart(name, price) {
    cart.push({name, price});
    alert(name + " savatga qo'shildi!");
}

function showCart() {
    let jami = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3>🛒 Savatcha</h3>
        ${cart.map(i => `<p>${i.name} - ${i.price} so'm</p>`).join('')}
        <p><b>Jami: ${jami} so'm</b></p>
        <input type="text" id="ism" placeholder="Ismingiz" required><br>
        <input type="tel" id="tel" placeholder="Telefon raqam" required><br>
        <button class="back-btn" style="background:green; color:white;" onclick="sendOrder(${jami})">✅ Buyurtmani tasdiqlash</button>
    `;
}

async function sendOrder(jami) {
    const ism = document.getElementById('ism').value;
    const tel = document.getElementById('tel').value;
    if(!ism || !tel) return alert("Ma'lumotlarni kiriting!");

    const res = await fetch(URL, { method: 'POST', body: JSON.stringify({ism, telefon: tel, buyurtma: cart.map(i=>i.name).join(", "), jami}) });
    const result = await res.json();

    if(result.status === "success") {
        let h = JSON.parse(localStorage.getItem('myOrders') || '[]');
        h.push({date: new Date().toLocaleDateString(), buyurtma: cart.map(i=>i.name).join(", "), jami});
        localStorage.setItem('myOrders', JSON.stringify(h));
        cart = [];
        alert("Buyurtma yuborildi!");
        renderCategories();
    }
}

function showOrderHistory() {
    const h = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3>📋 Tarix</h3>
        ${h.map(i => `<p>${i.date}: ${i.buyurtma} (${i.jami} so'm)</p>`).join('')}
    `;
}

document.addEventListener('DOMContentLoaded', loadProducts);