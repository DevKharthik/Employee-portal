const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// 🔐 Your actual SAP endpoint + auth
const SAP_URL = 'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zpe_forms_sd?sap-client=100';
const SAP_AUTH = {
  username: 'K901564',
  password: '06-Aug-030'
};

// 🔁 SOAP POST Utility
async function sapPost(xmlBody) {
  try {
    const { data } = await axios.post(SAP_URL, xmlBody, {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      auth: SAP_AUTH
    });
    return data;
  } catch (error) {
    throw new Error(`SAP Post Failed: ${error.message}`);
  }
}

// 📄 POST route to get payslip
router.post('/form', async (req, res) => {
  const { employeeId, month, year } = req.body;

  if (!employeeId || !month || !year) {
    return res.status(400).json({ success: false, message: 'Missing required fields: employeeId, month, year' });
  }

  const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZEMPLOYEE_FORM_FM>
          <PERNR>${employeeId}</PERNR>
          <MONTH>${month}</MONTH>
          <YEAR>${year}</YEAR>
        </urn:ZEMPLOYEE_FORM_FM>
      </soapenv:Body>
    </soapenv:Envelope>`;

  try {
    const response = await sapPost(soapBody);

    xml2js.parseString(response, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'XML Parsing Error', error: err });

      try {
        const body = result['soapenv:Envelope']?.['soapenv:Body'] || result['soap-env:Envelope']?.['soap-env:Body'];
        const payslipResponse = body?.['urn:ZEMPLOYEE_FORM_FMResponse'] || Object.values(body)[0];

        const pdfBase64 = payslipResponse?.PAYSLIP_PDF || null;

        if (!pdfBase64) {
          return res.status(404).json({ success: false, message: 'Payslip PDF not found in response' });
        }

        res.json({
          success: true,
          pdf_base64: pdfBase64,
          filename: `Payslip_${month}_${year}.pdf`
        });
      } catch (e) {
        res.status(500).json({ message: 'Unexpected SAP response structure', error: e.message });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'SAP Request Failed', error: err.message });
  }
});

module.exports = router;
