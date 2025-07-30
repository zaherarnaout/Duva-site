// === SVG Background Tracing Animation ===
// Background animation for DUVA website
// This file handles the SVG tracing animation with red dot and stroke effects

console.log('🎨 Background animation script loaded!');

// === SVG Background Tracing Animation ===
function initializeSVGTracingAnimation() {
  console.log('🎨 Initializing SVG tracing animation...');
  
  // Find the background SVG
  const backgroundSVG = document.querySelector('svg[class*="duva-main-background"], svg[class*="background"], svg[id*="background"], svg[data-background="true"]');
  
  if (!backgroundSVG) {
    console.log('⚠️ Background SVG not found, creating demo animation');
    createDemoSVGAnimation();
    return;
  }
  
  console.log('✅ Background SVG found:', backgroundSVG);
  
  // Get all paths in the SVG
  const paths = backgroundSVG.querySelectorAll('path');
  console.log(`📊 Found ${paths.length} paths to trace`);
  
  if (paths.length === 0) {
    console.log('⚠️ No paths found in SVG');
    return;
  }
  
  // Create tracing dot
  const tracingDot = createTracingDot();
  backgroundSVG.appendChild(tracingDot);
  
  // Create stroke overlay for drawing effect
  const strokeOverlay = createStrokeOverlay();
  backgroundSVG.appendChild(strokeOverlay);
  
  // Start the tracing animation
  startTracingAnimation(paths, tracingDot, strokeOverlay);
}

function createTracingDot() {
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', '0');
  dot.setAttribute('cy', '0');
  dot.setAttribute('r', '3');
  dot.setAttribute('fill', '#C0392B');
  dot.setAttribute('class', 'tracing-dot');
  dot.style.filter = 'drop-shadow(0 0 4px #C0392B)';
  dot.style.opacity = '0';
  dot.style.transition = 'opacity 0.3s ease';
  
  return dot;
}

function createStrokeOverlay() {
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  overlay.setAttribute('class', 'stroke-overlay');
  overlay.style.pointerEvents = 'none';
  
  return overlay;
}

function startTracingAnimation(paths, tracingDot, strokeOverlay) {
  let currentPathIndex = 0;
  let currentProgress = 0;
  const animationSpeed = 0.02; // Adjust for speed
  const pathDelay = 500; // Delay between paths in ms
  
  function animatePath() {
    if (currentPathIndex >= paths.length) {
      console.log('✅ Tracing animation complete');
      return;
    }
    
    const path = paths[currentPathIndex];
    const pathLength = path.getTotalLength();
    
    console.log(`🎨 Tracing path ${currentPathIndex + 1}/${paths.length}`);
    
    function tracePath() {
      if (currentProgress >= 1) {
        // Path complete, move to next
        currentPathIndex++;
        currentProgress = 0;
        
        if (currentPathIndex < paths.length) {
          setTimeout(animatePath, pathDelay);
        } else {
          console.log('✅ All paths traced');
        }
        return;
      }
      
      // Get point along path
      const point = path.getPointAtLength(currentProgress * pathLength);
      
      // Update tracing dot position
      tracingDot.setAttribute('cx', point.x);
      tracingDot.setAttribute('cy', point.y);
      tracingDot.style.opacity = '1';
      
      // Create stroke segment
      createStrokeSegment(path, currentProgress, strokeOverlay);
      
      // Update progress
      currentProgress += animationSpeed;
      
      // Continue animation
      requestAnimationFrame(tracePath);
    }
    
    // Start tracing this path
    tracePath();
  }
  
  // Start the animation
  setTimeout(animatePath, 1000); // Initial delay
}

function createStrokeSegment(path, progress, strokeOverlay) {
  const pathLength = path.getTotalLength();
  const segmentLength = pathLength * 0.02; // Segment size
  
  // Create a stroke segment
  const strokePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  strokePath.setAttribute('d', path.getAttribute('d'));
  strokePath.setAttribute('fill', 'none');
  strokePath.setAttribute('stroke', '#C0392B');
  strokePath.setAttribute('stroke-width', '2');
  strokePath.setAttribute('stroke-linecap', 'round');
  strokePath.setAttribute('stroke-linejoin', 'round');
  strokePath.style.strokeDasharray = `${segmentLength} ${pathLength}`;
  strokePath.style.strokeDashoffset = pathLength - (progress * pathLength);
  strokePath.style.opacity = '0.8';
  
  strokeOverlay.appendChild(strokePath);
  
  // Remove old segments to prevent memory issues
  setTimeout(() => {
    if (strokePath.parentNode) {
      strokePath.parentNode.removeChild(strokePath);
    }
  }, 5000);
}

function createDemoSVGAnimation() {
  console.log('🎨 Creating demo SVG animation...');
  
  // Create a demo SVG if no background SVG is found
  const demoContainer = document.createElement('div');
  demoContainer.className = 'demo-svg-container';
  demoContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    opacity: 0.1;
  `;
  
  const demoSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  demoSVG.setAttribute('width', '100%');
  demoSVG.setAttribute('height', '100%');
  demoSVG.setAttribute('viewBox', '0 0 1000 600');
  
  // Create demo paths
  const paths = [
    'M 100,300 Q 200,100 300,300 T 500,300',
    'M 500,300 Q 600,100 700,300 T 900,300',
    'M 100,400 L 300,400 L 300,200 L 500,200',
    'M 500,200 L 700,200 L 700,400 L 900,400'
  ];
  
  paths.forEach((pathData, index) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#333');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('opacity', '0.3');
    demoSVG.appendChild(path);
  });
  
  demoContainer.appendChild(demoSVG);
  document.body.appendChild(demoContainer);
  
  // Start animation with demo paths
  const demoPaths = demoSVG.querySelectorAll('path');
  const tracingDot = createTracingDot();
  const strokeOverlay = createStrokeOverlay();
  
  demoSVG.appendChild(tracingDot);
  demoSVG.appendChild(strokeOverlay);
  
  startTracingAnimation(demoPaths, tracingDot, strokeOverlay);
}

// Initialize SVG tracing animation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeSVGTracingAnimation();
});

// Export functions for potential external use
window.SVGTracingAnimation = {
  initialize: initializeSVGTracingAnimation,
  createDemo: createDemoSVGAnimation
}; 