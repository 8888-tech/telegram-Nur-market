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
            <div style="border:1px solid #ccc; padding:10px; margin:10px 0; display:flex; align-items:center; gap:10px;">
                <img src="${p.image}" style="width:80px; height:80px; object-fit:cover; border-radius:5px;">
                <div>
                    <p style="margin:0;"><b>${p.name}</b></p>
                    <p style="margin:0; font-size: 14px;">${p.price} so'm / ${p.unit}</p>
                    <button onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.unit}')" style="margin-top:5px;">🛒 Qo'shish</button>
                </div>
            </div>
        `).join('')}
    `;
}

function addToCart(name, price, unit) {
    let item = cart.find(i => i.name === name);
    item ? item.qty++ : cart.push({ name, price, unit, qty: 1 });
    alert(name + " savatga qo'shildi!");
}

function showCart() {
    let total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('product-list').innerHTML = `
        <button onclick="renderCategories()" class="back-btn">⬅️ Do'konga qaytish</button>
        <h3>Savat:</h3>
        ${cart.map(i => `<p>${i.name} - ${i.qty} ${i.unit}</p>`).join('')}
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
        buyurtma: cart.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', '), 
        jami: cart.reduce((s, i) => s + (i.price * i.qty), 0) + " so'm"
    };

    await fetch(URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(orderData) });
    
    // Tarixni saqlash
    let history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    history.push({...orderData, sana: new Date().toLocaleString()});
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
        ${history.length === 0 ? '<p>Hozircha buyurtmalar yo\'q.</p>' : 
        history.map(h => `<div style="border-bottom:1px solid #ccc; padding: 10px;">
            <small>${h.sana}</small><br><b>${h.buyurtma}</b><br>Jami: ${h.jami}
        </div>`).join('')}
    `;
}