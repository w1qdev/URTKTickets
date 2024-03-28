import './Button.scss'


const Button = ({ children, bgColor, onClick }) => {
    return (
        <button
            onClick={onClick}
            className='button'
            style={{ 
                backgroundColor: `${bgColor}`,
            }}
        >
            {children}
        </button>
    )
}


export default Button;

