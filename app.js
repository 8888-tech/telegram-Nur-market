const URL = "https://script.google.com/macros/s/AKfycbxcN4yMMi386PYjbZd7mGk8YwYzYWscaeqlF67GQRPFTa6to_L5qu8UMa2g68fkrKV56w/exec"; // Yangi URL ni yozing!
let allProducts = [], cart = [];

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (e) {
        console.error("Xatolik:", e);
    }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.Kategoriya).filter(c => c))];
    document.getElementById('product-list').innerHTML = `
        <h3 style="text-align:center; margin-bottom: 20px;">🛍️ Nur Market Kategoriyalari</h3>
        
        <div class="cat-grid">
            ${cats.map(cat => `
                <div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')">
                    <h3>📁 ${cat}</h3>
                </div>
            `).join('')}
        </div>

        <div style="margin-top: 25px;">
            <button class="menu-btn cart" onclick="showCart()">
                🛒 Savatcha <span style="background:#2e7d32; color:white; padding: 2px 8px; border-radius: 10px; font-size:12px;">${cart.length}</span>
            </button>
            <button class="menu-btn" onclick="showOrderHistory()">
                📋 Buyurtmalar tarixi
            </button>
            <a href="tel:+998993958888" class="menu-btn contact">
                📞 Biz bilan bog'lanish
            </a>
        </div>
    `;
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.Kategoriya === cat);
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3 style="margin-bottom:15px;">📁 ${cat}</h3>
        <div class="product-grid">
            ${prods.map(p => `
                <div class="product-card">
                    <div>
                       <img src="${p.Rasim}" class="product-img" onerror="this.src='https://via.placeholder.com/100'">
                        <p style="font-weight:600; color:#2c3e50;">${p.Nomi}</p>
                    </div>
                    <div>
                        <p style="color:#2e7d32; font-weight:bold; margin-bottom:8px;">${p.Narxi} so'm <span style="font-size:11px; color:#666;">/ ${p.Birlik}</span></p>
                        <button class="add-btn" onclick="addToCart('${p.Nomi.replace(/'/g, "\\'")}', ${parseFloat(p.Narxi) || 0})">+ Qo'shish</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addToCart(name, price) {
    cart.push({name, price});
    // Sahifani yangilamasdan vizual bildirishnoma yoki xabar
    alert(name + " savatga qo'shildi! 🛒");
}

function showCart() {
    let jami = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3>🛒 Savatcha</h3>
        ${cart.length === 0 ? '<p style="text-align:center; color:#666;">Savatchangiz bo\'sh</p>' : `
            <div style="background:white; padding:12px; border-radius:12px; border:1px solid #e1e4e8; margin-bottom:15px;">
                ${cart.map(i => `<div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #f1f3f5; padding-bottom:5px;"><span>${i.name}</span> <b>${i.price} so'm</b></div>`).join('')}
                <p style="text-align:right; font-size:16px; margin-top:10px;"><b>Jami: ${jami} so'm</b></p>
            </div>
            <input type="text" id="ism" placeholder="Ismingizni kiriting" required>
            <input type="tel" id="tel" placeholder="Telefon raqamingiz (+998...)" required>
            <button class="menu-btn" style="background:#4CAF50; color:white; border:none; margin-top:10px;" onclick="sendOrder(${jami})">✅ Buyurtmani tasdiqlash</button>
        `}
    `;
}

async function sendOrder(jami) {
    const ism = document.getElementById('ism').value;
    const tel = document.getElementById('tel').value;
    if(!ism || !tel) return alert("Iltimos, ism va telefon raqamni kiriting!");

    try {
        const res = await fetch(URL, { 
            method: 'POST', 
            body: JSON.stringify({ism, telefon: tel, buyurtma: cart.map(i=>i.name).join(", "), jami}) 
        });
        const result = await res.json();

        if(result.status === "success") {
            let h = JSON.parse(localStorage.getItem('myOrders') || '[]');
            h.unshift({date: new Date().toLocaleDateString(), buyurtma: cart.map(i=>i.name).join(", "), jami});
            localStorage.setItem('myOrders', JSON.stringify(h));
            cart = [];
            alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! 🎉");
            renderCategories();
        }
    } catch(e) {
        alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
}

function showOrderHistory() {
    const h = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3 style="text-align:center;">📋 Buyurtmalar tarixi</h3>
        ${h.length === 0 ? '<p style="text-align:center; color:#666;">Hali buyurtmalar yo\'q</p>' : 
          h.map(i => `
            <div style="background:white; border-left: 4px solid #4CAF50; padding:12px; margin-bottom:10px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.03); border-top:1px solid #e1e4e8; border-right:1px solid #e1e4e8; border-bottom:1px solid #e1e4e8;">
                <p style="margin:0; font-size:11px; color:#888;">📅 ${i.date}</p>
                <p style="margin:6px 0; font-weight:600; color:#333;">🛒 ${i.buyurtma}</p>
                <p style="margin:0; color:#2e7d32; font-weight:bold;">💰 Jami: ${i.jami} so'm</p>
            </div>
          `).join('')}
    `;
}

document.addEventListener('DOMContentLoaded', loadProducts);
