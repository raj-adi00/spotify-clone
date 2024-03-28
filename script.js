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
function songend() {

    if (audio.currentTime == audio.duration) {
        audio.pause();
        document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg");
        if (currentplayed == songs.length - 1)
            currentplayed = 0;
        else
            currentplayed++;
        audio = new Audio(songs[currentplayed]);
        audio.play();
        startfrombegin();
        initiailtime();
        document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/pause.svg");
        let clicked = currentplayed;
        audio.addEventListener("timeupdate", () => {
            moveseekbar(clicked);
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(audio.currentTime)}/${convertSecondsToMinutesAndSeconds(audio.duration)}`;
        })
    }
}
function displaysongtime(formattedcurrenttime, formattedduration) {
    document.querySelector(".songtime").innerHTML = `${formattedcurrenttime}/${formattedduration}`;
}
function initiailtime() {
    audio.addEventListener("loadeddata", () => {
        displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
    });
}
function moveseekbar(clicked) {
    let percent = (audio.currentTime / audio.duration) * 100;
    console.log(percent);
    if (currentplayed == clicked) {
        document.querySelector(".circle").style.left = `${percent < 99 ? percent : 99}%`;
    }
}
function startfrombegin() {
    document.querySelector(".circle").style.left = "0%";
    document.querySelector(".circle").style.transition = "all 0s";
}
let audio = new Audio();
let currentplayed;
const playMusic = (track, clicked) => {
    audio.pause();
    if (currentplayed != clicked) {
        document.querySelector(".circle").style.left = "0%";
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
        // startfrombegin();
        audio.addEventListener("timeupdate", () => {
            moveseekbar(clicked);
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(audio.currentTime)}/${convertSecondsToMinutesAndSeconds(audio.duration)}`;
            songend();
        });
    }
    else {
        if (currentplayed >= 0)
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg");
        document.getElementById("play").setAttribute("src", "images&logo/play.svg");
        currentplayed = -1000 + currentplayed;
        initiailtime();
        // startfrombegin();
        audio.addEventListener("timeupdate", () => {
            moveseekbar(clicked);
            document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(audio.currentTime)}/${convertSecondsToMinutesAndSeconds(audio.duration)}`;
            songend();
        });
    }
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/song");
    // let a=await fetch("https://github.com/raj-adi00/spotify-clone/tree/main/song");
    console.log(a);
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
            let clicked = currentplayed;
            audio.addEventListener("timeupdate", () => {
                moveseekbar(clicked);
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
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
                moveseekbar(0);
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
            });
        }
        else {
            audio.pause();
            document.getElementById(`img${currentplayed}`).setAttribute("src", "images&logo/play.svg")
            currentplayed -= 1000;
            document.getElementById("play").setAttribute("src", "images&logo/play.svg");
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                moveseekbar();
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
            });
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentplayed == undefined) {
            currentplayed = -1000;
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[0].querySelector(".info").textContent;
            audio = new Audio(songs[0]);
            initiailtime();
            let clicked = currentplayed;
            audio.addEventListener("timeupdate", () => {
                moveseekbar(clicked);
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
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
            let clicked = currentplayed;
            audio.addEventListener("timeupdate", () => {
                moveseekbar(clicked);
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
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
        startfrombegin();
    });

    document.getElementById("previous").addEventListener("click", () => {
        if (currentplayed == undefined) {
            currentplayed = -1000 + songs.length - 1;
            audio = new Audio(songs[currentplayed + 1000]);
            document.querySelector(".songname").innerHTML = document.querySelectorAll(".songlist li")[currentplayed + 1000].querySelector(".info").textContent;
            initiailtime();
            audio.addEventListener("timeupdate", () => {
                moveseekbar();
                displaysongtime(convertSecondToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
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
                moveseekbar();
                displaysongtime(convertSecondsToMinutesAndSeconds(audio.currentTime), convertSecondsToMinutesAndSeconds(audio.duration));
                songend();
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
        startfrombegin();
    });
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.clientX - document.querySelector(".seekbar").getBoundingClientRect().left);
        document.querySelector(".circle").style.left = `${e.clientX - document.querySelector(".seekbar").getBoundingClientRect().left}px`;
        let percent = ((e.clientX - document.querySelector(".seekbar").getBoundingClientRect().left) / (document.querySelector(".seekbar").getBoundingClientRect().right - document.querySelector(".seekbar").getBoundingClientRect().left));
        percent = percent * 100;
        percent = Math.trunc(percent);
        audio.currentTime = (percent * audio.duration) / 100;
        changecurrenttime(audio.currentTime);
    });
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
   
    document.querySelector(".close").addEventListener("click",()=>{
     document.querySelector(".left").style.left="-100%";
    });
}
main();