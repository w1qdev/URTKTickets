// import {
//     Menu as ChakraMenu,
//     MenuButton,
//     Button as ChakraButton
//   } from '@chakra-ui/react' 

  import { Button } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'


const MenuFilterButton = ({ title, isIncreasing, handleClick }) => {
    return (

        <Button 
            // colorScheme='whatsapp' 
            variant='solid'
            fontWeight={"400"} 
            fontSize={13} 
            className="room"
            onClick={handleClick} 
            rightIcon={isIncreasing ? <ChevronUpIcon color="white.500" /> : <ChevronDownIcon color="white.500" />}
        >
            {title}
        </Button>
    )
}


export default MenuFilterButton