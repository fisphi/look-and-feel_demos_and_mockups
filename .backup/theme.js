// Theme-Verwaltung
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Theme aus localStorage laden
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }
    
    // Theme setzen
    function setTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
    }
    
    // Toggle-Icon aktualisieren
    function updateToggleIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-fill';
        }
    }
    
    // Theme wechseln
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    // Event-Listener
    themeToggle.addEventListener('click', toggleTheme);
    
    // Theme beim Laden initialisieren
    loadTheme();
})();
