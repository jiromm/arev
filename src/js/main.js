let autoScrollInterval;
let isPlaying = false;
let touchStartY = 0;
let touchEndY = 0;
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to cat cards
    const catCards = document.querySelectorAll('.cat-card');
    const container = document.querySelector('.cats-scroll-container');
    const audioPlayer = document.getElementById('background-music');
    const cardsSection = document.querySelector('section');
    
    // Hide cards initially
    cardsSection.style.display = 'none';
    
    // Ensure audio is properly initialized
    if (audioPlayer) {
        audioPlayer.volume = 0.3; // Lower volume for better experience
        audioPlayer.loop = true;
    }

    catCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate__animated', 'animate__fadeInUp');
    });

    // Add click effect to cat cards
    catCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                card.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });

    // Touch event handlers
    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, false);

    container.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent default scrolling
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeDistance = touchEndY - touchStartY;
        const minSwipeDistance = 50; // Minimum distance for swipe to register

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe down - show previous card
                currentIndex = (currentIndex - 1 + catCards.length) % catCards.length;
            } else {
                // Swipe up - show next card
                currentIndex = (currentIndex + 1) % catCards.length;
            }
            updateCards();
        }
    }

    // Add music note animation
    const musicNote = document.querySelector('.animate__pulse');
    if (musicNote) {
        setInterval(() => {
            musicNote.classList.remove('animate__pulse');
            setTimeout(() => {
                musicNote.classList.add('animate__pulse');
            }, 50);
        }, 2000);
    }

    // Add scroll reveal effect
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    const startButton = document.getElementById('startButton');
    const cards = document.querySelectorAll('.cat-card');

    const updateCards = () => {
        cards.forEach((card, index) => {
            const position = (index - currentIndex + cards.length) % cards.length;
            
            if (position === 0) {
                card.style.transform = 'translateZ(0px) scale(1)';
                card.style.zIndex = '3';
                card.style.opacity = '1';
            } else if (position === 1) {
                card.style.transform = 'translateZ(-20px) scale(0.95)';
                card.style.zIndex = '2';
                card.style.opacity = '0.8';
            } else {
                card.style.transform = 'translateZ(-40px) scale(0.9)';
                card.style.zIndex = '1';
                card.style.opacity = '0.6';
            }
        });
    };

    const startExperience = async () => {
        if (!isPlaying) {
            // Show cards section
            cardsSection.style.display = 'block';
            cardsSection.classList.add('animate__animated', 'animate__fadeIn');
            
            // Start music
            if (audioPlayer) {
                try {
                    await audioPlayer.play();
                    audioPlayer.volume = 0.3; // Lower volume for better experience
                } catch (error) {
                    console.error('Error playing audio:', error);
                    // If autoplay fails, show a message to the user
                    alert('Please click the START button to begin the experience.');
                }
            }
            
            // Start automatic scrolling with slower interval (8 seconds)
            autoScrollInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % cards.length;
                updateCards();
            }, 8000);
            
            // Update button text
            startButton.textContent = 'STOP';
            isPlaying = true;
        } else {
            // Hide cards section
            cardsSection.style.display = 'none';
            
            // Stop music
            if (audioPlayer) {
                audioPlayer.pause();
            }
            
            // Stop automatic scrolling
            clearInterval(autoScrollInterval);
            
            // Update button text
            startButton.textContent = 'START';
            isPlaying = false;
        }
    };

    startButton.addEventListener('click', startExperience);

    // Initialize cards
    updateCards();
});
