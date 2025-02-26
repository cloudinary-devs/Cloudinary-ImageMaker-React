import { useTextOverlay } from "./TextOverlayContext";

const RightSideBar = () => {
  const { text, setText, color, setColor, font, setFont, fontSize, setFontSize, position, setPosition, imgSize } = useTextOverlay();

  return (
    <div className="w-64 bg-gray-100 p-4 shadow-lg rounded-lg h-screen flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Customize Text</h2>

      {/* Text Input */}
      <label className="mb-2">Text:</label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded mb-2"
      />

      {/* Color Picker */}
      <label className="mb-2">Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="border p-2 rounded mb-2"
      />

      {/* Font Selector */}
      <label className="mb-2">Font:</label>
      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="border p-2 rounded mb-2"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Verdana">Verdana</option>
      </select>

      {/* Font Size */}
      <label className="mb-2">Font Size:</label>
      <input
        type="range"
        min="10"
        max="100"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="mb-2"
      />
      <span className="text-sm">{fontSize}px</span>

      {/* X Position */}
      <label className="mb-2">X Position (max: {imgSize.width}):</label>
      <input
        type="range"
        min="0"
        max={imgSize.width - fontSize}
        value={position.x}
        onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
        className="mb-2"
      />

      {/* Y Position */}
      <label className="mb-2">Y Position (max: {imgSize.height}):</label>
      <input
        type="range"
        min="0"
        max={imgSize.height - fontSize}
        value={position.y}
        onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
        className="mb-2"
      />
    </div>
  );
};

export default RightSideBar;