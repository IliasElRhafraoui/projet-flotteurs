function afficherNumCycle(numero) {
    let numCycleId= "numCycle"+numero;
    let numCycle = document.getElementById(numCycleId);
    if (numCycle.innerHTML == "") {
        numCycle.innerHTML = 117;
    }
    else {
        numCycle.innerHTML = "";
    }
}