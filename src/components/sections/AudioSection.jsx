import { useTranslation } from "react-i18next";
import MediaSection from "./MediaSection";

const AudioSection = ({ items, onItemClick }) => {
  const { t } = useTranslation();

  return (
    <MediaSection
      title={t("section.audios")}
      items={items}
      type="audio"
      onItemClick={onItemClick}
      id="audios"
    />
  );
};

export default AudioSection;
