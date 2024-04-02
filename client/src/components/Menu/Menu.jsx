import {
    Menu as ChakraMenu,
    MenuButton,
    MenuList,
    MenuItem,
    Button as ChakraButton
  } from '@chakra-ui/react' 
import { ChevronDownIcon } from '@chakra-ui/icons'


const Menu = ({ menuItems, defaultMenuTitle, handleClick, menuSelectedItem, maxWidth, prefix }) => {

    return (
        <ChakraMenu>
            <MenuButton 
                maxWidth={maxWidth} 
                fontWeight={"400"} 
                fontSize={13} 
                className="room" 
                as={ChakraButton} 
                rightIcon={<ChevronDownIcon />}
            >
                {
                    menuSelectedItem 
                    ? ( <>{prefix} {menuSelectedItem}</> ) 
                    : defaultMenuTitle
                }
            </MenuButton>
            <MenuList minWidth='240px' maxHeight='200px' overflow="auto">
                {menuItems.length ? menuItems.map(menuItem => (
                    <MenuItem 
                        key={menuItem.id} 
                        onClick={handleClick}  
                    >{menuItem.title}</MenuItem>                     
                )) : null}
            </MenuList>
        </ChakraMenu>
    )
}


export default Menu;