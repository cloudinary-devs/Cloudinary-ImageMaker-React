import { Cloudinary } from "@cloudinary/url-gen/index";
import { useTemplate } from "./TemplateContext";
import { fill } from "@cloudinary/url-gen/actions/resize";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { useEffect, useState } from "react";

const templates = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
const myFlyers = ["f7.png", "f8.png", "f9.png", "f10.png", "f11.png", "f12.png"];

const LeftSideBar = () => {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const [flyers, setFlyers] = useState(myFlyers);
  const cld = new Cloudinary({
    cloud: {
      cloudName: "invite-maker",
    },
  });

  const getFlyersFromCloudinary = (images: string[], folderName: string) => {
    return images.map((image, index: number) => {
        const tempImg = cld.image(`${folderName}/${image}`);
        return (
        <div
          key={index}
          className={`flex justify-center items-center relative cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
            selectedTemplate === `/` + image ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => setSelectedTemplate(tempImg?.publicID)}
        >
          <img src={tempImg.resize(fill().height(320)).toURL()} alt={`Template ${index + 1}`} className="object-cover hover:opacity-80" />
        </div>
      )})
  }

  return (
    <div className="w-200 bg-gray-100 p-4 shadow-lg rounded-lg h-screen flex flex-col">
      <h1 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">
        InviteMaker
      </h1>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">Templates</h2>
        <div className="grid grid-cols-2 gap-3">
          {getFlyersFromCloudinary(templates, "templates")}
        </div>
      </div>
      <div className="border-t border-gray-300 my-2"></div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">My Flyers</h2>
        <div className="grid grid-cols-2 gap-3">
          {getFlyersFromCloudinary(flyers, "flyers")}
        </div>
      </div>
      <CloudinaryUploadWidget getFlyers={getFlyersFromCloudinary} folderName="flyers" files={flyers} setFlyers={setFlyers}/>
    </div>
  );
};

export default LeftSideBar;
