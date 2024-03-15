import CloseIcon from '../Icons/CloseIcon'
import { motion } from 'framer-motion'
import './Popup.scss'


const Popup = ({ title="Просмотр заявки", popupStatus, chuldren, popupHandler }) => {
    return (
        <motion.div 
            className="popup"
            onClick={popupHandler}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: 0.2 }}
        >
            <motion.div 
                className="popup__container"
                onClick={e => e.stopPropagation()}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 , transition: 0.3}}
                exit={{ scale: 0.95, opacity: 0, transition: 0.2 }}
                transition={{ duration: 0.4 }}
            >
                <div className="popup__container__header">
                    <div className="header__title">
                        <div className="header__title-text">{title}</div>
                        <div className="header__title-popup-status">{popupStatus}</div>
                    </div>
                    <div 
                        className="header__close"
                        onClick={popupHandler}
                    >
                        <CloseIcon className='close-icon' />
                    </div>
                </div>

                <div className="popup__container__body">
                    {chuldren}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Popup