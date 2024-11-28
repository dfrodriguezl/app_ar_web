window.onload = () => {
    let downloaded = false;

    const el = document.querySelector("[gps-new-camera]");

    renderPlaces();

    function renderPlaces() {
        el.addEventListener("gps-camera-update-position", async (e) => {

            if (!downloaded) {
                alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
                console.log("E", e);

                let indexShow = 0;

                const response = await fetch(`https://geoportal.dane.gov.co/laboratorio/serviciosjson/poblacion/centroides_manzanas.php?coordx=${e.detail.position.longitude}&coordy=${e.detail.position.latitude}&longitud=200`);
                const markers = await response.json();

                markers.resultado.forEach((marcador, index) => {

                    if (index < 10) {
                        const distanceCalculated = calculateDistance(e.detail.position.latitude, e.detail.position.longitude, marcador.LATITUD, marcador.LONGITUD);
                        const compoundEntity = document.createElement("a-entity");
                        compoundEntity.setAttribute('gps-new-entity-place', {
                            latitude: marcador.LATITUD,
                            longitude: marcador.LONGITUD
                        });

                        compoundEntity.setAttribute("look-controls", true);
                        compoundEntity.setAttribute("cursor", "rayOrigin: mouse");
                        compoundEntity.setAttribute("data-code", marcador.COD_DANE);
                        compoundEntity.setAttribute("id", marcador.COD_DANE);
                        compoundEntity.setAttribute("name", marcador.COD_DANE);

                        // Trying with a-image element
                        const icon = document.createElement('a-image');
                        icon.setAttribute('name', marcador.COD_DANE);
                        icon.setAttribute('marcador', JSON.stringify(marcador));
                        icon.setAttribute('src', './assets/ic_marcador_dane.png');
                        icon.setAttribute('scale', '7, 7');
                        icon.setAttribute("look-at", "[gps-new-camera]");

                        const text = document.createElement("a-text");
                        const textScale = 8;
                        text.setAttribute("look-at", "[gps-new-camera]");
                        text.setAttribute("scale", {
                            x: textScale,
                            y: textScale,
                            z: textScale
                        });
                        text.setAttribute("position", {
                            x: 0,
                            y: -7,
                            z: 0
                        });
                        text.setAttribute("value", marcador.COD_DANE + "\n " + distanceCalculated.toFixed(0) + " m");
                        text.setAttribute("align", "center");
                        text.setAttribute("data-code", marcador.COD_DANE);

                        compoundEntity.appendChild(icon);
                        compoundEntity.appendChild(text);


                        const clickListener = (ev, a) => {
                            ev.stopPropagation();
                            ev.preventDefault();

                            const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
                            const code = intersectedElement ? intersectedElement.getAttribute("name") : null;
                            const data = intersectedElement ? intersectedElement.getAttribute("marcador") : null;

                            if (indexShow === 0 && code != null) {
                                openModal(JSON.parse(data));
                            }

                            indexShow = + 1;

                        }

                        compoundEntity.addEventListener('click', clickListener);
                        document.querySelector("a-scene").appendChild(compoundEntity);

                        indexShow = 0;

                    }

                })

            }
            downloaded = true;



        });
    }


};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters

    // Convert degrees to radians
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    // Haversine formula
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

async function openModal(data) {
    fetch('./data/variables.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            return response.json();

        })
        .then(variables => {
            // Get modal elements
            const modal = document.getElementById("myModal");
            const closeModalBtn = document.getElementById("closeModalBtn");
            const el = document.getElementsByTagName("a-scene")[0];

            //Seccion datos principales
            const totalPersonasVar = variables.variablesCNPV["43501001"];
            const totalPersonas = data[totalPersonasVar];
            const personasLEAVar = variables.variablesCNPV["43501002"];
            const personasLEA = data[personasLEAVar];
            const hogaresVar = variables.variablesCNPV["43501003"];
            const hogares = data[hogaresVar];
            const viviendasVar = variables.variablesCNPV["43501004"];
            const viviendas = data[viviendasVar];
            const personasLugaresParticularesVar = variables.variablesCNPV["43501005"];
            const personasLugaresParticulares = data[personasLugaresParticularesVar];

            document.getElementById("analysisResult__totalPeople").innerText = totalPersonas;
            document.getElementById("analysisResult__totalLEA").innerText = personasLEA | 0;
            document.getElementById("analysisResult__totalHogares").innerText = hogares;
            document.getElementById("analysisResult__totalViviendas").innerText = viviendas;
            document.getElementById("analysisResult__totalPesonaparticular").innerText = personasLugaresParticulares;

            modal.style.display = "block";  // Show the modal

            // Open the modal when button is clicked
            // openModalBtn.addEventListener("click", function () {
            //     modal.style.display = "flex";  // Display as flex to center content
            // });

            // Close the modal when 'X' is clicked
            closeModalBtn.addEventListener("click", function () {
                modal.style.display = "none";
            });

            // Close modal if user clicks outside the modal content
            // window.addEventListener("click", function (event) {
            //     if (event.target === modal) {  // Check if overlay is clicked
            //         modal.style.display = "none";
            //     }
            // });
        })

}

