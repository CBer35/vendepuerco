// Get references to elements
const callScreen = document.getElementById('call-screen');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');
const contentDiv = document.getElementById('content');
const jumpscareImage = document.getElementById('jumpscare-image');
const loopVideo = document.getElementById('loop-video');

// Function to request fullscreen
function requestFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

// Function to trigger the jumpscare and video sequence
function triggerSequence() {
    callScreen.classList.add('hidden'); // Hide call screen
    contentDiv.classList.remove('hidden'); // Show content area
    requestFullscreen(); // Go fullscreen

    // Show jumpscare
    jumpscareImage.classList.remove('hidden');
    // Optional: Add jumpscare sound
    const jumpscareAudio = new Audio('https://huggingface.co/spaces/CBer35/asd/resolve/main/jumpscare_sound.mp3?download=true');
    jumpscareAudio.play();

    // After a short delay, hide jumpscare and show video
    setTimeout(() => {
        jumpscareImage.classList.add('hidden');
        loopVideo.classList.remove('hidden');
        loopVideo.play().catch(error => {
            console.log("Video autoplay blocked:", error);
            // Handle autoplay block if necessary (e.g., show a play button on the video)
        });
    }, 500); // Jumpscare duration (500ms)
}

// Add event listeners to call buttons
acceptButton.addEventListener('click', triggerSequence);
declineButton.addEventListener('click', triggerSequence);

// Fullscreen exit handler (optional, keeps existing logic)
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        console.log('Exited fullscreen');
        // Optional: Reset state if user exits fullscreen
        // contentDiv.classList.add('hidden');
        // callScreen.classList.remove('hidden');
        // loopVideo.pause();
        // loopVideo.currentTime = 0;
        // jumpscareImage.classList.add('hidden');
    }
}
