import './AdministratorTicketsPage.scss'
import CreateTicketButton from '../components/Buttons/CreateTicketButton';
import URTKLogo from '../assets/logo/urtkLogo.png'
import PlusIcon from '../components/Icons/PlusIcon'
import BlueLine from '../assets/other/blue-line.png'
import { AnimatePresence } from 'framer-motion'
import TicketsContainer from '../components/TicketsContainer/TicketsContainer';
import { getCurrentDate } from '../helpers/utils';
import { useState } from 'react';
import CreateTicketPopup from '../components/Popups/CreateTicketPopup';

const AdministratorTicketsPage = () => {

    const currentDate = getCurrentDate()
    const userRole = localStorage.getItem('role')
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    
    const handleOpenPopup = () => setIsPopupOpen(prev => !prev)


    return (
        <>
            <AnimatePresence>
                {isPopupOpen ? <CreateTicketPopup popupHandler={handleOpenPopup} /> : null}
            </AnimatePresence>
            <div className="administrator-tickets-page">
                <div className="container">
                    <div className="administrator-tickets-page__header">
                        <div className="administrator-tickets-page__header-title">УрТК НИЯУ МИФИ</div>
                        <div className="administrator-tickets-page__header-other">
                            <div className="logo">
                                <img src={URTKLogo} />
                            </div>
                            { userRole.includes("administrator") 
                            ? (<div className="current-time">{currentDate}</div>) 
                            : (
                                <CreateTicketButton handleOpenPopup={setIsPopupOpen} className="create-ticket__button" >
                                    <div className="button__text">Создать заявку</div>
                                    <PlusIcon width="20px" height="20px" fill="#7075F1" />
                                </CreateTicketButton>
                            )}
                        </div>
                    </div>

                    <TicketsContainer />
                </div>

                {/* <div className="line">
                    <img src={BlueLine} />
                </div> */}

            </div>
        </>
        
    )
}

export default AdministratorTicketsPage;