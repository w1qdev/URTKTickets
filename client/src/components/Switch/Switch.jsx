import { Switch as ChakraSwitch } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
    getIsShowCompletedTickets,
    switchIsShowDoneTickets,
} from "../../service/store/slices/settings/SettingsTicketsSlice";
import "./Switch.scss";

const Switch = ({ label }) => {
    const dispatch = useDispatch();
    const isShowCompletedTickets = useSelector(getIsShowCompletedTickets);

    const handleSwitchMode = () => {
        dispatch(switchIsShowDoneTickets());
    };

    return (
        <div className="switch-root">
            <label className="switch-root__label" htmlFor="shown-done-tickets">
                {label}
            </label>
            <ChakraSwitch
                className="switch-root__switch"
                id="shown-done-tickets"
                size="md"
                isChecked={isShowCompletedTickets}
                onChange={handleSwitchMode}
            />
        </div>
    );
};

export default Switch;
