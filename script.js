
async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/song");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        if (as[index].href.endsWith(".mp3")) {
            // console.log(as[index].href);
            songs.push(as[index].href);
        }
    }
    // console.log(songs);
    return songs;
}
let songs;
async function main() {
    songs = await getsongs();
    // console.log(songs);
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (let song of songs) {
        song = song.split('/song/')[1];
        song = song.substring(0, song.length - 4);
        song = song.replaceAll("%20", " ");
        songul.innerHTML += `<li class="flex" style="align-itmes:center; justify-content:space-between; background:#f8f8f87a; padding:5px">
                              <div class="musiclist flex space">
                              <img src="images&logo/music.svg" alt="">
                              <div>
                                <div>${song}</div>
                                <div>Artist</div>
                              </div>
                              </div>
                              <div class="flex pointer library-play-now" style="gap:4px; align-items:center">
                              Play Now
                              <img src="images&logo/play.svg">
                              </div>
                            </li>`;
    }
    var audio = new Audio(songs[0]);
    // audio.play();
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });
}
main();