function loadComponents() {
    // Load footer
    fetch('./footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load footer');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            feather.replace(); // Re-initialize feather icons for the footer
        })
        .catch(err => console.error('Error loading footer:', err));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);
