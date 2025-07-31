// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');

// Import route files
const employeeLoginRoute = require('./EmployeeLogin');
const employeeProfileRoute = require('./EmployeeProfile');
const employeeLeaveRoute = require('./EmployeeLeave');
const employeePayslipRoute = require('./Employeepayslip');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Route mounting
app.use('/api/employee',employeeLoginRoute );  // if you move login to route file
app.use('/api/employee', employeeProfileRoute);
app.use('/api/employee', employeeLeaveRoute);
app.use('/api/employee', employeePayslipRoute);
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});