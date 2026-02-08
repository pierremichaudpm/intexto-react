import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const partnerCardA = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { margin: 0; padding: 0; overflow: hidden; }
a.wrap { text-decoration: none; display: inline-block; }
.card-wrap {
  width: 300px; height: 250px;
  background: linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%);
  position: relative; overflow: hidden; cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  display: flex; flex-direction: column;
  border: 1px solid rgba(74, 144, 226, 0.3);
}
.lt { position: absolute; top: 0; left: 0; width: 200%; height: 2px; background: linear-gradient(90deg, transparent, #4A90E2, #9B59B6, #F39C12, transparent); animation: sg 3s linear infinite; }
.lb { position: absolute; bottom: 0; right: 0; width: 200%; height: 2px; background: linear-gradient(90deg, transparent, #F39C12, #9B59B6, #4A90E2, transparent); animation: sg 3s linear infinite reverse; }
.sl { position: absolute; top: 0; left: 0; width: 2px; height: 200%; background: linear-gradient(180deg, transparent, #4A90E2, #9B59B6, transparent); animation: sv 4s linear infinite; z-index: 2; }
.sr { position: absolute; top: 0; right: 0; width: 2px; height: 200%; background: linear-gradient(180deg, transparent, #9B59B6, #4A90E2, transparent); animation: sv 4s linear infinite reverse; z-index: 2; }
@keyframes sg { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
@keyframes sv { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }
.orb { position: absolute; border-radius: 50%; filter: blur(30px); z-index: 0; }
.o1 { width: 140px; height: 140px; background: #4A90E2; opacity: 0.12; top: -40px; right: -20px; animation: fo 7s ease-in-out infinite; }
.o2 { width: 100px; height: 100px; background: #9B59B6; opacity: 0.1; bottom: 20px; left: -20px; animation: fo 9s ease-in-out infinite reverse; }
@keyframes fo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.inner {
  display: flex; flex-direction: column; align-items: center;
  justify-content: space-between; height: 100%;
  padding: 24px 24px 22px; position: relative; z-index: 1;
  text-align: center;
}
.brand { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 4px; text-transform: uppercase; }
.divider { width: 60px; height: 2px; background: linear-gradient(90deg, #4A90E2, #9B59B6, #F39C12); }
.type-wrap { height: 18px; white-space: nowrap; }
#t2 { font-size: 12px; font-weight: 700; }
#c2 { display: inline-block; width: 8px; height: 14px; vertical-align: middle; animation: bk 0.7s step-end infinite; }
@keyframes bk { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.sub { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 400; letter-spacing: 0.5px; }
.action { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; background: #4A90E2; color: #030712; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; transition: all 0.3s ease; position: relative; overflow: hidden; }
.action::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: #9B59B6; transition: left 0.3s ease; z-index: -1; }
.card-wrap:hover .action::before { left: 0; }
.card-wrap:hover .action { color: #fff; }
.arrow { font-size: 13px; transition: transform 0.3s ease; }
.card-wrap:hover .arrow { transform: translateX(3px); }
</style>
</head>
<body>
<a class="wrap" href="https://studiomicho.com" target="_blank">
  <div class="card-wrap">
    <div class="lt"></div><div class="lb"></div>
    <div class="sl"></div><div class="sr"></div>
    <div class="orb o1"></div><div class="orb o2"></div>
    <div class="inner">
      <div class="brand">Studio Micho</div>
      <div class="divider"></div>
      <div class="type-wrap"><span id="t2"></span><span id="c2"></span></div>
      <div class="sub">Livraison ultra-rapide</div>
      <div class="action">Parlons-en <span class="arrow">&#8594;</span></div>
    </div>
  </div>
</a>
<script>
var ph=[{t:"Sites & apps a velocite IA",c:"#4A90E2"},{t:"SEO & strategie de contenu",c:"#9B59B6"},{t:"Marketing & transformation",c:"#F39C12"}];
var el=document.getElementById("t2"),cu=document.getElementById("c2"),pi=0,ci=0,del=false;
function tk(){var p=ph[pi];el.style.color=p.c;cu.style.background=p.c;if(!del){el.textContent=p.t.substring(0,ci+1);ci++;if(ci>=p.t.length){del=true;setTimeout(tk,1800);return;}setTimeout(tk,60);}else{el.textContent=p.t.substring(0,ci);ci--;if(ci<0){del=false;ci=0;pi=(pi+1)%ph.length;setTimeout(tk,400);return;}setTimeout(tk,30);}}
tk();
</script>
</body>
</html>`;

const partnerCardB = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 0; overflow: hidden; }
  a.wrap { text-decoration: none; display: inline-block; }
  .card-wrap {
    width: 300px; height: 250px;
    background: linear-gradient(135deg, #1a1a2e 0%, #2d2d3f 50%, #1a1a2e 100%);
    position: relative; overflow: hidden; cursor: pointer;
    display: flex; flex-direction: column;
  }
  .accent-bar {
    position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: linear-gradient(90deg, #E91E8C, #ff5eac, #E91E8C);
    background-size: 200% auto; animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
  .glow { position: absolute; right: -30px; top: -30px; width: 160px; height: 160px; background: radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%); }
  .glow2 { position: absolute; left: -20px; bottom: -20px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%); }
  .inner {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%; padding: 20px;
    position: relative; z-index: 1; text-align: center; gap: 10px;
  }
  .logo img { height: 50px; width: auto; }
  .sep { width: 50px; height: 2px; background: linear-gradient(90deg, transparent, #E91E8C, transparent); }
  .title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 800; color: #fff; line-height: 1.2; }
  .pink { color: #E91E8C; }
  .items { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
  .item {
    font-family: 'Open Sans', sans-serif; font-size: 8px;
    color: rgba(255,255,255,0.55); font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.6px;
    padding: 3px 7px; border: 1px solid rgba(233,30,140,0.25);
  }
  .foot { display: flex; align-items: center; gap: 14px; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #E91E8C; line-height: 1; }
  .stat-lbl { font-family: 'Open Sans', sans-serif; font-size: 7px; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.5px; }
  .action {
    display: flex; align-items: center; gap: 5px;
    padding: 9px 20px; background: #E91E8C; color: #fff;
    font-family: 'Open Sans', sans-serif; font-size: 10px;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; border-radius: 20px; transition: all 0.3s ease;
  }
  .card-wrap:hover .action { background: #ff5eac; }
  .arrow { font-size: 12px; transition: transform 0.3s ease; }
  .card-wrap:hover .arrow { transform: translateX(3px); }
</style>
</head>
<body>
<a class="wrap" href="https://visionmaxservices.net/" target="_blank">
  <div class="card-wrap">
    <div class="accent-bar"></div>
    <div class="glow"></div>
    <div class="glow2"></div>
    <div class="inner">
      <div class="logo">
        <img src="https://visionmaxservices.net/wp-content/uploads/2024/10/Nouveau-logo-sans-bg-e1728259683259.webp" alt="Vision Max Services">
      </div>
      <div class="sep"></div>
      <div class="title">Services d'immigration<br><span class="pink">certifi&#233;s</span></div>
      <div class="items">
        <span class="item">Visa</span>
        <span class="item">Asile</span>
        <span class="item">Parrainage</span>
        <span class="item">Travail</span>
        <span class="item">&#201;tudes</span>
      </div>
      <div class="foot">
        <div class="stat">
          <div class="stat-num">20+</div>
          <div class="stat-lbl">ans exp.</div>
        </div>
        <div class="action">D&#233;couvrez <span class="arrow">&#8594;</span></div>
      </div>
    </div>
  </div>
</a>
</body>
</html>`;

const AdBox = ({ position = "sidebar", ad }) => {
  const { t } = useTranslation();
  const html =
    ad === "visionmax"
      ? partnerCardB
      : ad === "studiomicho"
        ? partnerCardA
        : position === "sidebar"
          ? partnerCardA
          : partnerCardB;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`partner-card partner-card-${position}`}
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
        {"Publicité"}
      </div>
    </motion.div>
  );
};

export default AdBox;
