
SHAPES_URL = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
CRIMES_URL = "https://data.cityofnewyork.us/api/views/bi3n-znbr/rows.json?accessType=DOWNLOAD";
HOODNAMES_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
HOUSING_URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

var map;
var nyShapes = [];
//datasets to use
var DATASET_SHAPES = null;//.features[district].geometry.coordinates[0][setofcoordinates] or .features[0].properties
var DATASET_CRIMES = null;
var DATASET_HOODNAMES = null;
var DATASET_HOUSING = null;
var shapesDatasetRecieved;

//************************************DATASETS*************************************************************
function getDataFromURL(URL){
	var data = $.get(URL, function(){
		//console.log(URL)
	})
		.done( function(){
			//Success
                        if(URL === SHAPES_URL){
			   DATASET_SHAPES = JSON.parse(data.responseText);
                          // console.log(DATASET_SHAPES.features[0].geometry.coordinates[0][0]);
                       }else if(URL === CRIMES_URL){
                           DATASET_CRIMES = JSON.parse(data.responseText);
                          // console.log(DATASET_CRIMES);
                       }else if(URL === HOODNAMES_URL){
                           DATASET_HOODNAMES = JSON.parse(data.responseText);
                          // console.log(DATASET_HOODNAMES);
                       }else if(URL === HOUSING_URL){
                           DATASET_HOUSING = JSON.parse(data.responseText);
                           //console.log(DATASET_HOUSING);
                       }
			
		})
		.fail( function(error){
			console.error(error);
		})
}

//load all datasets needed 
getDataFromURL(SHAPES_URL);
getDataFromURL(CRIMES_URL);
getDataFromURL(HOODNAMES_URL);
getDataFromURL(HOUSING_URL);

shapesDatasetRecieved = setInterval(checkShapesDatasetStatus, 700);

function checkShapesDatasetStatus(){
    if(DATASET_SHAPES === null){
        //wait for dataset before drawing
    }else{
        //draw districts and stop interval
        clearInterval(shapesDatasetRecieved);
        drawNYDistrictsBorders();
    }
}


/************************************GOOGLE MAPS**********************************************/
function drawNYDistrictsBorders(){
    
    //loop through districts
    for(var d = 0; d < DATASET_SHAPES.features.length; d++){
        
            var geometryCoords = [];
            var coords = DATASET_SHAPES.features[d].geometry.coordinates[0];
            
            for(var i = 0; i < coords.length; i++){
                geometryCoords.push( {lat:parseFloat(coords[i][1]), lng:parseFloat(coords[i][0])} );
            }
            //create district border
            var shape = new google.maps.Polygon({
            paths: geometryCoords,
            strokeColor: 'rgb(0, 0, 255)',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0,
            fillColor:"darkgreen",
            id: d
          });
            //add a listener to each district
            google.maps.event.addListener(shape, "click", function(){
                //alert(this.id);
                this.setOptions({fillOpacity:0.3});
                
            });
            shape.setMap(map);
            //save shape to use later
            nyShapes.push(shape);
    } 
    
    //test
     nyShapes[1].setOptions({fillOpacity:0.5});
     //console.log(geometryCoords);
     
}
function onGoogleMapResponse(){
	
        map = new google.maps.Map(document.getElementById('mapcontainer'), {
                center: {lat:40.7128, lng: -73.8},
		zoom: 11
	});
        
      /*  var icon = {
             url: "https://logo.clearbit.com/www.stern.nyu.edu/", // url
             scaledSize: new google.maps.Size(30, 30)
        }*/
        //add starting marker
        var marker = new google.maps.Marker({
            position:{lat:40.7291, lng: -73.9965},
            //icon: icon,
            animation: google.maps.Animation.DROP,
            map:map
        });
        
        
        
}