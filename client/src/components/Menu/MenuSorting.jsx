import {
    Menu as ChakraMenu,
    MenuButton,
    MenuList,
    Button,
    MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import "./MenuSorting.scss";

const MenuSorting = ({ currentSortStatus }) => {
    return (
        <ChakraMenu>
            <MenuButton
                fontWeight={"400"}
                fontSize={14}
                height="37px"
                className="menu-sorting"
                as={Button}
                style={{ backgroundColor: "#fff" }}
                rightIcon={<ChevronDownIcon />}
            >
                {currentSortStatus}
            </MenuButton>
            <MenuList
                padding="2px 2px 2px 2px"
                borderRadius="4px"
                minWidth="200"
                fontSize="15px"
                maxHeight="450px"
                overflowX="hidden"
                className="menu-sorting__content"
            >
                <MenuItem className="menu-sorting__item">
                    <div className="item__title">Дате создания</div>
                </MenuItem>
                <MenuItem className="menu-sorting__item">
                    <div className="item__title">Алфавиту</div>
                </MenuItem>
            </MenuList>
        </ChakraMenu>
    );
};

export default MenuSorting;
