import CloseIcon from '../Icons/CloseIcon'
import './Popup.scss'


const Popup = ({ title, popupStatus, chuldren }) => {
    return (
        <div className="popup">
            <div className="popup__container">
                <div className="popup__container__header">
                    <div className="header__title">
                        <div className="header__title-text">{title}</div>
                        <div className="header__title-popup-status">{popupStatus}</div>
                    </div>
                    <div className="header__close">
                        <img src={CloseIcon} alt="close" />
                    </div>
                </div>

                <div className="popup__container__body">
                    {chuldren}
                </div>
            </div>
        </div>
    )
}

export default Popup