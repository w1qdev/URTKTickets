import './Button.scss'


const CreateTicketButton = ({ className, children, handleOpenPopup }) => {

    const handleCreateTicket = () => {
        handleOpenPopup(prev => !prev)
    
    }

    return (
        <button 
            className={className}
            onClick={handleCreateTicket}
        >
            {children}</button>
    )
}


export default CreateTicketButton;