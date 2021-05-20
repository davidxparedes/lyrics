const app = {};

app.$form = $('form');
app.$recentSearches = $('#recentSearches');
app.$recentSearchesToggle = $('#recentSearchesToggle');
app.lyricsArray = [];

app.getLyrics = (artist, song) => {
    $.ajax({
        url: `https://api.lyrics.ovh/v1/${artist}/${song}`,
        method: "GET",
        dataType: "json",
        beforeSend: function () {
            $('.loader').removeClass('d-none')
        },
        complete: function () {
            $('.loader').addClass('d-none')
        },
    }).then(function(data){
        const lyrics = data.lyrics;
        app.lyricsArray.push(lyrics);

        app.displayData(artist, song, lyrics);
        app.addRecentSearches(artist, song);
        app.$recentSearchesToggle.removeClass('d-none').addClass('d-flex');
    }).catch(function() {
        $('.lyrics').html('No lyrics available');
        $('#lyrics-modal').modal('toggle');
    });
};

app.displayData = (artist, song, lyrics) => {
    const $headingArtist = $('#headingArtist');
    const $headingSong = $('#headingSong');
        
    $headingArtist.html(artist);
    $headingSong.html(song);

    $('.lyrics').html(lyrics.replace(/\n/g, "<br>"));
    $('#lyrics-modal').modal('toggle');
};

app.addRecentSearches = (artist, song) => {
    $('#recentSearches').append(`
        <a class="row text-white d-flex justify-content-center text-decoration-none py-2 text-uppercase" href="#">
            <div class="col-sm-5 d-flex justify-content-center justify-content-sm-end align-items-center text-center text-sm-right p-sm-0">
                <span class="recent-artist">${artist}</span>
            </div>
            <div class="col-sm-1 p-0 d-flex justify-content-center align-items-center">
                <span class="d-none d-sm-block text-center">-</span>
            </div>
            <div class="col-sm-5 d-flex justify-content-center justify-content-sm-start align-items-center text-center text-sm-left p-sm-0">
                <span class="recent-song">${song}</span>
            </div>
        </a>
    `);
};

app.init = () => {
    app.$form.on('submit', function(e) {
        e.preventDefault();
    
        const $artist = $('#artist').val();
        const $song = $('#song').val();

        app.getLyrics($artist, $song);
        app.$form.trigger('reset');
    });

    app.$recentSearches.on('click', '.row', function() {
        const recentItemIndex = $(this).index();
        const recentArtist = $(this).find('.recent-artist').html();
        const recentSong = $(this).find('.recent-song').html();

        app.displayData(recentArtist, recentSong, app.lyricsArray[recentItemIndex]);
        console.log(app.lyricsArray[recentItemIndex]);
    });
};

$(function() {
    app.init();
});