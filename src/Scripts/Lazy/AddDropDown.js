document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('AddButton');
    const addContent = document.getElementById('Add-content');

    addButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Voorkom dat het click-event de document-click handler activeert
        const isVisible = addContent.style.display === 'block';
        addContent.style.visibility = isVisible ? 'hidden' : 'visible';
    });

    document.addEventListener('click', function() {
        addContent.style.visibility = 'hidden'; // Verberg het menu als ergens anders wordt geklikt
    });
});
