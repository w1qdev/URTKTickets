import { 
    MenuOptionGroup as ChakraMenuOptionGroup,
    MenuDivider,
    MenuItem,
  } from '@chakra-ui/react' 


const MenuOptionGroup = ({ title, handleClick, menuItemsList }) => {
    return (
        <>
            <ChakraMenuOptionGroup title={title}>
                {menuItemsList.length && menuItemsList.map(menuItem => (
                    <MenuItem key={menuItem.id} onClick={handleClick}>{menuItem.title}</MenuItem>
                ))}
            </ChakraMenuOptionGroup>
            <MenuDivider />
        </>
    )
}   


export default MenuOptionGroup;