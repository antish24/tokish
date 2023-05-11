import React, { useRef, useState } from "react";
import { FaFile, FaUpload } from "react-icons/fa";
import styles from "./upload.module.css";
import supabase from "../database/Supabase";
import { Auth } from "../store/Context";
const Upload = () => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [loading, setloading] = useState(false);
  const { currentUser } = Auth();
  const [error, setError] = useState("");
  const [file, setfile] = useState();
  const [errcolor, seterrcolor] = useState(false);
  const [fileload, setfileload] = useState(false);
  const [posturl, setposturl] = useState();
  function chooseFile() {
    fileRef.current.click();
    setfileload(true);
    setError('')
  }
  async function post() {
    if (fileRef.current.value) {
      setloading(true);
      seterrcolor(false);
      setError("uploading");
      const { error } = await supabase
        .from("zposts")
        .insert({ user_id: currentUser.uid, post: posturl });
      if (error) {
        seterrcolor(true);
        setError(error.message);
      } else {
        seterrcolor(false);
        setError("posted");
      }
      setfile();
      setposturl();
      fileRef.current.value = null;
      setfileload(false);
      setloading(false);
    } else {
      seterrcolor(true);
      setError("choose file first");
    }
  }
  async function uploadFile(event) {
    try {
      setError("");
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      let { error: uploadError } = await supabase.storage
        .from("test")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      setposturl(filePath);
      setfile(filePath);
    } catch (error) {
      seterrcolor(true);
      if(error.message==="Failed to fetch")
      setError("try again");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className={styles.box}>
      <div className={styles.filebox}>
        <div className={styles.top}>
          <h2>UPLOAD FILES</h2>
        </div>
        <div className={styles.mid}>
          <FaUpload size={40} color="rgb(0,140,255)" />
          <p>
            Drag & Drop Your File Here <br /> or
          </p>
          <button onClick={chooseFile}>Choose File</button>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            ref={fileRef}
            onChangeCapture={uploadFile}
            style={{ display: "none" }}
          />
        </div>
        <div
          className={styles.bottom}
          style={{ display: fileload ? "flex" : "none" }}
        >
          <FaFile
            style={{ color: uploading ? "rgb(69, 66, 66)" : "rgb(0,140,255)" }}
            size={40}
          />
          <div className={styles.zfile}>
            <div className={styles.filename}>{file}</div>
            <div className={styles.progress}>
              <div
                className={styles.load}
                style={{ display: uploading ? "flex" : "none" }}
              ></div>
              <div
                className={styles.loaddone}
                style={{ display: !uploading ? "flex" : "none" }}
              ></div>
            </div>
          </div>
        </div>
        <button
          className={styles.postbtn}
          style={{ display: fileload ? "flex" : "none" }}
          onClick={post}
          disabled={loading||uploading}
        >
          post
        </button>
        <div 
          style={{
            marginTop: "5px",
            width:'95%',
            height:"40px",
            display:error===''?"none":"flex",
            background:"rgb(0,140,255)",
            alignItems:'center',
            color: errcolor ? "black" : "white",
            borderRadius:"5px",
          }}
        >
          <div style={{marginLeft:"10px"}}>{error}</div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
