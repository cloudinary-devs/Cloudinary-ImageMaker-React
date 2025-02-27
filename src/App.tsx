import LeftSideBar from "./LeftSideBar";
import PlayGround from "./PlayGround";
import RightSideBar from "./RightSideBar";
import { TemplateProvider } from "./TemplateContext";
import { TextOverlayProvider } from "./TextOverlayContext";


function App() {
  return (
    <div className="flex">
      <TemplateProvider>
        <TextOverlayProvider>
          <LeftSideBar />
          <PlayGround />
          <RightSideBar />
        </TextOverlayProvider>
      </TemplateProvider>
    </div>
  );
}

export default App;
