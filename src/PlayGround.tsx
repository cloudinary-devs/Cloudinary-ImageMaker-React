import { useTemplate } from "./TemplateContext";
import { useTextOverlay } from "./TextOverlayContext";

const PlayGround = () => {
  const { selectedTemplate } = useTemplate();
  const { text, color, font, position } = useTextOverlay();

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-200 relative">
      {selectedTemplate ? (
        <div className="relative">
          {/* Image */}
          <img src={selectedTemplate} alt="Selected Template" className="max-w-full max-h-full" />
          
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
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
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
