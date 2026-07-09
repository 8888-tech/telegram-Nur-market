const URL = "https://script.google.com/macros/s/AKfycbzmEk3A6MyOnZaAijzEwIvlUEx77jn5QrWl972xCq1tM2UFv-9wUgo2bpSAB-lcpF3fHQ/exec"; // Yangi URL ni shu yerga qo'ying
let allProducts = [], cart = [];

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
    const cats = [...new Set(allProducts.map(p => p.Kategoriya).filter(c => c))];
    document.getElementById('product-list').innerHTML = `
        <h3 style="text-align:center;">Kategoriyalar</h3>
        ${cats.map(cat => `<div class="cat-card" onclick="showProds('${cat.replace(/'/g, "\\'")}')"><h3>${cat}</h3></div>`).join('')}
        <button class="back-btn" onclick="showCart()">🛒 Savatcha (${cart.length})</button>
        <p style="text-align:center; margin-top:20px;">📞 Aloqa: +998 90 123 45 67</p>
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
                    <p style="font-weight:bold;">${p.Nomi}</p>
                    <p>${p.Narxi} / ${p.Birlik}</p>
                    <button class="add-btn" onclick="addToCart('${p.Nomi.replace(/'/g, "\\'")}')">+</button>
                </div>
            `).join('')}
        </div>
    `;
}

function addToCart(name) {
    cart.push(name);
    alert(name + " savatchaga qo'shildi!");
}

function showCart() {
    document.getElementById('product-list').innerHTML = `
        <button class="back-btn" onclick="renderCategories()">⬅ Orqaga</button>
        <h3>🛒 Savatcha:</h3>
        <ul>${cart.map(item => `<li>${item}</li>`).join('')}</ul>
        <button class="back-btn" style="background:#4CAF50; color:white;" onclick="alert('Buyurtma yuborildi!')">Buyurtmani tasdiqlash</button>
    `;
}

document.addEventListener('DOMContentLoaded', loadProducts);