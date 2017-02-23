distance = 0;   //検索された距離
start_time=0;         //開始時刻
finish_time=0;        //終了時刻
start_test=0;finish_test=0;
result_time=0;        //走った時間
course =0;
chk = 0;
count = 0;

//距離、時間の検索
function Search_distance(){
    distance = search_form.dis.value;   //距離の値を取得
    minute   = search_form.min.value;   //時間の値を取得
    
    //検索formチェック
    if(search_form.dis.value == false & search_form.min.value == false){
        window.localStorage.setItem('flag', 1);
    }else if(search_form.dis.value == true & search_form.min.value == true){
        window.localStorage.setItem('flag', 2);
    }else if(search_form.min.value == true){
        window.localStorage.setItem('flag', 3);
    }
     
    //時間の検索
    if(search_form.dis.value == ""){
        //速さの取得
        var meyasu = window.localStorage.getItem('speed');
        //距離を計算
        distance = meyasu * (minute / 60 );
    }
    
    //距離のチェック
    if(distance > 42.195) {
        window.localStorage.setItem('flag', 4);
    }
    
    //距離をセット
    window.localStorage.setItem('search_dis', distance);
}

//履歴の検索
function Select_his(){
    var select = select_form.his.value; //選択したデータの取得
    //選択formチェック
    switch(select){
        case "data1":
            alert(window.localStorage.getItem('dis'));
            break;
        case "data2":
            alert(window.localStorage.getItem('dis1'));
            break;
        case "data3":
            alert(window.localStorage.getItem('dis2'));
            break;
        case "data4":
            alert(window.localStorage.getItem('dis3'));
            break;
        case "data5":
            alert(window.localStorage.getItem('dis4'));
            break;
        case "data6":
            alert(window.localStorage.getItem('dis5'));
            break;
    }
}

