import { useTranslation } from "react-i18next";
import { Mail, ArrowRight } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiWhatsapp,
  SiLinkedin,
} from "react-icons/si";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon">
            <Mail size={48} />
          </div>
          <h2 className="newsletter-title">{t("footer.stayInformed")}</h2>
          <p className="newsletter-subtitle">
            Recevez les dernières actualités de la communauté dans votre boîte
            mail. Inscription gratuite&nbsp;!
          </p>
          <a
            href="https://intexto.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="newsletter-btn"
          >
            <span>{t("footer.subscribe")}</span>
            <ArrowRight size={18} />
          </a>
          <p className="newsletter-privacy">
            En vous inscrivant, vous acceptez notre{" "}
            <a href="#">politique de confidentialité</a>. Désinscription
            possible à tout moment.
          </p>
        </div>
      </section>

      {/* Main Footer */}
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
                <a
                  href="https://www.facebook.com/jnnuma/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="facebook"
                >
                  <SiFacebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/jnnuma/reels/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="instagram"
                >
                  <SiInstagram size={18} />
                </a>
                <a
                  href="https://x.com/jeannuma"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="twitter"
                >
                  <SiX size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/jean-numa-goudou-a27ab130/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="linkedin"
                >
                  <SiLinkedin size={18} />
                </a>
                <a
                  href="https://wa.me/14383951256"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="whatsapp"
                >
                  <SiWhatsapp size={18} />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h3>{t("footer.contact")}</h3>
              <p>info@intexto.ca</p>
              <p>Montréal, Québec</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Intexto. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
