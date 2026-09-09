import express from 'express';
import Product from '../models/Product.js';
import ComplianceReport from '../models/ComplianceReport.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { isDbConnected, jsonStore } from '../db/index.js';

const router = express.Router();
router.use(authenticate);

// Create product
router.post('/', async (req, res) => {
  try {
    const rawData = req.body;
    const productName = rawData.productName || rawData.declarations?.productName || 'Scanned Packaged Commodity';
    const manufacturer = rawData.manufacturer || rawData.declarations?.manufacturerName || 'Unknown Manufacturer';
    const category = (rawData.category || rawData.declarations?.category || 'food').toLowerCase();
    const extractedDeclarations = rawData.extractedDeclarations || rawData.declarations || {};

    const productData = {
      productName,
      manufacturer,
      category,
      barcode: rawData.barcode || '',
      batchNumber: rawData.batchNumber || '',
      images: rawData.images || [],
      extractedDeclarations,
      complianceStatus: rawData.complianceStatus || 'pending',
      violationCount: rawData.violationCount || 0,
      scannedBy: req.user.id,
      inspectionLocation: rawData.inspectionLocation || 'Routine Inspection',
      notes: rawData.notes || ''
    };

    if (isDbConnected()) {
      const product = new Product(productData);
      await product.save();
      return res.status(201).json(product);
    } else {
      const user = jsonStore.findUserById(req.user.id);
      const product = jsonStore.createProduct({
        ...productData,
        scannedBy: user || { name: 'Enforcement Officer' }
      });
      return res.status(201).json(product);
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// List products
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, complianceStatus, category, search, sortBy = 'scannedAt', order = 'desc' } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (complianceStatus && complianceStatus !== 'All') query.complianceStatus = complianceStatus.toLowerCase();
      if (category && category !== 'All') query.category = category.toLowerCase();
      if (search) {
        query.$or = [
          { productName: new RegExp(search, 'i') },
          { manufacturer: new RegExp(search, 'i') }
        ];
      }

      const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
      const skip = (page - 1) * limit;

      const products = await Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .populate('scannedBy', 'name email');

      const total = await Product.countDocuments(query);

      return res.json({
        products,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      });
    } else {
      const result = jsonStore.getProducts({
        page,
        limit,
        complianceStatus: complianceStatus === 'All' ? null : complianceStatus,
        category: category === 'All' ? null : category,
        search,
        sortBy,
        order
      });
      return res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id).populate('scannedBy', 'name email');
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } else {
      const product = jsonStore.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } else {
      const product = jsonStore.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/:id', authorize('admin', 'inspector'), async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      await ComplianceReport.deleteMany({ product: req.params.id });
      return res.json({ message: 'Product deleted' });
    } else {
      const deleted = jsonStore.deleteProduct(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
