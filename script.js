Solution: Inject a Valid Image into #pdf-image
Here’s the snippet you can add before calling html2pdf(), to make sure the image is valid:

✅ 🔧 Code Snippet: Inject Product Image Dynamically
js
Copy
Edit
const imageElement = document.querySelector('#product-image img'); // or your actual main image selector
const pdfImageContainer = document.getElementById('pdf-image');

if (imageElement && pdfImageContainer) {
  const imageUrl = imageElement.src;
  pdfImageContainer.innerHTML = `<img src="${imageUrl}" style="max-width: 100%;">`;
}
📌 Place this just before the html2pdf().set({ ... }).from(...).save(); line in your #download-pdf event.

🧠 Why This Works:
It takes the actual visible image on your product page

Injects it inside #pdf-image using a real image src

Ensures html2canvas can render it without 404

✅ Final Result:
PDF only downloads once ✅

Product data appears ✅

Image loads properly ✅

No more errors in console ✅

Clean filename like DUVA-C329...pdf ✅

