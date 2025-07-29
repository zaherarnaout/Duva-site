console.log("DUVA accessories.js loaded!");

/* === Accessories Image Zoom on Hover (Constrained to Container) === */ 

document.querySelectorAll('.accessory-image').forEach(container => { 
  const img = container.querySelector('img'); 
  
  container.style.overflow = 'hidden'; // Keeps zoomed image inside the box 
  
  container.addEventListener('mouseenter', () => { 
    img.classList.add('zoomed'); 
  }); 
  
  container.addEventListener('mousemove', e => { 
    const rect = container.getBoundingClientRect(); 
    const x = ((e.clientX - rect.left) / rect.width) * 100; 
    const y = ((e.clientY - rect.top) / rect.height) * 100; 
    img.style.transformOrigin = `${x}% ${y}%`; 
  }); 
  
  container.addEventListener('mouseleave', () => { 
    img.classList.remove('zoomed'); 
    img.style.transformOrigin = 'center center'; 
  }); 
}); 

// === Accessories Checkbox Script === 
document.querySelectorAll('.accessory-checkbox').forEach(box => { 
  box.addEventListener('click', function () { 
    this.classList.toggle('active'); 
  }); 
}); 

// === Accessories Toggle Functionality ===
document.addEventListener("DOMContentLoaded", function () { 
  const toggle = document.querySelector(".accessories-toggle"); 
  const wrapper = document.querySelector(".accessories-wrapper"); 
  const arrow = document.querySelector(".accessories-arrow"); 
  const section = document.querySelector(".accessories-section"); 

  if (toggle && wrapper && arrow && section) { 
    toggle.addEventListener("click", function () { 
      const isOpen = section.classList.toggle("open"); 
      arrow.classList.toggle("rotated"); 

      if (isOpen) { 
        // Expand to actual scroll height 
        wrapper.style.maxHeight = wrapper.scrollHeight + "px"; 
      } else { 
        // Collapse 
        wrapper.style.maxHeight = "0px"; 
      } 
    }); 
  } 
}); 

// === Inject Accessories Divider (Max Width 2000px) === 
document.addEventListener('DOMContentLoaded', function () { 
  const accessoriesSection = document.querySelector(".accessories-section"); 
  if (accessoriesSection) { 
    const wrapper = document.createElement("div"); 
    wrapper.style.display = "flex"; 
    wrapper.style.justifyContent = "center"; 
    wrapper.style.marginTop = "24px"; 

    const divider = document.createElement("div"); 
    divider.style.width = "100%"; 
    divider.style.maxWidth = "2000px"; 
    divider.style.height = "1px"; 
    divider.style.backgroundColor = "#e0e0e0"; 

    wrapper.appendChild(divider); 
    accessoriesSection.after(wrapper); 
  } 
}); 

// === Accessory Injection for PDF ===
function injectSelectedAccessories() {
  // Find the PDF accessories container
  const pdfAccessoriesContainer = document.querySelector('#pdf-container .accessories-pdf-section');
  if (!pdfAccessoriesContainer) {
    console.log('⚠️ PDF accessories container not found');
    return;
  }

  // Find all selected accessories (checkboxes that are active/checked)
  const selectedAccessories = document.querySelectorAll('.accessory-checkbox.active, .accessory-checkbox.checked, .accessory-checkbox[data-selected="true"]');
  
  console.log('🔍 Found selected accessories:', selectedAccessories.length);
  selectedAccessories.forEach((acc, i) => {
    console.log(`  ${i + 1}. Checkbox:`, acc);
    console.log(`     Classes:`, acc.className);
    console.log(`     Parent item:`, acc.closest('.accessory-item'));
  });
  
  if (selectedAccessories.length === 0) {
    // Hide accessories section if none selected
    pdfAccessoriesContainer.style.display = 'none';
    console.log('ℹ️ No accessories selected, hiding accessories section');
    return;
  }

  // Show accessories section
  pdfAccessoriesContainer.style.display = 'block';
  
  // Clear existing accessories in PDF
  const existingAccessories = pdfAccessoriesContainer.querySelectorAll('.accessory-item');
  console.log('🧹 Clearing existing accessories:', existingAccessories.length);
  existingAccessories.forEach(item => item.remove());

  // Inject each selected accessory
  selectedAccessories.forEach((checkbox, index) => {
    const accessoryItem = checkbox.closest('.accessory-item');
    if (!accessoryItem) {
      console.log(`⚠️ No accessory item found for checkbox ${index + 1}`);
      return;
    }

    // Collect accessory data
    const code = accessoryItem.querySelector('.acc-code')?.textContent?.trim() || '';
    const title = accessoryItem.querySelector('.acc-title')?.textContent?.trim() || '';
    const description = accessoryItem.querySelector('.acc-description')?.textContent?.trim() || '';
    
    console.log(`📋 Accessory ${index + 1} data:`, { code, title, description });
    
    // Get image - try multiple selectors
    const image = accessoryItem.querySelector('.accessory-image .acc-img, .accessory-image img, .acc-img');
    const imageSrc = image?.src || image?.getAttribute('src') || '';
    
    console.log(`🔍 Accessory ${index + 1} image src:`, imageSrc);

    // Create accessory HTML for PDF
    const accessoryHTML = `
      <div class="accessory-item">
        <div class="accessory-image">
          ${imageSrc ? `<img src="${imageSrc}" alt="${title}" style="width: 80px; height: 60px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px; display: block;">` : ''}
        </div>
        <div class="accessory-details">
          <div class="accessory-code">${code}</div>
          <div class="accessory-title">${title}</div>
          <div class="accessory-description">${description}</div>
        </div>
      </div>
    `;

    // Add to PDF container
    pdfAccessoriesContainer.insertAdjacentHTML('beforeend', accessoryHTML);
    console.log(`✅ Injected accessory ${index + 1}: ${title}`);
  });

  console.log(`✅ Total accessories injected: ${selectedAccessories.length}`);
}

function updateAccessoriesSectionVisibility() {
  // Find all accessories sections
  const accessoriesSections = document.querySelectorAll('.accessories-pdf-section');
  // Find all selected accessories (customize selector as needed)
  const selectedAccessories = document.querySelectorAll('.accessory-checkbox.active, .accessory-selected, .accessory-item.selected');
  // If none selected, hide all accessories sections
  if (selectedAccessories.length === 0) {
    accessoriesSections.forEach(section => section.style.display = 'none');
  } else {
    accessoriesSections.forEach(section => section.style.display = '');
  }
}

// Call this after any accessory selection change
document.addEventListener('DOMContentLoaded', function() {
  updateAccessoriesSectionVisibility();
  // If you have accessory checkboxes, add listeners:
  document.querySelectorAll('.accessory-checkbox').forEach(cb => {
    cb.addEventListener('change', updateAccessoriesSectionVisibility);
  });
});

// Export functions for use in other modules
window.accessoriesModule = {
  injectSelectedAccessories,
  updateAccessoriesSectionVisibility
}; 