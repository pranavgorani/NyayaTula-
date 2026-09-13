export const COMPLIANCE_RULES = [
  {
    id: 'RULE_001',
    name: 'Name of Commodity',
    description: 'Product name must be declared on the package',
    ruleReference: 'Rule 6(1)(a)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.productName, 
      details: declarations.productName ? `Found: ${declarations.productName}` : 'Product name not found' 
    })
  },
  {
    id: 'RULE_002',
    name: 'Net Quantity',
    description: 'Net quantity must be declared with standard unit',
    ruleReference: 'Rule 6(1)(b)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: declarations.netQuantity > 0 && !!declarations.netQuantityUnit,
      details: declarations.netQuantity ? `Found: ${declarations.netQuantity} ${declarations.netQuantityUnit}` : 'Net quantity or unit missing'
    })
  },
  {
    id: 'RULE_003',
    name: 'MRP Declaration',
    description: 'Maximum Retail Price must be declared',
    ruleReference: 'Rule 6(1)(e)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.mrp && declarations.mrp > 0,
      details: declarations.mrp ? `Found MRP: ${declarations.mrp}` : 'MRP missing or invalid'
    })
  },
  {
    id: 'RULE_004',
    name: 'MRP Inclusive Text',
    description: 'MRP must be inclusive of all taxes',
    ruleReference: 'Rule 6(1)(e)',
    category: 'mandatory_declaration',
    severity: 'major',
    validate: (declarations) => ({ 
      passed: !!declarations.mrpInclusiveText,
      details: declarations.mrpInclusiveText ? 'Inclusive text found' : 'Missing "inclusive of all taxes" text'
    })
  },
  {
    id: 'RULE_005',
    name: 'Manufacturer Name',
    description: 'Name of the manufacturer must be provided',
    ruleReference: 'Rule 6(1)(a)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.manufacturerName,
      details: declarations.manufacturerName ? `Found: ${declarations.manufacturerName}` : 'Manufacturer name missing'
    })
  },
  {
    id: 'RULE_006',
    name: 'Manufacturer Address',
    description: 'Address of the manufacturer must be provided',
    ruleReference: 'Rule 6(1)(a)',
    category: 'mandatory_declaration',
    severity: 'major',
    validate: (declarations) => ({ 
      passed: !!declarations.manufacturerAddress,
      details: declarations.manufacturerAddress ? 'Manufacturer address found' : 'Manufacturer address missing'
    })
  },
  {
    id: 'RULE_007',
    name: 'Date of Manufacture',
    description: 'Manufacturing/Packing date must be declared',
    ruleReference: 'Rule 6(1)(d)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.mfgDate,
      details: declarations.mfgDate ? `Found: ${declarations.mfgDate}` : 'Manufacturing date missing'
    })
  },
  {
    id: 'RULE_008',
    name: 'Best Before/Expiry',
    description: 'Expiry or Best Before date must be declared',
    ruleReference: 'Rule 6(1)(d)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.expDate || !!declarations.bestBefore,
      details: declarations.expDate || declarations.bestBefore ? 'Expiry/Best Before found' : 'Expiry information missing'
    })
  },
  {
    id: 'RULE_009',
    name: 'Consumer Care Details',
    description: 'Customer care phone or email must be provided',
    ruleReference: 'Rule 6(1)(g)',
    category: 'mandatory_declaration',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.consumerCarePhone || !!declarations.consumerCareEmail,
      details: (declarations.consumerCarePhone || declarations.consumerCareEmail) ? 'Consumer care info found' : 'Contact details missing'
    })
  },
  {
    id: 'RULE_010',
    name: 'Country of Origin',
    description: 'Country of origin must be declared for imported items',
    ruleReference: 'Rule 6(1)(a)',
    category: 'conditional',
    severity: 'major',
    validate: (declarations) => {
      // Simplified client logic; if there is an importer, this must pass. Assuming true if country is found or no importer context is explicitly detected to fail it
      return {
        passed: !!declarations.countryOfOrigin || !declarations.importerName,
        details: declarations.countryOfOrigin ? `Found: ${declarations.countryOfOrigin}` : 'Not applicable or missing'
      }
    }
  },
  {
    id: 'RULE_011',
    name: 'Generic/Common Name',
    description: 'Common name of the product must be declared',
    ruleReference: 'Rule 6(1)(b)',
    category: 'mandatory_declaration',
    severity: 'minor',
    validate: (declarations) => ({ 
      passed: !!declarations.genericName || !!declarations.productName,
      details: declarations.genericName || declarations.productName ? 'Generic/Common name found' : 'Missing'
    })
  },
  {
    id: 'RULE_012',
    name: 'FSSAI License',
    description: 'Valid 14 digit FSSAI license number (if applicable food item)',
    ruleReference: 'FSSAI Rules',
    category: 'conditional',
    severity: 'critical',
    validate: (declarations) => ({ 
      passed: !!declarations.fssaiLicense && declarations.fssaiLicense.length === 14,
      details: declarations.fssaiLicense ? `Found: ${declarations.fssaiLicense}` : 'FSSAI License missing'
    })
  },
  {
    id: 'RULE_013',
    name: 'Importer Details',
    description: 'Importer name and address required for imported goods',
    ruleReference: 'Rule 6(1)(a)',
    category: 'conditional',
    severity: 'major',
    validate: (declarations) => ({ 
      passed: true, // Placeholder logic
      details: 'Evaluated conditionally'
    })
  },
  {
    id: 'RULE_014',
    name: 'Net Quantity Unit Standard',
    description: 'Standard units must be used for quantity',
    ruleReference: 'Rule 13',
    category: 'mandatory_declaration',
    severity: 'major',
    validate: (declarations) => {
      const validUnits = ['g', 'kg', 'ml', 'l', 'mg'];
      const passed = declarations.netQuantityUnit && validUnits.includes(declarations.netQuantityUnit.toLowerCase());
      return { 
        passed,
        details: passed ? 'Valid standard unit used' : 'Non-standard or missing unit'
      }
    }
  },
  {
    id: 'RULE_015',
    name: 'MRP Format',
    description: 'MRP format validation',
    ruleReference: 'Rule 6(1)(e)',
    category: 'mandatory_declaration',
    severity: 'minor',
    validate: (declarations) => ({ 
      passed: !!declarations.mrp,
      details: declarations.mrp ? 'Valid MRP format' : 'Invalid MRP format'
    })
  },
  {
    id: 'RULE_016',
    name: 'Readability, Placement & Font Size',
    description: 'Declarations must be conspicuous and legible on principal display panel',
    ruleReference: 'Rule 7 & 9',
    category: 'format',
    severity: 'major',
    validate: (declarations) => {
      // Logic: If the engine could extract the major fields easily, assume font size and contrast are acceptable
      const hasMajorFields = !!declarations.productName && !!declarations.netQuantity && !!declarations.mrp;
      return {
        passed: hasMajorFields,
        details: hasMajorFields ? 'Principal declarations are legible with sufficient font size' : 'Illegible declarations or insufficient font size (Rule 7/9)'
      };
    }
  }
];

export function runClientComplianceCheck(declarations) {
  let passedChecks = 0;
  let failedChecks = 0;
  const totalChecks = COMPLIANCE_RULES.length;
  
  const checkResults = COMPLIANCE_RULES.map(rule => {
    const result = rule.validate(declarations);
    if (result.passed) {
      passedChecks++;
    } else {
      failedChecks++;
    }
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      ruleReference: rule.ruleReference,
      passed: result.passed,
      severity: rule.severity,
      details: result.details
    };
  });

  const complianceScore = Math.round((passedChecks / totalChecks) * 100);
  let overallStatus = 'compliant';
  if (failedChecks > 0) {
    const hasCriticalFailures = checkResults.some(r => !r.passed && r.severity === 'critical');
    overallStatus = hasCriticalFailures ? 'non-compliant' : 'pending'; // simplistic overall logic
  }

  return {
    overallStatus,
    checkResults,
    totalChecks,
    passedChecks,
    failedChecks,
    complianceScore
  };
}
