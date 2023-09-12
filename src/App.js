import './App.css';
import React, {useEffect, useRef} from "react";
import { YMaps, useYMaps} from '@pbe/react-yandex-maps';

function CustomMap  ()  {
    let map;
    let btn;
    let placemark;
    const mapRef = useRef(null);
    const ymaps = useYMaps(["Map", "Placemark"]);

    async function mapPrepare() {
        let crds;
        let promise = new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                crds = pos.coords;
                resolve("end")
            });
        });

        await promise;

        if (!ymaps || !mapRef.current) {
            return;
        }

        map = new ymaps.Map(mapRef.current, {
            center: [crds.latitude, crds.longitude],
            zoom: 10
        });

        placemark = new ymaps.Placemark([crds.latitude, crds.longitude]);

        map.events.add('click', (event)=>{
            let crds = event.get("coords");
            placemark.geometry.setCoordinates([crds[0], crds[1]]);
        });

        map.geoObjects.add(placemark);
        

    }

    useEffect(() => {mapPrepare()}, [ymaps]);

    return React.createElement("div", {id: "map",ref:mapRef, style: { width: "600px", height: "400px" }}, btn);
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Выберите место на карте, в котором хотели бы узнать погоду.
                </p>
                <YMaps>
                    <CustomMap/>
                </YMaps>
            </header>
        </div>
    );
}

export default App;
