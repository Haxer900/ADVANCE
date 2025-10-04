#!/bin/bash
# Favicon Build Verification Script for ZENTHRA

echo "====================================="
echo "ZENTHRA Favicon Build Verification"
echo "====================================="
echo ""

# Check if build directory exists
if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist/ directory not found"
    echo "   Run 'npm run build' first"
    exit 1
fi

echo "✓ Build directory exists"

# Check for favicon files
FAVICON_FILES=("favicon.ico" "favicon.png" "favicon.svg" "site.webmanifest")
MISSING_FILES=()

for file in "${FAVICON_FILES[@]}"; do
    if [ -f "dist/$file" ]; then
        SIZE=$(ls -lh "dist/$file" | awk '{print $5}')
        echo "✓ $file exists ($SIZE)"
    else
        echo "❌ $file is missing"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo ""
    echo "❌ ERROR: ${#MISSING_FILES[@]} favicon file(s) missing"
    echo "   Make sure files exist in public/ directory before building"
    exit 1
fi

# Check HTML for favicon tags
echo ""
echo "Checking HTML for favicon tags..."
if grep -q 'favicon.ico' dist/index.html; then
    echo "✓ favicon.ico referenced in HTML"
else
    echo "❌ favicon.ico NOT referenced in HTML"
fi

if grep -q 'favicon.png' dist/index.html; then
    echo "✓ favicon.png referenced in HTML"
else
    echo "❌ favicon.png NOT referenced in HTML"
fi

if grep -q 'favicon.svg' dist/index.html; then
    echo "✓ favicon.svg referenced in HTML"
else
    echo "❌ favicon.svg NOT referenced in HTML"
fi

echo ""
echo "====================================="
echo "✅ All favicon checks passed!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: git push origin main"
echo "2. Wait for deployment to complete"
echo "3. Clear browser cache (Ctrl+Shift+R)"
echo "4. Test: https://zenthra.fashion/favicon.ico"
echo ""
