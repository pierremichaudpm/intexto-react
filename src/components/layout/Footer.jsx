import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, ArrowRight, Check } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiWhatsapp,
  SiLinkedin,
} from "react-icons/si";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const subscribers = JSON.parse(
        localStorage.getItem("intexto_newsletter") || "[]",
      );
      subscribers.push({
        email: email,
        date: new Date().toISOString(),
      });
      localStorage.setItem("intexto_newsletter", JSON.stringify(subscribers));

      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <>
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon">
            <Mail size={48} />
          </div>
          <h2 className="newsletter-title">{t("footer.stayInformed")}</h2>
          <p className="newsletter-subtitle">{t("footer.newsletter")}</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder={t("footer.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`newsletter-btn ${isSubscribed ? "subscribed" : ""}`}
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Check size={20} />
                  <span>{t("footer.subscribed")}</span>
                </>
              ) : (
                <>
                  <span>{t("footer.subscribe")}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="newsletter-privacy">{t("footer.privacy")}</p>
        </div>
      </section>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <img
                src="/Images/intextologo2.png"
                alt="Intexto"
                className="footer-logo"
              />
            </div>

            <div className="footer-col">
              <h3>{t("footer.followUs")}</h3>
              <div className="social-links">
                <a href="https://www.facebook.com/jnnuma/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="facebook"><SiFacebook size={18} /></a>
                <a href="https://www.instagram.com/jnnuma/reels/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="instagram"><SiInstagram size={18} /></a>
                <a href="https://x.com/jeannuma" target="_blank" rel="noopener noreferrer" aria-label="X" className="twitter"><SiX size={16} /></a>
                <a href="https://www.linkedin.com/in/jean-numa-goudou-a27ab130/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="linkedin"><SiLinkedin size={18} /></a>
                <a href="https://wa.me/14383951256" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="whatsapp"><SiWhatsapp size={18} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h3>{t("footer.contact")}</h3>
              <p>info@intexto.ca</p>
              <p>Montréal, Québec</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
