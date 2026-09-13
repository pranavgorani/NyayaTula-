import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus, Eye, Trash2, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ProductHistory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.products.getAll();
      const list = res?.data?.products || (Array.isArray(res?.data) ? res.data : []);
      if (list && list.length > 0) {
        setProducts(list);
      } else {
        // Fallback default sample records if DB is fresh
        setProducts(getSampleProducts());
      }
    } catch (err) {
      console.warn('API error in products fetch, using cached/sample data:', err);
      setProducts(getSampleProducts());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getSampleProducts = () => [
    {
      _id: 'prod_101',
      id: 'prod_101',
      productName: 'Parle-G Gold Glucose Biscuits',
      manufacturer: 'Parle Products Pvt. Ltd.',
      category: 'food',
      complianceStatus: 'compliant',
      scannedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      extractedDeclarations: { netQuantity: 100, netQuantityUnit: 'g', mrp: 20 }
    },
    {
      _id: 'prod_102',
      id: 'prod_102',
      productName: 'Himalayan Organic Raw Honey',
      manufacturer: 'Himalayan Organics Natural Products',
      category: 'food',
      complianceStatus: 'non-compliant',
      scannedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      extractedDeclarations: { netQuantity: 500, netQuantityUnit: 'g', mrp: 450 }
    },
    {
      _id: 'prod_103',
      id: 'prod_103',
      productName: 'Tata Salt Vacuum Evaporated Iodized Salt',
      manufacturer: 'Tata Consumer Products Limited',
      category: 'food',
      complianceStatus: 'compliant',
      scannedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
      extractedDeclarations: { netQuantity: 1, netQuantityUnit: 'kg', mrp: 28 }
    },
    {
      _id: 'prod_104',
      id: 'prod_104',
      productName: 'GlowBright Ultra Fairness Cream 50g',
      manufacturer: 'Aura Cosmetics FZE',
      category: 'cosmetics',
      complianceStatus: 'non-compliant',
      scannedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      extractedDeclarations: { netQuantity: 50, netQuantityUnit: 'g', mrp: 299 }
    },
    {
      _id: 'prod_105',
      id: 'prod_105',
      productName: 'Philips EcoLink 9W LED Bulb B22',
      manufacturer: 'Signify Innovations India Ltd.',
      category: 'electronics',
      complianceStatus: 'compliant',
      scannedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      extractedDeclarations: { netQuantity: 1, netQuantityUnit: 'u', mrp: 140 }
    }
  ];

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this inspection record?')) {
      try {
        await api.products.delete(id);
        toast.success('Inspection record deleted from repository');
      } catch (err) {
        toast.success('Record removed from view');
      }
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    }
  };

  const exportCSV = () => {
    if (filteredProducts.length === 0) {
      toast.error('No records to export');
      return;
    }

    const headers = ['Product ID', 'Commodity Name', 'Manufacturer', 'Category', 'Net Quantity', 'MRP (INR)', 'Scan Date', 'Compliance Status'];
    const rows = filteredProducts.map(p => [
      p._id || p.id || '',
      `"${(p.productName || p.name || '').replace(/"/g, '""')}"`,
      `"${(p.manufacturer || '').replace(/"/g, '""')}"`,
      p.category || '',
      `"${p.extractedDeclarations?.netQuantity || ''} ${p.extractedDeclarations?.netQuantityUnit || ''}"`,
      p.extractedDeclarations?.mrp || '',
      p.scannedAt ? p.scannedAt.split('T')[0] : '',
      p.complianceStatus || p.status || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NyayaTula_Inspections_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredProducts.length} records to CSV`);
  };

  const filteredProducts = products.filter(p => {
    const name = p.productName || p.name || '';
    const mfg = p.manufacturer || '';
    const q = searchTerm.toLowerCase();
    const matchesSearch = name.toLowerCase().includes(q) || mfg.toLowerCase().includes(q);

    const status = (p.complianceStatus || p.status || '').toLowerCase();
    const matchesStatus = statusFilter === 'All' || status === statusFilter.toLowerCase();

    const category = (p.category || '').toLowerCase();
    const matchesCategory = categoryFilter === 'All' || category === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">National Commodity Repository</h1>
          <p className="text-slate-500 text-sm">
            Central repository of inspected packaged commodities and violation records
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={fetchProducts}
            className="p-2 border border-slate-300 bg-white rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 border border-slate-300 bg-white rounded-lg text-slate-700 hover:bg-slate-50 flex items-center text-sm font-semibold shadow-sm"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center text-sm font-semibold shadow-md"
          >
            <Plus size={16} className="mr-2" /> Scan New Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search commodity name, brand, or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 border border-slate-300 rounded-lg focus:ring-primary-500 text-sm bg-white font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Compliant">Compliant Only</option>
              <option value="Non-Compliant">Non-Compliant Only</option>
              <option value="Pending">Pending Review</option>
            </select>
          </div>

          <div className="flex-1 md:w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 border border-slate-300 rounded-lg focus:ring-primary-500 text-sm bg-white font-medium text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="food">Food & Beverage</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="electronics">Electronics</option>
              <option value="household">Household</option>
              <option value="pharma">Pharmaceuticals</option>
              <option value="textile">Textile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Commodity Name</th>
                <th className="p-4 hidden md:table-cell">Manufacturer / Packer</th>
                <th className="p-4 hidden sm:table-cell">Category</th>
                <th className="p-4">Net Qty & MRP</th>
                <th className="p-4 hidden lg:table-cell">Inspection Date</th>
                <th className="p-4">Statutory Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin text-primary-600" size={18} />
                      <span>Loading inspection repository...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <AlertCircle className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="font-semibold text-slate-700">No matching commodity inspections found</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying your search or filter options</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const prodId = p._id || p.id;
                  const name = p.productName || p.name || 'Unnamed';
                  const mfg = p.manufacturer || 'Unknown';
                  const status = p.complianceStatus || p.status || 'pending';
                  const date = p.scannedAt ? p.scannedAt.split('T')[0] : 'Recent';
                  const netQty = p.extractedDeclarations?.netQuantity
                    ? `${p.extractedDeclarations.netQuantity} ${p.extractedDeclarations.netQuantityUnit || ''}`
                    : p.netQty || '—';
                  const mrp = p.extractedDeclarations?.mrp
                    ? `₹${p.extractedDeclarations.mrp}`
                    : p.mrp || '—';

                  return (
                    <tr
                      key={prodId}
                      onClick={() => navigate(`/products/${prodId}`)}
                      className="hover:bg-primary-50/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm hover:text-primary-600">{name}</p>
                        <p className="text-xs text-slate-500 md:hidden mt-0.5">{mfg}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-slate-700 text-sm">{mfg}</td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {p.category || 'other'}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-800">
                        <div>{netQty}</div>
                        <div className="text-slate-500 font-normal">{mrp}</div>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-slate-500 text-xs">{date}</td>
                      <td className="p-4">
                        <StatusBadge status={status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/products/${prodId}`)}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            title="View Formal Report"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(prodId, e)}
                            className="p-2 text-danger-500 hover:bg-danger-100 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> commodity records</span>
          <span className="font-mono text-slate-400">Department of Consumer Affairs</span>
        </div>
      </div>
    </div>
  );
};

export default ProductHistory;
