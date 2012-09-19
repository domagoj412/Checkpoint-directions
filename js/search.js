$(document).ready(function () {

    var myCurrentLat = 45.128168;
    var myCurrentLon = 14.793262;


    var tolerance = 0.0005;
    var photos = 0;
    var current = 0;
    var dataPhotos = new Array();
    var numPics=0;
    var reference=0;
    var lat = 0;
    var lng = 0;
    var distance = 0;

    function reset_vars() {
        tolerance = 0.0005;
        photos = 0;
        current = 0;
        dataPhotos = new Array();
        numPics=0;
        reference=0;
        lat = 0;
        lng = 0;
        distance=0;
    }

    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }

    function calculate_distance(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
        var dLon = (lon2-lon1).toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return d = R * c; // Distance in km

    }


    var loading_spinner = '<p style="text-align: center;margin-top: 10px"><img style="border:none" src="js/images/loading.gif"></p>';

    $("#search").keyup(function (e) {
        var term = $(this).val();
        get_suggestions(term);
    });

    function li_clickevents() {
        $(".location").unbind("click");
        $(".location").click(function () {
            reset_vars();

            reference = $(this).attr("data-reference");
            $("#choosen_content").html(loading_spinner);
            $("#cnt_below_pic").hide();
            $("#yes_options").hide();
            get_pictures();
        })
    }


    function get_suggestions(term) {
        $.ajax({
            url:"search.php",
            dataType:"json",
            data:{
                input:term
            },
            success:function (data) {
                $("#results_sugg").html('<ul data-role="listview" id="resultsul" data-inset="true"></ul>');
                for (i in data.predictions) {
                    $("#resultsul").append('<li class="ui-link-inherit"><a href="#choosen" class="location" data-reference="' + data.predictions[i].reference + '" data-transition="slide">' + data.predictions[i].description + '</a></li>');
                }
                $("#resultsul").listview();
                li_clickevents();
            }
        });
    }

    function get_pic_given_reference() {
        var minx = lng - tolerance;
        var miny = lat - tolerance;
        var maxx = lng + tolerance;
        var maxy = lat + tolerance;

        $.ajax({
            url:"search_panoramio.php",
            dataType:'json',
            data:{
                minx:minx,
                miny:miny,
                maxx:maxx,
                maxy:maxy
            },
            success:function (data) {
                if (data.photos.length != 0) {

                    if ($("#thePics").length == 0) {
                        $("#choosen_content").html('<div style="margin:5px" id="thePics"></div>');

                    }

                    var j=0;
                    for (i in data.photos) {
                        if($.inArray(data.photos[i].photo_file_url,dataPhotos)==-1) {
                            distanceFromPicture = calculate_distance(myCurrentLat,myCurrentLon,data.photos[i].latitude,data.photos[i].longitude);
                            if(distanceFromPicture<distance) {
                                dataPhotos[numPics] = data.photos[i].photo_file_url;
                                console.log("dataPhotos["+numPics+"]="+dataPhotos[numPics]);
                                j++;
                                numPics++;
                            }
                        }
                    }
                    photos = photos + j - 1;
                    if(j==0) {
                        tolerance = tolerance*2;
                        get_pictures();
                        return false;
                    } else {
                        $("#thePics").html("<img src='" + dataPhotos[current] + "'>");
                        $("#question").html("Do you know where is this?");
                        $("#useless").html("Useless picture?");
                        $("#cnt_below_pic").show();
                    }

                } else {
                    tolerance = tolerance*2;
                    get_pictures();
                }
            },
            error: function() {
                alert("error geting pictures");
            }
        });
    }

    function get_pictures() {

        if(tolerance>1) {
            $("#cnt_below_pic").show();
            $("#question").html("Unfortunately, no pictures where find between your position and your destination.<br>");
            $("#question").append("Get directions from your current position?");
            $("#useless").html("");
            $("#choosen_content").html("");
            return false;
        }

        if(lat==0) {
            $.ajax({
                url:"search_reference.php",
                dataType:"json",
                data:{
                    reference:reference
                },
                success:function (data) {
                    lat = data.result.geometry.location.lat;
                    lng = data.result.geometry.location.lng;

                    distance = calculate_distance(myCurrentLat,myCurrentLon,lat,lng);
                    get_pic_given_reference()
                }
            });
        } else {
            get_pic_given_reference()
        }

    }

    $("#no").click(function () {
        current++;
        $("#thePics").html(loading_spinner);
        $("#cnt_below_pic").hide();

        if (current <= photos) {
            var img = $("<img />").attr('src', dataPhotos[current])
                .load(function () {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alert('broken image!');
                    } else {
                        $("#thePics").html(img);
                        $("#cnt_below_pic").show();
                    }
                });
        } else {
            tolerance = tolerance*2;
            get_pictures();
        }
    });

    $("#yes").click(function () {
        $("img","#choosen_content").css({maxHeight:"30%"});
        $("#cnt_below_pic").hide();
        $("#yes_options").show();
        $("#yes_options").listview();
    });



});

