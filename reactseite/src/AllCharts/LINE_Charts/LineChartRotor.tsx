import { ApexOptions } from "apexcharts"

import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"



function LineChartRotor() {
type SeriesData = {
        name: string;
        value: number;
    }
    const [series, setSeries] = useState<{ name: string, data: number[] }[]>([])
    const [categories, setCategories] = useState<string[]>([]);


    useEffect(() => {
        fetch("http://localhost:8090/api/averageLeistungsMitGroupFürRotor")
            .then(response => response.json())
            .then((data: SeriesData[]) => {
                const formattedSeries = [{
                    name: "Leistung",
                    data: data.map(group => group.value)
                }]
                const categories = data.map(group => group.name)

                setSeries(formattedSeries)
                setCategories(categories)
            })
            .catch(error => console.error("Burada bir hata var!", error))
    }, [])

    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Zusammenhang zwischen Rotordurchmesser & Leistung',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Meter'
            }
        },
        yaxis: {
            title: {
              text: 'Average Leistungs Value'
            }
          },
        markers: {
            size: 10,
            colors: ['#AF5560'],
            strokeWidth: 3,
            hover: {
                size: 15
            }
        }
    }



    return (<div id="chart">
        <ReactApexChart
            options={options}
            series={series}
            height={350}
            type="line"
        />

    </div>)
}
export default LineChartRotor