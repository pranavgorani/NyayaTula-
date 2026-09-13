import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

const ImageUploader = ({ onImagesSelected, maxFiles = 5, existingImages = [] }) => {
  const [files, setFiles] = useState(existingImages);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    
    const totalFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(totalFiles);
    onImagesSelected(totalFiles);
  }, [files, maxFiles, onImagesSelected]);

  const removeFile = (e, index) => {
    e.stopPropagation();
    const newFiles = [...files];
    const fileToRemove = newFiles[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onImagesSelected(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 10485760, // 10MB
    maxFiles
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="rounded-full bg-slate-100 p-3 mb-3">
          <UploadCloud className="h-6 w-6 text-slate-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Supports JPG, PNG, WEBP (Max {maxFiles} files, 10MB each)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((file, i) => (
            <div key={i} className="group relative aspect-square w-full overflow-hidden rounded-lg border bg-slate-100">
              <img 
                src={file.preview || file} 
                alt={`Preview ${i}`} 
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => removeFile(e, i)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
