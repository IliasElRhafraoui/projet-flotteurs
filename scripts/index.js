
let main = document.getElementById('main');

let map = L.map('main-map').setView([0, 0], 2);

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; esri'
}).addTo(map);

setTimeout(() => map.invalidateSize(), 1500);

//liste des points
let listPoints = [];

let floatListStatic = [
    {
        wmo: "7900573",
        statusCode: "A",
        lastCycleBasicInfo: {
            date: "2024-06-16",
            numCycle: 117
        },
        platform: {
            type: "ARVEUR",
        },
        transmissionSystem: "IRIDIUM",
        battery: {
            status: 'ok'
        }
    },
    {
        wmo: "6990637",
        statusCode: "I",
        lastCycleBasicInfo: {
            date: "2024-06-12",
            numCycle: 60
        },
        platform: {
            type: "ARVEUR",
        },
        transmissionSystem: "ARVOR_C",
        battery: {
            status: 'ok'
        }
    }
];


fetch('https://fleetmonitoring.euro-argo.eu/floats/multi-lines-search/pages?page=1&size=75', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
        "nested": false,
        "path": "string",
        "searchValueType": "Text",
        "values": [
            "A"
        ],
        "field": "status"
    }])
}).then(function (response) {
    return response.json()
}).then(function (floatListDynamic) {
    floatListDynamic.forEach(function (float) {
        let card = templateHtml.replace(/{{wmo}}/g, float.wmo);
        card = card.replace(/{{statusCode}}/g, float.statusCode);
        card = card.replace(/{{lastCycleBasicInfo.date}}/g, float.lastCycleBasicInfo.date);
        card = card.replace(/{{plarform.type}}/g, float.platform.type);
        card = card.replace(/{{transmissionSystem}}/g, float.transmissionSystem);
        card = card.replace(/{{battery.status}}/g, float.battery.status);
        card = card.replace(/{{lastCycleBasicInfo.numCycle}}/g, float.lastCycleBasicInfo.numCycle);
        main.innerHTML = main.innerHTML + card;

        //Dessiner le point flotteur sur la carte 
        if (float.lastCycleBasicInfo.lat != null && float.lastCycleBasicInfo.lon != null) {
            let = marker = L.circleMarker([float.lastCycleBasicInfo.lat, float.lastCycleBasicInfo.lon], {
                radius: 5,
                color: '#ffc107',
                fill: true,
                stroke: false,
                fillOpacity: 1
            }).addTo(map)
                .bindPopup(`<strong>WMO: </strong> ${float.wmo} <br>
                        <strong>Type de platforme: </strong> ${float.platform.type} <br><br>
                        <a class="voir-plus-btn btn btn-primary" role="button" href="#${float.wmo}">Voir plus d'infos</a>`);
        
        marker.wmo = float.wmo;
        listPoints.push(marker);
        }

    });

});

let templateHtml = `
<div id="{{wmo}}" class="card">
  
    <div class="card-header">
        <span class="status">
            <div class=" {{statusCode}}-circle"></div>
            <button class="btn-map btn " onclick="afficherFloatDansLaCarte({{wmo}})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe-americas" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z"/>
                </svg>
            </button>
        </span>
        <span class="wmo">
            <strong>{{wmo}}</strong>
        </span>
    </div>



    <div class="card-body-float">
        <div  class="img-container">
            <img class="float" src="images/flotteur.png">
        </div>
        <div class="content">

            <div class="content-text">
                <b>Date</b>: {{lastCycleBasicInfo.date}}<br>
                <b>Type de platforme</b>: {{plarform.type}}<br>
                <b>System de transmission</b>: {{transmissionSystem}}<br>
                <b>Status de batterie</b>: {{battery.status}} <br>
            </div>
            <div id="cycle-line">
                <button class="btn-cycle btn btn-warning" onclick="afficherNumCycle({{wmo}},{{lastCycleBasicInfo.numCycle}})">Voir le dernier cycle</button>
                <strong class="num-cycle" id="numCycle{{wmo}}"></strong>
            </div>
        </div>
    </div>
</div>`;





function afficherNumCycle(wmo, numeroCycle) {
    let numCycleId = "numCycle" + wmo;
    let numCycle = document.getElementById(numCycleId);
    if (numCycle.innerHTML == "") {
        numCycle.innerHTML = numeroCycle;
    }
    else {
        numCycle.innerHTML = "";
    }
}

function afficherFloatDansLaCarte(wmo){
    let exist = false;
    listPoints.forEach(function(marker){
        if (marker.wmo == wmo){
            marker.openPopup();
            exist = true;
        }
    });
    if(exist==false){
        alert("Ce flotteur n'a pas encore de coordonnés :(")
    }
}





