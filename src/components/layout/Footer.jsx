import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/Images/intextologo.png" alt="Intexto" className="footer-logo" />
            <p>Journal haïtien moderne - Informations, analyses et perspectives.</p>
          </div>

          <div className="footer-col">
            <h3>Navigation</h3>
            <ul>
              <li><a href="#">Actualité</a></li>
              <li><a href="#">Politique</a></li>
              <li><a href="#">Voyage</a></li>
              <li><a href="#">Culture</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Suivez-nous</h3>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={24} />
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
  );
};

export default Footer;
