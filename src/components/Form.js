import { useState } from "react";
// import axios from "axios";

export default function NewPost() {
  const [file, setFile] = useState();
  const [newImage, setnewImage] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("newImage", newImage);
    // await axios.post("/api/posts", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    //grab the url from the return data which will contain the endpoint to upload an image
    const { url } = await fetch("http://localhost:3001/s3Url").then((res) =>
      res.json()
    );

    console.log(url);

    //post the image to the s3 bucket using the enpoint
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    });

    // parse the url and seperate the extra question mark from the url to get the location of the newly uploaded file ie: [myimageupload@aws]?[dklfhsofskdfj]
    const imageUrl = url.split("?")[0];
    console.log(imageUrl);
    setnewImage(imageUrl); //set the image to display it
  };

  //handle selecting of the file
  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div>
      <div>
        <div className='flex flex-col items-center justify-center'>
          <form
            onSubmit={submit}
            style={{ width: 650 }}
            className='flex flex-col space-y-5 px-5 py-14'>
            <input onChange={fileSelected} type='file' accept='image/*'></input>
            <input
              value={newImage}
              onChange={(e) => setnewImage(e.target.value)}
              type='text'
              placeholder='Image'></input>
            <button type='submit'>Submit</button>
          </form>
          <img src={newImage} alt='uploaded-img' />{" "}
          {/* is set the caption as the image url - pls change to the correct way*/}
        </div>
      </div>
    </div>
  );
}
