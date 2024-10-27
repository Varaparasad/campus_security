// Add JavaScript for button actions (e.g., sending requests to the server)
document.querySelectorAll('.accept-button').forEach(button => {
    button.addEventListener('click', () => {
        // Handle accept action (e.g., send AJAX request to server)
        console.log('Leave accepted');
    });
});

document.querySelectorAll('.reject-button').forEach(button => {
    button.addEventListener('click', () => {
        // Handle reject action (e.g., send AJAX request to server)
        console.log('Leave rejected');
    });
});