console.log("video");

var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
    // Obtain handles to main elements
    var videoContainer = document.getElementById('videoContainer');
    var video = document.getElementById('video');
    var videoControls = document.getElementById('video-controls');

    // Hide the default controls
    video.controls = false;

    // Display the user defined video controls
    videoControls.setAttribute('data-state', 'visible');

    // Obtain handles to buttons and other elements
    var playpause = document.getElementById('playpause');
    var mute = document.getElementById('mute');
    var progress = document.getElementById('progress');
    var time = document.getElementById('current-time');
    var fullscreen = document.getElementById('fullscreen');

    // If the browser doesn't support the progress element, set its state for some different styling
    var supportsProgress = (document.createElement('progress').max !== undefined);
    if (!supportsProgress) progress.setAttribute('data-state', 'noProgress');

    progress.setAttribute('max', video.duration);

    var updateTimeStamp = function (seconds) {
        time.innerText = String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
    }

    window.setInterval(function () {
        updateTimeStamp(video.currentTime);
    }, 200);

    if (!document.URL.endsWith('index.html') && document.URL.match('#\\d{1,5}$')) {
        video.currentTime = parseInt(document.URL.split('#')[document.URL.split('#').length - 1]);
        updateTimeStamp(video.currentTime);
        video.play();
    }

    // Check the volume
    var checkVolume = function (dir) {
        if (dir) {
            var currentVolume = Math.floor(video.volume * 10) / 10;
            if (dir === '+') {
                if (currentVolume < 1) video.volume += 0.1;
            }
            else if (dir === '-') {
                if (currentVolume > 0) video.volume -= 0.1;
            }
            // If the volume has been turned off, also set it as muted
            // Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
            if (currentVolume <= 0) video.muted = true;
            else video.muted = false;
        }
        changeButtonState('mute');
    }

    // Change the volume
    var alterVolume = function (dir) {
        checkVolume(dir);
    }

    // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
    if (document.addEventListener) {
        // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
        video.addEventListener('loadedmetadata', function () {
            progress.setAttribute('max', video.duration);
        });

        // Changes the button state of certain button's so the correct visuals can be displayed with CSS
        var changeButtonState = function (type) {
            // Play/Pause button
            if (type == 'playpause') {
                if (video.paused || video.ended) {
                    playpause.setAttribute('data-state', 'play');
                }
                else {
                    playpause.setAttribute('data-state', 'pause');
                }
            }
            // Mute button
            else if (type == 'mute') {
                mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
            }
        }

        // Add event listeners for video specific events
        video.addEventListener('play', function () {
            console.log("clicked playpause");
            changeButtonState('playpause');
            video.play();
            playpause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Pause Circle</title><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="#1EF1A0" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="#00CB7D" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M208 192v128M304 192v128"/></svg>';
        }, false);
        video.addEventListener('pause', function () {
            changeButtonState('playpause');
            video.pause();
            playpause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Caret Forward Circle</title><path d="M238.23 342.43l89.09-74.13a16 16 0 000-24.6l-89.09-74.13A16 16 0 00212 181.86v148.28a16 16 0 0026.23 12.29z" fill="#00CB7D"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="#1EF1A0" stroke-miterlimit="10" stroke-width="32"/></svg>';
        }, false);

        // Add events for all buttons			
        playpause.addEventListener('click', function (e) {
            if (video.paused || video.ended) video.play();
            else video.pause();
        });

        video.addEventListener('click', function (e) {
            if (video.paused || video.ended) video.play();
            else video.pause();
        });

        // The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
        mute.addEventListener('click', function (e) {
            video.muted = !video.muted;
            if (!video.muted) {
                mute.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Volume High</title><path d="M126 192H56a8 8 0 00-8 8v112a8 8 0 008 8h69.65a15.93 15.93 0 0110.14 3.54l91.47 74.89A8 8 0 00240 392V120a8 8 0 00-12.74-6.43l-91.47 74.89A15 15 0 01126 192zM320 320c9.74-19.38 16-40.84 16-64 0-23.48-6-44.42-16-64M368 368c19.48-33.92 32-64.06 32-112s-12-77.74-32-112M416 416c30-46 48-91.43 48-160s-18-113-48-160" fill="none" stroke="#1EF1A0" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';
            } else {
                mute.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Volume Mute</title><path fill="none" stroke="#00CB7D" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 432L64 80" fill="#1EF1A0"/><path d="M224 136.92v33.8a4 4 0 001.17 2.82l24 24a4 4 0 006.83-2.82v-74.15a24.53 24.53 0 00-12.67-21.72 23.91 23.91 0 00-25.55 1.83 8.27 8.27 0 00-.66.51l-31.94 26.15a4 4 0 00-.29 5.92l17.05 17.06a4 4 0 005.37.26zM224 375.08l-78.07-63.92a32 32 0 00-20.28-7.16H64v-96h50.72a4 4 0 002.82-6.83l-24-24a4 4 0 00-2.82-1.17H56a24 24 0 00-24 24v112a24 24 0 0024 24h69.76l91.36 74.8a8.27 8.27 0 00.66.51 23.93 23.93 0 0025.85 1.69A24.49 24.49 0 00256 391.45v-50.17a4 4 0 00-1.17-2.82l-24-24a4 4 0 00-6.83 2.82zM125.82 336zM352 256c0-24.56-5.81-47.88-17.75-71.27a16 16 0 00-28.5 14.54C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 002.32 6.25l19.66 19.67a4 4 0 006.75-2A146.89 146.89 0 00352 256zM416 256c0-51.19-13.08-83.89-34.18-120.06a16 16 0 00-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 001.9 8.26l16.77 16.76a4 4 0 006.52-1.27C410.09 315.88 416 289.91 416 256z" fill="#1EF1A0"/><path d="M480 256c0-74.26-20.19-121.11-50.51-168.61a16 16 0 10-27 17.22C429.82 147.38 448 189.5 448 256c0 47.45-8.9 82.12-23.59 113a4 4 0 00.77 4.55L443 391.39a4 4 0 006.4-1C470.88 348.22 480 307 480 256z" fill="#1EF1A0"/></svg>';
            }
            changeButtonState('mute');
        });

        function isFullscreen() {
            if (document.fullscreenElement || document.webkitFullscreenElement ||
                document.mozFullScreenElement)
                return true;
            else
                return false;
        }

        fullscreen.addEventListener("click", function (e) {
            if (!isFullscreen()) {
                document.getElementById("videoAndControls").requestFullscreen({
                    navigationUI: "hide",
                });
            } else {
                document.exitFullscreen();
            }
        });

        // As the video is playing, update the progress bar
        let timeUpdateFunction = function () {
            // For mobile browsers, ensure that the progress element's max attribute is set
            if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
            progress.value = video.currentTime;
            updateTimeStamp(video.currentTime);
        }
        video.addEventListener('timeupdate', debounce(timeUpdateFunction, 50));


        progress.addEventListener('click', function (e) {
            var pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
            video.currentTime = pos * video.duration;
        });

        function mouseMoveWhilstDown(target, whileMove) {
            var endMove = function () {
                window.removeEventListener('mousemove', whileMove);
                window.removeEventListener('mouseup', endMove);
            };

            target.addEventListener('mousedown', function (event) {
                event.stopPropagation(); // remove if you do want it to propagate ..
                window.addEventListener('mousemove', whileMove);
                window.addEventListener('mouseup', endMove);
            });
        }

        mouseMoveWhilstDown(
            progress,
            function (e) {
                var pos = (e.pageX - (progress.offsetLeft + progress.offsetParent.offsetLeft)) / progress.offsetWidth;
                video.currentTime = pos * video.duration;
                progress.value = video.currentTime;
            }
        );
    }
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};