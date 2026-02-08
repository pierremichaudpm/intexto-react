import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const STRIP_WIDTH = 728;
const STRIP_HEIGHT = 90;

const partnerStripHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; overflow: hidden; }
  a.wrap { text-decoration: none; display: inline-block; width: 100%; }
  .strip {
    width: 728px; height: 90px;
    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d3f 40%, #1a1a2e 100%);
    position: relative; overflow: hidden; cursor: pointer;
    display: flex; align-items: center;
  }
  .accent-bar {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 3px;
    background: linear-gradient(90deg, #E91E8C, #ff5eac, #E91E8C);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  .glow {
    position: absolute; right: 0; top: 0; width: 280px; height: 100%;
    background: radial-gradient(ellipse at 80% 50%, rgba(233,30,140,0.08) 0%, transparent 70%);
  }
  .logo-area {
    display: flex; align-items: center; padding: 0 18px;
    flex-shrink: 0; height: 100%;
    border-right: 1px solid rgba(233,30,140,0.2);
  }
  .logo-area img { height: 56px; width: auto; }
  .info {
    display: flex; flex-direction: column; gap: 4px;
    padding: 0 16px; flex: 1; position: relative; z-index: 1;
  }
  .title {
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 800; color: #fff; line-height: 1.1;
  }
  .pink { color: #E91E8C; }
  .items { display: flex; gap: 9px; align-items: center; }
  .item {
    font-family: 'Open Sans', sans-serif;
    font-size: 9px; color: rgba(255,255,255,0.7);
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.7px;
  }
  .dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: #E91E8C; opacity: 0.7; flex-shrink: 0;
  }
  .side {
    display: flex; align-items: center; gap: 12px;
    padding-right: 18px; flex-shrink: 0;
  }
  .stat { text-align: center; flex-shrink: 0; }
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 800; color: #E91E8C; line-height: 1;
  }
  .stat-lbl {
    font-family: 'Open Sans', sans-serif;
    font-size: 8px; color: rgba(255,255,255,0.5);
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .action {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 16px; background: #E91E8C; color: #fff;
    font-family: 'Open Sans', sans-serif;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; border-radius: 20px;
    transition: all 0.3s ease;
  }
  .strip:hover .action { background: #ff5eac; }
  .arrow { font-size: 12px; transition: transform 0.3s ease; }
  .strip:hover .arrow { transform: translateX(3px); }
</style>
</head>
<body>
<a class="wrap" href="https://visionmaxservices.net/" target="_blank">
  <div class="strip">
    <div class="accent-bar"></div>
    <div class="glow"></div>
    <div class="logo-area">
      <img src="https://visionmaxservices.net/wp-content/uploads/2024/10/Nouveau-logo-sans-bg-e1728259683259.webp" alt="Vision Max Services">
    </div>
    <div class="info">
      <div class="title">Services d'immigration <span class="pink">certifi&#233;s</span></div>
      <div class="items">
        <span class="item">Visa</span><span class="dot"></span>
        <span class="item">Asile</span><span class="dot"></span>
        <span class="item">Parrainage</span><span class="dot"></span>
        <span class="item">Permis travail</span><span class="dot"></span>
        <span class="item">Permis &#233;tudes</span>
      </div>
    </div>
    <div class="side">
      <div class="stat">
        <div class="stat-num">20+</div>
        <div class="stat-lbl">ans exp.</div>
      </div>
      <div class="action">D&#233;couvrez <span class="arrow">&#8594;</span></div>
    </div>
  </div>
</a>
</body>
</html>`;

const PartnerStrip = ({ type = "top" }) => {
  const { t } = useTranslation();
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.offsetWidth;
      setScale(w >= STRIP_WIDTH ? 1 : w / STRIP_WIDTH);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`partner-strip partner-strip-${type}`}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          maxWidth: STRIP_WIDTH,
          height: STRIP_HEIGHT * scale,
          overflow: "hidden",
        }}
      >
        <iframe
          srcDoc={partnerStripHtml}
          title="Vision Max Services"
          width={STRIP_WIDTH}
          height={STRIP_HEIGHT}
          style={{
            border: "none",
            display: "block",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
          scrolling="no"
        />
      </div>
      <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
        {"Publicité"}
      </div>
    </motion.div>
  );
};

export default PartnerStrip;
