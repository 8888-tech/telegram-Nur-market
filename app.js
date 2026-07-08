const URL = "https://script.google.com/macros/s/AKfycbwE4nSqAdOUDm4zmgtZQYuXFxhrUmYsz8YsYY0ABNDg_Pf_NelMSxHLlR_dveY50ZwMHA/exec";
let allProducts = [], cart = [];

// 1. BU YERDAN: DOMContentLoaded ni o'chirdik, chunki mahsulotlar 
// faqat "Kirish" bosilganda yuklanishi kerak.

async function loadProducts() {
    try {
        const res = await fetch(URL);
        allProducts = await res.json();
        renderCategories();
    } catch (error) {
        console.error("Xatolik:", error);
        document.getElementById('product-list').innerHTML = "<p>Internetni tekshiring!</p>";
    }
}

// 2. KIRISH FUNKSIYASI (Siz so'ragan qism)
function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;

    if (name && phone) {
        document.getElementById('reg-page').style.display = 'none';
        document.getElementById('shop-page').style.display = 'block';
        loadProducts(); // Faqat shu yerda yuklanadi
    } else {
        alert("Iltimos, ism va telefon raqamini kiriting!");
    }
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
            <div class="product-card" style="margin: 10px 0; border: 1px solid #ccc; padding: 10px;">
                <img src="${p.image}" style="width:100px; height:100px; object-fit:cover;">
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
        <input type="text" id="order-name" placeholder="Ismingiz" required style="width:100%; padding:10px; margin:5px 0;">
        <input type="tel" id="order-phone" placeholder="Telefon raqam" required style="width:100%; padding:10px; margin:5px 0;">
        <select id="pay-type" style="width:100%; padding:10px;"><option>Naqd</option><option>Click/Payme</option></select>
        <button onclick="checkout()" style="width:100%; padding:15px; margin-top:10px; background:green; color:white; border:none;">✅ Buyurtmani tasdiqlash</button>
    `;
}

async function checkout() {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    if (!name || !phone) return alert("Ma'lumotlarni to'ldiring!");

    const orderData = { ism: name, telefon: phone, buyurtma: cart.map(i => `${i.name} (${i.qty} ta)`).join(', '), jami: cart.reduce((s, i) => s + (i.price * i.qty), 0) + " so'm", tolov: document.getElementById('pay-type').value };

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
        ${history.map(h => `<div style="border-bottom:1px solid #ccc; padding: 5px;">${h.sana}: ${h.buyurtma} - ${h.jami}</div>`).join('')}
    `;
}