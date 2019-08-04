$(document).ready(() => {
    $("#searchForm").on('submit', e => {
        
        let searchVal = $("#searchText").val();
        getMovies(searchVal)

        e.preventDefault();
    })
});

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
                        <button onclick="selectMovie('${movie.imdbID}')" class="button" id="#show-modal" href="#">Movie Info</button>
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



function closeModal() {
    $(".modal"). css("display", "none")
}

