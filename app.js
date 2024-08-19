const express = require('express');
const connectDB = require('./config/db');
const agentRoutes = require('./routes/agentRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const policyRoutes = require('./routes/policyRoutes');
const policyCategoryRoutes = require('./routes/policyCategoryRoutes');
const policyCarrierRoutes = require('./routes/policyCarrierRoutes');
const cpuRoutes = require('./routes/cpuRoutes');
const fileUpload = require('express-fileupload');
const schedulerRoutes = require('./services/scheduler');
const dataUploadRoutes = require('./routes/dataUploadRoutes')

const app = express();
app.use(fileUpload());
require('dotenv').config();

connectDB();

app.use(express.json());

app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/policy-categories', policyCategoryRoutes);
app.use('/api/policy-carriers', policyCarrierRoutes);
app.use('/api/cpu', cpuRoutes);
app.use('/api', schedulerRoutes);
app.use('/api', dataUploadRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
