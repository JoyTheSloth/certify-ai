import express from 'express';
import {
  createCertificate,
  createBulkCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
  verifyCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

// Certificate CRUD routes
router.post('/certificate/create', createCertificate);
router.post('/certificate/bulk', createBulkCertificates);
router.get('/certificate/:id', getCertificate);
router.put('/certificate/:id', updateCertificate);
router.delete('/certificate/:id', deleteCertificate);

// Verification route
router.get('/verify/:certificateId', verifyCertificate);

export default router;
