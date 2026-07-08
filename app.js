const URL = "https://script.google.com/macros/s/AKfycbyrNC9NJicBXzcu6VHIFoQ4fP8g2Xwded2hvfhU0EnNvWRcDkEU6snSb6mEVrxo7DL6Tw/execc";
let allProducts = [], cart = [];

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (e) {
        document.getElementById('product-list').innerHTML = "Xatolik yuz berdi.";
    }
}

function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.Kategoriya))];
    document.getElementById('product-list').innerHTML = `
        <h3 style="margin:20px;">Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button class="back-btn" onclick="showOrderHistory()">📜 Buyurtmalar tarixi</button>
    `;
}

function showProds(cat) {
    const prods = allProducts.filter(p => p.Kategoriya === cat);
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅️ Orqaga</button>
        <div class="product-grid">
            ${prods.map(p => `
                <div class="product-card">
                    <img src="${p.Rasim}">
                    <p style="margin:8px 0; font-weight:bold;">${p.Nomi}</p>
                    <p style="font-size:11px; color:gray;">${p["o'lchov birligi"]}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:13px;">${p["Bittasini narxi"]}</span>
                        <button class="add-btn" onclick="addToCart('${p.Nomi.replace(/'/g, "\\'")}', '${p["Bittasini narxi"]}', '${p["o'lchov birligi"]}')">+</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addToCart(name, price, unit) {
    cart.push({ name, price, unit });
    alert(name + " savatga qo'shildi!");
}

function showOrderHistory() {
    const history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅️ Orqaga</button>
        <div style="padding:10px;">
            <h3>Tarix:</h3>
            ${history.map(h => `<div style="border-bottom:1px solid #ccc; padding:10px;">${h.sana} - ${h.buyurtma}</div>`).join('')}
        </div>
    `;
}