//現在地取得、マップ表示
function initMap() {
    var course = 1;
    var total_dis = 0;
    //コースのタイプを取得
    var type = window.localStorage.getItem('type');
    if(type == null) type = 0;

    //チェック
    var test = window.localStorage.getItem('flag');
    switch(test){
        case "1":
            alert("入力されていません。");
            window.localStorage.setItem('flag', 0);
            window.location.href = 'search.html';
            break;
        case "2":
            alert("両方入力されています。");
            window.localStorage.setItem('flag', 0);
            window.location.href = 'search.html';
            break;
        case "3":
            var fs = window.localStorage.getItem('speed');
            if(fs <= 0 || isNaN(fs) == true || isFinite(fs) == false){
                alert("履歴の情報が正しくないため検索できません。 \n他の検索方法を利用してください。");
                window.localStorage.setItem('flag', 0);
                window.location.href ='search.html';
            }
            break;
        case "4":
            window.localStorage.setItem('flag', 0);
            if(window.confirm("距離が長すぎます。本当によろしいですか？") == false)
            window.location.href ='search.html';    
            break;
    }
    
    //距離をゲット
    getdistance = window.localStorage.getItem('search_dis');
    
    //コース番号を取得
    var course_text = document.getElementById('course').innerHTML;
    
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
 
    //周回コース
    if(type == 0){
        document.getElementById("type").innerHTML="周回ルート";
    //geolocation
    if (navigator.geolocation) {
    //ブラウザでgeolocationが使える場合
    navigator.geolocation.getCurrentPosition(function(position) {        
         count = 4;      //ピンの数

        var start_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        var move_distance = getdistance*0.0089831487;       //移動距離
        
        var goal_pos = {
            lat:position.coords.latitude,
            lng:position.coords.longitude
        };
        
        
        if(course_text == "コース：0"){
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
        }else if(course_text == "コース：1"){    
            alert("コースが1に変更されました。");
            var via_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude+(move_distance/count)
        };
            //中継地点2を保存
            var via2_pos = {
                lat: position.coords.latitude+(move_distance/count),
                lng: position.coords.longitude+(move_distance/count)
            };
            //中継地点３を保存
            var via3_pos = {
                lat: position.coords.latitude+(move_distance/count),
                lng: position.coords.longitude
            };
        }else if(course_text == "コース：2"){
            alert("コースが2に変更されました。");
            var via_pos = {
                lat: position.coords.latitude-(move_distance/count),
                lng: position.coords.longitude
            };
            //中継地点2を保存
            var via2_pos = {
                lat: position.coords.latitude-(move_distance/count),
                lng: position.coords.longitude+(move_distance/count)
            };
            //中継地点３を保存
            var via3_pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude+(move_distance/count)
            };
        }else if(course_text == "コース：3"){
            alert("コースが3に変更されました。");
            var via_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude-(move_distance/count)
        };
        //中継地点2を保存
        var via2_pos = {
            lat: position.coords.latitude-(move_distance/count),
            lng: position.coords.longitude-(move_distance/count)
        };
        //中継地点３を保存
        var via3_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude-(move_distance/count)
        };
        }
        
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
        window.localStorage.setItem('via3_lat', lat4);
        window.localStorage.setItem('via3_lng', lng4); 
                            
        //移動距離(たぶん道のり) 
        var myTravelMode =  (document.getElementById('TravelMode').value == 'DRIVING')
                            ? google.maps.DirectionsTravelMode.DRIVING :
                            google.maps.DirectionsTravelMode.WALKING;
                            
        directionsService.route({
            origin: start_pos,
            destination: via_pos,
            travelMode: myTravelMode
        }, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                document.getElementById("journey").value =
                    (result.routes[0].legs[0].distance.value >= 1000)
                    ? (result.routes[0].legs[0].distance.value / 1000)
                    : result.routes[0].legs[0].distance.value;
                total_dis += Number((result.routes[0].legs[0].distance.value / 1000));
                if(Number(document.getElementById("journey").value) /1000 > getdistance*3){
                    alert("検索した距離と設定した道のりにずれがあります")
                }
            } else {
                alert('ルート検索できませんでした');
            }
        });
        directionsService.route({
            origin: via_pos,
            destination: via2_pos,
            travelMode: myTravelMode
        }, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                document.getElementById("journey").value =
                    (result.routes[0].legs[0].distance.value >= 1000)
                    ? (result.routes[0].legs[0].distance.value / 1000)
                    : result.routes[0].legs[0].distance.value;
                total_dis += Number((result.routes[0].legs[0].distance.value / 1000));
                if(Number(document.getElementById("journey").value) /1000 > getdistance*3){
                    alert("検索した距離と設定した道のりにずれがあります")
                }
            } else {
                alert('ルート検索できませんでした');
            }
        });
        directionsService.route({
            origin: via2_pos,
            destination: via3_pos,
            travelMode: myTravelMode
        }, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                document.getElementById("journey").value =
                    (result.routes[0].legs[0].distance.value >= 1000)
                    ? (result.routes[0].legs[0].distance.value / 1000)
                    : result.routes[0].legs[0].distance.value;
                total_dis += Number((result.routes[0].legs[0].distance.value / 1000));
                if(Number(document.getElementById("journey").value) /1000 > getdistance*3){
                    alert("検索した距離と設定した道のりにずれがあります")
                }
            } else {
                alert('ルート検索できませんでした');
            }
        });
        directionsService.route({
            origin: via3_pos,
            destination: goal_pos,
            travelMode: myTravelMode
        }, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                document.getElementById("journey").value =
                    (result.routes[0].legs[0].distance.value >= 1000)
                    ? (result.routes[0].legs[0].distance.value / 1000)
                    : result.routes[0].legs[0].distance.value;
                total_dis += Number((result.routes[0].legs[0].distance.value / 1000));
                document.getElementById("run_dis").innerHTML="距離： "+ total_dis.toFixed(1) + "km";
                        window.localStorage.setItem('search_dis',getdistance);
                        window.localStorage.setItem('dis',total_dis);
                if(Number(document.getElementById("journey").value) /1000 > getdistance*3){
                    alert("検索した距離と設定した道のりにずれがあります")
                }
            } else {
                alert('ルート検索できませんでした');
            }
        });
        
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
    //往復コース
    if(type == 1){
        document.getElementById("type").innerHTML="往復ルート";

        if (navigator.geolocation) {
    //ブラウザでgeolocationが使える場合
    navigator.geolocation.getCurrentPosition(function(position) {        

    
        count = 2;      //ピンの数
        
        var start_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        //ここを変更して正確な距離に近づける
        var move_distance = getdistance*0.0089831487;       //移動距離
        
        
        var goal_pos = {
            lat:position.coords.latitude,
            lng:position.coords.longitude
        };
        
        
        if(course_text == "コース：0"){
        //中継地点を保存
        var via_pos = {
            lat: position.coords.latitude+(move_distance/count),
            lng: position.coords.longitude
        };
        }else if(course_text == "コース：1"){    
            alert("コースが1に変更されました。");
            var via_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude+(move_distance/count)
        };
        }else if(course_text == "コース：2"){
            alert("コースが2に変更されました。");
            var via_pos = {
            lat: position.coords.latitude-(move_distance/count),
            lng: position.coords.longitude
        };
        }else if(course_text == "コース：3"){
            alert("コースが3に変更されました。");
            var via_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude-(move_distance/count)
        };
        }
        
        lat1=start_pos.lat;
        lng1=start_pos.lng;
        lat2=via_pos.lat;
        lng2=via_pos.lng;
        lat3=goal_pos.lat;
        lng3=goal_pos.lng;
        
        window.localStorage.setItem('start_lat', lat1);
        window.localStorage.setItem('start_lng', lng1);
        window.localStorage.setItem('via_lat', lat2);
        window.localStorage.setItem('via_lng', lng2);
        
        //移動距離(たぶん道のり) 
        var myTravelMode =  (document.getElementById('TravelMode').value == 'DRIVING')
                            ? google.maps.DirectionsTravelMode.DRIVING :
                            google.maps.DirectionsTravelMode.WALKING;
                            
        directionsService.route({
            origin: start_pos,
            destination: via_pos,
            travelMode: myTravelMode
        }, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                document.getElementById("journey").value =
                    (result.routes[0].legs[0].distance.value >= 1000)
                    ? (result.routes[0].legs[0].distance.value / 1000)
                    : result.routes[0].legs[0].distance.value;
                document.getElementById("run_dis").innerHTML="距離： "+ ((result.routes[0].legs[0].distance.value / 1000) * 2).toFixed(1) + "km";
                        window.localStorage.setItem('search_dis',getdistance);
                        window.localStorage.setItem('dis',result.routes[0].legs[0].distance.value / 1000 * 2);
                if(Number(document.getElementById("journey").value) /1000 > getdistance*3){
                    alert("検索した距離と設定した道のりにずれがあります")
                }
            } else {
                alert('ルート検索できませんでした');
            }
        });

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
        travelMode: google.maps.TravelMode.WALKING
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
    window.localStorage.setItem('type', type);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function back(){
    if(window.localStorage.getItem('state') != start ){
        location.href="search.html";
    }
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
    
    window.localStorage.setItem('state', start);
    
}

