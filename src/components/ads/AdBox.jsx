import { motion } from "framer-motion";

const studioMichoHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; overflow: hidden; }
  .banner-300 {
    width: 300px; height: 250px;
    background: linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%);
    position: relative; overflow: hidden; cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    display: flex; flex-direction: column;
    border: 1px solid rgba(74, 144, 226, 0.3);
  }
  .banner-300::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 200%; height: 2px;
    background: linear-gradient(90deg, transparent, #4A90E2, #9B59B6, #F39C12, transparent);
    animation: slideGlow 3s linear infinite;
  }
  .banner-300::after {
    content: ''; position: absolute; bottom: 0; right: 0;
    width: 200%; height: 2px;
    background: linear-gradient(90deg, transparent, #F39C12, #9B59B6, #4A90E2, transparent);
    animation: slideGlow 3s linear infinite reverse;
  }
  @keyframes slideGlow { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
  .side-line-left {
    position: absolute; top: 0; left: 0; width: 2px; height: 200%;
    background: linear-gradient(180deg, transparent, #4A90E2, #9B59B6, transparent);
    animation: slideVertical 4s linear infinite; z-index: 2;
  }
  .side-line-right {
    position: absolute; top: 0; right: 0; width: 2px; height: 200%;
    background: linear-gradient(180deg, transparent, #9B59B6, #4A90E2, transparent);
    animation: slideVertical 4s linear infinite reverse; z-index: 2;
  }
  @keyframes slideVertical { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }
  .orb { position: absolute; border-radius: 50%; filter: blur(30px); z-index: 0; }
  .orb-1 { width: 140px; height: 140px; background: #4A90E2; opacity: 0.12; top: -40px; right: -20px; animation: floatOrb 7s ease-in-out infinite; }
  .orb-2 { width: 100px; height: 100px; background: #9B59B6; opacity: 0.1; bottom: 20px; left: -20px; animation: floatOrb 9s ease-in-out infinite reverse; }
  .orb-3 { width: 70px; height: 70px; background: #F39C12; opacity: 0.08; top: 80px; left: 40%; animation: floatOrb 6s ease-in-out infinite 2s; }
  @keyframes floatOrb { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  .banner-content {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%; padding: 24px 20px 20px;
    position: relative; z-index: 1; text-align: center; gap: 12px;
  }
  .brand { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 4px; text-transform: uppercase; }
  .divider-h { width: 60px; height: 2px; background: linear-gradient(90deg, #4A90E2, #9B59B6, #F39C12); }
  .tagline-main {
    font-size: 12px; font-weight: 700;
    background: linear-gradient(90deg, #4A90E2, #9B59B6, #F39C12);
    background-size: 200% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 4s linear infinite; line-height: 1.4;
  }
  @keyframes gradientShift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
  .services { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 2px; }
  .service-tag {
    font-size: 8px; font-weight: 700; color: rgba(255,255,255,0.5);
    letter-spacing: 1px; text-transform: uppercase;
    padding: 3px 8px; border: 1px solid rgba(255,255,255,0.15);
  }
  .pitch { font-size: 9px; color: rgba(255,255,255,0.45); font-weight: 400; letter-spacing: 0.5px; }
  .cursor {
    display: inline-block; width: 7px; height: 12px; background: #4A90E2;
    margin-left: 3px; animation: blink 1s step-end infinite; vertical-align: middle;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 24px; background: #4A90E2; color: #030712;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 1.5px; text-decoration: none;
    transition: all 0.3s ease; position: relative; overflow: hidden; margin-top: 4px;
  }
  .cta-btn::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%; background: #9B59B6;
    transition: left 0.3s ease; z-index: -1;
  }
  .banner-300:hover .cta-btn::before { left: 0; }
  .banner-300:hover .cta-btn { color: #fff; }
  .cta-arrow { font-size: 13px; transition: transform 0.3s ease; }
  .banner-300:hover .cta-arrow { transform: translateX(3px); }
</style>
</head>
<body>
<a href="https://studiomicho.com" target="_blank" style="text-decoration: none;">
  <div class="banner-300">
    <div class="side-line-left"></div>
    <div class="side-line-right"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="banner-content">
      <div class="brand">Studio Micho</div>
      <div class="divider-h"></div>
      <div class="tagline-main">Produits num&#233;riques<br>&#224; v&#233;locit&#233; IA<span class="cursor"></span></div>
      <div class="services">
        <span class="service-tag">Sites</span>
        <span class="service-tag">Apps</span>
        <span class="service-tag">SEO</span>
        <span class="service-tag">Marketing</span>
      </div>
      <div class="pitch">Livraison ultra-rapide</div>
      <div class="cta-btn">Parlons-en <span class="cta-arrow">&#8594;</span></div>
    </div>
  </div>
</a>
</body>
</html>`;

const visionMax300Html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; overflow: hidden; }
  a.wrap { text-decoration: none; display: inline-block; }
  .banner {
    width: 300px; height: 250px;
    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d3f 50%, #1a1a2e 100%);
    position: relative; overflow: hidden; cursor: pointer;
    display: flex; flex-direction: column;
  }
  .pink-bar {
    position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, #E91E8C, #ff5eac, #E91E8C);
    background-size: 200% auto; animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
  .glow { position: absolute; right: -30px; top: -30px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%); }
  .glow2 { position: absolute; left: -20px; bottom: -20px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%); }
  .content {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%; padding: 20px;
    position: relative; z-index: 1; text-align: center; gap: 10px;
  }
  .logo img { height: 50px; width: auto; }
  .divider { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, #E91E8C, transparent); }
  .headline { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 800; color: #fff; line-height: 1.2; }
  .pink { color: #E91E8C; }
  .tags { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
  .tag {
    font-family: 'Open Sans', sans-serif; font-size: 8px;
    color: rgba(255,255,255,0.55); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.6px;
    padding: 3px 7px; border: 1px solid rgba(233,30,140,0.25);
  }
  .bottom { display: flex; align-items: center; gap: 14px; }
  .exp { text-align: center; }
  .exp-num { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #E91E8C; line-height: 1; }
  .exp-lbl { font-family: 'Open Sans', sans-serif; font-size: 7px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; }
  .cta {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 20px; background: #E91E8C; color: #fff;
    font-family: 'Open Sans', sans-serif; font-size: 10px;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; border-radius: 20px; transition: all 0.3s ease;
  }
  .banner:hover .cta { background: #ff5eac; }
  .arr { font-size: 12px; transition: transform 0.3s ease; }
  .banner:hover .arr { transform: translateX(3px); }
</style>
</head>
<body>
<a class="wrap" href="https://visionmaxservices.net/" target="_blank">
  <div class="banner">
    <div class="pink-bar"></div>
    <div class="glow"></div>
    <div class="glow2"></div>
    <div class="content">
      <div class="logo">
        <img src="https://visionmaxservices.net/wp-content/uploads/2024/10/Nouveau-logo-sans-bg-e1728259683259.webp" alt="Vision Max Services">
      </div>
      <div class="divider"></div>
      <div class="headline">Services d'immigration<br><span class="pink">certifi&#233;s</span></div>
      <div class="tags">
        <span class="tag">Visa</span>
        <span class="tag">Asile</span>
        <span class="tag">Parrainage</span>
        <span class="tag">Travail</span>
        <span class="tag">&#201;tudes</span>
      </div>
      <div class="bottom">
        <div class="exp">
          <div class="exp-num">20+</div>
          <div class="exp-lbl">ans exp.</div>
        </div>
        <div class="cta">D&#233;couvrez <span class="arr">&#8594;</span></div>
      </div>
    </div>
  </div>
</a>
</body>
</html>`;

const AdBox = ({ position = "sidebar" }) => {
  const html = position === "sidebar" ? visionMax300Html : studioMichoHtml;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`promo-box promo-box-${position}`}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <iframe
        srcDoc={html}
        title={position === "sidebar" ? "Studio Micho" : "Vision Max Services"}
        width="300"
        height="250"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
      />
      <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
        Publicit&#233;
      </div>
    </motion.div>
  );
};

export default AdBox;
