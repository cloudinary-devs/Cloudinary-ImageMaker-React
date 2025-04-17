### Smart Invites Made Easy: Automate With Cloudinary and React

This project demonstrates how to integrate **Cloudinary** and the **OpenAI SDK** to transform image content into actionable outputs. Built with **Node.js** on the backend and **React** on the frontend, the application showcases:  

- **Image Upload**: Upload images to Cloudinary using Cloudinary's Upload Widget  
- **Text Overlay**: Leverage Cloudinary's technology to add custom text overlay to your images    
- **CSV upload and name auto-population**: Upload a CSV file with names and let the app generate personalized invites automatically.
- **Cloud storage and optimization**: Store your files securely on Cloudinary using the Cloudinary Upload widget with upload presets, ensuring fast, optimized delivery.
- **Downloadable invitations** Download all the invitations you created with just one click.
- **Frontend Integration**: A React-powered user interface for uploading images and viewing results.  

## Github Repo
Take a deeper look to the code inside of the app [GitHub repo](https://github.com/cloudinary-devs/Cloudinary-ImageMaker-React).

## Clone the app via SSH

```git@github.com:cloudinary-devs/Cloudinary-ImageMaker-React.git```

## Set up the app locally

```npm install```

## Cloudinary setup

- You will need to create a cloud name inside of your Cloudinary account. Keep in mind you will need a Cloudinary account, [register](https://cloudinary.com/users/register_free) for FREE. You can see find the detailed instructions on how to create a Cloud name in our [blog](You can also find detailed instructions in the [blog post](https://cloudinary.com/blog/smart-invites-made-easy-automate-react#cloudinary_upload_presets)) post.

Then you will add this Cloud name in 2 different places:

Fist place is in the LeftSideBar [component](https://github.com/cloudinary-devs/Cloudinary-ImageMaker-React/blob/main/src/LeftSideBar.tsx#L15)

```javascript
  const cld = new Cloudinary({
    cloud: {
      cloudName: "invite-maker",
    },
  });
```

In the Cloudinary Upload Widget [component](https://github.com/cloudinary-devs/Cloudinary-ImageMaker-React/blob/main/src/CloudinaryUploadWidget.tsx#L13):

```javascript
  const uwConfig = {
    cloudName: "YOUR-CLOUD-NAME-HERE",
    uploadPreset: "YOUR-UPLOAD-PRESET-HERE",
    sources: ["local"],
    multiple: true,
    folder: `flyers`, //this is where the images will get stored
  };
```

You will need to create an Upload Preset for this app.

In your account, ensure you’re inside the product environment you just created, then select Settings > Upload. Click + Add Upload Preset. 

Enter the name of your preset. I named my preset “upload-images”. Now enter the folder name where they will live; mine is “flyers”. Click the Signing Mode dropdown and select Unsigned. For asset naming, make sure the two switches are turned on.

You can also find detailed instructions in the [blog post](https://cloudinary.com/blog/smart-invites-made-easy-automate-react#cloudinary_upload_presets)

For more detailed instructions on how to setup Cloudinary follow the instructions in [this blog post](https://cloudinary.com/blog/smart-invites-made-easy-automate-react).

## Run the app locally

```npm run dev```
