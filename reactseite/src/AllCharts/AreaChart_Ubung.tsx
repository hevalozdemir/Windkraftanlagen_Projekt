import { ApexOptions } from "apexcharts"
import { useEffect, useState } from "react"
import ReactApexChart from "react-apexcharts"

type seriesType = {
    name: string,
    data: number[]
}



function Ubung() {
    const [series, setSeries] = useState<seriesType[]>([])
    const [categories, setCategories] = useState<string[]>([])

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:8090/api/genehmiValue").then(response => response.json()),
            fetch("http://localhost:8090/api/inbetriebValue").then(response => response.json())
        ])
            .then(([Genehmi, Inbetrib]) => {

                const Genehmi_form1 = Object.entries(Genehmi)
                const Inbetrieb_form1 = Object.entries(Inbetrib)

                const Genehmi_form2 = Genehmi_form1.filter(([year, count]) => count !== 0).map(([year, count]) => [year, count])
                const Inbetrieb_form2 = Inbetrieb_form1.filter(([year, count]) => count !== 0).map(([year, count]) => [year, count])

                const Genehmi_form3 = Genehmi_form2.map(([_, count]) => count) as number[]
                const Inbetrieb_form3 = Inbetrieb_form2.map(([_, count]) => count) as number[]

                const categories = Genehmi_form1.map(([year, count]) => year) as string[]

                const formattedSeries: seriesType[] = [{
                    name: 'GenehmigungsDatum',
                    data: Genehmi_form3
                }, {
                    name: 'Inbetriebnahme',
                    data: Inbetrieb_form3
                }]

                setCategories(categories)
                setSeries(formattedSeries)
            })
            .catch(error => console.error("Fehler!", error))
    }, [])

    const option: ApexOptions = {
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: categories
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            }

        }
    }

    return (
        <div id="chart" >
            <ReactApexChart
                options={option}
                series={series}
                height={350}
                type="area" />


        </div >
    )
}
export default Ubung