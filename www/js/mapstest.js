distance = 0;   //検索された距離
count = 0;      //中継地点の数
start_time=0;         //開始時刻
finish_time=0;        //終了時刻
start_test=0;finish_test=0;
result_time=0;        //走った時間


//検索画面
function Search_distance(){
    distance = dis.textbox.value;  //テキストエリアの値を取得
    //距離をセット
    window.localStorage.setItem('search_dis', distance);
}


function initMap() {
    //距離をゲット
    getdistance = window.localStorage.getItem('search_dis');
    
    /* ルート検索を行う */
    var directionsService = new google.maps.DirectionsService();
    /* ルート検索の結果を表示するためのオブジェクトを生成 */
    var directionsRenderer = new google.maps.DirectionsRenderer();
    
    //マップを描画する
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0}, 
        zoom: 16
    });
    //var infoWindow = new google.maps.InfoWindow({map: map,content:"メッセージを表示"});
    /* mapObj を DirectionsRendererオブジェクトのsetMap()を使って関連付け */
    directionsRenderer.setMap(map);
 
    //geolocation
    if (navigator.geolocation) {
    //ブラウザでgeolocationが使える場合
    navigator.geolocation.getCurrentPosition(function(position) {
        //現在地をposに保存

        count = 4;      //ピンの数
        
        var start_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        var move_distance = getdistance*0.0089831487;       //移動距離
        
        //目的地を保存
        var goal_pos = {
            lat:position.coords.latitude,
            lng:position.coords.longitude
        };
        //中継地点を保存
        var via_pos = {
            lat: position.coords.latitude+(move_distance/count),
            lng: position.coords.longitude
        };
        //中継地点2を保存
        var via2_pos = {
            lat: position.coords.latitude+(move_distance/count),
            lng: position.coords.longitude-(move_distance/count)
        };
        //中継地点３を保存
        var via3_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude-(move_distance/count)
        };
        
        lat1=start_pos.lat;
        lng1=start_pos.lng;
        lat2=via_pos.lat;
        lng2=via_pos.lng;
        lat3=via2_pos.lat;
        lng3=via2_pos.lng;
        lat4=via3_pos.lat;
        lng4=via3_pos.lng;
        lat5=goal_pos.lat;
        lng5=goal_pos.lng;
        
        window.localStorage.setItem('start_lat', lat1);
        window.localStorage.setItem('start_lng', lng1);
        window.localStorage.setItem('via_lat', lat2);
        window.localStorage.setItem('via_lng', lng2);
        window.localStorage.setItem('via2_lat', lat3);
        window.localStorage.setItem('via2_lng', lng3);
        
        //二点間の距離を計算
        var kekka = Math.round(getDistance(lat1,lng1,lat2,lng2)*100);
        kekka +=Math.round(getDistance(lat2,lng2,lat3,lng3)*100);
        kekka +=Math.round(getDistance(lat3,lng3,lat4,lng4)*100);
        kekka +=Math.round(getDistance(lat4,lng4,lat5,lng5)*100);
        
        window.localStorage.setItem('dis',kekka/100);
        document.getElementById("run_dis").innerHTML="距離： "+kekka/100 + "km";
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
    var point2 = via2_pos;
    var point3 = via3_pos;
    var goal = goal_pos; 

    /* 開始,目的地点、ルーティングの種類を設定  */
    var request = { 
        origin: start, 
        destination: goal,
        waypoints:[{location:point1},{location:point2},{location:point3}],
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

//開始時間
function start(){
    start_time = new Date();        //開始時刻を取得
    var start_mon = start_time.getMonth()+1;  //月
    var start_day = start_time.getDate();    //日
    //月日をセット
    window.localStorage.setItem('mon',start_mon);
    window.localStorage.setItem('day',start_day);
    //時間に変換して表示
    var start_hours = start_time.getHours();
    var start_min = start_time.getMinutes();
    var start_sec = start_time.getSeconds();
    start_test = start_hours*3600+start_min*60+start_sec;
    document.getElementById("start_time").innerHTML="開始時間: "+start_hours+":"+start_min+":"+start_sec;
    run_timer();
}

//タイマー
function run_timer(){
    timerID = setInterval(
        function(){
            var run_time = new Date();
            var run_hours = run_time.getHours();
            var run_min = run_time.getMinutes();
            var run_sec = run_time.getSeconds();
            run_test = run_hours*3600+run_min*60+run_sec;
            run_timer = run_test - start_test;
            document.getElementById("run_time").innerHTML="経過時間: " + run_timer + "秒";
        }, 1000);  
}
//終了時間
function finish(){
    finish_time = new Date();       //終了時刻を取得
    //時間に変換して表示
    var finish_hours = finish_time.getHours();
    var finish_min = finish_time.getMinutes();
    var finish_sec = finish_time.getSeconds();
    finish_test = finish_hours*3600+finish_min*60+finish_sec;
    timer();    
    //履歴画面に切り替え
    window.location.href = '../www/history.html';
}
//経過時間
function timer(){
    
    //開始時刻と終了時刻の差を計算
    result = finish_test-start_test;
    //時間をローカルストレージにセット
    window.localStorage.setItem('result_his', result);
}

//履歴画面
function his(){
    //ローカルストレージからデータをゲット
    var mon = window.localStorage.getItem('mon');
    var day = window.localStorage.getItem('day');
    var dis = window.localStorage.getItem('dis');
    var time = window.localStorage.getItem('result_his');
    
    //時間に変換
    var h = Math.floor(time/3600);
    var m = Math.floor(time/60);
    var s = Math.floor(time%60);
    
    //速さを計算
    var speed = Math.round(dis/(time/3600));
    
    
    //履歴画面を書き換える
    document.getElementById("date").innerHTML="日付：   "+mon+"月"+day+"日";
    document.getElementById("dis").innerHTML="距離：   "+dis + "km";
    document.getElementById("time").innerHTML="走った時間：   "+h+"時間"+m+"分"+s+"秒";
    document.getElementById("speed").innerHTML="速さ：   " + speed + "km/h";
    //セッションで変数を送る

    //ローカルストレージをクリアする
    window.localStorage.removeItem('search_dis');
//    window.localStorage.removeItem('mon');
//    window.localStorage.removeItem('day');
    window.localStorage.removeItem('dis');
    window.localStorage.removeItem('result_his');
}
