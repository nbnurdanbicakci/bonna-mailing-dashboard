// Minimal static file server for Railway deployment
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the project root (excluding server.js, package.json, etc.)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.static(__dirname, { maxAge: '1h', index: 'index.html' }));

app.listen(PORT, () => console.log(`Bonna Mailing Dashboard running on port ${PORT}`));
