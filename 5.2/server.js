const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const booksRoutes = require('./routes/book_routes.js');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/books', booksRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});