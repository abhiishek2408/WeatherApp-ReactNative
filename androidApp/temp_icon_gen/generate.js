const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/hp/Desktop/WeatherApp/androidApp/assets/custom_icon.png';
const resDir = 'C:/Users/hp/Desktop/WeatherApp/androidApp/android/app/src/main/res';

const sizes = {
  'mipmap-mdpi': { adaptive: 108, legacy: 48 },
  'mipmap-hdpi': { adaptive: 162, legacy: 72 },
  'mipmap-xhdpi': { adaptive: 216, legacy: 96 },
  'mipmap-xxhdpi': { adaptive: 324, legacy: 144 },
  'mipmap-xxxhdpi': { adaptive: 432, legacy: 192 }
};

async function generateIcons() {
  const image = await Jimp.read(srcPath);
  
  // Crop transparent edges
  image.autocrop({ tolerance: 0 });
  
  for (const folder of Object.keys(sizes)) {
    const { adaptive, legacy } = sizes[folder];
    const targetDir = path.join(resDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 1. Generate legacy icons
    const legacyImg = image.clone();
    const legacyCoreSize = Math.floor(legacy * 0.8);
    legacyImg.scaleToFit({ w: legacyCoreSize, h: legacyCoreSize });
    
    const legacyCanvas = new Jimp({ width: legacy, height: legacy, color: 0x00000000 });
    const lgX = Math.floor((legacy - legacyImg.bitmap.width) / 2);
    const lgY = Math.floor((legacy - legacyImg.bitmap.height) / 2);
    legacyCanvas.composite(legacyImg, lgX, lgY);
    
    await legacyCanvas.write(path.join(targetDir, 'ic_launcher.png'));
    await legacyCanvas.write(path.join(targetDir, 'ic_launcher_round.png'));
    
    // 2. Generate adaptive foreground
    const adaptiveImg = image.clone();
    const safeZone = Math.floor(adaptive * (72 / 108));
    const targetSafeZone = Math.floor(safeZone * 0.75);
    adaptiveImg.scaleToFit({ w: targetSafeZone, h: targetSafeZone });
    
    const adaptiveCanvas = new Jimp({ width: adaptive, height: adaptive, color: 0x00000000 });
    const adX = Math.floor((adaptive - adaptiveImg.bitmap.width) / 2);
    const adY = Math.floor((adaptive - adaptiveImg.bitmap.height) / 2);
    adaptiveCanvas.composite(adaptiveImg, adX, adY);
    
    await adaptiveCanvas.write(path.join(targetDir, 'ic_launcher_foreground.png'));
  }
  
  console.log('High-res icons with text removed successfully generated!');
}

generateIcons().catch(err => console.error(err));
