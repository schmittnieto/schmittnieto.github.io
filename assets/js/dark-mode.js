document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme') || 'default';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    toggleButton.addEventListener('click', function() {
      const theme = document.documentElement.getAttribute('data-theme') === 'default' ? 'dark' : 'default';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  });
  