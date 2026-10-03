const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`TFT Tournament Manager API running on port ${PORT}`);
});