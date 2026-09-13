import mongoose from 'mongoose';

const checkResultSchema = new mongoose.Schema({
  ruleId: String,
  ruleName: String,
  ruleReference: String,
  category: String,
  passed: Boolean,
  severity: {
    type: String,
    enum: ['critical', 'major', 'minor']
  },
  details: String
}, { _id: false });

const complianceReportSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  checkResults: [checkResultSchema],
  overallStatus: {
    type: String,
    enum: ['compliant', 'non-compliant'],
    required: true
  },
  totalChecks: Number,
  passedChecks: Number,
  failedChecks: Number,
  complianceScore: Number,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  inspectorNotes: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

const ComplianceReport = mongoose.model('ComplianceReport', complianceReportSchema);
export default ComplianceReport;
