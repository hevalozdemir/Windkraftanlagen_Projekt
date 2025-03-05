import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

type BetriebData = {
    nabenhoehe: number;
    leistung: number;
    status: string;
}

type SeriesData = {
    name: string;
    data: [number, number][]
}
//Dieser Code erstellt ein Streudiagramm (Scatter Chart) in einer React-Anwendung. 
//Es wird dabei die Bibliothek ApexCharts verwendet, um das Diagramm zu zeichnen.
function ScatterChart() {

    const [series, setSeries] = useState<SeriesData[]>([])
    

    useEffect(() => {

        //Daten abrufen:
        //Die Daten kommen von einer URL, in diesem Fall von http://localhost:8090/api/betriebData. 
        //Das passiert mit der Funktion fetch.
        fetch("http://localhost:8090/api/betriebData")
        //Nachdem die Daten geholt wurden, werden sie in JSON-Format umgewandelt, also in eine Struktur, die der Computer gut verarbeiten kann.
            .then(response => response.json())

            //Es wird eine Liste von Objekten vom Typ BetriebData abgerufen. Jedes Objekt hat drei Eigenschaften:
            //nabenhoehe (Höhe der Nabe, in Metern),
            //leistung (Leistung in Kilowatt, kW),
            //status (zum Beispiel: "in Betrieb", "vor Inbetriebnahme", "im Gen.Verf.").
            .then((data: BetriebData[]) => {
                const inBetriebValue: [number, number][] = data.filter((x)=> x.status === 'in Betrieb').map((x) => [x.nabenhoehe, x.leistung]);
                const vorInbetriebnahmeValue: [number, number][] = data.filter((x)=> x.status === 'vor Inbetriebnahme').map((x) => [x.nabenhoehe, x.leistung]);
                const imGenVerfValue: [number, number][] =data.filter((x)=> x.status === 'im Gen.Verf.').map((x) => [x.nabenhoehe, x.leistung]);
                
                //Daten sotieren: 
                //Dann werden die Daten nach ihrem status sortiert:
            //Wenn der Status "in Betrieb" ist, werden die Werte in eine Liste inBetriebValue gepackt.
            //Wenn der Status "vor Inbetriebnahme" ist, kommen die Werte in vorInbetriebnahmeValue.
            //Wenn der Status "im Gen.Verf." (im Genehmigungsverfahren) ist, werden sie in imGenVerfValue gespeichert.
                

                //Diagram- Series erstellen:
                //Aus diesen Listen werden Serien (Reihen) für das Diagramm erstellt. Jede Serie bekommt einen Namen, basierend auf dem Status:
            //"in Betrieb",
            //"vor Inbetriebnahme",
            //"im Gen.Verf.".
                const formattedSeries = [
                    {
                        name: "in Betrieb",
                        data: inBetriebValue
                    },
                    {
                        name: "vor Inbetriebnahme",
                        data: vorInbetriebnahmeValue
                    },
                    {
                        name: "im Gen.Verf.",
                        data: imGenVerfValue
                    }
                ]
                setSeries(formattedSeries)
            })
    }, [])

    //Diagram Optionen:
    //Es werden verschiedene Einstellungen für das Diagramm festgelegt,
    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'scatter',
            zoom: {
                enabled: true,
                type: 'xy'
            }
        },
        xaxis: {
            title: {
                text: "Nabenhöhe (Meter)"
            },
            
            labels: {
                formatter: function (val) {
                    return parseFloat(val).toFixed();
                }
            },

        },
        yaxis: {
            title: {
                text: "Leistung (kW)"
            },
            tickAmount: 5
        },
        legend: {
            position: 'top'
        },
        markers: {
            size: 5,
            colors: ['#008FFB', '#00E396', '#FEB019'], 
        }
    }
    //Darstelleungs des Diagrams:
    //Zum Schluss wird das Diagramm mit den series (den Daten) und den options (den Einstellungen) angezeigt. 
    //Dazu wird die Komponente ReactApexChart verwendet.
    return (
        <div id="chart" className="containergf">
            <ReactApexChart
                options={options}
                series={series}
                type='scatter'
                height={350}
            />
        </div>
    );
}

export default ScatterChart;
