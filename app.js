const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwq_yG58u9265RPnp42PO8kacRhnmZMvgTEciTpUfYvIJ09tWrQSGUSuFZtkQOrFYBAUg/exec";
const productContainer = document.getElementById("products-container");

let cart = []; 

async function loadProducts() {
    try {
        if (!productContainer) return;
        productContainer.innerHTML = "<p style='text-align:center;'>Mahsulotlar yuklanmoqda...</p>";
        
        let response = await fetch(GOOGLE_SCRIPT_URL);
        let products = await response.json();
        
        productContainer.innerHTML = ""; 
        
        if (!products || products.length === 0) {
            productContainer.innerHTML = "<p style='text-align:center;'>Hozircha do'konda mahsulot yo'q.</p>";
            return;
        }

        products.forEach(product => {
            if (parseInt(product.stock) > 0) {
                let productCard = `
                    <div class="product-card" data-category="${product.category}">
                        <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}" class="product-img">
                        <div class="product-info">
                            <h4 class="product-title">${product.name}</h4>
                            <p class="product-category" style="color: #888; font-size: 12px; margin: 4px 0;">${product.category}</p>
                            <p class="product-price" style="font-weight: bold; color: #2e7d32; margin: 4px 0;">${Number(product.price).toLocaleString()} so'm / ${product.unit}</p>
                            <p class="product-stock" style="font-size: 11px; color: #e65100; margin-bottom: 8px;">Omborda: ${product.stock} ${product.unit}</p>
                            <button class="add-to-cart-btn" style="width:100%; padding:8px; background:#2e7d32; color:white; border:none; border-radius:5px; cursor:pointer;" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Savatga qo'shish +</button>
                        </div>
                    </div>
                `;
                productContainer.insertAdjacentHTML("beforeend", productCard);
            }
        });
    } catch (error) {
        console.error("Xatolik:", error);
        productContainer.innerHTML = "<p style='text-align:center; color:red;'>Tovarlarni yuklashda xatolik yuz berdi.</p>";
    }
}

window.addToCart = function(id, name, price) {
    let item = cart.find(p => p.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: id, name: name, price: price, quantity: 1 });
    }
    alert(`${name} savatga qo'shildi!`);
};

document.addEventListener("DOMContentLoaded", loadProducts);