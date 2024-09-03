

const ImagePreview = ({ src, alt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-full max-h-full">
        <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        &times;
      </button>
    </div>
  );
};

export default ImagePreview;