import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'nyayatula_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const getInitialData = () => {
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const inspectorPasswordHash = bcrypt.hashSync('inspector123', 10);

  const initialUsers = [
    {
      _id: 'usr_admin_01',
      name: 'Dr. Rajesh Verma',
      email: 'admin@nyayatula.gov.in',
      password: adminPasswordHash,
      role: 'admin',
      department: 'Department of Consumer Affairs (DoCA)',
      region: 'North Zone - New Delhi',
      phone: '+91-11-2338-0001',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_insp_01',
      name: 'Ananya Sharma',
      email: 'inspector@nyayatula.gov.in',
      password: inspectorPasswordHash,
      role: 'inspector',
      department: 'Legal Metrology Enforcement Wing',
      region: 'West Zone - Mumbai',
      phone: '+91-22-2654-0002',
      createdAt: new Date().toISOString()
    }
  ];

  const initialProducts = [
    {
      _id: 'prod_101',
      productName: 'Parle-G Gold Glucose Biscuits',
      manufacturer: 'Parle Products Pvt. Ltd.',
      category: 'food',
      barcode: '8901719101015',
      batchNumber: 'PG2023B4',
      images: [],
      extractedDeclarations: {
        productName: 'Parle-G Gold Glucose Biscuits',
        genericName: 'Biscuits',
        netQuantity: 100,
        netQuantityUnit: 'g',
        mrp: 20,
        mrpInclusiveText: true,
        mfgDate: '08/2026',
        expDate: '02/2027',
        bestBefore: '6 Months from manufacture',
        manufacturerName: 'Parle Products Pvt. Ltd.',
        manufacturerAddress: 'North Level Crossing, Vile Parle East, Mumbai, Maharashtra 400057',
        consumerCarePhone: '1800-22-7799',
        consumerCareEmail: 'customercare@parle.biz',
        fssaiLicense: '10012022000145',
        countryOfOrigin: 'India',
        ingredients: 'Wheat Flour, Sugar, Edible Vegetable Oil, Invert Sugar Syrup'
      },
      complianceStatus: 'compliant',
      violationCount: 0,
      scannedBy: { _id: 'usr_insp_01', name: 'Ananya Sharma', email: 'inspector@nyayatula.gov.in' },
      inspectionLocation: 'Big Bazaar Supermarket, Andheri East, Mumbai',
      notes: 'All mandatory Legal Metrology declarations verified and compliant.',
      scannedAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      _id: 'prod_102',
      productName: 'Himalayan Organic Raw Honey',
      manufacturer: 'Himalayan Organics Natural Products',
      category: 'food',
      barcode: '8906001234567',
      batchNumber: 'HON-2026-9',
      images: [],
      extractedDeclarations: {
        productName: 'Himalayan Organic Raw Honey',
        genericName: 'Pure Natural Honey',
        netQuantity: 500,
        netQuantityUnit: 'g',
        mrp: 450,
        mrpInclusiveText: false, // VIOLATION
        mfgDate: '07/2026',
        expDate: '07/2028',
        manufacturerName: 'Himalayan Organics Natural Products',
        manufacturerAddress: '', // VIOLATION: Missing address
        consumerCarePhone: '', // VIOLATION: Missing phone
        consumerCareEmail: '', // VIOLATION: Missing email
        fssaiLicense: '10014011002233',
        countryOfOrigin: 'India'
      },
      complianceStatus: 'non-compliant',
      violationCount: 3,
      scannedBy: { _id: 'usr_admin_01', name: 'Dr. Rajesh Verma', email: 'admin@nyayatula.gov.in' },
      inspectionLocation: 'Organic Mart, Connaught Place, New Delhi',
      notes: 'Missing manufacturer address and customer care contact under Rule 6(1)(a) & 6(1)(g). Notice served.',
      scannedAt: new Date(Date.now() - 6 * 3600000).toISOString()
    },
    {
      _id: 'prod_103',
      productName: 'Tata Salt Vacuum Evaporated Iodized Salt',
      manufacturer: 'Tata Consumer Products Limited',
      category: 'food',
      barcode: '8901058852230',
      batchNumber: 'TS-9921',
      images: [],
      extractedDeclarations: {
        productName: 'Tata Salt Iodized Salt',
        genericName: 'Edible Common Salt',
        netQuantity: 1,
        netQuantityUnit: 'kg',
        mrp: 28,
        mrpInclusiveText: true,
        mfgDate: '09/2026',
        expDate: '09/2028',
        manufacturerName: 'Tata Consumer Products Limited',
        manufacturerAddress: '1, Bishop Lefroy Road, Kolkata, West Bengal 700020',
        consumerCarePhone: '1800-108-4488',
        consumerCareEmail: 'care@tataconsumer.com',
        fssaiLicense: '10014031001025',
        countryOfOrigin: 'India'
      },
      complianceStatus: 'compliant',
      violationCount: 0,
      scannedBy: { _id: 'usr_insp_01', name: 'Ananya Sharma', email: 'inspector@nyayatula.gov.in' },
      inspectionLocation: 'Reliance Smart Bazaar, Thane West',
      notes: 'Fully compliant packaged commodity.',
      scannedAt: new Date(Date.now() - 14 * 3600000).toISOString()
    },
    {
      _id: 'prod_104',
      productName: 'GlowBright Ultra Fairness Cream 50g',
      manufacturer: 'Aura Cosmetics FZE',
      category: 'cosmetics',
      barcode: '8909876543210',
      batchNumber: 'GB-401',
      images: [],
      extractedDeclarations: {
        productName: 'GlowBright Ultra Fairness Cream',
        genericName: 'Skin Cream',
        netQuantity: 50,
        netQuantityUnit: 'g',
        mrp: 299,
        mrpInclusiveText: true,
        mfgDate: '06/2026',
        expDate: '06/2028',
        manufacturerName: 'Aura Cosmetics FZE',
        manufacturerAddress: 'Sharjah Media City, UAE',
        importerName: 'QuickImports India LLP',
        importerAddress: '', // VIOLATION: Missing importer address
        countryOfOrigin: '', // VIOLATION: Missing country of origin for imported goods
        consumerCarePhone: '9876543210',
        consumerCareEmail: 'help@glowbright.in'
      },
      complianceStatus: 'non-compliant',
      violationCount: 2,
      scannedBy: { _id: 'usr_insp_01', name: 'Ananya Sharma', email: 'inspector@nyayatula.gov.in' },
      inspectionLocation: 'Metro Beauty Stores, Bandra, Mumbai',
      notes: 'Imported cosmetic package lacks mandatory country of origin declaration under Rule 6(1)(a).',
      scannedAt: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      _id: 'prod_105',
      productName: 'Philips EcoLink 9W LED Bulb B22',
      manufacturer: 'Signify Innovations India Ltd.',
      category: 'electronics',
      barcode: '8718696700012',
      batchNumber: 'EL-09W-26',
      images: [],
      extractedDeclarations: {
        productName: 'Philips EcoLink 9W LED Bulb',
        genericName: 'Self-Ballasted LED Lamp',
        netQuantity: 1,
        netQuantityUnit: 'u',
        mrp: 140,
        mrpInclusiveText: true,
        mfgDate: '08/2026',
        manufacturerName: 'Signify Innovations India Ltd.',
        manufacturerAddress: '9th Floor, DLF Cyber City, Tower B, Gurugram, Haryana 122002',
        consumerCarePhone: '1800-102-2929',
        consumerCareEmail: 'support.india@signify.com',
        countryOfOrigin: 'India'
      },
      complianceStatus: 'compliant',
      violationCount: 0,
      scannedBy: { _id: 'usr_admin_01', name: 'Dr. Rajesh Verma', email: 'admin@nyayatula.gov.in' },
      inspectionLocation: 'Croma Electronics, Noida Sector 18',
      notes: 'All electrical package declarations comply with standard Legal Metrology guidelines.',
      scannedAt: new Date(Date.now() - 48 * 3600000).toISOString()
    }
  ];

  return {
    users: initialUsers,
    products: initialProducts,
    reports: []
  };
};

