const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let allProducts = [];
let cart = [];

// Ma'lumotlarni yuklash (avtomatik ishga tushadi)
async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
    } catch (e) { console.error("Xatolik:", e); }
}
loadProducts(); // Bot ochilganda yuklaydi

// Kategoriyani bosganda mahsulotlarni ko'rsatish
function showProds(catName) {
    const prods = allProducts.filter(p => p.category === catName);
    const list = document.getElementById('product-list');
    
    list.innerHTML = `<button onclick="renderCategories()" style="background:#888; width:100%; padding:10px; margin-bottom:10px;">⬅️ Orqaga</button>`;
    
    prods.forEach(p => {
        list.innerHTML += `
            <div class="product-card">
                <p><b>${p.name}</b> - ${p.price} so'm</p>
                <button onclick="addToCart('${p.name}', ${p.price})" style="background:#27ae60;">🛒 Savatga</button>
            </div>
        `;
    });
}

// Savatga qo'shish
function addToCart(name, price) {
    cart.push({ name, price });
    const btn = document.getElementById('cart-btn');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    btn.innerText = `🛒 Zakazni yuborish (${cart.length} ta - ${total} so'm)`;
    alert(name + " savatga qo'shildi!");
}

// Zakaz yuborish
function checkout() {
    if (cart.length === 0) return alert("Savat bo'sh!");
    const items = cart.map(i => i.name).join(', ');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    Telegram.WebApp.sendData(`Buyurtma:\n${items}\nJami: ${total} so'm`);
}

// Kategoriyalarni qayta ko'rsatish
function renderCategories() {
    const cats = [...new Set(allProducts.map(p => p.category))];
    document.getElementById('product-list').innerHTML = cats.map(cat => `
        <div class="cat-card" onclick="showProds('${cat}')">
            <h3>${cat}</h3>
        </div>
    `).join('');
}