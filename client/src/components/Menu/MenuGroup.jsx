import {
    Menu as ChakraMenu,
    MenuButton,
    MenuList,
    Button as ChakraButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import MenuOptionGroup from "./MenuOptionGroup";

const MenuGroup = ({
    menuItems,
    defaultMenuTitle,
    handleClick,
    menuSelectedItem,
}) => {
    return (
        <ChakraMenu>
            <MenuButton
                className="room"
                as={ChakraButton}
                rightIcon={<ChevronDownIcon />}
                fontWeight={400}
            >
                {menuSelectedItem ? (
                    <>№ {menuSelectedItem}</>
                ) : (
                    defaultMenuTitle
                )}
            </MenuButton>
            <MenuList minWidth="240px" maxHeight="200px" overflow="auto">
                {menuItems.length &&
                    menuItems.map((menuItem) => (
                        <MenuOptionGroup
                            key={menuItem.menuOptionGroupTitle}
                            title={menuItem.menuOptionGroupTitle}
                            handleClick={handleClick}
                            menuItemsList={menuItem.items}
                        />
                    ))}
            </MenuList>
        </ChakraMenu>
    );
};

export default MenuGroup;
