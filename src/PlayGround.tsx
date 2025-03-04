import { useTemplate } from "./TemplateContext";
import { useTextOverlay } from "./TextOverlayContext";
import { useRef, useState, useEffect } from "react";

const PlayGround = () => {
  const { selectedTemplate } = useTemplate();
  const { text, color, font, fontSize, position, imgSize, setImgSize, setImgOriginalSize } = useTextOverlay();
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        const containerWidth = window.innerWidth * 0.8;
        const containerHeight = window.innerHeight * 0.8;
        const aspectRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
        let newWidth = Math.min(containerWidth, imgRef.current.naturalWidth);
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > containerHeight) {
          newHeight = containerHeight;
          newWidth = newHeight * aspectRatio;
        }
        
        setImgSize({
          width: newWidth,
          height: newHeight,
        });


        setImgOriginalSize({
          width: imgRef.current.naturalWidth,
          height: imgRef.current.naturalHeight,
        });

        console.log('imgSize', imgSize);
        console.log('imgOriginalSize', imgSize)
      }
    };

    if (selectedTemplate) {
      setTimeout(updateSize, 100);
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [selectedTemplate]);

  useEffect(() => {
    if (textRef.current) {
      setTextSize({
        width: textRef.current.clientWidth,
        height: textRef.current.clientHeight,
      });
    }
  }, [text, font, fontSize, position, imgSize]);

  const safeX = Math.max(0, Math.min(position.x, imgSize.width - textSize.width));
  const safeY = Math.max(0, Math.min(position.y, imgSize.height - textSize.height));

  const saveImage = () => {
    if (!canvasRef.current || !imgRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const img = new Image();
    img.crossOrigin = "anonymous"; // Fix CORS issue
    img.src = selectedTemplate;
  
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // Draw the text
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = color;
      ctx.textBaseline = "top";
      ctx.fillText(text, position.x, position.y);
  
      try {
        const dataUrl = canvas.toDataURL("image/png"); // Ensures it's only called after the image is loaded
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "custom-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Failed to generate image:", error);
      }
    };
  
    img.onerror = () => {
      console.error("Failed to load image:", selectedTemplate);
    };
  };
  

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-200">
      {selectedTemplate ? (
        <div className="relative" style={{ width: imgSize.width, height: imgSize.height }}>
          <img
            ref={imgRef}
            src={selectedTemplate}
            alt="Selected Template"
            className="w-full h-auto"
          />

          {text && (
            <div
              ref={textRef}
              className="absolute"
              style={{
                top: `${safeY}px`,
                left: `${safeX}px`,
                color: color,
                fontFamily: font,
                fontSize: `${fontSize}px`,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: `${imgSize.width}px`,
              }}
            >
              {text}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Select a template to preview it here.</p>
      )}

      {/* Hidden canvas for saving image */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Save Image Button */}
      <button
        onClick={saveImage}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
      >
        Save Image
      </button>
    </div>
  );
};

export default PlayGround;
