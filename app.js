// URL ni albatta o'zingizniki bilan almashtiring!
const URL = "https://script.google.com/macros/s/AKfycbyrNC9NJicBXzcu6VHIFoQ4fP8g2Xwded2hvfhU0EnNvWRcDkEU6snSb6mEVrxo7DL6Tw/exec";
let allProducts = [];

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (e) {
        document.getElementById('product-list').innerHTML = "Xatolik: Ma'lumot olib bo'lmadi. URL ni tekshiring.";
    }
}

function renderCategories() {
    if (allProducts.length === 0) return;
    const cats = [...new Set(allProducts.map(p => p.Kategoriya).filter(c => c))];
    
    document.getElementById('product-list').innerHTML = `
        <h3 style="margin:20px; text-align:center;">Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button class="back-btn" onclick="showOrderHistory()">📜 Buyurtmalar tarixi</button>
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
                    <p style="margin:8px 0; font-weight:bold;">${p.Nomi}</p>
                    <p style="font-size:12px; color:gray;">${p["o'lchov birligi"]}</p>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${p["Bittasini narxi"]}</span>
                        <button class="add-btn" onclick="alert('Tanlandi: ${p.Nomi}')">+</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showOrderHistory() {
    const history = JSON.parse(localStorage.getItem('myOrders') || '[]');
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <div style="padding:10px;">
            <h3 style="text-align:center;">📋 Cheklar Tarixi</h3>
            ${history.length === 0 ? '<p style="text-align:center;">Hali buyurtma berilmagan.</p>' : 
              history.map(h => `<div style="background:white; padding:15px; margin-bottom:10px; border-radius:10px; border: 1px dashed #333;">
                <p><b>Sana:</b> ${h.sana}</p>
                <p>${h.buyurtma}</p>
              </div>`).join('')}
        </div>
    `;
}