import { createWorker } from 'tesseract.js';

export async function extractTextFromImage(imageFile, onProgress) {
  // Setup a timeout to prevent hanging forever if unpkg CDN is blocked or slow
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('OCR engine initialization timed out after 15 seconds. Please check your internet connection or use a demo preset.')), 15000);
  });

  const runOCR = async () => {
    const worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });

    const result = await worker.recognize(imageFile);
    await worker.terminate();

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words
    };
  };

  return Promise.race([runOCR(), timeoutPromise]);
}


export function parseDeclarationsFromText(rawText) {
  if (!rawText) return null;

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const fullText = rawText.replace(/\n/g, ' ');

  const result = {
    productName: null,
    netQuantity: null,
    netQuantityUnit: null,
    mrp: null,
    mrpInclusiveText: false,
    mfgDate: null,
    expDate: null,
    bestBefore: null,
    manufacturerName: null,
    manufacturerAddress: null,
    consumerCarePhone: null,
    consumerCareEmail: null,
    fssaiLicense: null,
    countryOfOrigin: null,
    genericName: null,
    ingredients: null
  };

  // Product Name (naive approach: first non-empty line)
  if (lines.length > 0) {
    result.productName = lines[0];
  }

  // Net Quantity
  const qtyMatch = fullText.match(/(?:Net (?:Wt\.|Qty\.?)|Weight|Quantity)\s*:?\s*([\d.]+)\s*(g|kg|ml|l)\b/i) || fullText.match(/\b([\d.]+)\s*(g|kg|ml|l)\b/i);
  if (qtyMatch) {
    result.netQuantity = parseFloat(qtyMatch[1]);
    result.netQuantityUnit = qtyMatch[2].toLowerCase();
  }

  // MRP
  const mrpMatch = fullText.match(/(?:MRP|M\.R\.P\.?|Rs\.?|₹)\s*:?\s*([\d.,]+)/i);
  if (mrpMatch) {
    result.mrp = parseFloat(mrpMatch[1].replace(/,/g, ''));
  }
  
  // MRP Inclusive
  if (/inclusive of all taxes|incl\. of all taxes/i.test(fullText)) {
    result.mrpInclusiveText = true;
  }

  // Dates
  const datePattern = /(?:0?[1-9]|[12]\d|3[01])[\/\-\.](?:0?[1-9]|1[012])[\/\-\.]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]+\d{2,4}/i;
  
  const mfgContext = fullText.match(new RegExp(`(?:Mfg|Manufactured|MFD|Packed).*?(${datePattern.source})`, 'i'));
  if (mfgContext) result.mfgDate = mfgContext[1];

  const expContext = fullText.match(new RegExp(`(?:Exp|Expiry|Use before).*?(${datePattern.source})`, 'i'));
  if (expContext) result.expDate = expContext[1];

  const bestBeforeContext = fullText.match(/Best Before.*?(?:\d+\s*(?:months|days|years)|\d{2}[\/\-]\d{4})/i);
  if (bestBeforeContext) result.bestBefore = bestBeforeContext[0];

  // Manufacturer Details
  const mfgByMatch = fullText.match(/(?:Manufactured by|Mfg by|Packed by)\s*[:-]?\s*([^,.]+)/i);
  if (mfgByMatch) result.manufacturerName = mfgByMatch[1].trim();

  const pincodeMatch = fullText.match(/\b\d{6}\b/);
  if (pincodeMatch && mfgByMatch) {
    const addressStartIndex = fullText.indexOf(mfgByMatch[1]);
    if(addressStartIndex !== -1) {
      result.manufacturerAddress = fullText.substring(addressStartIndex, fullText.indexOf(pincodeMatch[0]) + 6).trim();
    }
  }

  // Consumer Care
  const phoneMatch = fullText.match(/\b(?:1800\d{6}|\d{10})\b/);
  if (phoneMatch) result.consumerCarePhone = phoneMatch[0];

  const emailMatch = fullText.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
  if (emailMatch) result.consumerCareEmail = emailMatch[0];

  // FSSAI
  const fssaiMatch = fullText.match(/(?:FSSAI|Lic(?:ense)? No\.?)\s*:?\s*(\d{14})/i);
  if (fssaiMatch) result.fssaiLicense = fssaiMatch[1];

  // Origin
  const originMatch = fullText.match(/(?:Country of Origin|Made in|Product of)\s*:?\s*([A-Za-z]+)/i);
  if (originMatch) result.countryOfOrigin = originMatch[1];

  // Generic / Common Name
  const genericMatch = fullText.match(/(?:Common Name|Generic Name)\s*:?\s*([^,.]+)/i);
  if (genericMatch) result.genericName = genericMatch[1];

  // Ingredients
  const ingredientsMatch = fullText.match(/Ingredients\s*:?\s*(.*?)(?=\n|$|\w+:|Nutritional)/i);
  if (ingredientsMatch) result.ingredients = ingredientsMatch[1].trim();

  // Barcode / 2D Code
  const barcodeMatch = fullText.match(/\b\d{12,13}\b/);
  if (barcodeMatch && barcodeMatch[0] !== result.fssaiLicense && barcodeMatch[0] !== result.consumerCarePhone) {
    result.barcode = barcodeMatch[0];
  }

  return result;
}
