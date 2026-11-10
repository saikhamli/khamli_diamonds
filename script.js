const TELEGRAM_BOT_TOKEN = '8958634392:AAEcaXSd8ZObPjRmu5QFW2JdWTqULznVYv8';
const TELEGRAM_CHAT_ID = '5740907211';

const products = [
    { id: 1, name: "Eternal Round Solitaire (စိန်လုံးတစ်ပွင့်လက်စွပ်)", category: "Round", price: 4200, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Aura Oval Halo Ring (ဘဲဥပုံစိန်လက်စွပ်)", category: "Oval", price: 5800, img: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Imperial Emerald Cut (စတုဂံပုံစိန်လက်စွပ်)", category: "Emerald", price: 7500, img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Classic Round Studs (စိန်နားကပ်)", category: "Round", price: 2900, img: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "Midnight Oval Pendant (ဘဲဥပုံစိန်ဆွဲသီး)", category: "Oval", price: 3400, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "Majestic Emerald Band (စတုဂံပုံစိန်တန်းလက်စွပ်)", category: "Emerald", price: 9200, img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" }
];

let cart = [];

const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');

function displayProducts(categoryFilter = "all") {
    productGrid.innerHTML = "";
    const filtered = categoryFilter === "all" ? products : products.filter(p => p.category === categoryFilter);
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price.toLocaleString()}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">ခြင်းတောင်းထဲထည့်မည်</button>
        `;
        productGrid.appendChild(card);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        displayProducts(e.target.dataset.filter);
    });
});

cartIcon.addEventListener('click', () => cartSidebar.classList.add('open'));
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    document.getElementById('kpay-container').style.display = "none";
});

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCart();
    cartSidebar.classList.add('open');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    cartItemsContainer.innerHTML = "";
    document.getElementById('kpay-container').style.display = "none";
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="product-price">$${item.price.toLocaleString()}</div>
            </div>
            <span class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></span>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartCountElement.innerText = cart.length;
    const totalCost = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.innerText = totalCost.toLocaleString(undefined, {minimumFractionDigits: 2});
}

function showKpayQR() {
    const kpayContainer = document.getElementById('kpay-container');
    if (cart.length > 0) {
        kpayContainer.style.display = "block";
    } else {
        alert("ခြင်းတောင်းထဲမှာ ပစ္စည်းမရှိသေးပါခင်ဗျာ။");
    }
}

function uploadSlip() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const fileInput = document.getElementById('slip-file');
    const submitBtn = document.getElementById('submit-btn');

    if (!name || !phone || fileInput.files.length === 0) {
        alert("ကျေးဇူးပြု၍ နာမည်၊ ဖုန်းနံပါတ် နှင့် ငွေလွှဲပြေစာ အားလုံးကို ပြည့်စုံစွာ ဖြည့်စွက်ပေးပါရန်။");
        return;
    }

    submitBtn.innerText = "ပို့ဆောင်နေပါသည်...";
    submitBtn.disabled = true;

    let itemsList = cart.map(item => `- ${item.name} ($${item.price.toLocaleString()})`).join('\n');
    const totalCost = cart.reduce((sum, item) => sum + item.price, 0);

    const message = `💎 အော်ဒါအသစ် ရရှိပါပြီ 💎\n\n👤 ဝယ်သူနာမည်: ${name}\n📞 ဖုန်းနံပါတ်: ${phone}\n\n📦 ဝယ်ယူသည့်ပစ္စည်းများ:\n${itemsList}\n\n💰 စုစုပေါင်းကျသင့်ငွေ: $${totalCost.toLocaleString()}`;

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', fileInput.files[0]);
    formData.append('caption', message);

    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok) {
            alert("လူကြီးမင်း၏ အော်ဒါနှင့် ငွေလွှဲပြေစာ ပေးပို့မှု အောင်မြင်ပါသည်! စစ်ဆေးပြီးပါက အမြန်ဆုံး ဆက်သွယ်ပေးပါမည်။");
            cart = [];
            updateCart();
            cartSidebar.classList.remove('open');
        } else {
            alert("Telegram သို့ ပို့၍မရပါ။ Botဆီတွင် Start နှိပ်ထားခြင်း ရှိမရှိ ပြန်စစ်ပါ။");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("ပို့ဆောင်မှု မအောင်မြင်ပါ။ အင်တာနက်လိုင်း ပြန်စစ်ပေးပါ။");
    })
    .finally(() => {
        submitBtn.innerText = "အချက်အလက်နှင့် ပြေစာပေးပို့မည်";
        submitBtn.disabled = false;
    });
}

// ====== ဖုန်းများတွင် လက်ဖြင့် ဆွဲပိတ် (Swipe to Close) နိုင်ရန် ပြင်ဆင်ခြင်း ======
let touchStartX = 0;
let touchEndX = 0;

cartSidebar.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

cartSidebar.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    if (touchEndX - touchStartX > 50) { 
        cartSidebar.classList.remove('open');
        document.getElementById('kpay-container').style.display = "none";
    }
}

displayProducts();