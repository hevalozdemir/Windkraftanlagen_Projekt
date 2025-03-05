import { ApexOptions } from "apexcharts";
import { error } from "console";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

//Önce series icin tip tanimlayalim. Hazir kodda hangi sekildeyse öyle tanimlamalisin. 
//Cünkü ApexChart kurallari geregi.

type seriesType = {
    name: string,
    data: number[];
}[];

function KreisUndHersteller() {

    const [categories, setCategories] = useState<string[]>([])
    const [series, setSeries] = useState<seriesType>([])

    useEffect(() => {
        fetch("http://localhost:8090/api/kreisUndHersteller")
            .then((response) => response.json())
            .then((kreisHerstellerList: Record<string, Record<string, number>>) => {
                //console.log("Kreis - Hersteller List:",kreisHerstellerList)
                const allHerstellers = new Set<string>()
                //console.log("All Hersteller:",allHerstellers)
                const allKreise = Object.keys(kreisHerstellerList)
                //console.log("All Kreis:", allKreise)
                allKreise.forEach(kreis => {
                    Object.keys(kreisHerstellerList[kreis]).forEach(hersteller => {
                        allHerstellers.add(hersteller);
                    });
                });
                const formattedSeries = Array.from(allHerstellers).map(hersteller => {
                    return {
                        name: hersteller,
                        data: allKreise.map(kreis => kreisHerstellerList[kreis][hersteller] || 0)
                    };
                })
                setSeries(formattedSeries)
            })
            .catch(error => console.error("Error!", error))
    }, [])

    //categories icin:
    useEffect(() => {
        fetch("http://localhost:8090/api/kreisUndCount")
            .then((response) => response.json())
            .then((Liste) => {
                const formattedCategories = Object.entries(Liste).map(([x, y]) => x)
                setCategories(formattedCategories)
            })
            .catch(error => console.error("Error!", error))
    }, [])



    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: 'end', // 'around', 'end'
                borderRadiusWhenStacked: 'last', // 'all', 'last'
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            type: 'category',
            categories: categories,
        },
        yaxis: {
            min: 0,
            max: 1050,  // Y ekseni maksimum değeri 1050 olacak
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    }
    return (
        <div className="containerpie">
            <div id="Chart">
                <ReactApexChart
                    options={options}
                    series={series}
                    height={350}
                    type="bar" />
            </div>
        </div>)
} export default KreisUndHersteller;