function initialize () {

}
var map;
var ne,sw;
function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.75, lng: -97.13},
          zoom: 16
        });

        google.maps.event.addListener(map, "bounds_changed", function() {
       // send the new bounds back to your server
        var bounds =  map.getBounds();
        ne = bounds.getNorthEast();
        sw = bounds.getSouthWest();
        });
}


function sendRequest () {

   var output =  document.getElementById("output");
   output.innerHTML = "";
   initMap();

   var nelat = ne.lat();
   var nelng = ne.lng();

   var swlat = sw.lat();
   var swlng = sw.lng();

   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);

   xhr.open("GET", "proxy.php?term="+query+"&bounds="+swlat+","+swlng+"|"+nelat+","+nelng+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var total =  json.total;

          var searchresults =  document.getElementById("searchresults");
          searchresults.innerHTML = total+' no. of results found';
          
          if(total>0){
            var businesses = json.businesses;
            var i = 1;
            for(var obj in businesses){
    
                var number = i;
                var id = businesses[obj].id;
                var name = businesses[obj].name;
                var image = businesses[obj].image_url;
                var url = businesses[obj].url;
                var rating_img_url = businesses[obj].rating_img_url;
                var snippet_text = businesses[obj].snippet_text;
                var location = businesses[obj].location;

                var latitude = location.coordinate.latitude;
                var longitude = location.coordinate.longitude;

                var row = document.createElement("div");


                var div = '<div class="card left-card">' 
                            +'<div class="">'   
                              +'<img src="'+image+'" style = "" alt="No Image Found" />'
                            +'</div>'
                            +'<div class="info">'
                              + '<a href="'+url+'" style="text-decoration: none;  font-size: 22px;"><p>'+number+'. '+name+'</p></a>'
                              + '<p class="cardp">Rating:'
                                +'<img src="'+rating_img_url+'" style="float:right;"/>'
                              +'</p>'
                              +'<p>'+snippet_text+'</p>'
                            +'</div>'
                          +'</div>';
               
                var myLatLng = { lat: latitude, lng: longitude};
                addMarker(myLatLng,map,""+number);


                row.innerHTML = div;
                output.appendChild(row);

                i++;
            }
          }

       }
   };
   xhr.send(null);
}

function addMarker(location, map,labels) {
  var marker = new google.maps.Marker({
    position: location,
    label: labels,
    map: map
  });
}

