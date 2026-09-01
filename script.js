
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

        cart.push({
            name: productName,
            price: price
        });

        updateCart();

        alert(productName + " has been added to your cart!");
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

function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}

cartIcon.addEventListener('click', () => {
    cartBox.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartBox.classList.remove('active');
});
// Like / Wishlist functionality

document.querySelectorAll('.like-btn').forEach(button => {

    button.addEventListener('click', function() {

        this.classList.toggle('fas');
        this.classList.toggle('far');

        if (this.classList.contains('fas')) {
            alert('Product added to your wishlist!');
        } else {
            alert('Product removed from your wishlist!');
        }

    });

});