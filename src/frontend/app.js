document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        displayProducts();
    } else if (window.location.pathname.includes('product.html')) {
        displayProductDetails();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    } else if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    }
});

const mockData = {
    products: [
        { id: 1, name: "Product 1", description: "Description 1", price: 10, image: "placeholder.jpg" },
        { id: 2, name: "Product 2", description: "Description 2", price: 20, image: "placeholder.jpg" },
        { id: 3, name: "Product 3", description: "Description 3", price: 30, image: "placeholder.jpg" }
    ]
};

function displayProducts() {
    const productCatalog = document.getElementById('product-catalog');
    productCatalog.innerHTML = '';
    mockData.products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <a href="product.html?id=${product.id}">View Details</a>
        `;
        productCatalog.appendChild(productItem);
    });
}

function displayProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = mockData.products.find(p => p.id == productId);
    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
}

function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsSection = document.getElementById('cart-items');
    cartItemsSection.innerHTML = '';
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h2>${item.name}</h2>
            <p>$${item.price}</p>
        `;
        cartItemsSection.appendChild(cartItem);
    });
}

function displayUserProfile() {
    const userProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        orderHistory: [
            { orderId: 1, product: 'Product 1', date: '2023-01-01' },
            { orderId: 2, product: 'Product 2', date: '2023-02-01' }
        ]
    };
    const userProfileSection = document.getElementById('user-profile');
    userProfileSection.innerHTML = `
        <h2>${userProfile.name}</h2>
        <p>${userProfile.email}</p>
        <h3>Order History</h3>
        <ul>
            ${userProfile.orderHistory.map(order => `<li>${order.product} - ${order.date}</li>`).join('')}
        </ul>
    `;
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = mockData.products.find(p => p.id == productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
}

function proceedToCheckout() {
    window.location.href = 'checkout.html';
}

function completeCheckout(event) {
    event.preventDefault();
    localStorage.removeItem('cart');
    alert('Checkout complete');
    window.location.href = 'index.html';
}

function searchProducts() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = mockData.products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );
    const productCatalog = document.getElementById('product-catalog');
    productCatalog.innerHTML = '';
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <a href="product.html?id=${product.id}">View Details</a>
        `;
        productCatalog.appendChild(productItem);
    });
}