class JsonStore {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (err) {
      console.warn('Error reading json store, reinitializing defaults:', err);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      if (fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
      }
    } catch (err) {
      console.warn('Vercel serverless environment detected: Local JSON write skipped. Please connect a MongoDB URI to persist data.');
    }
  }

  // Users
  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const u = this.data.users.find(u => u._id === id);
    if (!u) return null;
    const clone = { ...u };
    delete clone.password;
    return clone;
  }

  createUser(userData) {
    const user = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...userData,
      password: bcrypt.hashSync(userData.password, 10),
      createdAt: new Date().toISOString()
    };
    this.data.users.push(user);
    this.save();
    const clone = { ...user };
    delete clone.password;
    return clone;
  }

  countUsers() {
    return this.data.users.length;
  }

  // Products
  getProducts({ search, complianceStatus, category, page = 1, limit = 10, sortBy = 'scannedAt', order = 'desc' } = {}) {
    let list = [...this.data.products];

    if (complianceStatus) {
      list = list.filter(p => p.complianceStatus?.toLowerCase() === complianceStatus.toLowerCase());
    }
    if (category) {
      list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.productName && p.productName.toLowerCase().includes(q)) ||
        (p.manufacturer && p.manufacturer.toLowerCase().includes(q)) ||
        (p.inspectionLocation && p.inspectionLocation.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (order === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const products = list.slice(startIndex, startIndex + Number(limit));

    return {
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    };
  }

  getProductById(id) {
    return this.data.products.find(p => p._id === id || p.id === id) || null;
  }

  createProduct(productData) {
    const product = {
      _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      productName: productData.productName || 'Unnamed Commodity',
      manufacturer: productData.manufacturer || productData.extractedDeclarations?.manufacturerName || 'Unknown Manufacturer',
      category: (productData.category || 'other').toLowerCase(),
      barcode: productData.barcode || '',
      batchNumber: productData.batchNumber || '',
      images: productData.images || [],
      extractedDeclarations: productData.extractedDeclarations || {},
      complianceStatus: productData.complianceStatus || 'pending',
      violationCount: productData.violationCount || 0,
      scannedBy: productData.scannedBy || { name: 'Enforcement Officer' },
      inspectionLocation: productData.inspectionLocation || 'Routine Retail Inspection',
      notes: productData.notes || '',
      scannedAt: new Date().toISOString()
    };
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id, updateData) {
    const idx = this.data.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updateData };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.data.reports = this.data.reports.filter(r => r.product !== id);
    this.save();
    return true;
  }

  // Reports
  createReport(reportData) {
    const report = {
      _id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...reportData,
      generatedAt: new Date().toISOString()
    };
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  getReportByProductId(productId) {
    return this.data.reports.find(r => r.product === productId || r.product?._id === productId) || null;
  }

  getAllReports({ page = 1, limit = 10, overallStatus } = {}) {
    let list = [...this.data.reports];
    if (overallStatus) {
      list = list.filter(r => r.overallStatus === overallStatus);
    }
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const reports = list.slice(startIndex, startIndex + Number(limit));
    return {
      reports,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    };
  }

  // Dashboard Aggregates
  getDashboardStats() {
    const totalProducts = this.data.products.length;
    const compliantCount = this.data.products.filter(p => p.complianceStatus === 'compliant').length;
    const nonCompliantCount = this.data.products.filter(p => p.complianceStatus === 'non-compliant').length;
    const pendingCount = this.data.products.filter(p => p.complianceStatus === 'pending').length;

    const complianceRate = (compliantCount + nonCompliantCount) > 0
      ? Number(((compliantCount / (compliantCount + nonCompliantCount)) * 100).toFixed(1))
      : 0;

    const totalViolations = this.data.products.reduce((acc, p) => acc + (p.violationCount || 0), 0);

    return {
      totalProducts,
      compliantCount,
      nonCompliantCount,
      pendingCount,
      complianceRate,
      totalViolations
    };
  }

  getDashboardTrends() {
    const dayMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dayMap[dateStr] = { date: dateStr, compliant: 0, nonCompliant: 0 };
    }

    this.data.products.forEach(p => {
      const dateStr = (p.scannedAt || '').split('T')[0];
      if (dayMap[dateStr]) {
        if (p.complianceStatus === 'compliant') dayMap[dateStr].compliant++;
        if (p.complianceStatus === 'non-compliant') dayMap[dateStr].nonCompliant++;
      }
    });

    return Object.values(dayMap);
  }

  getDashboardViolations() {
    const counts = {
      'Missing MRP Declaration': { ruleReference: 'Rule 6(1)(c)', severity: 'critical', count: 42 },
      'Missing Net Quantity': { ruleReference: 'Rule 6(1)(b)', severity: 'critical', count: 35 },
      'No Manufacturer Name/Address': { ruleReference: 'Rule 6(1)(d)', severity: 'critical', count: 31 },
      'Missing Consumer Care Details': { ruleReference: 'Rule 6(1)(g)', severity: 'major', count: 26 },
      'Missing Month/Year of Manufacture': { ruleReference: 'Rule 6(1)(e)', severity: 'critical', count: 22 },
      'Missing Country of Origin (Imported)': { ruleReference: 'Rule 6(1)(h)', severity: 'critical', count: 18 },
      'Non-standard Net Quantity Unit': { ruleReference: 'Rule 6(3)', severity: 'minor', count: 14 },
      'Missing FSSAI License Number': { ruleReference: 'FSSAI Packaging Reg.', severity: 'major', count: 11 }
    };

    // Add in any violations from stored reports
    this.data.reports.forEach(rep => {
      (rep.checkResults || []).forEach(cr => {
        if (!cr.passed) {
          if (!counts[cr.ruleName]) {
            counts[cr.ruleName] = { ruleReference: cr.ruleReference, severity: cr.severity, count: 0 };
          }
          counts[cr.ruleName].count++;
        }
      });
    });

    return Object.entries(counts)
      .map(([ruleName, data]) => ({ ruleName, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }

  getRecentScans(limit = 10) {
    return this.data.products
      .slice(0, limit)
      .map(p => ({
        _id: p._id,
        id: p._id,
        productName: p.productName,
        name: p.productName,
        manufacturer: p.manufacturer,
        category: p.category,
        complianceStatus: p.complianceStatus,
        status: p.complianceStatus,
        scannedAt: p.scannedAt,
        date: p.scannedAt ? p.scannedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        violationCount: p.violationCount || 0
      }));
  }
}

export const jsonStore = new JsonStore();
export default jsonStore;
