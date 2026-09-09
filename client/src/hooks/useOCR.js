import { useState } from 'react';
import { extractTextFromImage, parseDeclarationsFromText } from '../services/ocrEngine';

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState(null);
  const [declarations, setDeclarations] = useState(null);
  const [error, setError] = useState(null);

  const processImage = async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    try {
      const ocrResult = await extractTextFromImage(file, (p) => setProgress(p));
      setExtractedText(ocrResult.text);
      
      const parsed = parseDeclarationsFromText(ocrResult.text);
      setDeclarations(parsed);
      
      setIsProcessing(false);
      return { text: ocrResult.text, parsed };
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err.message || 'Failed to process image');
      setIsProcessing(false);
      throw err;
    }
  };

  const reset = () => {
    setIsProcessing(false);
    setProgress(0);
    setExtractedText(null);
    setDeclarations(null);
    setError(null);
  };

  return {
    isProcessing,
    progress,
    extractedText,
    declarations,
    error,
    processImage,
    reset
  };
}
