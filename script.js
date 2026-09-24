(() => {
  const html = document.documentElement;
  const scrollCanvas = document.getElementById("hero-lightpass");
  const context = scrollCanvas.getContext("2d");
  const navbar = document.querySelector(".navbar");

  const frameCount = 300;
  const currentFrame = index => (
    `frames/frame_${index.toString().padStart(4, '0')}.jpg`
  );

  // Preload images
  const images = [];
  const preloadImages = () => {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images[i] = img;
    }
  };

  // Initial image load
  const img = new Image();
  img.src = currentFrame(1);
  scrollCanvas.width = 1920; 
  scrollCanvas.height = 1080; 

  img.onload = function() {
    scrollCanvas.width = img.width;
    scrollCanvas.height = img.height;
    context.drawImage(img, 0, 0);
  }

  let targetFrameIndex = 1;
  let currentFrameIndex = 1;

  const updateImage = index => {
    if(images[index] && images[index].complete) {
      context.clearRect(0, 0, scrollCanvas.width, scrollCanvas.height);
      context.drawImage(images[index], 0, 0);
    } else {
      const image = new Image();
      image.src = currentFrame(index);
      image.onload = () => {
        context.clearRect(0, 0, scrollCanvas.width, scrollCanvas.height);
        context.drawImage(image, 0, 0);
      }
    }
  }

  window.addEventListener('scroll', () => {  
    const scrollTop = html.scrollTop;
    
    // Calculate scroll fraction based on the entire document height
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    
    // Ensure we don't go past 100% or below 0% for the frames
    const scrollFraction = maxScrollTop > 0 ? Math.max(0, Math.min(1, scrollTop / maxScrollTop)) : 0;
    
    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );
    
    targetFrameIndex = frameIndex + 1;
    
    // Navbar blur effect
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  const renderLoop = () => {
    if (currentFrameIndex !== targetFrameIndex) {
      // Easing function for buttery smooth scroll
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.1;
      
      if (Math.abs(currentFrameIndex - targetFrameIndex) < 0.1) {
          currentFrameIndex = targetFrameIndex;
      }
      
      updateImage(Math.round(currentFrameIndex));
    }
    requestAnimationFrame(renderLoop);
  };

  preloadImages();
  requestAnimationFrame(renderLoop);
})();
