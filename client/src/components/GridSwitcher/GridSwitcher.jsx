import "./GridSwitcher.scss";
import GridIcon from "../Icons/GridIcon";
import FlexIcon from "../Icons/FlexIcon";
import { motion } from "framer-motion";

const GridSwitcher = ({
    isGridMode,
    handleSwitchToFlexMode,
    handleSwitchToGridMode,
}) => {
    return (
        <div className="grid-switcher">
            <motion.div
                whileTap={{
                    scale: 0.9,
                }}
                onClick={handleSwitchToGridMode}
                className={`grid ${isGridMode == "true" ? "active" : null}`}
            >
                <GridIcon fill="#0000009e" />
            </motion.div>
            <motion.div
                whileTap={{
                    scale: 0.9,
                }}
                onClick={handleSwitchToFlexMode}
                className={`flex ${isGridMode == "true" ? null : "active"}`}
            >
                <FlexIcon fill="#0000009e" />
            </motion.div>
        </div>
    );
};

export default GridSwitcher;
