document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        fetchProducts();
    } else if (window.location.pathname.includes('product.html')) {
        fetchProductDetails();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    } else if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    } else if (window.location.pathname.includes('checkout.html')) {
        // No specific action needed for checkout.html load
    }
});

// Fetch all products from the server
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products on the homepage
function displayProducts(products) {
    const productCatalog = document.getElementById('product-catalog');
    productCatalog.innerHTML = '';

    if (!Array.isArray(products) || products.length === 0) {
        productCatalog.innerHTML = '<p>No products available.</p>';
        return;
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
            <a href="product.html?id=${product._id}">View Details</a>
        `;
        productCatalog.appendChild(productItem);
    });
}

// Fetch details for a specific product by ID
async function fetchProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        console.error('Product ID is missing');
        document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
            const product = await response.json();
            displayProductDetails(product);
        } else {
            console.error('Product not found');
            document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Display product details on the product details page
function displayProductDetails(product) {
    const productDetails = document.getElementById('product-details');
    if (!productDetails) return;

    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <button onclick="addToCart('${product._id}')">Add to Cart</button>
    `;
}

// Add a product to the cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    fetch(`/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart');
        })
        .catch(error => console.error('Error adding product to cart:', error));
}

// Display items in the cart
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsSection = document.getElementById('cart-items');
    cartItemsSection.innerHTML = '';

    if (cartItems.length === 0) {
        cartItemsSection.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h2>${item.name}</h2>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsSection.appendChild(cartItem);
    });
}

// Remove an item from the cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Display user profile and order history
function displayUserProfile() {
    const userProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        orderHistory: JSON.parse(localStorage.getItem('cart')) || [] // Mockup order history
    };

    const userProfileSection = document.getElementById('user-profile');
    userProfileSection.innerHTML = `
        <h2>${userProfile.name}</h2>
        <p>${userProfile.email}</p>
        <h3>Order History</h3>
        <ul>
            ${userProfile.orderHistory.map(order => `<li>${order.name} - $${order.price.toFixed(2)}</li>`).join('')}
        </ul>
    `;
}

// Function to proceed to checkout
function proceedToCheckout() {
    window.location.href = 'checkout.html';
}

// Complete the checkout process
function completeCheckout(event) {
    event.preventDefault();
    localStorage.removeItem('cart');
    alert('Checkout complete');
    window.location.href = 'index.html';
}

// Search products based on user input
function searchProducts() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );
            displayProducts(filteredProducts);
        })
        .catch(error => console.error('Error searching products:', error));
}
