import { useTranslation } from "react-i18next";
import HeroCard from "../common/HeroCard";

const HeroSection = ({ items, onItemClick }) => {
  const { t } = useTranslation();

  if (!items || items.length === 0) return null;

  const mainItem = items[0];
  const sideItems = items.slice(1, 3);

  return (
    <section className="hero-section" aria-label={t("hero.headline")}>
      <div className="hero-section__grid">
        <div className="hero-section__main">
          <HeroCard
            item={mainItem.item}
            type={mainItem.type}
            onClick={onItemClick}
            priority={true}
          />
        </div>

        {sideItems.length > 0 && (
          <div className="hero-section__side">
            {sideItems.map((entry) => (
              <HeroCard
                key={`${entry.type}-${entry.item.id}`}
                item={entry.item}
                type={entry.type}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
