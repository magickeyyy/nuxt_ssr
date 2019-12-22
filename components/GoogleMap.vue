<template>
    <div id="google_map">
		<div id="mapbox_"></div>
    </div>
</template>

<script>
const gicon = require('~/assets/icon/icon_logo.png');
export default {
    data() {
        return {
            list: [
                { lat: 13.7223596573, lng: 100.7157897950 },
                { lat: 13.8080720000, lng: 100.0581840000 },
                { lat: 13.7280200000, lng: 100.5297000000 },
                { lat: 13.7162000000, lng: 100.5310000000 },
                { lat: 13.7290530000, lng: 100.5135740000 },
                { lat: 14.0549898148, lng: 100.1214981080 },
                { lat: 13.7518351800, lng: 100.6275230200 },
                { lat: 13.8884840012, lng: 100.6017456050 },
                { lat: 14.1346082687, lng: 100.6175308230 },
                { lat: 13.7278539724, lng: 100.5726671220 },
            ],
        };
    },
    methods: {
        initMap2() {
			const marks = this.list;
			let map = new google.maps.Map(document.getElementById('mapbox_'), {
          		center: {lat: 13.7223596573, lng: 100.7157897950},
          		zoom: 8,
            });
            marks.map((v,i)=>{
                return new google.maps.Marker({
                    position: v,
                    map,
                    label:'P'
                })
            });
		},
        initMaps() {
            var map;
            var markers = [];
            var defaultZoom = 9;
            function initialize() {
                var mapOptions = {
                    center: new google.maps.LatLng(39.90403, 116.407526),
                    zoom: defaultZoom,
                };
                map = new google.maps.Map(document.getElementById('google_map'), mapOptions);
                //设置地图缩放
                var i = markers.length;
                var bounds = new google.maps.LatLngBounds();
                while (i--) {
                    bounds.extend(
                        new google.maps.LatLng(markers[i].getPosition().lat(), markers[i].getPosition().lng()),
                    );
                }
                map.fitBounds(bounds);

                //地图缩放时触发，当地图的缩放比例大于默认比例时，恢复为默认比例
                google.maps.event.addListener(map, 'zoom_changed', function() {
                    if (map.getZoom() > defaultZoom) {
                        map.setZoom(defaultZoom);
                    }
                });
            }
            // Show the new coordinates for the rectangle in an info window.

            function addMarker(location) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                });
                markers.push(marker);
            }
            // Sets the map on all markers in the array.
            function setAllMap(map) {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(map);
                }
            }

            // Removes the markers from the map, but keeps them in the array.
            function clearMarkers() {
                setAllMap(null);
            }

            // Shows any markers currently in the array.
            function showMarkers() {
                setAllMap(map);
            }

            // Deletes all markers in the array by removing references to them.
            function deleteMarkers() {
                clearMarkers();
                markers = [];
            }
            google.maps.event.addDomListener(window, 'load', initialize);
        },
    },
    mounted() {
        this.initMap2();
    },
};
</script>

<style scoped lang="less">
#google_map {
    width: 800px;
	height: 600px;
	margin: 0 auto;
	#mapbox_{
		height: 100%;
		width: 100%;
	}
}
</style>
