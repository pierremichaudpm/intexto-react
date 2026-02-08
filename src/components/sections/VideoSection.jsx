import { useTranslation } from "react-i18next";
import MediaSection from "./MediaSection";

const VideoSection = ({ items, onItemClick }) => {
  const { t } = useTranslation();

  return (
    <MediaSection
      title={t("section.videos")}
      items={items}
      type="video"
      onItemClick={onItemClick}
      id="videos"
    />
  );
};

export default VideoSection;
