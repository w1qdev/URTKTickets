import InfoIcon from '../Icons/InfoIcon';
import './Notification.scss'


const Notification = ({ text, type="success" }) => {
    return (
        <div className={`notification ${type}`}>
            <InfoIcon className="notification__icon" />
            <div className="notification__text">
                {text}
            </div>
        </div>
    )
}

export default Notification;