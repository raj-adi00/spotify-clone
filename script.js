function convertSecondsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    if (isNaN(minutes))
        minutes = 0;
    if (isNaN(remainingSeconds))
        remainingSeconds = 0;
    var formattedTime = minutes + ":" + Math.floor(((remainingSeconds < 10 ? "0" : "") + remainingSeconds));
    return formattedTime;
}
function displaysongtime(formattedcurrenttime, formattedduration) {
    document.querySelector(".songtime").innerHTML = `${formattedcurrenttime}/${formattedduration}`;
}
function initiailtime()
{
    audio.addEventListener("loadeddata",()=>{
        displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
    });
}
function moveseekbar() {

}
let audio = new Audio();
let currentplayed;
const playMusic = (track, clicked) => {
    audio.pause();
    if (currentplayed != clicked) {
        audio = new Audio(track);
        audio.play();
        document.getElementById("play").setAttribute("src", "images&logo/pause.svg");
        document.getElementById(`img${clicked}`).setAttribute("src", "images&logo/pause.svg");
        if (currentplayed >= 0) {
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg");
            // console.log(currentplayed);
        }
        currentplayed = clicked;
        initiailtime();
        audio.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(audio.currentTime)}/${convertSecondsToMinutesAndSeconds(audio.duration)}`;
        });
    }
    else {
        if (currentplayed >= 0)
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg");
        document.getElementById("play").setAttribute("src", "images&logo/play.svg");
        currentplayed = -1000 + currentplayed;
        initiailtime();
        audio.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(audio.currentTime)}/${convertSecondsToMinutesAndSeconds(audio.duration)}`;
        });
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
                              <img src="images&logo/play.svg" style="padding:0 3px;" id="img${index - 1}">
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
    document.getElementById("play").addEventListener("click", () => {
        if (audio != undefined && currentplayed < 0) {
            audio.play();
            currentplayed += 1000;
            document.getElementById("play").setAttribute("src", "images&logo/pause.svg");
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/pause.svg");
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else if (currentplayed == undefined) {
            audio = new Audio(songs[0]);
            audio.play();
            currentplayed = 0;
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[0].querySelector(".info").textContent;
            document.getElementById("play").setAttribute("src", "images&logo/pause.svg");
            document.getElementById("img0").setAttribute("src", "images&logo/pause.svg");
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else {
            audio.pause();
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg")
            currentplayed -= 1000;
            document.getElementById("play").setAttribute("src", "images&logo/play.svg");
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentplayed == undefined) {
            currentplayed = -1000;
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[0].querySelector(".info").textContent;
            audio = new Audio(songs[0]);
          initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else if (currentplayed < 0) {
            if (currentplayed + 1000 == songs.length - 1) {
                currentplayed = -1000;
            }
            else
                currentplayed++;
            audio = new Audio(songs[currentplayed + 1000]);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed + 1000].querySelector(".info").textContent;
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else if (currentplayed == songli.length - 1) {
            initiailtime();
            playMusic(songs[0], 0);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[0].querySelector(".info").textContent;
        }
        else {
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed + 1].querySelector(".info").textContent;
            playMusic(songs[currentplayed + 1], currentplayed + 1);
        }
    });

    document.getElementById("previous").addEventListener("click", () => {
        if (currentplayed == undefined) {
            currentplayed = -1000 + songs.length - 1;
            audio = new Audio(songs[currentplayed + 1000]);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed + 1000].querySelector(".info").textContent;
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else if (currentplayed < 0) {
            if (currentplayed + 1000 == 0)
                currentplayed = -1000 + songs.length - 1;
            else
                currentplayed--;
            audio = new Audio(songs[currentplayed + 1000]);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed + 1000].querySelector(".info").textContent;
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
            });
        }
        else if (currentplayed == 0) {
            initiailtime();
            playMusic(songs[songs.length - 1], songs.length - 1);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[songs.length - 1].querySelector(".info").textContent;
        }
        else {
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed - 1].querySelector(".info").textContent;
            playMusic(songs[currentplayed - 1], currentplayed - 1);
            initiailtime();
        }
    });
}
main();