//コースの変更
function change(){
    var course = 0;
    var course_text = document.getElementById('course').innerHTML;
    
    if(window.localStorage.getItem('state') != start){
    if(course_text == "コース：0"){
        course = 1;
    }else if(course_text == "コース：1"){
        course = 2;
    }else if(course_text == "コース：2"){
        course = 3;
    }else {
        course = 0;
    }
    document.getElementById("course").innerHTML="コース："+course;
    initMap();
    }
}

//タイプ変更
function typechange(){
    if(window.localStorage.getItem('state') != start){
    var type = window.localStorage.getItem('type');
    if(type == null) type = 0;
    
    if(type == 0){
        type = 1;
    }else if(type == 1){
        type = 0;
    }
    window.localStorage.setItem('type', type);
    location.reload();
    }
}

//タイマー
function run_timer(){
    timerID = setInterval(function(){
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
    
    if(window.localStorage.getItem('state') == start){
    finish_time = new Date();       //終了時刻を取得
    
    //時間に変換して表示
    var finish_hours = finish_time.getHours();
    var finish_min = finish_time.getMinutes();
    var finish_sec = finish_time.getSeconds();
    finish_test = finish_hours*3600+finish_min*60+finish_sec;
    timer();
    window.localStorage.setItem('chk', 1);
    
//    if(window.localStorage.getItem('dis') == 0) window.localStorage.setItem('chk',0);
    //時間のチェック
    if(window.localStorage.getItem('result_his') == 0){
        if(window.confirm("走った時間が0です。履歴に保存してもよろしいですか？") == false)
            window.localStorage.setItem('chk',2);
    }
    //速さのチェック
    if(window.localStorage.getItem('speed') >= 100){
        if(window.confirm("速すぎます。履歴に保存してもよろしいですか？") == false)
            window.localStorage.setItem('chk',2);
    }
    
    //履歴にデータを保存
    if(window.localStorage.getItem('chk') != 2){
    window.localStorage.setItem('his_mon', window.localStorage.getItem('mon'));
    window.localStorage.setItem('his_day', window.localStorage.getItem('day'));
    window.localStorage.setItem('his_dis', window.localStorage.getItem('dis'));
    window.localStorage.setItem('his_time', window.localStorage.getItem('result_his'));
    }
    
    //履歴画面に切り替え
    location.href = 'history.html';
    window.localStorage.removeItem('state');
    }else{
        alert("ランニングが開始されていません。");
    }
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
    var his_num = window.localStorage.getItem('his_num');
    if(his_num == null) his_num = 0;
    
    var mon1,day1,dis1,h1,m1,s1,speed1;
    var mon2,day2,dis2,h2,m2,s2,speed2;
    var mon3,day3,dis3,h3,m3,s3,speed3;
    var mon4,day4,dis4,h4,m4,s4,speed4;
    var mon5,day5,dis5,h5,m5,s5,speed5;
    
    //ローカルストレージからデータをゲット
    var mon = window.localStorage.getItem('his_mon');
    var day = window.localStorage.getItem('his_day');
    var dis = window.localStorage.getItem('his_dis');
    var time = window.localStorage.getItem('his_time');
    
    
    //時間に変換
    var h = Math.floor(time/3600);
    var m = Math.floor(time/60);
    var s = Math.floor(time%60);
    
    //速さを計算
    var speed = Math.round(dis/(time/3600));
    
    dis = dis*10;
    dis = Math.round(dis);
    dis = dis/10;
    
    //履歴画面を書き換える
    document.getElementById("date").innerHTML   ="日付：   "+mon+"月"+day+"日";
    document.getElementById("dis").innerHTML    ="距離：   "+dis + "km";
    document.getElementById("time").innerHTML   ="時間：   "+h+"時間"+m+"分"+s+"秒";
    document.getElementById("speed").innerHTML  ="速さ：   " + speed + "km/h";  
//    document.getElementById("maps").innerHTML  ="マップを表示";
    if(window.localStorage.getItem('chk') == 1)his_num++;
    
    
    //2件目の履歴を取得
    if(his_num > 1){
        mon1    = window.localStorage.getItem('mon1');
        day1    = window.localStorage.getItem('day1');
        dis1    = window.localStorage.getItem('dis1');
        h1      = window.localStorage.getItem('h1');
        m1      = window.localStorage.getItem('m1');
        s1      = window.localStorage.getItem('s1');
        speed1  = window.localStorage.getItem('speed1');
    }
    //3件目の履歴を取得
    if(his_num > 2){
        mon2    = window.localStorage.getItem('mon2');
        day2    = window.localStorage.getItem('day2');
        dis2    = window.localStorage.getItem('dis2');
        h2      = window.localStorage.getItem('h2');
        m2      = window.localStorage.getItem('m2');
        s2      = window.localStorage.getItem('s2');
        speed2  = window.localStorage.getItem('speed2');
    }
    //4件目の履歴を取得
    if(his_num > 3){
        mon3    = window.localStorage.getItem('mon3');
        day3    = window.localStorage.getItem('day3');
        dis3    = window.localStorage.getItem('dis3');
        h3      = window.localStorage.getItem('h3');
        m3      = window.localStorage.getItem('m3');
        s3      = window.localStorage.getItem('s3');
        speed3  = window.localStorage.getItem('speed3');
    }
    //5件目の履歴を取得
    if(his_num > 4){
        mon4    = window.localStorage.getItem('mon4');
        day4    = window.localStorage.getItem('day4');
        dis4    = window.localStorage.getItem('dis4');
        h4      = window.localStorage.getItem('h4');
        m4      = window.localStorage.getItem('m4');
        s4      = window.localStorage.getItem('s4');
        speed4  = window.localStorage.getItem('speed4');
    }
    //6件目の履歴を取得
    if(his_num > 5){
        mon5    = window.localStorage.getItem('mon5');
        day5    = window.localStorage.getItem('day5');
        dis5    = window.localStorage.getItem('dis5');
        h5      = window.localStorage.getItem('h5');
        m5      = window.localStorage.getItem('m5');
        s5      = window.localStorage.getItem('s5');
        speed5  = window.localStorage.getItem('speed5');
    }
        
    //履歴2件目
    if(his_num > 1){
        var date_txt1 = document.createElement('div');
        var dis_txt1 = document.createElement('div');
        var time_txt1 = document.createElement('div');
        var speed_txt1 = document.createElement('div');
        var br = document.createElement('br');
        date_txt1.id = "mon1"; 
        date_txt1.innerHTML = "日付：   "+mon1+"月"+day1+"日";
        dis_txt1.id = "mon1"; 
        dis_txt1.innerHTML = "距離：   "+dis1 + "km";
        time_txt1.id = "mon1"; 
        time_txt1.innerHTML = "時間：   "+h1+"時間"+m1+"分"+s1+"秒";
        speed_txt1.id = "mon1"; 
        speed_txt1.innerHTML = "速さ：   " + speed1 + "km/h";
        
        var objBody = document.getElementsByTagName("body").item(0); 
        objBody.appendChild(date_txt1);
        objBody.appendChild(dis_txt1);
        objBody.appendChild(time_txt1);
        objBody.appendChild(speed_txt1);
        objBody.appendChild(br);
    
    }
    //履歴3件目
    if(his_num > 2){
        var date_txt2 = document.createElement('div');
        var dis_txt2 = document.createElement('div');
        var time_txt2 = document.createElement('div');
        var speed_txt2 = document.createElement('div');
        var br = document.createElement('br');
        date_txt2.id = "mon2"; 
        date_txt2.innerHTML = "日付：   "+mon2+"月"+day2+"日";
        dis_txt2.id = "mon2"; 
        dis_txt2.innerHTML = "距離：   "+dis2 + "km";
        time_txt2.id = "mon2"; 
        time_txt2.innerHTML = "時間：   "+h2+"時間"+m2+"分"+s2+"秒";
        speed_txt2.id = "mon2"; 
        speed_txt2.innerHTML = "速さ：   " + speed2 + "km/h";
        
        var objBody = document.getElementsByTagName("body").item(0); 
        objBody.appendChild(date_txt2);
        objBody.appendChild(dis_txt2);
        objBody.appendChild(time_txt2);
        objBody.appendChild(speed_txt2);
        objBody.appendChild(br);
        }
    //履歴4件目
    if(his_num > 3){
        var date_txt3 = document.createElement('div');
        var dis_txt3 = document.createElement('div');
        var time_txt3 = document.createElement('div');
        var speed_txt3 = document.createElement('div');
        var br = document.createElement('br');
        date_txt3.id = "mon3"; 
        date_txt3.innerHTML = "日付：   "+mon3+"月"+day3+"日";
        dis_txt3.id = "mon3"; 
        dis_txt3.innerHTML = "距離：   "+dis3 + "km";
        time_txt3.id = "mon3"; 
        time_txt3.innerHTML = "時間：   "+h3+"時間"+m3+"分"+s3+"秒";
        speed_txt3.id = "mon3"; 
        speed_txt3.innerHTML = "速さ：   " + speed3 + "km/h";
        
        var objBody = document.getElementsByTagName("body").item(0); 
        objBody.appendChild(date_txt3);
        objBody.appendChild(dis_txt3);
        objBody.appendChild(time_txt3);
        objBody.appendChild(speed_txt3);
        objBody.appendChild(br);
        }
    //履歴5件目
    if(his_num > 4){
        var date_txt4 = document.createElement('div');
        var dis_txt4 = document.createElement('div');
        var time_txt4 = document.createElement('div');
        var speed_txt4 = document.createElement('div');
        var br = document.createElement('br');
        date_txt4.id = "mon4"; 
        date_txt4.innerHTML = "日付：   "+mon4+"月"+day4+"日";
        dis_txt4.id = "mon4"; 
        dis_txt4.innerHTML = "距離：   "+dis4 + "km";
        time_txt4.id = "mon4"; 
        time_txt4.innerHTML = "時間：   "+h4+"時間"+m4+"分"+s4+"秒";
        speed_txt4.id = "mon4"; 
        speed_txt4.innerHTML = "速さ：   " + speed4 + "km/h";
        
        var objBody = document.getElementsByTagName("body").item(0); 
        objBody.appendChild(date_txt4);
        objBody.appendChild(dis_txt4);
        objBody.appendChild(time_txt4);
        objBody.appendChild(speed_txt4);
        objBody.appendChild(br);
        }
    //履歴6件目
    if(his_num > 5){
        var date_txt5 = document.createElement('div');
        var dis_txt5 = document.createElement('div');
        var time_txt5 = document.createElement('div');
        var speed_txt5 = document.createElement('div');
        var br = document.createElement('br');
        date_txt5.id = "mon5"; 
        date_txt5.innerHTML = "日付：   "+mon5+"月"+day5+"日";
        dis_txt5.id = "mon5"; 
        dis_txt5.innerHTML = "距離：   "+dis5 + "km";
        time_txt5.id = "mon5"; 
        time_txt5.innerHTML = "時間：   "+h5+"時間"+m5+"分"+s5+"秒";
        speed_txt5.id = "mon5"; 
        speed_txt5.innerHTML = "速さ：   " + speed5 + "km/h";
        
        var objBody = document.getElementsByTagName("body").item(0); 
        objBody.appendChild(date_txt5);
        objBody.appendChild(dis_txt5);
        objBody.appendChild(time_txt5);
        objBody.appendChild(speed_txt5);
        objBody.appendChild(br);
        }
    
    //2件目の為に履歴を保存
    window.localStorage.setItem('mon1', mon);
    window.localStorage.setItem('day1', day);
    window.localStorage.setItem('dis1', dis);
    window.localStorage.setItem('h1', h);
    window.localStorage.setItem('m1', m);
    window.localStorage.setItem('s1', s);
    window.localStorage.setItem('speed1', speed);
    //3件目の為に履歴を保存
    window.localStorage.setItem('mon2', mon1);
    window.localStorage.setItem('day2', day1);
    window.localStorage.setItem('dis2', dis1);
    window.localStorage.setItem('h2', h1);
    window.localStorage.setItem('m2', m1);
    window.localStorage.setItem('s2', s1);
    window.localStorage.setItem('speed2', speed1);
    //4件目の為に履歴を保存
    window.localStorage.setItem('mon3', mon2);
    window.localStorage.setItem('day3', day2);
    window.localStorage.setItem('dis3', dis2);
    window.localStorage.setItem('h3', h2);
    window.localStorage.setItem('m3', m2);
    window.localStorage.setItem('s3', s2);
    window.localStorage.setItem('speed3', speed2);
    //5件目の為に履歴を保存
    window.localStorage.setItem('mon4', mon3);
    window.localStorage.setItem('day4', day3);
    window.localStorage.setItem('dis4', dis3);
    window.localStorage.setItem('h4', h3);
    window.localStorage.setItem('m4', m3);
    window.localStorage.setItem('s4', s3);
    window.localStorage.setItem('speed4', speed3);
    //6件目の為に履歴を保存
    window.localStorage.setItem('mon5', mon4);
    window.localStorage.setItem('day5', day4);
    window.localStorage.setItem('dis5', dis4);
    window.localStorage.setItem('h5', h4);
    window.localStorage.setItem('m5', m4);
    window.localStorage.setItem('s5', s4);
    window.localStorage.setItem('speed5', speed4);
    window.localStorage.setItem('his_num', his_num);
    console.log(his_num);
    //セッションで変数を送る
    window.localStorage.setItem('speed', speed);
    window.localStorage.setItem('chk', 0);
}

//履歴削除
function del(){
    window.localStorage.removeItem('his_mon');
    window.localStorage.removeItem('his_day');
    window.localStorage.removeItem('his_dis');
    window.localStorage.removeItem('his_time');
    window.localStorage.removeItem('his_num');
    location.reload();
}