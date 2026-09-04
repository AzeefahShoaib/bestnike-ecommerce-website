
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

let slides = document.querySelectorAll('.home-slider');
let index = 0;

function next(){
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove("active");
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

document.querySelectorAll('.featured-image-1').forEach(image_1 =>{
    image_1.addEventListener('click', () =>{
      var src = image_1.getAttribute('src');
      document.querySelector('.big-image-1').src = src;
    });
  });

  document.querySelectorAll('.featured-image-2').forEach(image_2 =>{
    image_2.addEventListener('click', () =>{
      var src = image_2.getAttribute('src');
      document.querySelector('.big-image-2').src = src;
    });
  });

  document.querySelectorAll('.featured-image-3').forEach(image_3 =>{
    image_3.addEventListener('click', () =>{
      var src = image_3.getAttribute('src');
      document.querySelector('.big-image-3').src = src;
    });
  });
   // Shopping Cart
let cart = [];

const cartIcon = document.querySelector('#cart-icon');
const cartBox = document.querySelector('#cart-box');
const cartItems = document.querySelector('#cart-items');
const cartTotal = document.querySelector('#cart-total');
const closeCart = document.querySelector('#close-cart');

document.querySelectorAll('.products .btn').forEach(button => {

    button.addEventListener('click', function(event) {

        event.preventDefault();

        let productBox = this.closest('.box');

        let productName = productBox.querySelector('h3').innerText;
        let productPrice = productBox.querySelector('.prices').innerText;

        let price = parseFloat(productPrice.replace(/[^0-9.]/g, ''));

        const productId = parseInt(productBox.getAttribute('data-id'));

fetch('https://bestnike-ecommerce-website-production.up.railway.app/api/cart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        product_id: productId,
        quantity: 1
    })
})
.then(response => response.json())
.then(data => {

    cart.push({
        name: productName,
        price: price
    });

    updateCart();

    alert(productName + " has been added to your cart!");
})
.catch(error => {
    console.error("Add to cart failed:", error);
});
    });

});

function updateCart() {

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.innerText = '0.00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>

                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    cartTotal.innerText = total.toFixed(2);
}
async function loadCartFromBackend() {
    try {
        const response = await fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/cart');
        const items = await response.json();

        cart = items.map(item => ({
            cart_id: item.cart_id,
            name: item.name,
            price: parseFloat(item.price)
        }));

        updateCart();

        console.log("Cart loaded from database:", items);

    } catch (error) {
        console.error("Failed to load cart:", error);
    }
}

