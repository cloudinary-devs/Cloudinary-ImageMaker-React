import { useEffect, useState, useCallback } from "react";

function CloudinaryUploadWidget({getFlyers, folderName, files, setFlyers}) {
  const [loaded, setLoaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const uwConfig= {
    cloudName: 'invite-maker',
    uploadPreset: "upload-images",
    sources: ["local"],
    multiple: true,
    folder: `flyers`,
  };
  

  /**
   * Load Cloudinary Upload Widget Script
   */
  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = async () => {
    setUploadProgress(null);
    if (loaded) {
      try {
        await window.cloudinary.openUploadWidget(uwConfig, processUploads);
      } catch (error) {
        setUploadProgress('failed');
      }
    }
  };

  const processUploads = useCallback((error, result) => {
    if (result?.event === "queues-end") {
      result.info.files.forEach(img => {
        if (
          img.status !== "success" ||
          error !== undefined
        ) {
          setUploadProgress('failed');
        } else {
            const fileName =  img.uploadInfo.path.split("/").pop();
            setFlyers(prevFlyers => {
                const updatedFlyers = [...prevFlyers, fileName];
                console.log('Updated Flyers:', updatedFlyers);
                getFlyers(updatedFlyers, folderName); // Ensure it gets the latest state
                return updatedFlyers;
              });
            setUploadProgress('successful');
        }
      });
    }
  }, []);

  return (
    <>
      <button id="upload_widget" className="bg-blue-600 text-white hover:bg-blue-200 hover:text-black cursor-pointer h-[40px] rounded-lg" onClick={initializeCloudinaryWidget}>
        Upload FLyer</button>
        {uploadProgress}
    </>
  );
}

export default CloudinaryUploadWidget;