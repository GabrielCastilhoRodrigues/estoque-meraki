require('dotenv').config();
const express = require('express');
const app = express();
const sync = require('./config/sync');

//Rotas das operações
const productTypeRoutes = require('./routes/productTypeRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const itemPurchaseRoutes = require('./routes/itemPurchaseRoutes');
const personRoutes = require('./routes/personRoutes');
const saleRoutes = require('./routes/saleRoutes');

app.use(express.json());

app.use('/product-type', productTypeRoutes);
app.use('/product', productRoutes);
app.use('/stock', stockRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/item-purchase', itemPurchaseRoutes);
app.use('/person', personRoutes);
app.use('/sale', saleRoutes)

app.listen(process.env.PORT, () => {});