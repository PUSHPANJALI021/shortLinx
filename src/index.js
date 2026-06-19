const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/urls'));
app.use('/', require('./routes/redirect'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});
