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

async function loadUserProductsPage() {
    console.log("Loading User Products Page..."); 
    const userProductsList = document.getElementById('user-products-list');
    if (!userProductsList) return;

    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        console.log("User Products:", products);  // Debugging line

        userProductsList.innerHTML = products.map(product => `
            <div class="product">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button onclick="editProduct('${product._id}', '${product._rev}', '${product.name}', '${product.description}', ${product.price})">Edit</button>
                <button onclick="deleteProduct('${product._id}', '${product._rev}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching user products:', error);
        userProductsList.innerHTML = `<p>Failed to load your products. Please try again later.</p>`;
    }
}

async function loadProductDetailsPage() {
    console.log("Loading Product Details Page...");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    console.log("Product ID:", productId);
    const productDetails = document.getElementById('product-details');
    if (!productDetails) return;

    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        console.log("Fetch Response:", response); // Log the response

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const product = await response.json();
        console.log("Product Details:", product);

        productDetails.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
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
    // You can update the content of the page dynamically to edit the product
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <h2>Edit Product</h2>
        <form id="edit-product-form">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" value="${name}" required><br>
            <label for="description">Description:</label><br>
            <input type="text" id="description" name="description" value="${description}" required><br>
            <label for="price">Price:</label><br>
            <input type="number" id="price" name="price" value="${price}" required><br><br>
            <button type="submit">Update Product</button>
        </form>
        <div id="edit-product-result"></div>
    `;

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
                loadUserProductsPage(); // Reload the user's products page
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
                <button onclick="removeFromCart('${item.id}')">Remove</button>
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

console.log("Script loaded and running...");
console.log("Current Pathname:", window.location.pathname);

// Load the correct page based on the URL
if (window.location.pathname.includes('products.html')) {
    console.log("Products page detected"); // Add this line
    loadProductsPage();
} else if (window.location.pathname.includes('product-details.html')) {
    console.log("Product details page detected"); // Add this line
    loadProductDetailsPage();
} else if (window.location.pathname.includes('add-product.html')) {
    console.log("Add product page detected"); // Add this line
    loadAddProductPage();
} if (window.location.pathname.includes('user-products.html')) {
    console.log("User products page detected"); // Add this line
    loadUserProductsPage();
} else if (window.location.pathname.includes('cart.html')) {
    console.log("Cart page detected"); // Add this line
    loadCartPage();
}