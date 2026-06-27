import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'certificates.json');

// Initialize database
export const initDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

// Read all certificates
export const readCertificates = () => {
  try {
    initDb();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading certificate registry:', err);
    return [];
  }
};

// Write certificates
export const writeCertificates = (certificates) => {
  try {
    initDb();
    fs.writeFileSync(DATA_FILE, JSON.stringify(certificates, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to certificate registry:', err);
    return false;
  }
};

// Find by Certificate ID (or certificateNumber)
export const findCertificateById = (id) => {
  const list = readCertificates();
  return list.find(c => c.certificateNumber === id || c.id === id);
};

// Add single certificate
export const addCertificate = (cert) => {
  const list = readCertificates();
  
  // Deduplicate using certificate number
  const index = list.findIndex(c => c.certificateNumber === cert.certificateNumber);
  
  const newRecord = {
    ...cert,
    id: cert.id || `CERT-${Date.now()}`,
    createdAt: cert.createdAt || new Date().toISOString()
  };

  if (index !== -1) {
    list[index] = { ...list[index], ...newRecord };
  } else {
    list.push(newRecord);
  }

  writeCertificates(list);
  return newRecord;
};

// Add bulk certificates
export const addBulkCertificates = (certs) => {
  const list = readCertificates();
  const added = [];

  certs.forEach(cert => {
    const newRecord = {
      ...cert,
      id: cert.id || `CERT-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    
    // Deduplicate
    const index = list.findIndex(c => c.certificateNumber === cert.certificateNumber);
    if (index !== -1) {
      list[index] = { ...list[index], ...newRecord };
    } else {
      list.push(newRecord);
    }
    added.push(newRecord);
  });

  writeCertificates(list);
  return added;
};
