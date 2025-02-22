const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.getElementById("progress");
const volumeControl = document.getElementById("volume");
const playlistEl = document.getElementById("playlist-items");
const showPlaylistBtn = document.getElementById("show-playlist");
const playlistContainer = document.getElementById("playlist-container");
const heartBtn = document.getElementById("add-to-playlist");
const favoritesContainer = document.getElementById("favorites-container");
const favoritesList = document.getElementById("favorites-items");
const favoritesBtn = document.getElementById("favorites-btn");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const songAlbum = document.getElementById("song-album");

let isPlaying = false;
let favorites = [];
let currentIndex = 0;

const playlist = [
  {
    name: "Ambient Electronic",
    src: "playlist/ambient-electronic-290981.mp3",
    artist: "Ambient",
    album: "Album 1",
  },
  {
    name: "Calm Night",
    src: "playlist/calm-night-291502.mp3",
    artist: "Calm",
    album: "Album 2",
  },
  {
    name: "Modern Tech",
    src: "playlist/modern-tech-290001.mp3",
    artist: "Modern",
    album: "Album 3",
  },
  {
    name: "Path to Glory",
    src: "playlist/path-to-glory-284930.mp3",
    artist: "Glory",
    album: "Album 4",
  },
];

// Initialize Player
document.addEventListener("DOMContentLoaded", () => {
  updatePlaylistUI();
  updateFavoritesUI();
  if (playlist.length > 0) {
    playSong(0, false, false); // Load the first song but do not play it automatically
  }
});

// Function to Play Song
function playSong(index, isFavorite = false, autoPlay = true) {
  currentIndex = index;
  const song = isFavorite ? favorites[currentIndex] : playlist[currentIndex];
  if (!song) return;

  audio.src = song.src;
  songTitle.textContent = song.name;
  songArtist.textContent = song.artist;
  songAlbum.textContent = song.album;

  if (autoPlay) {
    audio.play();
    playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    isPlaying = true;
  }

  updateHeartButton();
}

// Play/Pause Toggle
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    audio.pause();
    playPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
  isPlaying = !isPlaying;
});

// Next/Previous Song
nextBtn.addEventListener("click", () => changeSong(1));
prevBtn.addEventListener("click", () => changeSong(-1));

function changeSong(direction) {
  if (playlist.length > 0) {
    currentIndex =
      (currentIndex + direction + playlist.length) % playlist.length;
    playSong(currentIndex);
  }
}

// Playlist Toggle
showPlaylistBtn.addEventListener("click", () => {
  playlistContainer.style.display =
    playlistContainer.style.display === "block" ? "none" : "block";
});

// Favorites Toggle
favoritesBtn.addEventListener("click", () => {
  favoritesContainer.style.display =
    favoritesContainer.style.display === "block" ? "none" : "block";
});

// Volume Control
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

// Progress Bar Update
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

// Seek Functionality
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Auto Next Song
audio.addEventListener("ended", () => nextBtn.click());

heartBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;

  const song = playlist[currentIndex];
  const indexInFavorites = favorites.findIndex((fav) => fav.src === song.src);

  if (indexInFavorites === -1) {
    favorites.push({ ...song });
    heartBtn.classList.add("liked"); // Turn green when liked
  } else {
    favorites.splice(indexInFavorites, 1);
    heartBtn.classList.remove("liked"); // Turn gray when unliked
  }

  updateFavoritesUI();
});

/* Update heart button when changing songs */
function updateHeartButton() {
  const song = playlist[currentIndex];
  heartBtn.classList.toggle(
    "liked",
    favorites.some((fav) => fav.src === song.src)
  );
}

// Call updateHeartButton() whenever a new song is played
audio.addEventListener("loadeddata", updateHeartButton);

// Update Favorites UI
function updateFavoritesUI() {
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>No songs added</li>";
  } else {
    favorites.forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = song.name;
      li.addEventListener("click", () => playSong(index, true));
      favoritesList.appendChild(li);
    });
  }
}

// Update Heart Button State
function updateHeartButton() {
  const song = playlist[currentIndex];
  heartBtn.classList.toggle(
    "liked",
    favorites.some((fav) => fav.src === song.src)
  );
}

// Remove Song from Playlist
function removeSong(index) {
  if (playlist.length === 0) return;

  playlist.splice(index, 1);
  updatePlaylistUI();

  if (playlist.length > 0) {
    currentIndex = Math.max(0, index - 1);
    playSong(currentIndex);
  } else {
    audio.pause();
    audio.src = "";
    songTitle.textContent = "No song playing";
  }
}

// Update Playlist UI
function updatePlaylistUI() {
  playlistEl.innerHTML = "";

  playlist.forEach((song, index) => {
    const li = document.createElement("li");

    // Song Name Span
    const songNameSpan = document.createElement("span");
    songNameSpan.textContent = song.name;
    songNameSpan.classList.add("song-name");
    songNameSpan.addEventListener("click", () => playSong(index));

    // Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&#10005;"; // 'X' symbol
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeSong(index);
    });

    // Append elements
    li.appendChild(songNameSpan);
    li.appendChild(removeBtn);
    playlistEl.appendChild(li);
  });

  if (playlist.length === 0) {
    playlistEl.innerHTML = "<li>No songs added</li>";
  }
}

const insertBtn = document.getElementById("insert-song");

// Insert New Song
insertBtn.addEventListener("click", () => {
  if (songName && songSrc) {
    playlist.push({
      name: songName,
      src: songSrc,
      artist: "Unknown Artist",
      album: "Unknown Album",
    });
    updatePlaylistUI();
    alert(`${songName} added to Playlist!`);
  }
});

document.getElementById("insert-song").addEventListener("click", function () {
  document.getElementById("file-input").click();
});

document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      // Create new song object
      const newSong = {
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        src: url,
        artist: "Unknown Artist",
        album: "Unknown Album",
      };

      // Add to playlist
      playlist.push(newSong);
      updatePlaylistUI();

      // Auto-play the newly added song
      playSong(playlist.length - 1);

      alert(`${newSong.name} added to Playlist!`);
    }
  });
