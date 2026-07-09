// URL ni albatta o'zingizning yangi Web App manzilingiz bilan almashtiring!
const URL = "https://script.google.com/macros/s/AKfycbxmR4RGx4Hjaj5NNrep03vSIa9jXzVNzDvSRNR3xXkFPGihonqSXZSTqXz4FzXvOiQf2A/exec"; 
let allProducts = [], cart = [];

document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (e) {
        document.getElementById('product-list').innerHTML = "Xatolik: Ma'lumot olib bo'lmadi.";
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
                    <p style="font-size:12px;">${p.Narxi} so'm / ${p.Birlik}</p>
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
        <ul style="text-align:left;">${cart.map(item => `<li>${item}</li>`).join('')}</ul>
        <button class="back-btn" style="background:#4CAF50; color:white; width: 90%;" onclick="sendOrder()">✅ Buyurtmani tasdiqlash</button>
    `;
}

async function sendOrder() {
    if(cart.length === 0) return alert("Savatcha bo'sh!");
    
    const orderData = {
        ism: "Mijoz", 
        telefon: "+998900000000", 
        buyurtma: cart.join(", ")
    };

    try {
        const res = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        const result = await res.json();
        if(result.status === "success") {
            alert("Buyurtmangiz qabul qilindi!");
            cart = [];
            renderCategories();
        } else {
            alert("Xatolik yuz berdi.");
        }
    } catch(e) {
        alert("Server bilan bog'lanib bo'lmadi.");
    }
}