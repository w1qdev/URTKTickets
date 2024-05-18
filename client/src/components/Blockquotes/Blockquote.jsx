import InfoIcon from "../Icons/InfoIcon";
import "./Blockquote.scss";

const Blockquote = ({ text, type = "success" }) => {
    return (
        <div className={`notification ${type}`}>
            <InfoIcon className="notification__icon" />
            <div className="notification__text">{text}</div>
        </div>
    );
};

export default Blockquote;
