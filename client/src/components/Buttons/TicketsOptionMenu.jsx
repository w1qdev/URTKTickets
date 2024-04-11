import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const TicketOptionMenu = ({ children }) => {
    return (
        <Menu>
            <MenuButton variant="unstyled" as={Button}>
                {children}
                <ChevronDownIcon />
            </MenuButton>
            <MenuList>
                <MenuItem>Action 1</MenuItem>
                <MenuItem>Action 2</MenuItem>
                <MenuItem>Action 3</MenuItem>
            </MenuList>
        </Menu>
    );
};

export default TicketOptionMenu;