loadCartFromBackend();
 function removeFromCart(index) {

    const cartId = cart[index].cart_id;

    fetch(` https://bestnike-ecommerce-website-production.up.railway.app/api/cart/${cartId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {

        console.log("Remove response:", data);

        cart.splice(index, 1);

        updateCart();

        alert("Item removed from cart!");

    })
    .catch(error => {
        console.error("Remove from cart failed:", error);
    });
}
// Like / Wishlist functionality

 const latestProductIds = [4, 5, 6, 4, 5, 6];

document.querySelectorAll('.products .btn').forEach((button, index) => {

    button.addEventListener('click', function(event) {

        event.preventDefault();

        let productBox = this.closest('.box');

        let productName = productBox.querySelector('h3').innerText;
        let productPrice = productBox.querySelector('.prices').innerText;

        let priceMatch = productPrice.match(/\d+(\.\d+)?/);
        let price = priceMatch ? parseFloat(priceMatch[0]) : 0;

        // Database product ID
        const productId = latestProductIds[index];

        console.log("Sending Product ID:", productId);

        fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        })
        .then(response => response.json())
        .then(data => {

            console.log("Backend response:", data);

            cart.push({
                name: productName,
                price: price
            });

            updateCart();

            alert(productName + " has been added to your cart!");
        })
        .catch(error => {
            console.error("Add to cart failed:", error);
        });

    });

});

// CONNECT FRONTEND WITH BACKEND
 

async function loadProductsFromBackend() {
    try {
        const response = await fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/products');
        const products = await response.json();

        console.log("Products received from MySQL:");
        console.log(products);

        // Get only Home products
        const homeProducts = products.filter(product =>
            product.category === "Home"
        );

        const homeSlides = document.querySelectorAll('.home-slider');

        homeSlides.forEach((slide, index) => {

            if (homeProducts[index]) {

                const product = homeProducts[index];

                const productTitle = slide.querySelector('span');

                if (productTitle) {
                    productTitle.innerText = product.name;
                }

            }

        });

    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}

loadProductsFromBackend();
// CART OPEN/CLOSE FIX

const cartIconFix = document.querySelector('#cart-icon');
const cartBoxFix = document.querySelector('#cart-box');
const closeCartFix = document.querySelector('#close-cart');

if (cartIconFix && cartBoxFix) {
    cartIconFix.addEventListener('click', function () {
        cartBoxFix.classList.add('active');
        console.log("Cart opened");
    });
}

if (closeCartFix && cartBoxFix) {
    closeCartFix.addEventListener('click', function () {
        cartBoxFix.classList.remove('active');
        console.log("Cart closed");
    });
}

// WISHLIST BACKEND

const wishlistProductIds = [4, 5, 6, 4, 5, 6];

document.querySelectorAll('.like-btn').forEach((button, index) => {

    button.addEventListener('click', function(event) {

        event.preventDefault();

        const productId = wishlistProductIds[index];

        // If heart is already filled, remove from wishlist
        if (this.classList.contains('fas')) {

            fetch(` https://bestnike-ecommerce-website-production.up.railway.app/api/wishlist/${productId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {

                console.log("Wishlist remove response:", data);

                this.classList.remove('fas');
                this.classList.add('far');

                alert('Product removed from wishlist!');
            })
            .catch(error => {
                console.error("Wishlist remove failed:", error);
            });

        }

        // Otherwise add to wishlist
        else {

            fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: productId
                })
            })
            .then(response => response.json())
            .then(data => {

                console.log("Wishlist add response:", data);

                this.classList.remove('far');
                this.classList.add('fas');

                alert('Product added to wishlist!');
            })
            .catch(error => {
                console.error("Wishlist add failed:", error);
            });

        }

    });

});
// ===============================
// WISHLIST PANEL OPEN / CLOSE
// ===============================

const wishlistIcon = document.querySelector('#wishlist-icon');
const wishlistBox = document.querySelector('#wishlist-box');
const closeWishlist = document.querySelector('#close-wishlist');
const wishlistItems = document.querySelector('#wishlist-items');

wishlistIcon.addEventListener('click', async () => {

    wishlistBox.classList.add('active');

    try {
        const response = await fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/wishlist');
        const items = await response.json();

        wishlistItems.innerHTML = '';

        if (items.length === 0) {
            wishlistItems.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        items.forEach(item => {

            wishlistItems.innerHTML += `
                <div class="wishlist-item">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>$${parseFloat(item.price).toFixed(2)}</p>
                </div>
            `;
        });

        console.log("Wishlist loaded:", items);

    } catch (error) {
        console.error("Failed to load wishlist:", error);
    }

});

closeWishlist.addEventListener('click', () => {
    wishlistBox.classList.remove('active');
});
const checkoutBtn = document.querySelector('#checkout-btn');

checkoutBtn.addEventListener('click', async () => {
console.log("Checkout button clicked");
    try {
        const response = await fetch(' https://bestnike-ecommerce-website-production.up.railway.app/api/checkout', {
            method: 'POST'
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(
            `Order placed successfully!\nOrder ID: ${data.orderId}\nTotal: $${data.total}`
        );

        cart = [];
        updateCart();

        document.querySelector('#cart-box').classList.remove('active');

    } catch (error) {
        console.error("Checkout failed:", error);
        alert("Checkout failed.");
    }
});