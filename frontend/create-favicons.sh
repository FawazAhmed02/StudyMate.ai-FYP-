#!/bin/bash

# This script generates favicon files from your logo icon
# Make sure you have ImageMagick installed: https://imagemagick.org/

# Source file - use the most detailed icon version
SOURCE_ICON="public/logo-icon-dark-transparent.png"

# Check if source exists
if [ ! -f "$SOURCE_ICON" ]; then
  echo "Error: Source icon not found at $SOURCE_ICON"
  echo "Please save one of your icon files as 'logo-icon.png' in the public directory"
  exit 1
fi

# Generate favicons
echo "Generating favicons from $SOURCE_ICON"

# Standard favicon.ico (multi-size)
convert "$SOURCE_ICON" -background none -resize 16x16 -flatten public/favicon-16.png
convert "$SOURCE_ICON" -background none -resize 32x32 -flatten public/favicon-32.png
convert public/favicon-16.png public/favicon-32.png -background none public/favicon.ico

# Apple Touch Icon
convert "$SOURCE_ICON" -background none -resize 180x180 -flatten public/apple-touch-icon.png

# Android Chrome
convert "$SOURCE_ICON" -background none -resize 192x192 -flatten public/android-chrome-192x192.png
convert "$SOURCE_ICON" -background none -resize 512x512 -flatten public/android-chrome-512x512.png

# Standard PNG icons
convert "$SOURCE_ICON" -background none -resize 16x16 -flatten public/favicon-16x16.png
convert "$SOURCE_ICON" -background none -resize 32x32 -flatten public/favicon-32x32.png

echo "Favicon generation complete!"
echo "The following files were created:"
echo "  - public/favicon.ico"
echo "  - public/favicon-16x16.png"
echo "  - public/favicon-32x32.png"
echo "  - public/apple-touch-icon.png"
echo "  - public/android-chrome-192x192.png"
echo "  - public/android-chrome-512x512.png"

echo "You may now delete the temporary files public/favicon-16.png and public/favicon-32.png"
rm public/favicon-16.png public/favicon-32.png

echo "Remember to save one of your icon files as 'logo-icon.png' in the public directory before running this script." 