// import { Cloudinary } from "@cloudinary/url-gen";
// import { fill } from "@cloudinary/url-gen/actions/resize";
import LeftSideBar from "./LeftSideBar";
import PlayGround from "./PlayGround";
import RightSideBar from "./RightSideBar";
import { TemplateProvider } from "./TemplateContext";
import { TextOverlayProvider } from "./TextOverlayContext";

function App() {
  // const cld = new Cloudinary({
  //   cloud: {
  //     cloudName: "invite-maker",
  //   },
  // });

  // const myImage = cld.image("templates");

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  // myImage.resize(fill().width(250).height(250));

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
