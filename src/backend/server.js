const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

