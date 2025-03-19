import { useTemplate } from "./TemplateContext";
import { useTextOverlay } from "./TextOverlayContext";
import { useRef, useState, useEffect } from "react";

const PlayGround = () => {
  const { selectedTemplate } = useTemplate();
  const { text, color, font, fontSize, position, imgSize, setImgSize, setImgOriginalSize } = useTextOverlay();
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current && selectedTemplate) {
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
  
  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-200">
      {selectedTemplate ? (
        <div className="relative" style={{ width: imgSize.width, height: imgSize.height }}>
          <img
            ref={imgRef}
            src={`https://res.cloudinary.com/invite-maker/image/upload/v1/${selectedTemplate}`}
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
    </div>
  );
};

export default PlayGround;
