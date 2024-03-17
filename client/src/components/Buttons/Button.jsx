import './Button.scss'


const Button = ({ children, bgColor, clickHandler }) => {
    return (
        <button
            onClick={clickHandler}
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

