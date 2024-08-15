// Register User
async function registerUser() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const result = document.getElementById('register-result');

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                result.innerHTML = `<p>Registration successful! Redirecting...</p>`;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                result.innerHTML = `<p>Error: ${data.error || 'Registration failed'}</p>`;
            }
        } catch (error) {
            console.error('Error registering:', error);
            result.innerHTML = `<p>Failed to register. Please try again later.</p>`;
        }
    });
}

// Login User
async function loginUser() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const result = document.getElementById('login-result');

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                result.innerHTML = `<p>Login successful! Redirecting...</p>`;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                result.innerHTML = `<p>Error: ${data.error || 'Login failed'}</p>`;
            }
        } catch (error) {
            console.error('Error logging in:', error);
            result.innerHTML = `<p>Failed to login. Please try again later.</p>`;
        }
    });
}

// Logout User
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Load User Profile
async function loadUserProfile() {
    const profileForm = document.getElementById('profile-form');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const result = document.getElementById('profile-result');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify({ id: user.id, name, email }));
                result.innerHTML = `<p>Profile updated successfully!</p>`;
            } else {
                result.innerHTML = `<p>Failed to update profile. Please try again later.</p>`;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            result.innerHTML = `<p>Failed to update profile. Please try again later.</p>`;
        }
    });
}

// Update Navbar with User Info
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navbar = document.querySelector('nav ul');

    if (user) {
        navbar.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="cart.html">Cart</a></li>
            <li><a href="user-products.html">My Products</a></li>
            <li><a href="add-product.html">Add Product</a></li>
            <li><a href="profile.html" id="profile-link">${user.name}</a></li>
            <li><a href="#" onclick="logoutUser()">Logout</a></li>
        `;
    } else {
        navbar.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
        `;
    }
}

// Load Products Page
async function loadProductsPage() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        productsList.innerHTML = products.map(product => `
            <div class="product">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <a href="product-details.html?id=${product._id}">View Details</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching products:', error);
        productsList.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
    }
}

// Load User Products Page
async function loadUserProductsPage() {
    const userProductsList = document.getElementById('user-products-list');
    if (!userProductsList) return;

    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();

        userProductsList.innerHTML = products.map(product => `
            <div class="product">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button class="edit" onclick="editProduct('${product._id}', '${product._rev}', '${product.name}', '${product.description}', ${product.price})">Edit</button>
                <button class="delete" onclick="deleteProduct('${product._id}', '${product._rev}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching user products:', error);
        userProductsList.innerHTML = `<p>Failed to load your products. Please try again later.</p>`;
    }
}

// Load Product Details Page
async function loadProductDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetails = document.getElementById('product-details');
    if (!productDetails) return;

    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const product = await response.json();

        productDetails.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button class="edit" onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetails.innerHTML = `<p>Failed to load product details. Please try again later.</p>`;
    }
}

// Load Add Product Page
function loadAddProductPage() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const result = document.getElementById('add-product-result');

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price })
            });

            if (response.ok) {
                result.innerHTML = `<p>Product added successfully!</p>`;
                form.reset();
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            result.innerHTML = `<p>Failed to add product. Please try again later.</p>`;
        }
    });
}

function editProduct(id, rev, name, description, price) {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <h2>Edit Product</h2>
        <form id="edit-product-form" class="centered-form">
            <label for="name">Product Name:</label>
            <input type="text" id="name" name="name" value="${name}" required>

            <label for="description">Description:</label>
            <input type="text" id="description" name="description" value="${description}" required>

            <label for="price">Price:</label>
            <input type="number" id="price" name="price" value="${price}" required>

            <button type="submit" class="edit">Update Product</button>
            <div id="edit-product-result"></div>
        </form>
    `;

    // Add the event listener for form submission
    const form = document.getElementById('edit-product-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedName = document.getElementById('name').value;
        const updatedDescription = document.getElementById('description').value;
        const updatedPrice = document.getElementById('price').value;
        const result = document.getElementById('edit-product-result');

        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: id, _rev: rev, name: updatedName, description: updatedDescription, price: updatedPrice })
            });

            if (response.ok) {
                result.innerHTML = `<p>Product updated successfully!</p>`;
            } else {
                throw new Error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            result.innerHTML = `<p>Failed to update product. Please try again later.</p>`;
        }
    });
}


// Delete Product
async function deleteProduct(id, rev) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}?rev=${rev}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Product deleted successfully!');
                loadUserProductsPage();  // Reload the user's products page
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again later.');
        }
    }
}

// Add to Cart
function addToCart(id, name, price) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('You need to login or register to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert(`${name} added to cart`);
}

// Load Cart Page
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length > 0) {
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <button class="remove" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `).join('');
    } else {
        cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
    }
}

// Remove from Cart
function removeFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCartPage();
}

// Automatically run functions based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('register.html')) {
        registerUser();
    } else if (window.location.pathname.includes('login.html')) {
        loginUser();
    } else if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
    } else if (window.location.pathname.includes('products.html')) {
        loadProductsPage();
    } else if (window.location.pathname.includes('product-details.html')) {
        loadProductDetailsPage();
    } else if (window.location.pathname.includes('add-product.html')) {
        loadAddProductPage();
    } if (window.location.pathname.includes('user-products.html')) {
        loadUserProductsPage();
    } else if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }

    updateNavbar();
});

console.log("Script loaded and running...");
console.log("Current Pathname:", window.location.pathname);
