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
                        icon.setAttribute('scale', '20, 20');
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
                            y: -17,
                            z: 0
                        });

                        const viviendas = marcador.V21;
                        const hogares = marcador.V32;
                        const personas = marcador.V54;

                        text.setAttribute("value", "Manzana: " + marcador.COD_DANE.slice(-8) + 
                            "\n Viviendas: " + viviendas  + 
                            "\n Hogares: " + hogares  +
                            "\n Personas: " + personas  +
                            "\n Dist: " + distanceCalculated.toFixed(0) + " m \n");
                        // text.setAttribute("value", "Manzana: " + marcador.COD_DANE.slice(-8));
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

            // Sección datos de edificaciones

            const usoViviendaVar = variables.variablesCNPV["43601001"];
            const usoVivienda = data[usoViviendaVar];
            const usoMixtoVar = variables.variablesCNPV["43601002"];
            const usoMixto = data[usoMixtoVar];
            const usoNoResidencialVar = variables.variablesCNPV["43601003"];
            const usoNoResidencial = data[usoNoResidencialVar];
            const usoLEAVar = variables.variablesCNPV["43601004"];
            const usoLEA = data[usoLEAVar];

            const usoNRIndustriaVar = variables.variablesCNPV["43603001"];
            const usoNRIndustria = data[usoNRIndustriaVar];
            const usoNRComercioVar = variables.variablesCNPV["43603002"];
            const usoNRComercio = data[usoNRComercioVar];
            const usoNRServiciosVar = variables.variablesCNPV["43603003"];
            const usoNRServicios = data[usoNRServiciosVar];
            const usoNRAgroVar = variables.variablesCNPV["43603004"];
            const usoNRAgro = data[usoNRAgroVar];
            const usoNRInstitucionalVar = variables.variablesCNPV["43603005"];
            const usoNRInstitucional = data[usoNRInstitucionalVar];
            const usoNRLoteVar = variables.variablesCNPV["43603006"];
            const usoNRLote = data[usoNRLoteVar];
            const usoNRParqueVar = variables.variablesCNPV["43603007"];
            const usoNRParque = data[usoNRParqueVar];
            const usoNRMineroVar = variables.variablesCNPV["43603008"];
            const usoNRMinero = data[usoNRMineroVar];
            const usoNRProteccionVar = variables.variablesCNPV["43603009"];
            const usoNRProteccion = data[usoNRProteccionVar];
            const usoNRConstruccionVar = variables.variablesCNPV["43603010"];
            const usoNRConstruccion = data[usoNRConstruccionVar];
            const usoNRSIVar = variables.variablesCNPV["43603011"];
            const usoNRSI = data[usoNRSIVar];

            const usoMixtoIndustriaVar = variables.variablesCNPV["43602001"];
            const usoMixtoIndustria = data[usoMixtoIndustriaVar];
            const usoMixtoComercioVar = variables.variablesCNPV["43602002"];
            const usoMixtoComercio = data[usoMixtoComercioVar];
            const usoMixtoServiciosVar = variables.variablesCNPV["43602003"];
            const usoMixtoServicios = data[usoMixtoServiciosVar];
            const usoMixtoAgroVar = variables.variablesCNPV["43602004"];
            const usoMixtoAgro = data[usoMixtoAgroVar];
            const usoMixtoSIVar = variables.variablesCNPV["43602005"];
            const usoMixtoSI = data[usoMixtoSIVar];

            // Sección datos de viviendas
            const casaVar = variables.variablesCNPV["43701001"];
            const casa = data[casaVar];
            const aptoVar = variables.variablesCNPV["43701002"];
            const apto = data[aptoVar];
            const cuartoVar = variables.variablesCNPV["43701003"];
            const cuarto = data[cuartoVar];
            const viviendaIndigenaVar = variables.variablesCNPV["43701004"];
            const viviendaIndigena = data[viviendaIndigenaVar];
            const viviendaTradicionalVar = variables.variablesCNPV["43701005"];
            const viviendaTradicional = data[viviendaTradicionalVar];
            const otroVar = variables.variablesCNPV["43701006"];
            const otro = data[otroVar];

            const ocupacionOcupadaVar = variables.variablesCNPV["43702001"];
            const ocupacionOcupada = data[ocupacionOcupadaVar];
            const ocupacionAusentesVar = variables.variablesCNPV["43702002"];
            const ocupacionAusentes = data[ocupacionAusentesVar];
            const ocupacionTemporalVar = variables.variablesCNPV["43702003"];
            const ocupacionTemporal = data[ocupacionTemporalVar];
            const ocupacionDesocupadaVar = variables.variablesCNPV["43702004"];
            const ocupacionDesocupada = data[ocupacionDesocupadaVar];

            const ocupacionEstrato1Var = variables.variablesCNPV["43703001"];
            const ocupacionEstrato1 = data[ocupacionEstrato1Var];
            const ocupacionEstrato2Var = variables.variablesCNPV["43703002"];
            const ocupacionEstrato2 = data[ocupacionEstrato2Var];
            const ocupacionEstrato3Var = variables.variablesCNPV["43703003"];
            const ocupacionEstrato3 = data[ocupacionEstrato3Var];
            const ocupacionEstrato4Var = variables.variablesCNPV["43703004"];
            const ocupacionEstrato4 = data[ocupacionEstrato4Var];
            const ocupacionEstrato5Var = variables.variablesCNPV["43703005"];
            const ocupacionEstrato5 = data[ocupacionEstrato5Var];
            const ocupacionEstrato6Var = variables.variablesCNPV["43703006"];
            const ocupacionEstrato6 = data[ocupacionEstrato6Var];
            const ocupacionEstratoNSVar = variables.variablesCNPV["43703007"];
            const ocupacionEstratoNS = data[ocupacionEstratoNSVar];

            const serviciosEnergiaSiVar = variables.variablesCNPV["43704001"];
            const serviciosEnergiaSi = data[serviciosEnergiaSiVar];
            const serviciosEnergiaNoVar = variables.variablesCNPV["43704002"];
            const serviciosEnergiaNo = data[serviciosEnergiaNoVar];
            const serviciosAcueductoSiVar = variables.variablesCNPV["43704003"];
            const serviciosAcueductoSi = data[serviciosAcueductoSiVar];
            const serviciosAcueductoNoVar = variables.variablesCNPV["43704004"];
            const serviciosAcueductoNo = data[serviciosAcueductoNoVar];
            const serviciosAlcantarilladoSiVar = variables.variablesCNPV["43704005"];
            const serviciosAlcantarilladoSi = data[serviciosAlcantarilladoSiVar];
            const serviciosAlcantarilladoNoVar = variables.variablesCNPV["43704006"];
            const serviciosAlcantarilladoNo = data[serviciosAlcantarilladoNoVar];
            const serviciosGasSiVar = variables.variablesCNPV["43704007"];
            const serviciosGasSi = data[serviciosGasSiVar];
            const serviciosGasNoVar = variables.variablesCNPV["43704008"];
            const serviciosGasNo = data[serviciosGasNoVar];
            const serviciosBasuraSiVar = variables.variablesCNPV["43704009"];
            const serviciosBasuraSi = data[serviciosBasuraSiVar];
            const serviciosBasuraNoVar = variables.variablesCNPV["43704010"];
            const serviciosBasuraNo = data[serviciosBasuraNoVar];
            const serviciosInternetSiVar = variables.variablesCNPV["43704011"];
            const serviciosInternetSi = data[serviciosInternetSiVar];
            const serviciosInternetNoVar = variables.variablesCNPV["43704012"];
            const serviciosInternetNo = data[serviciosInternetNoVar];
            

            

            const dataCharts = {
                chart1: {
                    uso_vivienda: { valor: usoVivienda, etiqueta: "Vivienda" },
                    uso_mixto: { valor: usoMixto, etiqueta: "Mixto" },
                    uso_no_residencial: { valor: usoNoResidencial, etiqueta: "Unidad no residencial" },
                    uso_lea: { valor: usoLEA, etiqueta: "Lugar especial de alojamiento" }
                },
                chart2: {
                    uso_industria: {valor: usoMixtoIndustria, etiqueta: "Industria"},
                    uso_comercio: {valor: usoMixtoComercio, etiqueta: "Comercio"},
                    uso_servicios: {valor: usoMixtoServicios, etiqueta: "Servicios"},
                    uso_agropecuario: {valor: usoMixtoAgro, etiqueta: "Agropecuario, Agroindustrial, Forestal"},
                    uso_sin_informacion: {valor: usoMixtoSI, etiqueta: "Sin informacion"},
                },
                chart3: {
                    uso_industria: {valor: usoNRIndustria, etiqueta: "Industria"},
                    uso_comercio: {valor: usoNRComercio, etiqueta: "Comercio"},
                    uso_servicios: {valor: usoNRServicios, etiqueta: "Servicios"},
                    uso_agropecuario: {valor: usoNRAgro, etiqueta: "Agropecuario, Agroindustrial, Forestal"},
                    uso_institucional: {valor: usoNRInstitucional, etiqueta: "Institucional"},
                    uso_lote: {valor: usoNRLote, etiqueta: "Lote (Unidad sin construccion)"},
                    uso_parque: {valor: usoNRParque, etiqueta: "Parque/Zona verde"},
                    uso_minero: {valor: usoNRMinero, etiqueta: "Minero-Energetico"},
                    uso_proteccion: {valor: usoNRProteccion, etiqueta: "Proteccion/Conservacion ambiental"},
                    uso_construccion: {valor: usoNRConstruccion, etiqueta: "En construccion"},
                    uso_sin_informacion: {valor: usoNRSI, etiqueta: "Sin informacion"}
                },
                chart4: {
                    casa: {valor: casa, etiqueta: "Casa"},
                    apto: {valor: apto, etiqueta: "Apartamento"},
                    cuarto: {valor: cuarto, etiqueta: "Tipo cuarto"},
                    vivienda_indigena: {valor: viviendaIndigena, etiqueta: "Vivienda tradicional indígena"},
                    vivienda_etnica: {valor: viviendaTradicional, etiqueta: "Vivienda tradicional étnica (Afrocolombiana, isleña, Rom"},
                    otro: {valor: otro, etiqueta: "Otro (Contenedor, carpa, embarcación, vagón, cueva, refugio natural,etc."}
                }
            }

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

            drawChart(dataCharts);

            // Close modal if user clicks outside the modal content
            // window.addEventListener("click", function (event) {
            //     if (event.target === modal) {  // Check if overlay is clicked
            //         modal.style.display = "none";
            //     }
            // });
        })

}

