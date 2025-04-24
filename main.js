// Get references to elements
const callScreen = document.getElementById('call-screen');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');
const contentDiv = document.getElementById('content');
const jumpscareImage = document.getElementById('jumpscare-image');
// No loopVideo element needed anymore

// Global reference for the audio to control looping
let jumpscareAudio = null;

// Function to request fullscreen
function requestFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            // If fullscreen fails, still proceed with the sequence
            showJumpscareAndLoopSound();
        });
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
    // Note: Some browsers require fullscreen request to be called *after* the user interaction event handler finishes.
    // If fullscreen doesn't work reliably, we might need to adjust the call timing.
}

// Function to show the jumpscare and play the looping sound
function showJumpscareAndLoopSound() {
    callScreen.classList.add('hidden'); // Hide call screen
    contentDiv.classList.remove('hidden'); // Show content area

    // Show jumpscare image (it will stay visible)
    jumpscareImage.classList.remove('hidden');

    // Initialize and play jumpscare sound in a loop
    if (!jumpscareAudio) { // Prevent creating multiple audio elements
        jumpscareAudio = new Audio('https://huggingface.co/spaces/CBer35/asd/resolve/main/jumpscare_sound.mp3?download=true');
        jumpscareAudio.loop = true; // Set the audio to loop
        jumpscareAudio.play().catch(error => {
            console.log("Audio autoplay blocked:", error);
            // Handle autoplay block if necessary
            // Maybe add a text instruction "Click screen to enable sound"
        });
    }
}

// Function to handle the button click
function handleButtonClick() {
    // Request fullscreen first
    requestFullscreen();
    // Then show jumpscare and start sound (this might be called by fullscreen error handler too)
    // Add a small delay to allow fullscreen transition to start
    setTimeout(showJumpscareAndLoopSound, 100); 
}

// Add event listeners to call buttons
acceptButton.addEventListener('click', handleButtonClick);
declineButton.addEventListener('click', handleButtonClick);

// Fullscreen exit handler
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        console.log('Exited fullscreen');
        // When exiting fullscreen, stop the audio and reset the view
        if (jumpscareAudio) {
            jumpscareAudio.pause();
            jumpscareAudio.currentTime = 0; // Reset audio position
            jumpscareAudio.loop = false; // Ensure loop is off if we re-enter later
            jumpscareAudio = null; // Clear the reference
        }
        contentDiv.classList.add('hidden');
        jumpscareImage.classList.add('hidden');
        callScreen.classList.remove('hidden'); // Show call screen again
    }
}
