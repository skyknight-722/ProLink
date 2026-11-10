#!/bin/bash

# Test script for ProjectLink Web Application

echo "Testing ProjectLink Web Application..."
echo ""

# Check if files exist
if [ ! -f "index.html" ]; then
    echo "❌ ERROR: index.html not found"
    exit 1
fi

if [ ! -f "css/style.css" ]; then
    echo "❌ ERROR: css/style.css not found"
    exit 1
fi

if [ ! -f "js/app.js" ]; then
    echo "❌ ERROR: js/app.js not found"
    exit 1
fi

echo "✅ All required files found"
echo ""

# Check file contents
echo "Checking HTML structure..."
if grep -q "ProjectLink" index.html && grep -q "css/style.css" index.html; then
    echo "✅ HTML structure looks good"
else
    echo "❌ ERROR: HTML structure issues"
    exit 1
fi

echo ""
echo "Checking CSS..."
if grep -q "color: var(--primary)" css/style.css && grep -q "background: linear-gradient" css/style.css; then
    echo "✅ CSS styling looks good"
else
    echo "❌ ERROR: CSS styling issues"
    exit 1
fi

echo ""
echo "Checking JavaScript..."
if grep -q "function init()" js/app.js && grep -q "\.modal" js/app.js; then
    echo "✅ JavaScript functionality looks good"
else
    echo "❌ ERROR: JavaScript functionality issues"
    exit 1
fi

echo ""
echo "Testing functionality..."
echo "Run the test.html file in a browser to test the application"
echo ""
echo "ProjectLink Web Application is ready for testing!"
echo ""
echo "To test:" && echo "1. Open test.html in your browser to see the test page" && echo "2. Open index.html to view the main application" && echo "3. Check the console for any JavaScript errors" && echo "4. Test the filtering, modals, and forms functionality" && echo ""

