
let main = document.getElementById('main');

let map = L.map('main-map').setView([0, 0], 2);

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; esri'
}).addTo(map);

setTimeout(() =>  map.invalidateSize(), 1500);

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


fetch('https://fleetmonitoring.euro-argo.eu/floats/multi-lines-search/pages?page=1&size=6', {
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
        console.log(float)
        let card = templateHtml.replace(/{{wmo}}/g, float.wmo);
        card = card.replace(/{{statusCode}}/g, float.statusCode);
        card = card.replace(/{{lastCycleBasicInfo.date}}/g, float.lastCycleBasicInfo.date);
        card = card.replace(/{{plarform.type}}/g, float.platform.type);
        card = card.replace(/{{transmissionSystem}}/g, float.transmissionSystem);
        card = card.replace(/{{battery.status}}/g, float.battery.status);
        card = card.replace(/{{lastCycleBasicInfo.numCycle}}/g, float.lastCycleBasicInfo.numCycle);
        main.innerHTML = main.innerHTML + card;

        //Dessiner le point flotteur sur la carte 

       // L.marker([float.lastCycleBasicInfo, -16.09]).addTo(map)
    });
});

let templateHtml = `
<div  class="card">
    <div id="myImage">
        <button onclick="afficherNumCycle({{wmo}},{{lastCycleBasicInfo.numCycle}})">Voir le nombre de cicles</button>
        <span id="numCycle{{wmo}}"></span>
    </div>
    <div class="card-header">
        <span class="status">
            <div class=" {{statusCode}}-circle"></div>
        </span>
        <span class="wmo">
            <strong>{{wmo}}</strong>
        </span>
    </div>



    <div class="card-body">
        <div class="img-container">
            <img class="float" src="images/flotteur.png">
        </div>
        <div class="content">

            <b>Date</b>: {{lastCycleBasicInfo.date}}<br>
            <b>Type de platforme</b>: {{plarform.type}}<br>
            <b>System de transmission</b>: {{transmissionSystem}}<br>
            <b>Status de batterie</b>: {{battery.status}} <br>
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





