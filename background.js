// === Red Dot SVG Path Tracer ===

// Wait for the DOM and background SVG to be ready
document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector("svg");
  if (!svg) return;

  // Create the red dot element
  const dot = document.createElement("div");
  dot.classList.add("tracing-dot");
  document.body.appendChild(dot);

  // Get all visible paths to animate
  const paths = svg.querySelectorAll("path");
  let totalLength = 0;

  // Convert all paths into segments with cumulative lengths
  const segments = [];
  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    if (length === 0) return;

    const color = getComputedStyle(path).stroke;
    path.style.stroke = color || "#C0392B";
    path.style.strokeWidth = "1.5";
    path.style.fill = "none";
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.animation = `draw 4s linear forwards ${index * 0.5}s`;

    segments.push({ path, length, offset: totalLength });
    totalLength += length;
  });

  // Animate red dot over time
  let startTime = null;
  function animateDot(time) {
    if (!startTime) startTime = time;
    const elapsed = (time - startTime) / 1000;
    const speed = 100; // pixels per second
    const distance = elapsed * speed;

    if (distance > totalLength) {
      dot.style.display = "none"; // hide the dot at end
      return;
    }

    // Find current path segment
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (distance < seg.offset + seg.length) {
        const t = (distance - seg.offset) / seg.length;
        const point = seg.path.getPointAtLength(t * seg.length);
        dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
        break;
      }
    }

    requestAnimationFrame(animateDot);
  }

  requestAnimationFrame(animateDot);
});
