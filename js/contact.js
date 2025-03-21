document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const statusMessage = document.getElementById('statusMessage');
    const inputs = contactForm.querySelectorAll('input, textarea');

    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Change button text and disable it
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        try {
            // Send form data to backend
            const response = await sendContactForm(formData);
            
            // Show success message
            showStatus('Your message has been sent successfully!', 'success');
            
            // Clear form inputs
            clearFormInputs();
            
        } catch (error) {
            // Show error message
            showStatus('Something went wrong. Please try again.', 'error');
            console.error('Error:', error);
        } finally {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                statusMessage.classList.add('hidden');
            }, 5000);
        }
    });
    
    // Function to clear all form inputs
    function clearFormInputs() {
        inputs.forEach(input => {
            input.value = '';
            // Reset border color to default
            input.style.borderColor = '#3366cc';
        });
    }
    
    // Function to send form data to backend
    async function sendContactForm(formData) {
        // Replace with your actual backend URL
        const backendUrl = '/api/contact';
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }
        
        return await response.json();
    }
    
    // Function to show status messages
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'status-success', 'status-error');
        
        if (type === 'success') {
            statusMessage.classList.add('status-success');
        } else {
            statusMessage.classList.add('status-error');
        }
        
        // Add fade-in animation
        statusMessage.classList.add('fade-in');
    }
    
    // Form validation - real-time feedback
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
    
    function validateInput(input) {
        if (input.value.trim() === '') {
            input.style.borderColor = '#ef4444'; // Red for error
        } else {
            input.style.borderColor = '#3366cc'; // Default blue
        }
    }
    
    // Add a clear button functionality if needed
    document.addEventListener('keydown', function(e) {
        // Clear form with Escape key (optional feature)
        if (e.key === 'Escape') {
            clearFormInputs();
        }
    });
});