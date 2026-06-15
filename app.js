const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
let cart = [];

// Registratsiya va do'konga o'tish
function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    if (name && phone) {
        // Sahifani almashtirish
        document.getElementById('reg-page').style.display = 'none';
        document.getElementById('shop-page').style.display = 'block';
        
        // Mahsulotlarni yuklashni boshlash
        loadProducts();
    } else {
        alert("Iltimos, ism va telefon raqamingizni kiriting!");
    }
}

// Mahsulotlarni Google Sheets'dan yuklash
async function loadProducts() {
    try {
        const res = await fetch(URL);
        const data = await res.json();
        const list = document.getElementById('product-list');
        
        list.innerHTML = data.map(p => `
            <div style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:8px;">
                <img src="${p.image}" style="width:100px; display:block; margin:auto;">
                <p style="text-align:center; font-weight:bold;">${p.name}</p>
            </div>
        `).join('');
    } catch (e) {
        alert("Mahsulotlar yuklanmadi. Iltimos, internetni tekshiring.");
    }
}

// Buyurtmani yuborish
function checkout() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    Telegram.WebApp.sendData(`Yangi buyurtma!\nIsm: ${name}\nTel: ${phone}`);
}