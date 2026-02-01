import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiWhatsapp } from "react-icons/si";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Store in localStorage
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
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-icon">
            <Mail size={48} />
          </div>
          <h2 className="newsletter-title">Restez informé</h2>
          <p className="newsletter-subtitle">
            Recevez les dernières actualités de la communauté dans votre boîte
            mail. Inscription gratuite&nbsp;!
          </p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Votre adresse email"
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
                  <span>Inscrit !</span>
                </>
              ) : (
                <>
                  <span>S'abonner</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
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
              <h3>Suivez-nous</h3>
              <div className="social-links">
                <a
                  href="https://www.facebook.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="facebook"
                >
                  <SiFacebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="instagram"
                >
                  <SiInstagram size={18} />
                </a>
                <a
                  href="https://x.com/intexto"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="twitter"
                >
                  <SiX size={16} />
                </a>
                <a
                  href="https://wa.me/15141234567"
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
              <h3>Contact</h3>
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
