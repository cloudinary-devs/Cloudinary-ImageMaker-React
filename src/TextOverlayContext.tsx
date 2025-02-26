import { createContext, useContext, useState } from "react";

interface TextOverlayContextProps {
  text: string;
  setText: (text: string) => void;
  color: string;
  setColor: (color: string) => void;
  font: string;
  setFont: (font: string) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  imgSize: { width: number; height: number };
  setImgSize: (size: { width: number; height: number }) => void;
}

const TextOverlayContext = createContext<TextOverlayContextProps | undefined>(undefined);

export const TextOverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 500, height: 500 });

  return (
    <TextOverlayContext.Provider value={{ text, setText, color, setColor, font, setFont, position, setPosition, imgSize, setImgSize }}>
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
