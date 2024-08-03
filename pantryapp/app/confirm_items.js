"use client"
import React, { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, TextField, Modal } from "@mui/material"

const style = {
    position: 'relative',
    top: '0%',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const ConfirmItems = ({ cameraItems, addItem, handleCameraHasItems }) => {
    const [open, setOpen] = useState(true);
    const handleClose = () => setOpen(false);

    const [cameraLocalItems, setCameraLocalItems] = useState([]);

    // Process and set camera items
    useEffect(() => {
        const processedItems = processCameraItems(cameraItems);
        setCameraLocalItems(processedItems);
    }, []);

    const processCameraItems = (items) => {
        const counts = {};
      
        items.forEach(item => {
          for (const key in item) {
            if (key !== 'name') continue;
            const name = item[key];
            counts[name] = (counts[name] || 0) + 1;
          }
        });

        return Object.keys(counts).map(name => ({
            name,
            count: counts[name],
        }));
    }

    const addLocalItem = (itemName) => {
        // Update the local state
        setCameraLocalItems(prevItems =>
            prevItems.map(item =>
                item.name === itemName
                    ? { ...item, count: item.count + 1 }
                    : item
            )
        );
    }

    const removeLocalItem = (itemName) => {
        // Update the local state
        setCameraLocalItems(prevItems =>
            prevItems.map(item =>
                item.name === itemName
                    ? { ...item, count: Math.max(item.count - 1, 0) }
                    : item
            )
        );
    }

    const updateAndClose = () => {
        // Update the global state
        cameraLocalItems.forEach(({ name, count }) => {
            console.log(count)
            for (let i = 0; i < count; i++) {
                name = name.charAt(0).toUpperCase() + name.slice(1)
                addItem(name, count);
            }
        });

        handleCameraHasItems();

        // Close the modal
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box justifyContent={"center"} display={"flex"} alignItems={"center"} flexDirection={'column'} width="100vw" height="100vh">
                <Box justifyContent={"center"} display={"flex"} alignItems={"center"} flexDirection={'column'}>
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" alignContent={"center"}>
                            Confirm Items to be Added
                        </Typography>
                    </Box>
                    <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
                        {cameraLocalItems.map(({ name, count }) => (
                            <Box
                                key={name}
                                width="100%"
                                minHeight="150px"
                                display={"flex"}
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                bgcolor={"#f0f0f0"}
                                paddingX={5}
                            >
                                <Typography
                                    variant={"h3"}
                                    color={"#333"}
                                    textAlign={"center"}
                                >
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </Typography>

                                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                                    Quantity: {count}
                                </Typography>
                                <Box gap={2} justifyContent={"center"} display={"flex"}>
                                    <Button
                                        variant="contained"
                                        onClick={() => addLocalItem(name)}
                                    >Add</Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => removeLocalItem(name)}
                                    >Remove</Button>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                <Button
                    variant="contained"
                    onClick={updateAndClose}
                    >
                    Confirm
                </Button>
            </Box>
        </Modal>
    )
};

export default ConfirmItems;
