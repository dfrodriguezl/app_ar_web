function openTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    // Show the current tab content and set the tab to active
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}