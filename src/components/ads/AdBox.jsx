import { motion } from "framer-motion";

const AdBox = ({ position = "sidebar" }) => {
  const adSizes = {
    sidebar: "300×250",
    "sidebar-half": "300×250",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`promo-box promo-box-${position}`}
    >
      <div className="promo-box-content">
        <p style={{ fontSize: "1.2rem", color: "#dd4f4f", fontWeight: "700" }}>
          EMPLACEMENT PUBLICITAIRE {adSizes[position] || "300×600"}
        </p>
      </div>
    </motion.div>
  );
};

export default AdBox;
