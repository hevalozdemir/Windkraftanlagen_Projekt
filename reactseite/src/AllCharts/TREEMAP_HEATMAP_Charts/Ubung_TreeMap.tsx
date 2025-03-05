import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

//Burada hazir kullandigim kodda series in tipi cok önemli. 
type seriesType = {
    data: 
        {
            x: string,
            y: number
        }[]
}

function TreeMapUbung() {
    const [series, setSeries] = useState<seriesType[]>([])

    useEffect(() => {
        fetch("http://localhost:8090/api/kreisUndCount")
            .then(response => response.json())
            //burada dikkat etmen gereken: api isteginden dönen ifadenin tipi.
            .then((kreisList : Record<string,number>)=> {
                const formattedSeries = Object.entries(kreisList).map(([kreisName, kreisCount]) => ({x: kreisName, y:kreisCount}))
          
              setSeries([{data : formattedSeries}])
            })
            .catch(error => console.error("Burada bir hata var!", error))
    }, [])


    const options: ApexOptions = {
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'treemap'
        },
        title: {
            text: 'Anzahl der WKA nach Kreis'
        }
    }
    return (<div id="Chart">
        <ReactApexChart
            options={options}
            series={series}
            height={350}
            type="treemap" />

    </div>)
}
export default TreeMapUbung;