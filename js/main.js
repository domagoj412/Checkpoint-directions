$(document).ready(function () {

    var miny = "45.10";
    var maxy = "45.19";
    var minx = "14.75";
    var maxx = "14.80";

    $.ajax({
        url: "http://www.panoramio.com/map/get_panoramas.php?order=popularity&set=full&from=0&to=10&minx=" + minx + "&miny=" + miny + "&maxx=" + maxx + "&maxy=" + maxy + "&size=medium",
        dataType: 'json',
        success: function(data) {
            for (i in data.photos) {
                $("#thePics").append("<img width='305' src='" + data.photos[i].photo_file_url + "'>");
                console.log(data.photos[i].photo_file_url);
            }
        }
    });

});
