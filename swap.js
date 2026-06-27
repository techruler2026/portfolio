const fs = require('fs');
const file = 'c:\\Users\\CHANDHAN\\Desktop\\portfolio\\index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Rename About Us to About Me
content = content.replace(/>About Us</g, '>About Me<');

// 2. Swap Services and About Me sections
// Find Services section
const servicesStart = content.indexOf('  <!-- ===================== SERVICES SECTION ===================== -->');
const aboutStart = content.indexOf('  <!-- ===================== ABOUT SECTION ===================== -->');
const experienceStart = content.indexOf('  <!-- ===================== EXPERIENCE SECTION ===================== -->');

if (servicesStart !== -1 && aboutStart !== -1 && experienceStart !== -1) {
    const servicesBlock = content.substring(servicesStart, aboutStart);
    const aboutBlock = content.substring(aboutStart, experienceStart);
    
    const beforeServices = content.substring(0, servicesStart);
    const afterAbout = content.substring(experienceStart);
    
    // Swap them!
    const newContent = beforeServices + aboutBlock + servicesBlock + afterAbout;
    fs.writeFileSync(file, newContent, 'utf8');
    console.log("Successfully swapped and renamed!");
} else {
    console.log("Could not find section markers.");
}
