import React, { forwardRef } from 'react'
import {useState} from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Popper, Snackbar} from "@mui/material"
import {firestore} from '@/firebase'
import {collection} from 'firebase/firestore'
import {doc, getDocs, query, setDoc, deleteDoc, getDoc} from 'firebase/firestore'


const style = {
    position: 'relative',
    top: '-5%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const PoppupSearchBox = forwardRef(({openSearch, handleCloseSearch}, ref) => {
    const [itemName, setItemName] = useState('');
    const [pantry, setPantry] = useState([])
    const [openError, setOpenError] = useState(false)
    const handleErrorClose = () => setOpenError(false);

    // const [openSearch, setOpenSearch] = useState(true);
    // const handleSearchClose = handleCloseSearch;

    const searchItem = async (item) => {
        try{
            const docRef = doc(collection(firestore, 'pantry'), item)
            const docSnap = await getDoc(docRef)
        
            if(docSnap.exists()) {
                const pantryList = []
                pantryList.push({name: docSnap.id, ...docSnap.data()})
                setPantry(pantryList)
            } else {
            setOpenError(true)
            }
        }
        catch(e){
            setOpenError(true)
        }
    }

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, 'pantry'), item)
        // Check if it exists
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const count = docSnap.data().count + 1
          await setDoc(docRef, {count})
        } else{
          await setDoc(docRef, {count: 1})
        }
    
        await searchItem(item)
      }
    
      const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'pantry'), item)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
          const count = docSnap.data().count
          if (count == 1) {
            await deleteDoc(docRef)
          } else {
          await setDoc(docRef, {count: count - 1})
          }
          await searchItem(item)
        }
      }

    return (
    <Box justifyContent={"center"} display={"flex"} alignItems={"center"} flexDirection={'column'} width="100vw" height="100vh">
        <Snackbar
            open={openError}
            autoHideDuration={1000}
            onClose={handleErrorClose}
            message="Item not found"
            // action={action}
        />
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Search Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
            />
            <Button
                variant="outlined"
                onClick={() => {
                searchItem(itemName)
                //   handleCloseSearch()
                }}
            >Search</Button>
            </Stack>
        </Box>
        <Box justifyContent={"center"} display={"flex"} alignItems={"center"} flexDirection={'column'}>
            <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
                {pantry.map(({name, count}) => (
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
                    Quantity:{count}
                    </Typography>
                    <Box gap={2} justifyContent={"center"} display={"flex"}>
                    <Button variant="contained"
                        onClick={() => addItem(name)}
                    >Add</Button>
                    <Button variant="contained"
                        onClick={() => removeItem(name)}
                    >Remove</Button>
                    </Box>
                </Box>
                ))}
            </Stack>
        </Box>
        <Button variant="contained" onClick={handleCloseSearch}>Close</Button>
    </Box>
    )
});

PoppupSearchBox.displayName = 'PoppupSearchBox';
export default PoppupSearchBox;