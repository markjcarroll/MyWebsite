// Event listener that triggers when the entire DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("Portfolio loaded successfully!"); // Log a message to the console when the page is fully loaded
});


document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if the hCaptcha response exists
    const hCaptchaResponse = hcaptcha.getResponse();
    
    if (hCaptchaResponse.length === 0) {
        // If hCaptcha has not been completed, prevent the form submission
        alert("Please complete the CAPTCHA before submitting.");
        return false;
    }

    const form = event.target; // Get the form element
    const formData = new FormData(form); // Collect form data in key-value pairs

    // Send the form data using fetch (AJAX request)
    try {
        const response = await fetch('https://formspree.io/f/xovqqwwz', {
            method: 'POST', // Use POST method to send data
            body: formData, // Attach form data as the request body
            headers: {
                'Accept': 'application/json' // Expect a JSON response from the server
            }
        });

        const resultMessage = document.getElementById('form-response'); // Element to show success/failure messages
        if (response.ok) {
            // If the response is successful (status 200-299)
            resultMessage.innerText = '\nMessage sent successfully!'; // Show success message
            resultMessage.style.color = 'green'; // Set the message color to green
            resultMessage.style.display = 'block'; // Make the message visible
            form.reset(); // Clear the form fields after successful submission
            hcaptcha.reset(); // Reset hCaptcha after successful form submission
        } else {
            // If the response is unsuccessful (status 400 or higher)
            const data = await response.json(); // Parse the response JSON
            if (data.errors) {
                // If there are specific errors, show them as the message
                resultMessage.innerText = data.errors.map(error => error.message).join(", ");
            } else {
                // Generic error message if no specific errors are provided
                resultMessage.innerText = '\nThere was a problem sending your message. Please try again.';
            }
            resultMessage.style.color = 'red'; // Set the message color to red
            resultMessage.style.display = 'block'; // Make the message visible
        }
    } catch (error) {
        // If the fetch request fails (e.g., network error)
        const resultMessage = document.getElementById('form-response'); // Element to show error messages
        resultMessage.innerText = '\nThere was an error sending your message. Please try again.'; // Show error message
        resultMessage.style.color = 'red'; // Set the message color to red
        resultMessage.style.display = 'block'; // Make the message visible
    }
});


// Get all sections on the page to apply scroll-triggered animations
const sections = document.querySelectorAll('section');

// Create an IntersectionObserver to detect when sections come into view
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // When a section is in view (threshold is met), add the 'visible' class to it
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing the section once it's visible
        }
    });
}, { threshold: 0.30 }); // Set the threshold to a % (when  that % of the section is visible)

// Observe each section to trigger animations when they scroll into view
sections.forEach(section => {
    sectionObserver.observe(section);
});

