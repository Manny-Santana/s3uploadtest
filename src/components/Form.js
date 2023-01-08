import { useState } from "react";
import axios from "axios";

export default function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    // await axios.post("/api/posts", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    const { url } = await fetch("http://localhost:3001/s3Url").then((res) =>
      res.json()
    );

    console.log(url);

    //post the image to the s3 bucket
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: file,
    });

    const imageUrl = url.split("?")[0];
    console.log(imageUrl);
    setCaption(imageUrl); //this needs to change 
  };

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
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type='text'
              placeholder='Caption'></input>
            <button type='submit'>Submit</button>
          </form>
          <img src={caption} alt='uploaded-img' /> {/* is set the caption as the image url - pls change to the correct way*/}
        </div>
      </div>
    </div>
  );
}
