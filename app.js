const URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";

async function saveUser() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;

    if (name && phone) {
        document.getElementById('reg-page').classList.remove('active');
        document.getElementById('shop-page').classList.add('active');
        loadProducts();
    } else {
        alert("Iltimos, ism va telefon raqamni kiriting!");
    }
}

async function loadProducts() {
    const res = await fetch(URL);
    const data = await res.json();
    document.getElementById('product-list').innerHTML = data.map(p => `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
            <img src="${p.image}" style="width:50px;">
            <p>${p.name}</p>
        </div>
    `).join('');
}

function checkout() {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    Telegram.WebApp.sendData(`Buyurtma egasi: ${name}, Tel: ${phone}`);
}