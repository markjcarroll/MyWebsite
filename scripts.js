// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const hCaptchaResponse = hcaptcha.getResponse(); // Check if the hCaptcha response exists
    
    if (hCaptchaResponse.length === 0) {
        alert("Please complete the CAPTCHA before submitting."); // Alert if CAPTCHA is not completed
        return false; // Stop form submission
    }

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Collect form data

    // Send the form data using fetch (AJAX request)
    try {
        const response = await fetch('https://formspree.io/f/xovqqwwz', {
            method: 'POST', // Use POST method to send data
            body: formData, // Attach form data as the request body
            headers: {
                'Accept': 'application/json' // Expect a JSON response from the server
            }
        });
        
        const resultMessage = document.getElementById('form-response'); // Element to show messages

        if (response.ok) {
            resultMessage.innerText = '\nMessage sent successfully!'; // Success message
            resultMessage.style.color = 'green'; // Green color for success
            resultMessage.style.display = 'block'; // Make the message visible
            form.reset(); // Clear the form fields
            hcaptcha.reset(); // Reset hCaptcha
        } else {
            const data = await response.json(); // Parse the response JSON
            if (data.errors) {
                resultMessage.innerText = data.errors.map(error => error.message).join(", "); // Show errors if any
            } else {
                resultMessage.innerText = '\nThere was a problem sending your message. Please try again.'; // Generic error
            }
            resultMessage.style.color = 'red'; // Red color for error
            resultMessage.style.display = 'block'; // Make the message visible
        }
    } catch (error) {
        const resultMessage = document.getElementById('form-response'); // Error message element
        resultMessage.innerText = '\nThere was an error sending your message. Please try again.'; // Show error
        resultMessage.style.color = 'red'; // Red color for error
        resultMessage.style.display = 'block'; // Make the message visible
    }
}

// Initialize IntersectionObserver to handle scroll-triggered animations
function initSectionObserver() {
    const sections = document.querySelectorAll('section'); // Get all sections

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add 'visible' class when in view
            } else {
                entry.target.classList.remove('visible'); // Remove 'visible' class when out of view
            }
        });
    }, { threshold: 0.35 }); // Threshold set to 35% visibility

    sections.forEach(section => {
        sectionObserver.observe(section); // Observe each section
    });
}

// DOMContentLoaded event to ensure the DOM is fully loaded before executing code
document.addEventListener("DOMContentLoaded", function() {
    console.log("Portfolio loaded successfully!"); // Log a message when the page is fully loaded

    // Add event listener to the contact form to handle form submission
    document.getElementById('contact-form').addEventListener('submit', handleFormSubmit);

    // Initialize section observer for scroll-triggered animations
    initSectionObserver();
});
