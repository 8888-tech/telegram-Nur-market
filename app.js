const URL = "https://script.google.com/macros/s/AKfycbwE4nSqAdOUDm4zmgtZQYuXFxhrUmYsz8YsYY0ABNDg_Pf_NelMSxHLlR_dveY50ZwMHA/exec";
let allProducts = [], cart = [];

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (error) {
        document.getElementById('product-list').innerHTML = "Xatolik yuz berdi. Internetni tekshiring.";
    }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = `
        <h3>Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button onclick="showOrderHistory()" style="margin-top:20px; width:100%; padding:10px;">📜 Buyurtmalar tarixi</button>
    `;
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.category === cat);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Orqaga</button>
        ${prods.map(p => `
            <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
                <p>${p.name} - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price})">🛒 Qo'shish</button>
            </div>
        `).join('')}
    `;
}

function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    item ? item.qty++ : cart.push({ name, price, qty: 1 });
    alert(name + " savatga qo'shildi!");
}

function showCart() {
    let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Do'konga qaytish</button>
        <h3>Savat:</h3>
        ${cart.map(i => `<p>${i.name} - ${i.qty} ta</p>`).join('')}
        <p><b>Jami: ${total} so'm</b></p>
        <input type="text" id="order-name" placeholder="Ismingiz" style="width:100%; padding:10px; margin:5px 0;">
        <input type="tel" id="order-phone" placeholder="Telefon raqam" style="width:100%; padding:10px; margin:5px 0;">
        <button onclick="checkout()" style="width:100%; padding:15px; background:green; color:white; border:none;">✅ Tasdiqlash</button>
    `;
}

async function checkout() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    if (!name || !phone) return alert("Iltimos, ism va telefoningizni kiriting!");

    const orderData = { 
        ism: name, 
        telefon: phone, 
        buyurtma: cart.map(i => `${i.name} (${i.qty} ta)`).join(', '), 
        jami: cart.reduce((s, i) => s + (i.price * i.qty), 0) + " so'm"
    };

    await fetch(URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(orderData) });
    alert("✅ Buyurtmangiz qabul qilindi!");
    cart = [];
    renderCategories();
}

function showOrderHistory() {
    const history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Orqaga</button>
        <h3>Tarix:</h3>
        ${history.map(h => `<div style="border-bottom:1px solid #ccc; padding: 5px;">${h.sana}: ${h.buyurtma} - ${h.jami}</div>`).join('')}
    `;
}