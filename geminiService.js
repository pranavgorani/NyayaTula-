import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI() : null;

const SYSTEM_INSTRUCTION = `You are an expert Compliance Inspector AI for the Government of India, specializing in the Legal Metrology (Packaged Commodities) Rules, 2011. 

Your task is to analyze an uploaded image of a packaged commodity label, extract all relevant text using OCR, and evaluate it for strict compliance with the law. You must format the extracted data into specific fields so our software can automatically populate a form.

INSTRUCTIONS:
1. Scan the provided image carefully and extract all visible text.
2. Search for the 6 Mandatory Declarations.
3. Check for correctness, completeness, and placement. 
4. Flag any missing, misleading, or non-standard declarations.
5. Evaluate readability (contrast, blurriness, and estimated relative font size).

MANDATORY DECLARATIONS TO CHECK:
1. Manufacturer / Packer / Importer: Full name and complete physical address.
2. Product Name: Generic or common name of the product.
3. Net Quantity: Numerical value and standard unit.
4. Date: Month and Year of Manufacture, Packing, or Import.
5. MRP: Must explicitly state 'MRP', include the price with currency (Rs/₹), AND state '(inclusive of all taxes)'.
6. Consumer Care: Must include at least a Telephone Number/Helpline AND an Email Address.`;

export async function analyzePackageImage(base64Image, mimeType = 'image/jpeg') {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured in the backend .env file. AI Scanner is disabled.');
  }

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        'Analyze this package label for Legal Metrology compliance.'
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            compliance_status: { type: Type.STRING, enum: ['COMPLIANT', 'NON_COMPLIANT'] },
            auto_fill_data: {
              type: Type.OBJECT,
              properties: {
                manufacturer_name: { type: Type.STRING, nullable: true },
                manufacturer_address: { type: Type.STRING, nullable: true },
                product_name: { type: Type.STRING, nullable: true },
                net_quantity_value: { type: Type.NUMBER, nullable: true },
                net_quantity_unit: { type: Type.STRING, nullable: true },
                date_month: { type: Type.STRING, nullable: true },
                date_year: { type: Type.STRING, nullable: true },
                mrp_price: { type: Type.NUMBER, nullable: true },
                mrp_full_text: { type: Type.STRING, nullable: true },
                consumer_care_phone: { type: Type.STRING, nullable: true },
                consumer_care_email: { type: Type.STRING, nullable: true },
                consumer_care_address: { type: Type.STRING, nullable: true }
              }
            },
            missing_declarations: { type: Type.ARRAY, items: { type: Type.STRING } },
            violations_found: { type: Type.ARRAY, items: { type: Type.STRING } },
            readability_assessment: { type: Type.STRING },
            tampering_or_obscuration_detected: { type: Type.BOOLEAN }
          },
          required: ['compliance_status', 'auto_fill_data', 'missing_declarations', 'violations_found', 'readability_assessment', 'tampering_or_obscuration_detected']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze image using AI: ' + error.message);
  }
}