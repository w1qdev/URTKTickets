import {
    Menu as ChakraMenu,
    MenuButton,
    MenuList,
    MenuItem,
    Button as ChakraButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { addColorPropertyToMenuPriorityItems } from "../../helpers/utils";

const MenuPriorityFilter = ({
    menuItems,
    defaultMenuTitle,
    handleClick,
    menuSelectedItem,
    maxWidth,
    prefix,
}) => {
    const updatedMenuItems = addColorPropertyToMenuPriorityItems(menuItems);

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
                {menuSelectedItem ? (
                    <>
                        {prefix} {menuSelectedItem}
                    </>
                ) : (
                    defaultMenuTitle
                )}
            </MenuButton>
            <MenuList
                padding="3px 0px 3px 0px"
                minWidth="200px"
                fontSize={14}
                maxHeight="200px"
                overflow="auto"
            >
                {updatedMenuItems.length
                    ? updatedMenuItems.map((menuItem) => (
                          <MenuItem
                              style={{ color: menuItem.color }}
                              key={menuItem.id}
                              onClick={handleClick}
                          >
                              {menuItem.title}
                          </MenuItem>
                      ))
                    : null}
            </MenuList>
        </ChakraMenu>
    );
};

export default MenuPriorityFilter;
