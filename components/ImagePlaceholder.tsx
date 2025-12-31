
import React from 'react';

interface ImagePlaceholderProps {
  label: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ label }) => {
  return (
    <div className="relative bg-gray-700 border border-dashed border-gray-500 rounded-lg aspect-w-16 aspect-h-9 flex items-center justify-center overflow-hidden">
       <img src="https://picsum.photos/400/300" alt={label} className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="relative z-10 text-center p-4">
        <span className="block font-semibold text-gray-300">[GAMBAR: {label}]</span>
        <span className="text-xs text-gray-400">Placeholder imej akan muncul di sini.</span>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
