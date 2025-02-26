import { useTemplate } from "./TemplateContext";
import { useTextOverlay } from "./TextOverlayContext";
import { useRef, useEffect } from "react";

const PlayGround = () => {
  const { selectedTemplate } = useTemplate();
  const { text, color, font, position, imgSize, setImgSize } = useTextOverlay();
  const imgRef = useRef<HTMLImageElement>(null);

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
      setTimeout(updateSize, 100); // Ensure image loads
    }

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [selectedTemplate]);

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

          {/* Debugging Info */}
          <p className="absolute top-2 left-2 bg-black text-white p-1 text-xs">
            Image Size: {imgSize.width} x {imgSize.height} | Text Position: {position.x}, {position.y}
          </p>

          {/* Text Overlay */}
          {text && (
            <div
              className="absolute"
              style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                color: color,
                fontFamily: font,
                fontSize: "24px",
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
