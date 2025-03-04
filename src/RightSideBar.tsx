import { Cloudinary } from "@cloudinary/url-gen/index";
import { useTextOverlay } from "./TextOverlayContext";
import Papa from "papaparse";
import { useState, useRef } from "react";
// Import required actions.
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text as cloudinaryText } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { Position } from "@cloudinary/url-gen/qualifiers";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { fill } from "@cloudinary/url-gen/actions/resize";

const RightSideBar = () => {
  const {
    text,
    setText,
    color,
    setColor,
    font,
    setFont,
    fontSize,
    setFontSize,
    position,
    setPosition,
    imgSize,
    imgOriginalSize,
  } = useTextOverlay();
  const [csvData, setCsvData] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "invite-maker",
    },
  });
  const myImage = cld.image("templates/1.png");
  // Compute precise scaling ratios
  const scaleX = imgOriginalSize.width / imgSize.width;
  const scaleY = imgOriginalSize.height / imgSize.height;

  // Scale font size proportionally
  const adjustedFontSize = Math.round(fontSize * scaleX);

  // Estimate text width using an approximate character size multiplier
  const estimatedTextWidth = adjustedFontSize * text.length * 0.6; // Approximate width (adjust as needed)

  // Correctly map X and Y positions based on original size
  const mappedX = Math.max(
    0,
    Math.min(position.x * scaleX, imgOriginalSize.width - estimatedTextWidth)
  );
  const mappedY = Math.max(
    0,
    Math.min(position.y * scaleY, imgOriginalSize.height - adjustedFontSize)
  );

  console.log("Original Image:", imgOriginalSize);
  console.log("Scaled Image:", imgSize);
  console.log("Original Position:", position);
  console.log("Mapped Position (Absolute, Safe Area):", {
    x: mappedX,
    y: mappedY,
  });
  console.log("Estimated Text Width:", estimatedTextWidth);
  console.log("Adjusted Font Size:", adjustedFontSize);

  // Apply position mapping using absolute values
  myImage.overlay(
    source(
      cloudinaryText(text, new TextStyle(font, adjustedFontSize)) // Scale font size correctly
        .textColor(color)
    ).position(
      new Position()
        .gravity(compass("north_west"))
        .offsetX(Math.round(mappedX + estimatedTextWidth / 8))
        .offsetY(Math.round(mappedY + adjustedFontSize / 2)) // Use absolute values
    )
  );

  // Generate the Cloudinary URL
  const myUrl = myImage.toURL();
  console.log(myUrl);

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<string[]>(file, {
      complete: (result) => {
        const filteredData = result.data
          .filter(
            (row, index) =>
              index !== 0 || (row[0] && row[0].toLowerCase() !== "name")
          )
          .map((row) => row[0]);
        setCsvData(filteredData);
      },
    });
  };
  return (
    <div className="w-64 bg-gray-100 p-4 shadow-lg rounded-lg h-screen flex flex-col">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Customize Text</h2>
        <label className="mb-2">Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded mb-2"
        />

        <label className="mb-2">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 rounded mb-2"
        />

        <label className="mb-2">Font:</label>
        {/* As for font families, we offer several built-in options, including Arial, Verdana, Helvetica, Trebuchet MS, Times New Roman, Georgia, Courier New, Open Sans, Roboto, and Montserrat. */}
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

        <label className="mb-2">X Position (max: {imgSize.width}):</label>
        <input
          type="range"
          min="0"
          max={imgSize.width - fontSize}
          value={position.x}
          onChange={(e) =>
            setPosition({ ...position, x: Number(e.target.value) })
          }
          className="mb-2"
        />

        <label className="mb-2">Y Position (max: {imgSize.height}):</label>
        <input
          type="range"
          min="0"
          max={imgSize.height - fontSize}
          value={position.y}
          onChange={(e) =>
            setPosition({ ...position, y: Number(e.target.value) })
          }
          className="mb-2"
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Upload CSV
        </button>

        <div className="w-full max-w-xs mt-4 p-2 bg-white shadow-lg rounded-lg flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">CSV Names</h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {csvData.map((name, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="p-2">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
