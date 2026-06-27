import * as storage from '../utils/storage.js';

// Create a single certificate log
export const createCertificate = (req, res) => {
  try {
    const certData = req.body;
    if (!certData.recipientName || !certData.certificateNumber) {
      return res.status(400).json({ error: 'Recipient name and Certificate Number are required fields.' });
    }
    const record = storage.addCertificate(certData);
    return res.status(201).json(record);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create certificate registry record' });
  }
};

// Create bulk certificates
export const createBulkCertificates = (req, res) => {
  try {
    const { certificates } = req.body;
    if (!certificates || !Array.isArray(certificates)) {
      return res.status(400).json({ error: 'An array of certificates is required.' });
    }
    const records = storage.addBulkCertificates(certificates);
    return res.status(201).json(records);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create bulk certificate registry records' });
  }
};

// Get single certificate
export const getCertificate = (req, res) => {
  const { id } = req.params;
  const record = storage.findCertificateById(id);
  if (!record) {
    return res.status(404).json({ error: 'Certificate record not found.' });
  }
  return res.json(record);
};

// Update certificate
export const updateCertificate = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const list = storage.readCertificates();
  
  const index = list.findIndex(c => c.id === id || c.certificateNumber === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Certificate record not found.' });
  }

  list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
  storage.writeCertificates(list);
  return res.json(list[index]);
};

// Delete certificate
export const deleteCertificate = (req, res) => {
  const { id } = req.params;
  const list = storage.readCertificates();
  const index = list.findIndex(c => c.id === id || c.certificateNumber === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Certificate record not found.' });
  }

  list.splice(index, 1);
  storage.writeCertificates(list);
  return res.json({ message: 'Certificate deleted successfully.' });
};

// Verify certificate URL checker
export const verifyCertificate = (req, res) => {
  const { certificateId } = req.params;
  const record = storage.findCertificateById(certificateId);
  
  if (!record) {
    return res.json({
      status: 'Invalid',
      certificateNumber: certificateId,
      message: 'This certificate number is not registered in our verification system.'
    });
  }

  return res.json({
    status: 'Valid',
    recipientName: record.recipientName,
    certificateNumber: record.certificateNumber,
    courseName: record.courseName,
    organizationName: record.organizationName,
    issueDate: record.issueDate,
    instructorName: record.instructorName,
    description: record.description,
    createdAt: record.createdAt
  });
};
