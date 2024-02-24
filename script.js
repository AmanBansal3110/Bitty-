console.log("Let's write js");
let audiog = new Audio();
let songs;
let currFolder;
let playfromList = document.querySelector(".playfromList");

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }
    updateSongList(); // Update the displayed list of songs
}

function convertSecondsToTime(seconds) {
    if(isNaN(seconds)||seconds<0){
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const displayMinutes =  String(minutes).padStart(1,'0');
    const displaySeconds =  String(remainingSeconds).padStart(2,'0');

    return `${displayMinutes}:${displaySeconds}`;
}
function updateSongList() {
    let songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML += `<li>  
            <img class="invert" src="assets/music.png" alt="">
            <div class="info">
                <div class="songname">${song.replaceAll("%20", " ")} </div>
                <div>Aman Bansal</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="playfromList icon invert" src="assets/play.png" alt="">
            </div>   
        </li>`;

        
    }

    // Set up event listeners for song list items
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            handleSongClick(e);
        });
    });
}

function handleSongClick(e) {

        playfromList = e.querySelector(".playfromList");
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    }
const playMusic = (track, pause = false)=>{    
    audiog.src = `/${currFolder}/` + track;
    if(!pause){
        audiog.play()
        playfromBar.src = "assets/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
}

async function displayAlbums(){
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // console.log(e.href.includes(".htaccess"))
        if(e.href.includes("/songs/") ){
            console.log(e.href);
            let folder = e.href.split("/").slice(-1)[0];
            if (folder.trim() !== "") {  // Check if folder is not empty
                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json();
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div class="play">
                   <img src="assets/play-button.svg" alt="">
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h3>
                    ${response.title}
                </h3>   
                <p>${response.description}</p>
            </div>`
                // Rest of the code...
            } else {
                console.log("Folder is empty or not properly formatted.");
            }
            
        };
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener('click', async item=>{
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}
async function main(){
    await getSongs("songs/arjit");
    playMusic(songs[0], true);

    // Display all cards on screen
    await displayAlbums()

    window.addEventListener('resize', () => {
        const rightContainer = document.querySelector('.container');
        const playbar = document.querySelector('.playbar');
        playbar.style.width = `${rightContainer.clientWidth-30}px`;
      });
      
      // Initial call to set the width on page load
      window.dispatchEvent(new Event('resize'));
      
    playfromBar.addEventListener('click', () => {
        if (!audiog.paused) {
            audiog.pause();
            playfromBar.src = "assets/play.png";
            for (const song of songs) {
                const songnameElement = document.querySelector(".songname");
                if (songnameElement && songnameElement.textContent === decodeURI(song)) {
                    document.querySelector(".icon").src = "assets/play.png";
                    break;
                }
            }
        } else {
            audiog.play();
            playfromBar.src = "assets/pause.svg";
            for (const song of songs) {
                const songnameElement = document.querySelector(".songname");
                if (songnameElement && songnameElement.textContent === decodeURI(song)) {
                    document.querySelector(".icon").src = "assets/pause.svg";
                    break;
                }
            }
        }
    });
    audiog.addEventListener('timeupdate', ()=>{
        document.querySelector(".currTime").innerHTML = `${convertSecondsToTime(audiog.currentTime)}`;
        document.querySelector(".durTime").innerHTML = `${convertSecondsToTime(audiog.duration)}`;
        document.querySelector(".circle").style.left = (audiog.currentTime)/(audiog.duration)*100 - 1 + "%";
        document.querySelector(".progress").style.width = (audiog.currentTime)/(audiog.duration)*100 + "%";
    })

    document.querySelector(".clicking").addEventListener('click', e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        audiog.currentTime = ((audiog.duration)*percent)/100;
        document.querySelector(".progress").style.width = percent + "%";
    })
    document.querySelector(".hamburger").addEventListener('click',()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener('click',()=>{
        document.querySelector(".left").style.left = "-120%";
    })


    let inputVOl = 100;
    document.querySelector(".inputVolume").value = 100;
    document.querySelector(".inputVolume").addEventListener('change', e=>{
        inputVOl = e.target.value;
        audiog.volume = parseInt(inputVOl)/100;
    })


    document.querySelector(".volume-icon").addEventListener('click',()=>{
        if(audiog.volume>0){
            audiog.volume = 0;
            document.querySelector(".inputVolume").value =0;
            document.querySelector(".volume-icon").src = "assets/mute.svg"
        }
        else{
            audiog.volume = parseInt(inputVOl)/100;
            document.querySelector(".inputVolume").value = inputVOl;
            document.querySelector(".volume-icon").src = "assets/volume.svg"
        }
    });

    document.querySelector(".circle").addEventListener('wheel', e => {
        e.preventDefault();g
    
        const wheelDelta = e.offsetX; 
    
        // Calculate the percentage to update the audio's currentTime
        const percentageChange = wheelDelta / 100;
        const currentPercentage = parseFloat(document.querySelector(".circle").style.left) || 0;
        const newPercentage = Math.min(100, Math.max(0, currentPercentage + percentageChange));
    
        // Update the circle's left position and the progress bar's width
        document.querySelector(".circle").style.left = newPercentage + "%";
        document.querySelector(".progress").style.width = newPercentage + "%";
    
        // Update the audio's currentTime
        audiog.currentTime = (audiog.duration * newPercentage) / 100;
    });

    function nextButtonClickHandler() {
            index = songs.indexOf(audiog.src.split("/").slice(-1)[0]);
            if((index+1) < songs.length){
             playMusic(songs[index+1]);
        }
        else{
            playMusic(songs[0]);
        }
    }
    function previousButtonClickHandler() {
            index = songs.indexOf(audiog.src.split("/").slice(-1)[0]);
            if((index-1) >= 0){
                playMusic(songs[index-1]);
            } else {
                playMusic(songs[0]);
         }
    }

    previous.removeEventListener('click', previousButtonClickHandler);
    nextSong.removeEventListener('click', nextButtonClickHandler);

    // Add new event listeners for "previous" and "next" buttons
    previous.addEventListener('click', previousButtonClickHandler);
    nextSong.addEventListener('click', nextButtonClickHandler);

    document.querySelector(".volume-icon").addEventListener('mouseenter',e=>{
        document.querySelector(".inputVolume").style.opacity = 1;
    })
    document.querySelector(".volume-icon").addEventListener('mouseleave', e => {
        setTimeout(() => {
            document.querySelector(".inputVolume").style.opacity = 0;
        }, 10000); // 30 seconds delay
    });
}

main();
console.log("hii");
