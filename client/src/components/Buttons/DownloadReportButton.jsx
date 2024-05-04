import { motion } from "framer-motion";
import "./Button.scss";

const DownloadReportButton = ({ children, onClick }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="button download"
        >
            {children}
        </motion.button>
    );
};

export default DownloadReportButton;
