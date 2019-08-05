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
const movieItem = document.getElementsByClassName("movie-item")
let items

loadItems();

eventListeners();

function eventListeners() {
    home.addEventListener("click", addListItem)
    movieItem[0].addEventListener("click", deleteItem)
}

function loadItems() {
    items = getItemFromLS();
    items.forEach(function(item) {
        createItem(item)
    })
}

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

        // function progressBar() {
        //     if(${movie.imdbRating} > 0 && ${movie.imdbRating} < 5) {
        //         $(".progress").addClass("twenty")
        //     }
        // }

        $(output).appendTo(".container-fluid");

        
        if(imdbPuan == 0) {
            $(".progress").addClass("none")
        }else if(imdbPuan > 0 && imdbPuan < 5) {
            $(".progress").addClass("fifty")
        }else if(imdbPuan >= 5 && imdbPuan < 10) {
            $(".progress").addClass("one-hundred")
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
    items.push(movie);
    localStorage.setItem('items', JSON.stringify(items))
}

function deleteItemFromLS(text) {
    items = getItemFromLS();
    items.forEach(function(item, index) {
        if(item == text) {
            items.splice(index, 1)
        }
    });

    localStorage.setItem('items', JSON.stringify(items))

}

function createItem(text) {
    var htmlList = `
        <li class="movie-item">
            ${text}
            <a href="#" class="delete-item float-right">
                <i class="fas fa-times"></i>
            </a>
        </li>
    `;

    list.innerHTML += htmlList
}

function addListItem(e) {
    // if(input.value === "") {
    //     alert('Please enter a movie name')
    //     return
    // }

    if(!(input.value === "")) {
        createItem(input.value);

        setItemToLS(input.value);

        input.value = "";    
        
        movieListText.style.display = "block";
        
        movieList.innerHTML = ""
        
    }

    e.preventDefault()
}

function deleteItem(e) {
    if(e.target.className === 'movie-item') {
        console.log(e);
        
        e.target.remove();
        deleteItemFromLS(e.target.textContent)
    }

    e.preventDefault()
}



function closeModal() {
    $(".modal"). css("display", "none")
}

