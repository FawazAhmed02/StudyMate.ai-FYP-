# Favicon Setup Instructions

To set up favicons for your StudyMate AI application, follow these steps:

## Option 1: Using an Online Favicon Generator (Recommended for Windows)

1. Choose the icon-only version of your logo (the one with the brain and circuit design)
2. Go to [Favicon.io](https://favicon.io/favicon-converter/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Upload your logo icon
4. Download the generated package
5. Extract and place all the favicon files in your `frontend/public` directory:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - android-chrome-192x192.png
   - android-chrome-512x512.png
   - site.webmanifest (already created for you)

## Option 2: Using the Script (for Linux/macOS)

If you have ImageMagick installed:

1. Save your icon-only logo as `logo-icon.png` in the `frontend/public` directory
2. Make the script executable: `chmod +x create-favicons.sh`
3. Run the script: `./create-favicons.sh`
4. The script will generate all necessary favicon files

## Verifying Your Favicons

After adding the favicons:

1. Restart your Next.js development server
2. Open your application in the browser
3. You should now see your icon in the browser tab instead of the default localhost text
4. Check different browsers and devices to ensure the favicon displays correctly

## Troubleshooting

If your favicon isn't showing:
- Clear your browser cache
- Ensure all paths in the `_document.tsx` file are correct
- Verify that the favicon files are in the public directory
- Check the browser developer console for any 404 errors related to favicon files 