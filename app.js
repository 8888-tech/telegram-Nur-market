const URL = "https://script.google.com/macros/s/AKfycbwE4nSqAdOUDm4zmgtZQYuXFxhrUmYsz8YsYY0ABNDg_Pf_NelMSxHLlR_dveY50ZwMHA/exec";
let allProducts = [], cart = [];

async function loadProducts() {
    const res = await fetch(URL);
    allProducts = await res.json();
    renderCategories();
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = `
        <h3>Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button onclick="showOrderHistory()" style="margin-top:20px; width:100%; padding:10px;">📜 Buyurtmalarim tarixi</button>
    `;
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div class="product-card">
                <img src="${p.image}" style="width:100px; height:100px; object-fit:cover;">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">🛒 Qo'shish</button>
            </div>
        `).join('')}
    `;
}

function showCart() {
    let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Do'konga qaytish</button>
        <h3>Savat:</h3>
        ${cart.map(i => `<p>${i.name} - ${i.qty} ta</p>`).join('')}
        <p><b>Jami: ${total} so'm</b></p>
        <input type="text" id="order-name" placeholder="Ismingiz" required style="width:100%; padding:10px; margin:5px 0;">
        <input type="tel" id="order-phone" placeholder="Telefon raqam" required style="width:100%; padding:10px; margin:5px 0;">
        <select id="pay-type" style="width:100%; padding:10px;"><option>Naqd</option><option>Click/Payme</option></select>
        <button onclick="checkout()" style="width:100%; padding:15px; margin-top:10px; background:green; color:white;">✅ Buyurtmani tasdiqlash</button>
    `;
}

async function checkout() {
    const orderData = {
        ism: document.getElementById('order-name').value,
        telefon: document.getElementById('order-phone').value,
        buyurtma: cart.map(i => `${i.name} (${i.qty} ta)`).join(', '),
        jami: cart.reduce((s, i) => s + (i.price * i.qty), 0) + " so'm",
        tolov: document.getElementById('pay-type').value
    };

    await fetch(URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(orderData) });
    
    let history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    history.push({...orderData, sana: new Date().toLocaleDateString()});
    localStorage.setItem('myOrders', JSON.stringify(history));
    
    alert("✅ Buyurtmangiz qabul qilindi!");
    cart = [];
    renderCategories();
}

function showOrderHistory() {
    const history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Orqaga</button>
        <h3>Tarix:</h3>
        ${history.map(h => `<div style="border-bottom:1px solid #ccc;">${h.sana}: ${h.buyurtma} - ${h.jami}</div>`).join('')}
    `;
    // Faylning eng pastiga qo'shing
document.addEventListener('DOMContentLoaded', loadProducts);
}