const express = require('express');
const dotenv = require('dotenv');
const app = express();
const routes = require('./routes/index');
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
