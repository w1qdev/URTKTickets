import "./GridSwitcher.scss";
import GridIcon from "../Icons/GridIcon";
import FlexIcon from "../Icons/FlexIcon";

const GridSwitcher = ({
    isGridMode = false,
    handleSwitchToFlexMode,
    handleSwitchToGridMode,
}) => {
    return (
        <div className="grid-switcher">
            <div
                onClick={handleSwitchToGridMode}
                className={`grid ${isGridMode ? "active" : null}`}
            >
                <GridIcon fill="#0000009e" />
            </div>
            <div
                onClick={handleSwitchToFlexMode}
                className={`flex ${isGridMode ? null : "active"}`}
            >
                <FlexIcon fill="#0000009e" />
            </div>
        </div>
    );
};

export default GridSwitcher;
