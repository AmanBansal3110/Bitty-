console.log("Let's write js");
// lets start the js code era
let audiog = new Audio();
let songs;
let currFolder;
let playdone = 0;
let playfromList = document.querySelector(".playfromList");
async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index =0;  index < as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }
    let songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>  
        <img class="invert" src="music.png" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")} </div>
            <div>Aman Bansal</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="playfromList invert" src="play.png" alt="">
    </div>   
    </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', ()=>{
            if(!audiog.paused){
                playfromList.src = "play.png";
               }
            if(playfromList == e.querySelector(".playfromList") ){
                if(!audiog.paused){
                    playfromList.src = "play.png";
                    audiog.pause();
                }
                else{
                    playfromList.src = "pause.svg";
                    audiog.play();
                }
            }
            else{
                playfromList = e.querySelector(".playfromList");
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
                playfromList.src = "pause.svg"
                playdone = 1;
            }
        })
    })
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
const playMusic = (track, pause = false)=>{    
    audiog.src = `/${currFolder}/` + track;
    if(!pause){
        audiog.play()
        playfromBar.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
}

async function main(){
    await getSongs("songs/arjit");
    playMusic(songs[0], true);

    
    window.addEventListener('resize', () => {
        const rightContainer = document.querySelector('.right');
        const playbar = document.querySelector('.playbar');
        playbar.style.width = `${rightContainer.clientWidth-30}px`;
      });
      
      // Initial call to set the width on page load
      window.dispatchEvent(new Event('resize'));
      

    playfromBar.addEventListener('click', ()=>{
        if(audiog.paused){
            audiog.play()
            playfromBar.src = "pause.svg"
            playfromList.src = "pause.svg"
        }
        else{
            audiog.pause();
            playfromBar.src = "play.png"
            playfromList.src = "play.png"
        }
    })
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
        console.log(percent)
    })
    audiog.addEventListener('pause',()=>{
        playfromBar.src = 'play.png';
        playfromList.src = 'play.png';
    })
    audiog.addEventListener('play',()=>{
        playfromBar.src = 'pause.svg';
        playfromList.src = 'pause.svg';
    });
    document.querySelector(".hamburger").addEventListener('click',()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener('click',()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener('click', ()=>{
        let index = songs.indexOf(audiog.src.split("/").slice(-1) [0]);
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
        else 
            playMusic(songs[0]);
    })
    nextSong.addEventListener('click', ()=>{
        let index = songs.indexOf(audiog.src.split("/").slice(-1) [0]);
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })

    document.querySelector(".inputVolume").addEventListener('change', e=>{
        console.log(e.target.value);
        audiog.volume = parseInt(e.target.value)/100;
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener('click', async item=>{
            console.log(item, item.currentTarget.dataset.folder)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })

}   

main() 
console.log("hii")