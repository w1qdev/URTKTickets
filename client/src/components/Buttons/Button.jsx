import "./Button.scss";

const Button = ({ children, bgColor, onClick, isDisabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className="button"
            style={{
                backgroundColor: `${bgColor}`,
            }}
        >
            {children}
        </button>
    );
};

export default Button;
