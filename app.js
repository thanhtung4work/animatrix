class Anime{
    constructor(title = "", studio = "", release_year = 0, is_watched = false){
        this.title = title;
        this.studio = studio;
        this.release_year = release_year;
        this.is_watched = is_watched;
        this.id = this.title.replace(/\s/, "");
    }
}

class AnimeList{
    list=[]
    constructor(list = []){
        if (localStorage.getItem("your_anime_list") == null)
            this.list = list
        else{
            let list_deserialized = JSON.parse(localStorage.getItem("your_anime_list"));
            this.list = list_deserialized;
        }
    }

    get_list(){
        return this.list;
    }

    add(anime){
        for(let item of this.list){
            if (anime.id === item.id){
                title_input.value = "Already added";
                return false;
            }
        }
        
        this.list.push(anime)
        this.update_storage();
        return true;
    }

    remove_by_id(anime_id){
        let temp = []
        for (let anime of this.list){
            if (anime.id != anime_id){
                temp.push(anime);
            }
        }
        this.list = temp;
        this.update_storage()
    }

    update_status(anime_id){
        for(let anime of this.list){
            if (anime.id === anime_id){
                anime.is_watched = !anime.is_watched;
                return anime.is_watched;
            }
        }
    }

    update_storage(){
        let list_serialized = JSON.stringify( this.list );
        localStorage.setItem("your_anime_list", list_serialized);
    }
}

const open_modal_btn = document.querySelector("#open-modal");
const close_modal_btn = document.querySelector("#close-modal");
const modal =  document.querySelector("#modal");

open_modal_btn.addEventListener("click", (e) => {
    document.querySelector("#modal").style.display = "block";
})
close_modal_btn.addEventListener("click", (e) => {
    document.querySelector("#modal").style.display = "none";
})


const anime_list = new AnimeList();

//variable
const add_btn = document.querySelector("#add");
const title_input = document.querySelector("#title");
const studio_input = document.querySelector("#studio");
const release_input = document.querySelector("#release");
const watch_input = document.querySelector("#watched");
const the_list = document.querySelector("#list")

//action
add_btn.addEventListener("click", (e) => {
    
    //anime prop
    let title = title_input.value;
    let studio = studio_input.value;
    let release_year = release_input.value
    let is_watched = watch_input.checked;

    //not allow empty title
    if (title === "") return

    let new_anime = new Anime(title, studio, release_year, is_watched);
    if(anime_list.add(new_anime)){
        create_anime_card(new_anime);
        modal.style.display = "none";
    }
})

//clear the title input when already added
title_input.addEventListener('click', e=>{
    if(e.target.value == "Already added"){
        e.target.value = ''
    }
})

//function for remove button
function remove_anime(id){
    //remove from list
    let anime_id = id
    anime_list.remove_by_id(id)

    //remove from screen
    let remove_btn = document.querySelector("#"+id);
    let card = remove_btn.parentElement;
    card.remove();
}

//update watched status


function create_anime_card(anime){
    let card = document.createElement('div')
    let title = document.createElement('h3')
    let studio = document.createElement('h3')
    let release = document.createElement('h3')
    let watchBtn = document.createElement('button')
    let removeBtn = document.createElement('button')

    card.classList.add('card', 'pad', 'col-a-third');
    watchBtn.classList.add('pad', "btn-blue");
    watchBtn.setAttribute("data-name", anime.id);

    removeBtn.classList.add('pad', "btn-blue");
    removeBtn.addEventListener("click", (e)=>{
        remove_anime(e.target.id);
    })

    title.textContent = `"${anime.title}"`;
    studio.textContent = anime.studio;
    release.textContent = anime.release_year;
    
    removeBtn.textContent = "Remove";
    removeBtn.id = anime.id;

    watchBtn.textContent = anime.is_watched?"Watched":"Not watched yet";
    watchBtn.addEventListener("click", e => {
        let stat= anime_list.update_status(e.target.getAttribute("data-name"));
        console.log(stat);
        e.target.textContent = stat?"Watched":"Not watched yet";
    })

    card.appendChild(title);
    card.appendChild(studio);
    card.appendChild(release);
    card.appendChild(watchBtn);
    card.appendChild(removeBtn);
    the_list.appendChild(card);
}

function view(){
    for(let anime of anime_list.list){
        create_anime_card(anime)
    }
}
view()