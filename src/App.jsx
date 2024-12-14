import { useEffect, useRef, useState } from 'react';
import { FaBrush, FaSave } from 'react-icons/fa';
import { HiUpload } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [originalImage, setOriginalImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'white';
    context.lineWidth = brushSize;
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;

 
    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      context.lineCap = 'round';
      context.strokeStyle = 'white';
      context.lineWidth = brushSize;
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x * scaleX, y * scaleY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    contextRef.current.lineTo(x * scaleX, y * scaleY);
    contextRef.current.stroke();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(event.target.result);
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const generateMask = () => {
    const mask = canvasRef.current.toDataURL('image/png');
    setMaskImage(mask);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const clearGeneration = () => {
    setMaskImage(null);
    setShowResults(false);
  };

  const saveGeneration = () => {
    const link = document.createElement('a');
    link.download = 'mask_image.png';
    link.href = maskImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text py-2 text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Paint On Image
        </h1>
        <div className="mb-8">
          <label className="block w-full max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 border-dashed border-blue-400 hover:border-blue-600">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <HiUpload className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Upload your files
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    File should be JPG, PNG, PDF
                  </p>
                  <p className="text-sm text-gray-400">
                    Max. file size 15MB
                  </p>
                  <div className="mt-4">
                    <span className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Browse File
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Drag & Drop your file or click to browse
                  </p>
                </div>
              </div>
            </div>
          </label>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FaBrush className="text-blue-500 text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Brush Size</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200 min-w-[3rem] text-center">
                    {brushSize}px
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateMask}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                Generate Mask
              </button>
              <button
                onClick={clearCanvas}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <MdDelete /> Clear
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="relative w-full aspect-[3/2] bg-gray-900 rounded-xl overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
              className="w-full h-full"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>
        {(originalImage || maskImage) && showResults && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {originalImage && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Original Image
                  </h3>
                  <div className="rounded-xl overflow-hidden">
                    <img src={originalImage} alt="Original" className="w-full" />
                  </div>
                </div>
              )}
              {maskImage && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Mask Image
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={saveGeneration}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaSave className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={clearGeneration}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <MdDelete className="h-4 w-4" />
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <img src={maskImage} alt="Mask" className="w-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;