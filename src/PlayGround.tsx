import { useTemplate } from "./TemplateContext";
import { useTextOverlay } from "./TextOverlayContext";
import { useRef, useState, useEffect } from "react";

const PlayGround = () => {
  const { selectedTemplate } = useTemplate();
  const { text, color, font, fontSize, position, imgSize, setImgSize } = useTextOverlay();
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImgSize({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
        });
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
    <div className="flex justify-center items-center w-full h-screen bg-gray-200">
      {selectedTemplate ? (
        <div className="relative">
          <img
            ref={imgRef}
            src={selectedTemplate}
            alt="Selected Template"
            className="max-w-full h-auto"
            onLoad={() =>
              setImgSize({
                width: imgRef.current?.clientWidth || 0,
                height: imgRef.current?.clientHeight || 0,
              })
            }
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
