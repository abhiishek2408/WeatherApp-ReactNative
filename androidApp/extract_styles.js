const fs = require('fs');
const code = fs.readFileSync('WeatherAppWithPicker.js', 'utf8');
const styleStart = code.indexOf('const styles = StyleSheet.create({');
if (styleStart !== -1) {
  const stylesCode = code.substring(styleStart);
  fs.writeFileSync('src/utils/styles.js', "import { StyleSheet, Platform } from 'react-native';\n\nexport " + stylesCode);
  console.log("Styles extracted");
} else {
  console.error("Styles not found");
}
