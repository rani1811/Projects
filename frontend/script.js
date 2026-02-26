/* ===============================
   DOM ELEMENTS
=============================== */
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
const insertBtn = document.getElementById("insert-song");
const fileInput = document.getElementById("file-input");

/* ===============================
   STATE
=============================== */
let playlist = [];
let favorites = [];
let currentIndex = 0;
let isPlaying = false;

/* ===============================
   LOAD SONGS FROM BACKEND
=============================== */
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/songs")
    .then((res) => res.json())
    .then((data) => {
      playlist = data.map((song) => ({
        name: song.title,
        src: song.file_url,   // already contains /music/filename.mp3
        artist: song.artist,
        album: "Album",
      }));

      updatePlaylistUI();
      updateFavoritesUI();

      if (playlist.length > 0) {
        loadSong(0);
      }
    })
    .catch((err) => console.error("Error loading songs:", err));
});

/* ===============================
   LOAD SONG
=============================== */
function loadSong(index) {
  const song = playlist[index];
  if (!song) return;

  currentIndex = index;
  audio.src = song.src;
  songTitle.textContent = song.name;
  songArtist.textContent = song.artist;
  songAlbum.textContent = song.album;

  updateHeartButton();
}

/* ===============================
   PLAY / PAUSE
=============================== */
playPauseBtn.addEventListener("click", () => {
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
    isPlaying = true;
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
    isPlaying = false;
  }
});

/* ===============================
   NEXT / PREVIOUS
=============================== */
nextBtn.addEventListener("click", () => changeSong(1));
prevBtn.addEventListener("click", () => changeSong(-1));

function changeSong(direction) {
  if (playlist.length === 0) return;

  currentIndex =
    (currentIndex + direction + playlist.length) % playlist.length;

  loadSong(currentIndex);
  audio.play();
  playPauseBtn.textContent = "⏸";
}

/* ===============================
   PROGRESS BAR
=============================== */
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

audio.addEventListener("ended", () => nextBtn.click());

/* ===============================
   VOLUME
=============================== */
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

/* ===============================
   TOGGLE PLAYLIST & FAVORITES
=============================== */
showPlaylistBtn.addEventListener("click", () => {
  playlistContainer.style.display =
    playlistContainer.style.display === "block" ? "none" : "block";
});

favoritesBtn.addEventListener("click", () => {
  favoritesContainer.style.display =
    favoritesContainer.style.display === "block" ? "none" : "block";
});

/* ===============================
   FAVORITES
=============================== */
heartBtn.addEventListener("click", () => {
  if (playlist.length === 0) return;

  const song = playlist[currentIndex];
  const exists = favorites.find((fav) => fav.src === song.src);

  if (!exists) {
    favorites.push(song);
  } else {
    favorites = favorites.filter((fav) => fav.src !== song.src);
  }

  updateFavoritesUI();
  updateHeartButton();
});

function updateHeartButton() {
  const song = playlist[currentIndex];
  const isFav = favorites.some((fav) => fav.src === song?.src);

  heartBtn.classList.toggle("liked", isFav);
}

function updateFavoritesUI() {
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>No songs added</li>";
    return;
  }

  favorites.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.addEventListener("click", () => {
      audio.src = song.src;
      audio.play();
      playPauseBtn.textContent = "⏸";
    });
    favoritesList.appendChild(li);
  });
}

/* ===============================
   PLAYLIST UI
=============================== */
function updatePlaylistUI() {
  playlistEl.innerHTML = "";

  if (playlist.length === 0) {
    playlistEl.innerHTML = "<li>No songs added</li>";
    return;
  }

  playlist.forEach((song, index) => {
    const li = document.createElement("li");

    const songName = document.createElement("span");
    songName.textContent = song.name;
    songName.classList.add("song-name");
    songName.addEventListener("click", () => {
      loadSong(index);
      audio.play();
      playPauseBtn.textContent = "⏸";
    });

    li.appendChild(songName);
    playlistEl.appendChild(li);
  });
}

/* ===============================
   LOCAL FILE INSERT
=============================== */
insertBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  const newSong = {
    name: file.name.replace(/\.[^/.]+$/, ""),
    src: url,
    artist: "Local File",
    album: "Local",
  };

  playlist.push(newSong);
  updatePlaylistUI();
  loadSong(playlist.length - 1);
  audio.play();
  playPauseBtn.textContent = "⏸";
});
