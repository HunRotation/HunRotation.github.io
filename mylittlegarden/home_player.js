document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('openhouseVideo');
  if (video) {
    video.addEventListener('ended', function() {
      window.location.href = 'home.html';
    }, false);
  }
});
