// script.js

// Function to update status colors
function updateStatusColors() {
    const statusElements = document.querySelectorAll('.status');

    statusElements.forEach(statusElement => {
        const status = statusElement.getAttribute('data-status').toLowerCase();

        // Remove any existing color classes to reset the element
        statusElement.classList.remove('approved', 'pending', 'rejected');

        // Add the appropriate color class based on the status
        if (status === 'approved') {
            statusElement.classList.add('approved');
        } else if (status === 'pending') {
            statusElement.classList.add('pending');
        } else if (status === 'rejected') {
            statusElement.classList.add('rejected');
        }
    });
}

// Call the function to set initial colors
updateStatusColors();
