import './AdministratorTicketsPage.scss'
import URTKLogo from '../assets/logo/urtkLogo.png'
import BlueLine from '../assets/other/blue-line.png'

import TicketsContainer from '../components/TicketsContainer/TicketsContainer';
import { getCurrentDate } from '../helpers/utils';

const AdministratorTicketsPage = () => {

    const currentDate = getCurrentDate()

    return (
        <>
            <div className="administrator-tickets-page">
                <div className="container">
                    <div className="administrator-tickets-page__header">
                        <div className="administrator-tickets-page__header-title">УрТК НИЯУ МИФИ</div>
                        <div className="administrator-tickets-page__header-other">
                            <div className="logo">
                                <img src={URTKLogo} />
                            </div>
                            <div className="current-time">{currentDate}</div>
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