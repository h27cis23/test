distance = 1;   //検索された距離
count = 0;      //中継地点の数

function initMap() {    
    /* ルート検索を行う */
    var directionsService = new google.maps.DirectionsService();
    /* ルート検索の結果を表示するためのオブジェクトを生成 */
    var directionsRenderer = new google.maps.DirectionsRenderer();
    
    //マップを描画する
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644}, 
        zoom: 16
    });
//    var infoWindow = new google.maps.InfoWindow({map: map,content:"メッセージを表示"});
    /* mapObj を DirectionsRendererオブジェクトのsetMap()を使って関連付け */
    directionsRenderer.setMap(map);
 

  if (navigator.geolocation) {
    //ブラウザでgeolocationが使える場合
    navigator.geolocation.getCurrentPosition(function(position) {
        //現在地をposに保存

        count = 2;
        var start_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        //目的地を保存
        var move_distance = distance*0.0089831487;
        var goal_pos = {
            lat:position.coords.latitude,
            lng:position.coords.longitude
//            lat: position.coords.latitude+0.0078,
//            lng: position.coords.longitude+0.0007
        };
        //中継地点を保存
        var via_pos = {
            lat: position.coords.latitude+(move_distance/count),
            lng: position.coords.longitude
        };
        
        lat1=window.localStorage.getItem('start_lat');
        lng1=window.localStorage.getItem('start_lng');
        lat2=window.localStorage.getItem('via_lat');
        lng2=window.localStorage.getItem('via_lng');
                
        //二点間の距離を計算
        var kekka = Math.round(getDistance(lat1,lng1,lat2,lng2)/2*100);

//        alert(""+kekka*2/100+"km");
//        //スタート位置にピンを立てる
//        var marker = new google.maps.Marker({
//            position: start_pos,
//            map: map,
//            title:"" + メッセージ + ""
//        });
    
//        //マップインフォメーション（現在はピンを利用）
//        infoWindow.setPosition(start_pos);
//        infoWindow.setContent('現在位置');

        
        //現在地をマップの中央に設定
        map.setCenter(start_pos);

  
      /* 開始,中継,目的地点の座標を指定*//*ここを変更する*/
    var start = start_pos; 
    var point1 = via_pos;
    var goal = goal_pos; 

    /* 開始,目的地点、ルーティングの種類を設定  */
    var request = { 
        origin: start, 
        destination: goal,
        waypoints:[{location:point1}],
        travelMode: google.maps.TravelMode.DRIVING
    }; 

    
    directionsService.route(request, function(result, status) {    
        /* ルート検索に成功したら以下の処理 */
        if (status == google.maps.DirectionsStatus.OK) { 
            /* ルートをマップ上に表示 */ 
            directionsRenderer.setDirections(result);
        }
    });
        
    }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
    });

    


  }else {
    //ブラウザでgeolocationが使えない場合
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}


//距離の計算//
function getDistance(lat1, lng1, lat2, lng2) {
       function radians(deg){
      return deg * Math.PI / 180;
   }
       return 6378.14 * Math.acos(Math.cos(radians(lat1))* 
    Math.cos(radians(lat2))*
    Math.cos(radians(lng2)-radians(lng1))+
    Math.sin(radians(lat1))*
    Math.sin(radians(lat2)));
}