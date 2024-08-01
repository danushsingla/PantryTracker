import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box, Button } from "@mui/material";
import { storage } from "@/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

export const CameraComponent = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const[pictureTaken, setPictureTaken] = useState(false);

  const handleTakePhoto = () => {
    const img = camera.current.takePhoto();
    setImage(img);
    setPictureTaken(true);
  }

  // Because webcam images are base64 encoded, we need to convert it to a blob
  const dataURLToBlob = (dataURL) => {
    const [header, data] = dataURL.split(',');
    const mime = header.split(':')[1].split(';')[0];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
  };

  const photoConfirmed = () => {
    if(image) {
        const blob = dataURLToBlob(image);
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Progress bar
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            },
            (error) => {
                console.error(error);
            },
            () => {
                console.log('Upload complete');
            }
        );
    }
}

  const imgStyle = {
    width: '100%', // Adjust width as needed
    height: 'auto', // Adjust height as needed
    maxWidth: '700px', // Example max width
    maxHeight: '700px' // Example max height
  };

  return (
    <Box style={imgStyle} display={"flex"} gap={1} flexDirection={"column"} alignItems={"center"}>
      <Camera ref={camera} aspectRatio={16 / 9} style={imgStyle}/>
      <Button variant={"contained"} onClick={handleTakePhoto}>Take photo</Button>
      {image && <img src={image} style={imgStyle} alt='Taken photo' />}
      {pictureTaken && (
        <Button
          variant="contained"
          onClick={photoConfirmed}
        >
          Continue
        </Button>
      )}
    </Box>
  );
}

export default CameraComponent;
