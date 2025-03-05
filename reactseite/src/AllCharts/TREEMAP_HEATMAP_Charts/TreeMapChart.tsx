import { ApexOptions } from "apexcharts";
import { error } from "console";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

type seriesType = {
    data: {
        x: string,
        y: number
    }[]
}
//Aslinda normalde burada sadece x: string, y: number yazsan yetiyor. ama bu TeeMap in yapisiyla uymadigi icin. 
//Type i tekrar düzeltmek zorunda kaldik.

function TreeMapChart() {

    const [series, setSeries] = useState<seriesType[]>([])

    useEffect(() => {
        fetch("http://localhost:8090/api/kreisUndCount")
            .then(response => response.json())
            .then((kreisList: Record<string, number>) => {

                const formattedSeries = Object.entries(kreisList).map(([kreisName, kreisCount]) => ({ x: kreisName, y: kreisCount }))

                setSeries([{ data: formattedSeries }])
                //formattedSeries'i, data adlı bir diziyle sarmalayın.
                //series prop'una bu sarmalanmış yapıyı geçin.
            })
            .catch(error => console.error("Error!!", error))

    }, [])


    const options: ApexOptions =
    {
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap'
        },
        title: {
            text: 'Anzahl der WKA nach Kreis',
            align: 'center'
        }
    };

    return (<div id="Chart">
        <ReactApexChart
            options={options}
            series={series}
            height={350}
            type="treemap" />

    </div>)
}
export default TreeMapChart;