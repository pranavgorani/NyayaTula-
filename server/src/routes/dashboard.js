import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Product from '../models/Product.js';
import ComplianceReport from '../models/ComplianceReport.js';
import { isDbConnected, jsonStore } from '../db/index.js';

const router = express.Router();
router.use(authenticate);

// Aggregated statistics
router.get('/stats', async (req, res) => {
  try {
    if (isDbConnected()) {
      const totalProducts = await Product.countDocuments();
      const compliantCount = await Product.countDocuments({ complianceStatus: 'compliant' });
      const nonCompliantCount = await Product.countDocuments({ complianceStatus: 'non-compliant' });
      const pendingCount = await Product.countDocuments({ complianceStatus: 'pending' });

      const complianceRate = (compliantCount + nonCompliantCount) > 0
        ? (compliantCount / (compliantCount + nonCompliantCount)) * 100
        : 0;

      const result = await Product.aggregate([
        { $group: { _id: null, totalViolations: { $sum: "$violationCount" } } }
      ]);
      const totalViolations = result.length > 0 ? result[0].totalViolations : 0;

      return res.json({
        totalProducts,
        totalScans: totalProducts,
        compliantCount,
        nonCompliantCount,
        pendingCount,
        pendingReview: pendingCount,
        complianceRate: Number(complianceRate.toFixed(1)),
        totalViolations,
        violationsFound: totalViolations
      });
    } else {
      const stats = jsonStore.getDashboardStats();
      return res.json({
        ...stats,
        totalScans: stats.totalProducts,
        pendingReview: stats.pendingCount,
        violationsFound: stats.totalViolations
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Trends over 30 days
router.get('/trends', async (req, res) => {
  try {
    if (isDbConnected()) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const trends = await Product.aggregate([
        { $match: { scannedAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$scannedAt" } },
            compliant: { $sum: { $cond: [{ $eq: ["$complianceStatus", "compliant"] }, 1, 0] } },
            nonCompliant: { $sum: { $cond: [{ $eq: ["$complianceStatus", "non-compliant"] }, 1, 0] } }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", compliant: 1, nonCompliant: 1, _id: 0 } }
      ]);

      return res.json(trends);
    } else {
      const trends = jsonStore.getDashboardTrends();
      return res.json(trends);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trends', error: error.message });
  }
});

// Top violations
router.get('/violations', async (req, res) => {
  try {
    if (isDbConnected()) {
      const violations = await ComplianceReport.aggregate([
        { $unwind: "$checkResults" },
        { $match: { "checkResults.passed": false } },
        {
          $group: {
            _id: "$checkResults.ruleName",
            ruleReference: { $first: "$checkResults.ruleReference" },
            severity: { $first: "$checkResults.severity" },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { ruleName: "$_id", name: "$_id", ruleReference: 1, severity: 1, count: 1, _id: 0 } }
      ]);

      return res.json(violations.length > 0 ? violations : jsonStore.getDashboardViolations());
    } else {
      const violations = jsonStore.getDashboardViolations().map(v => ({
        ...v,
        name: v.ruleName
      }));
      return res.json(violations);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching violations', error: error.message });
  }
});

// Recent scans
router.get('/recent', async (req, res) => {
  try {
    if (isDbConnected()) {
      const recent = await Product.find()
        .sort({ scannedAt: -1 })
        .limit(10)
        .select('productName manufacturer category complianceStatus scannedAt violationCount');

      const mapped = recent.map(p => ({
        _id: p._id,
        id: p._id,
        productName: p.productName,
        name: p.productName,
        manufacturer: p.manufacturer,
        category: p.category,
        complianceStatus: p.complianceStatus,
        status: p.complianceStatus,
        scannedAt: p.scannedAt,
        date: p.scannedAt ? p.scannedAt.toISOString().split('T')[0] : '',
        violationCount: p.violationCount
      }));

      return res.json(mapped);
    } else {
      const recent = jsonStore.getRecentScans(10);
      return res.json(recent);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent products', error: error.message });
  }
});

export default router;
