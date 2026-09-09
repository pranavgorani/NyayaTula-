import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Product from '../models/Product.js';
import ComplianceReport from '../models/ComplianceReport.js';
import { runComplianceCheck } from '../services/complianceEngine.js';
import { analyzePackageImage } from '../services/geminiService.js';
import { isDbConnected, jsonStore } from '../db/index.js';

const router = express.Router();
router.use(authenticate);

// Run compliance check (support both /check and /check/:productId)
const handleCheck = async (req, res) => {
  try {
    const productId = req.body.productId || req.params.productId;
    let declarations = req.body.declarations || req.body;

    let product = null;

    if (isDbConnected()) {
      if (productId) {
        product = await Product.findById(productId);
      }
      if (!product && !declarations) {
        return res.status(400).json({ message: 'Product ID or declarations required' });
      }

      if (product && !declarations) {
        declarations = product.extractedDeclarations;
      }

      const result = runComplianceCheck(declarations || {});

      let report = null;
      if (product) {
        report = new ComplianceReport({
          product: product._id,
          checkResults: result.checkResults,
          overallStatus: result.overallStatus,
          totalChecks: result.totalChecks,
          passedChecks: result.passedChecks,
          failedChecks: result.failedChecks,
          complianceScore: result.complianceScore,
          generatedBy: req.user.id
        });
        await report.save();

        product.complianceStatus = result.overallStatus;
        product.violationCount = result.failedChecks;
        await product.save();
      }

      return res.status(201).json(report || result);
    } else {
      // JSON Store fallback
      if (productId) {
        product = jsonStore.getProductById(productId);
      }

      if (product && !declarations) {
        declarations = product.extractedDeclarations;
      }

      const result = runComplianceCheck(declarations || {});

      let report = null;
      if (product) {
        report = jsonStore.createReport({
          product: product._id,
          checkResults: result.checkResults,
          overallStatus: result.overallStatus,
          totalChecks: result.totalChecks,
          passedChecks: result.passedChecks,
          failedChecks: result.failedChecks,
          complianceScore: result.complianceScore,
          generatedBy: req.user.id
        });

        jsonStore.updateProduct(product._id, {
          complianceStatus: result.overallStatus,
          violationCount: result.failedChecks
        });
      }

      return res.status(201).json(report || result);
    }
  } catch (error) {
    console.error('Error running compliance check:', error);
    res.status(500).json({ message: 'Error running compliance check', error: error.message });
  }
};

router.post('/check', handleCheck);
router.post('/check/:productId', handleCheck);

// Get report by product ID
router.get('/report/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (isDbConnected()) {
      let report = await ComplianceReport.findOne({ product: productId })
        .populate('product')
        .populate('generatedBy', 'name email');

      if (!report) {
        const product = await Product.findById(productId).populate('scannedBy', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Auto generate if missing
        const result = runComplianceCheck(product.extractedDeclarations || {});
        report = new ComplianceReport({
          product: product._id,
          checkResults: result.checkResults,
          overallStatus: result.overallStatus,
          totalChecks: result.totalChecks,
          passedChecks: result.passedChecks,
          failedChecks: result.failedChecks,
          complianceScore: result.complianceScore,
          generatedBy: req.user.id
        });
        await report.save();
        report = await ComplianceReport.findById(report._id).populate('product');
      }

      return res.json(report);
    } else {
      // JSON Store fallback
      const product = jsonStore.getProductById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      let report = jsonStore.getReportByProductId(productId);
      if (!report) {
        const result = runComplianceCheck(product.extractedDeclarations || {});
        report = jsonStore.createReport({
          product: product._id,
          checkResults: result.checkResults,
          overallStatus: result.overallStatus,
          totalChecks: result.totalChecks,
          passedChecks: result.passedChecks,
          failedChecks: result.failedChecks,
          complianceScore: result.complianceScore,
          generatedBy: req.user.id
        });
      }

      // Format response with product populated
      const fullResponse = {
        ...report,
        product,
        generatedBy: { name: 'Enforcement Officer', email: 'officer@nyayatula.gov.in' }
      };

      return res.json(fullResponse);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
});

// List all reports
router.get('/reports', async (req, res) => {
  try {
    const { page = 1, limit = 10, overallStatus } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (overallStatus) query.overallStatus = overallStatus;

      const skip = (page - 1) * limit;
      const reports = await ComplianceReport.find(query)
        .sort({ generatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('product', 'productName manufacturer');

      const total = await ComplianceReport.countDocuments(query);

      return res.json({
        reports,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      });
    } else {
      const result = jsonStore.getAllReports({ page, limit, overallStatus });
      return res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

export default router;
