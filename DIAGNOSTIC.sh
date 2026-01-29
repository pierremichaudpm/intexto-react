#!/bin/bash

echo "========================================="
echo "🔍 DIAGNOSTIC INTEXTO REACT"
echo "========================================="
echo ""

echo "1️⃣  Vérification Node.js..."
node --version
npm --version
echo ""

echo "2️⃣  Vérification des dépendances..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules existe"
    echo "   Packages installés: $(ls node_modules | wc -l)"
else
    echo "❌ node_modules manquant - Exécutez: npm install"
fi
echo ""

echo "3️⃣  Vérification du build..."
if [ -d "dist" ]; then
    echo "✅ Build existe"
    ls -lh dist/
else
    echo "❌ Build manquant - Exécutez: npm run build"
fi
echo ""

echo "4️⃣  Vérification des ports..."
echo "Port 5173 (dev):"
lsof -i :5173 2>/dev/null || echo "   Port libre"
echo "Port 8080 (python):"
lsof -i :8080 2>/dev/null || echo "   Port libre"
echo ""

echo "5️⃣  Test de compilation..."
npm run build 2>&1 | tail -10
echo ""

echo "========================================="
echo "📋 INSTRUCTIONS"
echo "========================================="
echo ""
echo "Pour lancer le site:"
echo "  1. npm run dev"
echo "  2. Ouvrez http://localhost:5173"
echo ""
echo "Ou pour le build:"
echo "  1. npm run build"
echo "  2. npm run preview"
echo "  3. Ouvrez http://localhost:4173"
echo ""
echo "========================================="
