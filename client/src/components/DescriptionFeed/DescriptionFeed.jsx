import "./DescriptionFeed.scss";

const DescriptionFeed = ({
    descriptionText,
    isCreatingDescription = false,
}) => {
    return (
        <>
            {descriptionText && isCreatingDescription === false ? (
                <>
                    <div className="description-title">Комментарий</div>
                    <div className="description-feed">{descriptionText}</div>
                </>
            ) : null}
        </>
    );
};

export default DescriptionFeed;
