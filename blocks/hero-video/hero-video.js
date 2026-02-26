export default function decorate(block) {
  const pictureDiv = block.querySelector(':scope > div:first-child');
  if (!pictureDiv || !pictureDiv.querySelector('picture')) {
    block.classList.add('no-image');
    return;
  }

  // Add play button on the image
  const playButton = document.createElement('button');
  playButton.className = 'hero-video-play';
  playButton.setAttribute('aria-label', 'Play video');
  playButton.innerHTML = '<span class="hero-video-play-icon"></span>';
  pictureDiv.querySelector('div').appendChild(playButton);

  // Add gradient overlay on the image
  const gradient = document.createElement('div');
  gradient.className = 'hero-video-gradient';
  pictureDiv.querySelector('div').appendChild(gradient);

  // Add "Watch the video" hover text on the image
  const watchText = document.createElement('span');
  watchText.className = 'hero-video-watch-text';
  watchText.textContent = 'Watch the video';
  pictureDiv.querySelector('div').appendChild(watchText);

  // Add "Watch the video" CTA in the text area
  const textDiv = block.querySelector(':scope > div:last-child div');
  if (textDiv) {
    const cta = document.createElement('a');
    cta.className = 'hero-video-cta';
    cta.href = '#';
    cta.textContent = 'Watch the video';
    textDiv.appendChild(cta);
  }

  // Mark image container for styling
  pictureDiv.querySelector('div').classList.add('hero-video-media');
}
