let audio = new Audio();
let currentplayed;
const playMusic = (track, clicked) => {
    audio.pause();
    if (currentplayed != clicked) {
        audio = new Audio(track);
        audio.play();
        currentplayed = clicked;
    }
    else {
        currentplayed = -100;
    }
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/song");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div);
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        if (as[index].href.endsWith(".mp3") || as[index].href.endsWith(".MP3")) {
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
    let index = 0;
    for (let song of songs) {
        song = song.split('/song/')[1];
        // console.log(songs);
        let music = song.split('(')[0];
        let singer = song.split('(')[1];
        singer = singer.split(')')[0];
        music = music.replaceAll("%20", " ");
        singer = singer.replaceAll("%20", " ");
        songul.innerHTML += `<li class="flex librarysong" style="align-itmes:center; justify-content:space-between; background:#f8f8f87a; padding:5px">
                              <div class="musiclist flex space">
                              <img src="images&logo/music.svg" alt="">
                              <div>
                                <div style="overflow:hidden; max-width:12vw; height:17px;" class="info" id="${index++}">${music}</div>
                                <div style="overflow:hidden; max-width:12vw; height:17px; class="name">${singer}</div>
                              </div>
                              </div>
                              <div class="flex pointer library-play-now" style="gap:4px; align-items:center">
                              <img src="images&logo/play.svg" style="padding:0 3px;">
                              </div>
                            </li>`;

    }
    let songli = document.querySelectorAll(".songlist li");
    // console.log(songs);
    for (let music of songli) {
        music.addEventListener("click", () => {
            let currentsong = music.querySelector(".info").innerText;
            // console.log(currentsong);
            document.querySelector(".songname").innerHTML = currentsong;
            // console.log(music.querySelector(".info").id);
            playMusic(songs[parseInt(music.querySelector(".info").id)], parseInt(music.querySelector(".info").id));
        });
    }
}
main();