const axios = require('axios')

module.exports = {
    getData: async function (settings) {
        return await axios(`https://api.spotify.com/v1/${settings.endpoint}`, {
                headers: {
                    'Authorization': 'Bearer ' + settings.acces_token
                }
            })
            .then(function (response) {
                return response.data.items;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    filterData: async function (tracks) {
        const filteredTracks = await tracks.map(function (track) {
            return {
                album_name: track.track.album.name,
                artist: track.track.artists && track.track.artists[0] ? track.track.artists[0] : track.track.artists.name,
                length: track.track.duration_ms,
                href: track.track.href,
                id: track.track.id,
                name: track.track.name,
                popularity: track.track.popularity,
                preview_url: track.track.preview_url,
                release_date: track.track.album.release_date,
                images: track.track.album.images
            };
        }).filter(function(track) {
            if(track.preview_url !== null) {
                return track;
            } 
        });

        return filteredTracks;
    },
    getRandomSongs: function (arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
};