
// Adds the keyframe animation for the scan line
export const addScanLineKeyframe = () => {
  if (document.styleSheets.length > 0) {
    const styleSheet = document.styleSheets[0];
    try {
      styleSheet.insertRule(`
        @keyframes scanline {
          0% { top: 0; }
          50% { top: 100%; }
          50.1% { top: 0; }
          100% { top: 100%; }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      console.error("Impossible d'ajouter la règle CSS pour l'animation de scan:", e);
    }
  }
};
