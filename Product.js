import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  manufacturer: String,
  category: {
    type: String,
    enum: ['food', 'cosmetics', 'electronics', 'household', 'pharma', 'textile', 'other'],
    default: 'other'
  },
  barcode: String,
  batchNumber: String,
  images: [String],
  extractedDeclarations: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  complianceStatus: {
    type: String,
    enum: ['compliant', 'non-compliant', 'pending'],
    default: 'pending'
  },
  violationCount: {
    type: Number,
    default: 0
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  inspectionLocation: String,
  notes: String,
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

productSchema.index({ complianceStatus: 1 });
productSchema.index({ scannedAt: -1 });
productSchema.index({ scannedBy: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
