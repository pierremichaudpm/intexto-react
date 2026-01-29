#!/bin/bash

echo "🚀 Démarrage du site Intexto React..."
echo ""

# Kill existing processes
pkill -f "node.*vite" 2>/dev/null
pkill -f "python3 -m http.server" 2>/dev/null
sleep 1

cd "/home/pierre/Documents/Intexto/site intexto/intexto-react"

echo "✅ Serveur prêt!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Ouvrez votre navigateur à:"
echo "   http://localhost:5173"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Start Vite dev server
npm run dev
