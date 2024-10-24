window.onload = () => {
    let testEntityAdded = false;
    let downloaded = false;

    const el = document.querySelector("[gps-new-camera]");

    renderPlaces();

    // const data = require('./data_test/data.json');

    // fetch('./data_test/data.json')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }

    //         return response.json();

    //     })
    //     .then(data => {
    //         const resultado = data.resultado;
    //         renderPlaces(resultado);
    //     })

    // fetch(`https://geoportal.dane.gov.co/laboratorio/serviciosjson/poblacion/centroides_manzanas.php?coordx=${e.detail.position.longitude}&coordy=${e.detail.position.latitude}&longitud=200`)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }

    //         return response.json();

    //     })
    //     .then(data => {
    //         const resultado = data.resultado;
    //         renderPlaces(resultado);
    //     })

    // function renderPlaces(resultado) {
    function renderPlaces() {

        // console.log("RESULTADO IN", resultado);

        el.addEventListener("gps-camera-update-position", async (e) => {

            // const response = await fetch(`https://geoportal.dane.gov.co/laboratorio/serviciosjson/poblacion/centroides_manzanas.php?coordx=${e.detail.position.longitude}&coordy=${e.detail.position.latitude}&longitud=200`);
            // const markers = await response.json();
            // alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            // alert(markers)

            // console.log("JSON", markers);
            // if (!testEntityAdded) {
            //     alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);
            //     // Add a box to the north of the initial GPS position
            //     const entity = document.createElement("a-box");
            //     entity.setAttribute("scale", {
            //         x: 20,
            //         y: 20,
            //         z: 20
            //     });
            //     entity.setAttribute('material', { color: 'red' });
            //     entity.setAttribute('gps-new-entity-place', {
            //         latitude: e.detail.position.latitude + 0.001,
            //         longitude: e.detail.position.longitude
            //     });
            //     const text = document.createElement("a-text");
            //     const textScale = 1;
            //     text.setAttribute("look-at", "[gps-new-camera]");
            //     text.setAttribute("scale", {
            //         x: textScale,
            //         y: textScale,
            //         z: textScale
            //     });
            //     text.setAttribute("value", "Colegio GS");
            //     text.setAttribute("align", "center");
            //     entity.appendChild(text);
            //     const clickListener = function (ev) {
            //         ev.stopPropagation();
            //         ev.preventDefault();

            //         alert("Di click");
            //     };

            //     entity.addEventListener('click', clickListener);
            //     document.querySelector("a-scene").appendChild(entity);
            // }
            // testEntityAdded = true;



            if (!downloaded) {
                alert(`Got first GPS position: lon ${e.detail.position.longitude} lat ${e.detail.position.latitude}`);

                let indexShow = 0;

                const response = await fetch(`https://geoportal.dane.gov.co/laboratorio/serviciosjson/poblacion/centroides_manzanas.php?coordx=${e.detail.position.longitude}&coordy=${e.detail.position.latitude}&longitud=200`);
                const markers = await response.json();

                // console.log("MARKERS", markers);

                markers.resultado.forEach((marcador, index) => {
                    // const compoundEntity = document.createElement("a-entity");
                    // compoundEntity.setAttribute('gps-new-entity-place', {
                    //     latitude: marcador.LATITUD,
                    //     longitude: marcador.LONGITUD
                    // });

                    // const box = document.createElement("a-box");

                    // box.setAttribute("scale", {
                    //     x: 20,
                    //     y: 20,
                    //     z: 20
                    // });

                    // box.setAttribute('material', { color: 'transparent', src: './assets/ic_marcador_dane.png' });

                    // box.setAttribute("position", {
                    //     x: 0,
                    //     y: 20,
                    //     z: 0
                    // });

                    // const text = document.createElement("a-text");
                    // const textScale = 10;
                    // text.setAttribute("look-at", "[gps-new-camera]");
                    // text.setAttribute("scale", {
                    //     x: textScale,
                    //     y: textScale,
                    //     z: textScale
                    // });
                    // text.setAttribute("value", marcador.COD_DANE);
                    // text.setAttribute("align", "center");

                    // compoundEntity.appendChild(box);
                    // compoundEntity.appendChild(text);

                    // const clickListener = function (ev) {
                    //     ev.stopPropagation();
                    //     ev.preventDefault();

                    //     alert("Di click");
                    // };

                    // compoundEntity.addEventListener('click', clickListener);

                    // document.querySelector("a-scene").appendChild(compoundEntity);

                    // const marker = document.createElement("a-marker");
                    // marker.setAttribute("markerhandler");
                    // marker.setAttribute("emitevents", true);
                    // marker.setAttribute("id", "marker");

                    if (index < 10) {
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
                            y: -13,
                            z: 0
                        });
                        text.setAttribute("value", marcador.COD_DANE);
                        text.setAttribute("align", "center");
                        text.setAttribute("data-code", marcador.COD_DANE);

                        compoundEntity.appendChild(icon);
                        compoundEntity.appendChild(text);

                        // marker.appendChild(compoundEntity);


                        const plane = document.createElement('a-plane');
                        plane.setAttribute("color", "#CCC");
                        plane.setAttribute("height", "20");
                        plane.setAttribute("width", "20");


                        const clickListener = (ev, a) => {
                            ev.stopPropagation();
                            ev.preventDefault();
                            // console.log(ev.detail.intersection.point);
                            // console.log(a);
                            const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
                            const code = intersectedElement.getAttribute("name");

                            if (indexShow === 0) {
                                alert("Dí click en " + code);
                                // indexShow = 0;
                            }

                            indexShow = + 1;

                            // console.log("INDEX SHOW", indexShow);
                        }



                        // const clickListenerIcon = (ev) => {
                        //     alert("Di click Icon");
                        // }

                        // const clickListenerText = (ev) => {
                        //     alert("Di click Text");
                        // }

                        // console.log("COMPOUND ENTITY", compoundEntity);


                        compoundEntity.addEventListener('click', clickListener);

                        // icon.addEventListener('click', clickListenerIcon);

                        // text.addEventListener('click', clickListenerText);

                        // compoundEntity.addEventListener("onefingermove", clickListener);

                        // compoundEntity.addEventListener('markerFound', )

                        // marker.addEventListener("click", clickListener);



                        document.querySelector("a-scene").appendChild(compoundEntity);
                        document.querySelector("a-scene").appendChild(plane);

                        indexShow = 0;
                        // document.querySelector("a-scene").appendChild(marker);

                        // document.querySelector("a-scene").addEventListener("onefingermove", clickListener);

                        // document.querySelector("a-scene").addEventListener("click", clickListener);

                        // document.querySelector("a-scene").addEventListener("markerLost", (e) => {
                        //     isMarkerVisible = false;
                        // });
                    }



                })


                // alert(data.estado);
                // const compoundEntityN = document.createElement("a-entity");
                // compoundEntityN.setAttribute('gps-new-entity-place', {
                //     latitude: e.detail.position.latitude + 0.001,
                //     longitude: e.detail.position.longitude
                // });

                // // compoundEntityN.setAttribute('gltf-model', './assets/ic_marcador_dane.gltf');

                // const box = document.createElement("a-box");

                // box.setAttribute("scale", {
                //     x: 20,
                //     y: 20,
                //     z: 20
                // });

                // box.setAttribute('material', { color: 'transparent', src: './assets/ic_marcador_dane.png' });

                // box.setAttribute("position", {
                //     x: 0,
                //     y: 20,
                //     z: 0
                // });

                // const text = document.createElement("a-text");
                // const textScale = 10;
                // text.setAttribute("look-at", "[gps-new-camera]");
                // text.setAttribute("scale", {
                //     x: textScale,
                //     y: textScale,
                //     z: textScale
                // });
                // text.setAttribute("value", "Punto 1");
                // text.setAttribute("align", "center");

                // compoundEntityN.appendChild(box);
                // compoundEntityN.appendChild(text);

                // const clickListener = function (ev) {
                //     ev.stopPropagation();
                //     ev.preventDefault();

                //     alert("Di click");
                // };

                // compoundEntityN.addEventListener('click', clickListener);

                // document.querySelector("a-scene").appendChild(compoundEntityN);

                // const compoundEntityE = document.createElement("a-entity");
                // compoundEntityE.setAttribute('gps-new-entity-place', {
                //     latitude: e.detail.position.latitude,
                //     longitude: e.detail.position.longitude + 0.001
                // });

                // const boxE = document.createElement("a-box");

                // boxE.setAttribute("scale", {
                //     x: 20,
                //     y: 20,
                //     z: 20
                // });

                // boxE.setAttribute('material', { color: 'red' });

                // boxE.setAttribute("position", {
                //     x: 0,
                //     y: 20,
                //     z: 0
                // });

                // const textE = document.createElement("a-text");
                // const textScaleE = 10;
                // textE.setAttribute("look-at", "[gps-new-camera]");
                // textE.setAttribute("scale", {
                //     x: textScaleE,
                //     y: textScaleE,
                //     z: textScaleE
                // });
                // textE.setAttribute("value", "Punto 2");
                // textE.setAttribute("align", "center");

                // compoundEntityE.appendChild(boxE);
                // compoundEntityE.appendChild(textE);

                // const clickListenerE = function (ev) {
                //     ev.stopPropagation();
                //     ev.preventDefault();

                //     alert("Di click");
                // };

                // compoundEntityE.addEventListener('click', clickListenerE);

                // document.querySelector("a-scene").appendChild(compoundEntityE);

                // const compoundEntityW = document.createElement("a-entity");
                // compoundEntityW.setAttribute('gps-new-entity-place', {
                //     latitude: e.detail.position.latitude,
                //     longitude: e.detail.position.longitude - 0.001
                // });

                // const boxW = document.createElement("a-box");

                // boxW.setAttribute("scale", {
                //     x: 20,
                //     y: 20,
                //     z: 20
                // });

                // boxW.setAttribute('material', { color: 'red' });

                // boxW.setAttribute("position", {
                //     x: 0,
                //     y: 20,
                //     z: 0
                // });

                // const textW = document.createElement("a-text");
                // const textScaleW = 10;
                // textW.setAttribute("look-at", "[gps-new-camera]");
                // textW.setAttribute("scale", {
                //     x: textScaleW,
                //     y: textScaleW,
                //     z: textScaleW
                // });
                // textW.setAttribute("value", "Punto 4");
                // textW.setAttribute("align", "center");

                // compoundEntityW.appendChild(boxW);
                // compoundEntityW.appendChild(textW);

                // const clickListenerW = function (ev) {
                //     ev.stopPropagation();
                //     ev.preventDefault();

                //     alert("Di click");
                // };

                // compoundEntityW.addEventListener('click', clickListenerW);

                // document.querySelector("a-scene").appendChild(compoundEntityW);

                // const compoundEntityS = document.createElement("a-entity");
                // compoundEntityS.setAttribute('gps-new-entity-place', {
                //     latitude: e.detail.position.latitude - 0.001,
                //     longitude: e.detail.position.longitude
                // });

                // const boxS = document.createElement("a-box");

                // boxS.setAttribute("scale", {
                //     x: 20,
                //     y: 20,
                //     z: 20
                // });

                // boxS.setAttribute('material', { color: 'red' });

                // boxS.setAttribute("position", {
                //     x: 0,
                //     y: 20,
                //     z: 0
                // });

                // const textS = document.createElement("a-text");
                // const textScaleS = 10;
                // textS.setAttribute("look-at", "[gps-new-camera]");
                // textS.setAttribute("scale", {
                //     x: textScaleS,
                //     y: textScaleS,
                //     z: textScaleS
                // });
                // textS.setAttribute("value", "Punto 3");
                // textS.setAttribute("align", "center");

                // compoundEntityS.appendChild(boxS);
                // compoundEntityS.appendChild(textS);

                // const clickListenerS = function (ev) {
                //     ev.stopPropagation();
                //     ev.preventDefault();

                //     alert("Di click");
                // };

                // compoundEntityS.addEventListener('click', clickListenerS);

                // document.querySelector("a-scene").appendChild(compoundEntityS);

            }
            downloaded = true;



        });
    }


};