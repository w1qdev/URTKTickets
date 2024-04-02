import {
    Menu as ChakraMenu,
    MenuButton,
    Button as ChakraButton
  } from '@chakra-ui/react' 
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'


const MenuFilter = ({ title, isIncreasing, handleClick }) => {
    return (
        <ChakraMenu>
            <MenuButton  
                fontWeight={"400"} 
                fontSize={13} 
                className="room"
                onClick={handleClick} 
                as={ChakraButton} 
                rightIcon={isIncreasing ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
                {title}
            </MenuButton>
        </ChakraMenu>
    )
}


export default MenuFilter