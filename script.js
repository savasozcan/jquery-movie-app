$(document).ready(() => {

        $("#searchForm").on('submit', e => {
        
        let searchVal = $("#searchText").val();
        getMovies(searchVal)

        e.preventDefault();
    })
});
const input = document.getElementById("searchText")
const form = document.getElementById("searchForm")
const list = document.getElementById("list")
const home = document.getElementById("home")
const movieList = document.getElementById("movies")
const movieListText = document.getElementById("movie-text")
const movieItem = [...document.getElementsByClassName("movie-item")]
let items

loadItems();

eventListeners();

function eventListeners() {
    home.addEventListener("click", addListItem)
    list.addEventListener('click', deleteItem);
}

function loadItems() {
    items = getItemFromLS();
    items.forEach(function(item) {
        createItem(item)
    })
}

// api den filmleri çekmek
function getMovies(searchVal) {
    axios.get("http://www.omdbapi.com?s=" + searchVal + "&apikey=63f944af")
    .then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = "";
        
        $.each(movies, (index, movie) => {
            output += `
                <div class="movie-container">
                    <div class="row">
                        <img class="movie-img" src="${movie.Poster}" alt="">
                        <h5 class="movie-title">${movie.Title}</h5>
                        <button onclick="selectMovie('${movie.imdbID}')" class="info-btn" id="#show-modal" href="#">Movie Info</button>
                    </div>
                </div>
            `;
        })

        $("#movies").html(output);
    })
    .catch((err) =>  {
        console.log(err);    
    })
}

// Seçilen filmin modalda açılması
function selectMovie(id) {
    axios.get("http://www.omdbapi.com?i=" + id + "&plot=full" + "&apikey=63f944af")
    .then((response) => {
        console.log(response);

        let movie = response.data;
        let output = "";
        let imdbPuan = movie.imdbRating;

        output += `
            <div class="modal">
                <div class="modal-card">
                    <header class="modal-card-header">
                        <p class="modal-card-title">
                            ${movie.Title} (${movie.Year})
                        </p>
                        <button class="delete close-modal" onclick="closeModal()" aria-label="close"></button>
                    </header>

                    <div class="modal-card-body">
                        <span class="title">${movie.Title}</span>
                        <img class="modal-img" src="${movie.Poster}">
                        <span class="rating">${movie.imdbRating}</span>
                        <div id="progress-container">
                            <br />
                            <div class="progress"><span class="status"></span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $(output).appendTo(".container-fluid");

        // if(imdbPuan == 0) {
        //     $(".progress").addClass("none")
        // }else if(imdbPuan > 0 && imdbPuan < 5) {
        //     $(".progress").addClass("fifty")
        // }else if(imdbPuan >= 5 && imdbPuan < 10) {
        //     $(".progress").addClass("one-hundred")
        // }

        let yuzde = Math.floor((imdbPuan*10))
        $(".progress .status").css('width', yuzde + "%")

        //Burada söylemiş olduğunuz "0 Kırmızı 50 Sarı 100 Yeşil" ibaresini biraz değiştirerek 0-50 puan arası kırmızı / 50-80 puan arası sarı / 80-100 puan arsını yeşil ile gösterdim.

        if(yuzde < '50') {
            $(".progress .status").css('background-color', 'red')
        }else if (yuzde >= '50' && yuzde < '80') {
            $(".progress .status").css('background-color', 'yellow')
        }else {
            $(".progress .status").css('background-color', 'green')
        }        
    })

    .catch((err) => {
        console.log(err);
        
    })
};

function getItemFromLS() {
    if(localStorage.getItem('items') === null) {
        items = [];
    }else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    
    return items;

}

function setItemToLS(movie) {
    items = getItemFromLS();
    //localStorage da 10 film bulunması ve aynı isimde text girilmesi halinde conditiona girmeyecek
    if(items.length <= 10 && !items.toString().includes(movie)) {
        items.push(movie);
        localStorage.setItem('items', JSON.stringify(items))
    }
}

//localeStorage den silmek
function deleteItemFromLS(text) {
    items = getItemFromLS();
    items.forEach(function(item,index){
        if(item === text){
            items.splice(index,1);   
        }
    });
    localStorage.setItem('items',JSON.stringify(items));

}

//localStorage a giden bilginin ekrana basılması için gerekli elemanların oluşturulması
function createItem(text) {
    // create li
    const li = document.createElement('li');
    li.className = 'movie-item';
    li.appendChild(document.createTextNode(text));

    // create a
    const a = document.createElement('a');
    a.classList = 'delete-item float-right';
    a.setAttribute('href', '#');
    a.innerHTML = '<i class="fas fa-times"></i>';

    // add a to li
    li.appendChild(a);

    // add li to ul
    list.appendChild(li);
}

//Oluşturulan elemanların ekrana eklemesi
function addListItem(e) {
    if(!(input.value === "")) {
        createItem(input.value);

        setItemToLS(input.value);

        input.value = "";    
        
        movieListText.style.display = "block";
        
        movieList.innerHTML = ""
        
    }

    e.preventDefault()
}

//Son girilen filmler listesindeki eleman silinmesi
function deleteItem(e) {
    if (e.target.className === 'fas fa-times') {        
        e.target.parentElement.parentElement.remove();

        // delete item from LS
        deleteItemFromLS(e.target.parentElement.parentElement.textContent);
    }
    e.preventDefault();
}

function closeModal() {
    $(".modal"). css("display", "none")
}

//Not: localstorage da bilgini saklanması film arandığında değil, filmi aradıktan sonra yukarıdaki 'Film Ara' butonuna basıp anasayfaya döndükten sonra yapılmaktadır.

