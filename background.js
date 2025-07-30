// === SVG Background Tracing Animation ===
function initializeSVGTracingAnimation() {
  const backgroundSVG = document.querySelector('svg.duva-main-background');

  if (!backgroundSVG) {
    console.warn('SVG not found.');
    return;
  }

  const paths = backgroundSVG.querySelectorAll('path');
  if (paths.length === 0) {
    console.warn('No paths to trace.');
    return;
  }

  // Create the red dot
  const dot = document.createElement('div');
  dot.classList.add('tracing-dot');
  document.body.appendChild(dot);

  // Helper: get total length and set initial styles
  paths.forEach(path => {
    path.style.stroke = '#C0392B';
    path.style.strokeWidth = '2';
    path.style.fill = 'none';
    path.style.strokeDasharray = path.getTotalLength();
    path.style.strokeDashoffset = path.getTotalLength();
    path.style.animation = 'draw 4s ease forwards';
  });

  // Animate the red dot along paths
  let currentPath = 0;
  function traceNextPath() {
    if (currentPath >= paths.length) return;

    const path = paths[currentPath];
    const length = path.getTotalLength();
    let start = null;

    function animateDot(time) {
      if (!start) start = time;
      const progress = (time - start) / 2000; // 2 seconds per path
      const point = path.getPointAtLength(progress * length);
      dot.style.transform = `translate(${point.x}px, ${point.y}px)`;

      if (progress < 1) {
        requestAnimationFrame(animateDot);
      } else {
        currentPath++;
        setTimeout(traceNextPath, 500); // pause before next
      }
    }

    requestAnimationFrame(animateDot);
  }

  traceNextPath();
}

document.addEventListener('DOMContentLoaded', initializeSVGTracingAnimation);
