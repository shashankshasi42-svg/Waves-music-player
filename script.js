"use strict";

// 1. Music playlist
const songs = [
  {
    title: "SoundHelix Song 1",
    artist: "Demo Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "SoundHelix Song 2",
    artist: "Demo Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "SoundHelix Song 3",
    artist: "Demo Artist",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

// 2. Get HTML elements
const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const previousButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artist");
const progressBar = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const songList = document.getElementById("songList");
const player = document.querySelector(".player");

let currentSongIndex = 0;

// 3. Convert seconds into minutes and seconds
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// 4. Update the playlist display
function updatePlaylist() {
  songList.replaceChildren();

  songs.forEach((song, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "song" + (index === currentSongIndex ? " active" : "");

    const number = document.createElement("span");
    number.className = "song-num";
    number.textContent = String(index + 1).padStart(2, "0");

    const info = document.createElement("span");
    info.className = "song-info";

    const title = document.createElement("strong");
    title.textContent = song.title;

    const artist = document.createElement("small");
    artist.textContent = song.artist;

    info.append(title, artist);

    const icon = document.createElement("span");
    icon.className = "song-time";
    icon.textContent =
      index === currentSongIndex && !audio.paused ? "Ⅱ" : "♫";

    button.append(number, info, icon);

    button.addEventListener("click", () => {
      loadSong(index);
      playSong();
    });

    songList.appendChild(button);
  });
}

// 5. Load a selected song
function loadSong(index) {
  currentSongIndex = (index + songs.length) % songs.length;

  const song = songs[currentSongIndex];

  audio.src = song.src;
  audio.load();

  songTitle.textContent = song.title;
  artistName.textContent = song.artist;

  progressBar.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  updatePlaylist();
}

// 6. Play music
async function playSong() {
  try {
    await audio.play();

    playButton.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Pause");
    player.classList.add("playing");

    updatePlaylist();
  } catch (error) {
    pauseDisplay();
    artistName.textContent =
      "Audio unavailable. Check your internet connection.";

    console.error("Playback error:", error);
  }
}

// 7. Pause music
function pauseSong() {
  audio.pause();
  pauseDisplay();
  updatePlaylist();
}

// Update play button and player appearance
function pauseDisplay() {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Play");
  player.classList.remove("playing");
}

// 8. Play/Pause button
playButton.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// 9. Next song
nextButton.addEventListener("click", () => {
  loadSong(currentSongIndex + 1);
  playSong();
});

// 10. Previous song
previousButton.addEventListener("click", () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadSong(currentSongIndex - 1);
    playSong();
  }
});

// 11. Show total song duration
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// 12. Update playback progress
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progressBar.value =
      (audio.currentTime / audio.duration) * 100;

    currentTime.textContent = formatTime(audio.currentTime);
  }
});

// 13. Allow users to seek through a song
progressBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number(progressBar.value) / 100) * audio.duration;
  }
});

// 14. Volume control
volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

audio.volume = Number(volumeSlider.value);

// 15. Automatically play the next song when one ends
audio.addEventListener("ended", () => {
  loadSong(currentSongIndex + 1);
  playSong();
});

// 16. Keep controls correct when audio is paused or played
audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Pause");
  player.classList.add("playing");
  updatePlaylist();
});

audio.addEventListener("pause", () => {
  pauseDisplay();
  updatePlaylist();
});

// 17. Show audio loading errors
audio.addEventListener("error", () => {
  pauseDisplay();
  console.error(
    "Could not load audio. Check the song URL or internet connection."
  );
});

// 18. Load the first song when the page opens
loadSong(0);









