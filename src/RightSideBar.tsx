import { Cloudinary } from "@cloudinary/url-gen/index";
import { useTextOverlay } from "./TextOverlayContext";
import Papa from "papaparse";
import { useState, useRef, useEffect } from "react";
// Import required actions.
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text as cloudinaryText } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { Position } from "@cloudinary/url-gen/qualifiers";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { fill } from "@cloudinary/url-gen/actions/resize";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useTemplate } from "./TemplateContext";

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
  const [, setGeneratedLinks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedTemplate } = useTemplate();

  useEffect(() => {
    if (csvData.length > 0) {
      setText(`${csvData[0]} ${text}`);
    }
  }, [csvData]);

  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: "invite-maker",
    },
  });

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.length > 0) {
      const myImage = cld.image(`${selectedTemplate}`);
      // Compute precise scaling ratios
      const scaleX = imgOriginalSize.width / imgSize.width;
      const scaleY = imgOriginalSize.height / imgSize.height;

      // Scale font size proportionally
      const adjustedFontSize = Math.round(fontSize * scaleX);

      // Estimate text width and height using an approximate character size multiplier
      const estimatedTextWidth = adjustedFontSize * text.length * 0.6; // Approximate width
      const estimatedTextHeight = adjustedFontSize; // Text height is usually 1 line height

      // Compute safe positions for text placement
      const mappedX = Math.max(
        0,
        Math.min(position.x * scaleX, imgOriginalSize.width - estimatedTextWidth)
      );
      const mappedY = Math.max(
        0,
        Math.min(
          position.y * scaleY,
          imgOriginalSize.height - estimatedTextHeight
        ) // Prevent Y overflow
      );

      // Adjust offsets only if there's enough space
      const adjustedX =
        mappedX +
        (mappedX + estimatedTextWidth < imgOriginalSize.width
          ? estimatedTextWidth / 8
          : 0);
      const adjustedY =
        mappedY +
        (mappedY + estimatedTextHeight <
        imgOriginalSize.height - estimatedTextHeight
          ? adjustedFontSize / 2
          : 0); // Prevents text from going below the image

      // Apply position mapping using absolute values
      const safeFont = font && font.length > 0 ? font : "Arial"; // Default to Arial if font is missing
      const safeFontSize = fontSize > 0 ? fontSize : 20; // Default to 20px if fontSize is invalid
      const adjustedFontSizes = Math.round(safeFontSize * scaleX);
      
      // Check if adjustedFontSizes is valid before using it
      if (adjustedFontSizes > 0 && safeFont) {
        myImage.overlay(
          source(
            cloudinaryText(text, new TextStyle(safeFont, adjustedFontSizes)) // Scale font size correctly
              .textColor(color)
          ).position(
            new Position()
              .gravity(compass("north_west"))
              .offsetX(Math.round(adjustedX))
              .offsetY(Math.round(adjustedY)) // Use absolute values
          )
        );

        // Generate the Cloudinary URL
        const myUrl = myImage.toURL();
        console.log(myUrl);
      }
    }
  }, [text, color, font, fontSize, position, imgSize, imgOriginalSize, selectedTemplate]);

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

  const generateFlyers = async () => {
    if (!selectedTemplate || selectedTemplate.length === 0) return;
    const previewName = csvData[0] || "";
    const links: string[] = csvData.map((name) => {
      const myImage = cld.image(`${selectedTemplate}`);

      myImage.resize(
        fill().width(imgOriginalSize.width).height(imgOriginalSize.height)
      );

      const scaleX = imgOriginalSize.width / imgSize.width;
      const scaleY = imgOriginalSize.height / imgSize.height;

      const adjustedFontSize = Math.round(fontSize * scaleX);
      const estimatedTextWidth =
        adjustedFontSize * (name.length + text.length) * 0.65;
      const estimatedTextHeight = adjustedFontSize;

      let mappedX = Math.max(
        0,
        Math.min(
          position.x * scaleX,
          imgOriginalSize.width - estimatedTextWidth * 0.9
        )
      );
      const mappedY = Math.max(
        0,
        Math.min(
          position.y * scaleY,
          imgOriginalSize.height - estimatedTextHeight
        )
      );

      // Prevent overflow on X-axis with finer adjustment
      if (mappedX + estimatedTextWidth > imgOriginalSize.width) {
        mappedX = imgOriginalSize.width - estimatedTextWidth * 0.6;
      }
      if (mappedX < 0) {
        mappedX = 0;
      }
      const safeFont = font || "Arial"; // Default to Arial if font is missing
      const safeFontSize = fontSize > 0 ? fontSize : 20; // Default to 20px if fontSize is invalid
      const adjustedFontSizes = Math.round(safeFontSize * scaleX);
      if (adjustedFontSizes > 0 && safeFont) {
        myImage.overlay(
          source(
            cloudinaryText(
              `${name} ${text.replace(previewName, "")}`,
              new TextStyle(safeFont, adjustedFontSizes)
            ).textColor(color)
          ).position(
            new Position()
              .gravity(compass("north_west"))
              .offsetX(Math.round(mappedX))
              .offsetY(Math.round(mappedY))
          )
        );
      }

      return myImage.toURL();
    });
    console.log(links[1]);
    setGeneratedLinks(links);

    if (links.length === 1) {
      const link = document.createElement("a");
      link.href = links[0];
      link.download = "flyer.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const zip = new JSZip();
      const folder = zip.folder("Flyers");

      if (folder) {
        await Promise.all(
          links.map(async (url, index) => {
            const response = await fetch(url);
            const blob = await response.blob();
            folder.file(`flyer_${index + 1}.png`, blob);
          })
        );

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "flyers.zip");
      }
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 shadow-lg rounded-lg h-screen flex flex-col">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Customize Text</h2>
        <label className="mb-2">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <div>
          <label className="mb-2">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          />
        </div>
        <div>
          <label className="mb-2">Font</label>
          {/* As for font families, we offer several built-in options, including Arial, Verdana, Helvetica, Trebuchet MS, Times New Roman, Georgia, Courier New, Open Sans, Roboto, and Montserrat. */}
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div>
          <label className="mb-2 w-full">Font Size {fontSize}px</label>
          <input
            type="range"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="mb-2 w-full"
          />
        </div>
        <div>
          <label className="mb-2">X Position</label>
          <input
            type="range"
            min="0"
            max={imgSize.width - fontSize}
            value={position.x}
            onChange={(e) =>
              setPosition({ ...position, x: Number(e.target.value) })
            }
            className="mb-2 w-full"
          />
        </div>
        <div>
          <label className="mb-2">Y Position</label>
          <input
            type="range"
            min="0"
            max={imgSize.height - fontSize}
            value={position.y}
            onChange={(e) =>
              setPosition({ ...position, y: Number(e.target.value) })
            }
            className="mb-2 w-full"
          />
        </div>
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
          Upload Name List
        </button>
        {csvData.length > 0 && (
          <button
            onClick={generateFlyers}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
          >
            Generate Flyers
          </button>
        )}
        {csvData.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
