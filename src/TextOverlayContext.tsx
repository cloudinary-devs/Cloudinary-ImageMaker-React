import { createContext, useContext, useState } from "react";

interface TextOverlayContextProps {
  text: string;
  setText: (text: string) => void;
  color: string;
  setColor: (color: string) => void;
  font: string;
  setFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  imgSize: { width: number; height: number };
  setImgSize: (size: { width: number; height: number }) => void;
  imgOriginalSize: { width: number; height: number };
  setImgOriginalSize: (size: { width: number; height: number }) => void;
}

const TextOverlayContext = createContext<TextOverlayContextProps | undefined>(undefined);

export const TextOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [text, setText] = useState(" ");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [imgSize, setImgSize] = useState({ width: 500, height: 500 });
  const [imgOriginalSize, setImgOriginalSize] = useState({ width: 500, height: 500 });

  return (
    <TextOverlayContext.Provider
      value={{ text, setText, color, setColor, font, setFont, fontSize, setFontSize, position, setPosition, imgSize, setImgSize, imgOriginalSize, setImgOriginalSize }}
    >
      {children}
    </TextOverlayContext.Provider>
  );
};

export const useTextOverlay = () => {
  const context = useContext(TextOverlayContext);
  if (!context) {
    throw new Error("useTextOverlay must be used within a TextOverlayProvider");
  }
  return context;
};
