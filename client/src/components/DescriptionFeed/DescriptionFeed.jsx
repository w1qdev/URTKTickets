import "./DescriptionFeed.scss";
import { Tooltip } from "@chakra-ui/react";
import TrashIcon from "../Icons/TrashIcon";
import EditIcon from "../Icons/EditIcon";
import { AnimatePresence, motion } from "framer-motion";

const DescriptionFeed = ({
    descriptionText,
    isCreatingDescription = false,
    isRemovable = false,
    handleRemoveDescription,
    handleEditDescription,
}) => {
    return (
        <>
            {descriptionText && isCreatingDescription === false ? (
                <div className="description__container">
                    <div className="description-title">Комментарий</div>

                    <div className="description-feed">
                        <div className="description">{descriptionText}</div>

                        {isRemovable ? (
                            <div className="enviroment">
                                <Tooltip
                                    hasArrow
                                    label="Редактировать комментарий"
                                    placement="top"
                                    bg="gray.700"
                                >
                                    <button
                                        onClick={handleEditDescription}
                                        className="enviroment edit"
                                    >
                                        <EditIcon
                                            className="edit-icon"
                                            width="20px"
                                            height="20px"
                                        />
                                    </button>
                                </Tooltip>

                                <Tooltip
                                    hasArrow
                                    label="Удалить описание"
                                    placement="top"
                                    bg="gray.700"
                                >
                                    <button
                                        onClick={() =>
                                            handleRemoveDescription()
                                        }
                                        className="enviroment remove"
                                    >
                                        <TrashIcon
                                            className="trash-icon"
                                            width="20px"
                                            height="20px"
                                        />
                                    </button>
                                </Tooltip>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default DescriptionFeed;
