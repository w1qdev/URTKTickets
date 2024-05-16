import "./GridSwitcher.scss";
import GridIcon from "../Icons/GridIcon";
import FlexIcon from "../Icons/FlexIcon";

const GridSwitcher = ({
    isGridMode,
    handleSwitchToFlexMode,
    handleSwitchToGridMode,
}) => {
    return (
        <div className="grid-switcher">
            <div
                onClick={handleSwitchToGridMode}
                className={`grid ${isGridMode == "true" ? "active" : null}`}
            >
                <GridIcon fill="#0000009e" />
            </div>
            <div
                onClick={handleSwitchToFlexMode}
                className={`flex ${isGridMode == "true" ? null : "active"}`}
            >
                <FlexIcon fill="#0000009e" />
            </div>
        </div>
    );
};

export default GridSwitcher;
