import { useTemplate } from "./TemplateContext";

const templates = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
const myFlyers = ["7.png", "8.png", "9.png", "10.png", "11.png", "12.png"];

const LeftSideBar = () => {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();

  return (
    <div className="w-200 bg-gray-100 p-4 shadow-lg rounded-lg h-screen flex flex-col">
      <h1 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">
        InviteMaker
      </h1>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">Templates</h2>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${
                selectedTemplate === `/` + template ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setSelectedTemplate(`/${template}`)}
            >
              <img src={`/${template}`} alt={`Template ${index + 1}`} className="w-full h-80 object-cover hover:opacity-80" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-300 my-2"></div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-gray-100 p-2 z-10">My Flyers</h2>
        <div className="grid grid-cols-2 gap-3">
          {myFlyers.map((flyer, index) => (
            <div
              key={index}
              className="relative cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-300 hover:shadow-lg border-transparent"
              onClick={() => setSelectedTemplate(`/${flyer}`)}
            >
              <img src={`/${flyer}`} alt={`Flyer ${index + 1}`} className="w-full h-80 object-cover hover:opacity-80" />
            </div>
          ))}
        </div>
      </div>
      <button className="bg-blue-600 text-white hover:bg-blue-200 hover:text-black cursor-pointer h-[40px] rounded-lg">
        Upload Flyer
      </button>
    </div>
  );
};

export default LeftSideBar;
