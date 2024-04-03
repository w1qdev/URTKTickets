import './AdministratorTicketsPage.scss'
import CreateTicketButton from '../components/Buttons/CreateTicketButton';
import URTKLogo from '../assets/logo/urtkLogo.png'
import PlusIcon from '../components/Icons/PlusIcon'
// import BlueLine from '../assets/other/blue-line.png'
import { AnimatePresence, motion } from 'framer-motion'
import TicketsContainer from '../components/TicketsContainer/TicketsContainer';
import { getCurrentDate, dateFormatter } from '../helpers/utils';
import { Button, Stack } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import CreateTicketPopup from '../components/Popups/CreateTicketPopup';


const AdministratorTicketsPage = () => {

    const [isUsingFilters, setIsUsingFilters] = useState(false)
    const [isFilterClear, setIsFilterClear] = useState(false)
    const currentDate = dateFormatter(getCurrentDate())
    const userRole = localStorage.getItem('role') || ""
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
                            <Stack direction='row' align='end'>
                                {isUsingFilters ? (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: 0.2 }}
                                            exit={{ opacity: 0, transition: 0.2 }}    
                                        >
                                            <Button
                                                colorScheme='red' 
                                                variant='ghost'
                                                fontWeight={"400"} 
                                                fontSize={14} 
                                                className="room"                         
                                                rightIcon={<RepeatIcon />}
                                                onClick={() => setIsFilterClear(prev => true)}
                                            >
                                                Сбросить фильтры
                                            </Button>
                                        </motion.div>
                                    </AnimatePresence>
                                ) : null}

                                { userRole.includes("administrator") 
                                ? (<div className="current-time">{currentDate}</div>) 
                                : (

                                    <CreateTicketButton 
                                        handleOpenPopup={setIsPopupOpen} 
                                        className="create-ticket__button"
                                    >
                                        <div className="button__text">Создать заявку</div>
                                        <PlusIcon width="20px" height="20px" fill="#7075F1" />
                                    </CreateTicketButton>
                                )}
                            </Stack>                    
                        </div>
                    </div>

                    <TicketsContainer
                        handleUsingFilters={setIsUsingFilters}
                        setIsFilterClear={setIsFilterClear}
                        isUsingFilters={isUsingFilters}
                        isFilterClear={isFilterClear}
                    />
                </div>

                {/* <div className="line">
                    <img src={BlueLine} />
                </div> */}

            </div>
        </>
        
    )
}

export default AdministratorTicketsPage;