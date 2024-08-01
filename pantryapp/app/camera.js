import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box, Button } from "@mui/material";

export const CameraComponent = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const[pictureTaken, setPictureTaken] = useState(false);

  const handleTakePhoto = () => {
    const img = camera.current.takePhoto();
    setImage(img);
    setPictureTaken(true);
  }

  const photoConfirmed = () => {
    console.log("Photo is confirmed.")
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
