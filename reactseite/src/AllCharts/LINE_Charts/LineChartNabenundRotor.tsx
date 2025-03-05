
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

type SeriesData = {
  name: string,
  value: number
}


function LineChartNabenundRotor() {
  const [series, setSeries] = useState<{ name: string, data: number[] }[]>([])
  const [categories, setCategories] = useState<string[]>()

  useEffect(() => {

    Promise.all([
      fetch("http://localhost:8090/api/averageLeistungsMitGroupFürNabenhoehe").then(response => response.json()),
      fetch("http://localhost:8090/api/averageLeistungsMitGroupFürRotor").then(response => response.json())
    ]).then(([nabenhoeheData, rotordurchmesserData]: [SeriesData[], SeriesData[]]) => {
      const formattedSeries = [{
        name: "Nabenhöhe",
        data: nabenhoeheData.map(group => group.value)
        },
        {
        name: "Rotordurchmesser",
        data: rotordurchmesserData.map(group => group.value)
        }]
        const categories = rotordurchmesserData.map(group => group.name)
      
        setSeries(formattedSeries);
        setCategories(categories)
        //ikisi arasina noktali virgül koymak; yani ikisini de ayri ayri calistirdigin anlamina geliyor!

      })
      .catch(error => console.error("Burada bir hata var!", error))

  }, [])

  


  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Nabenhoehe & Rotordurchmesser',
      align: 'left'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 1
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
      },
      min: 0,
      max: 4000
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  }



  return (<div id="chart">
    <div>
      <ReactApexChart
        options={options}
        series={series}
        height={350}
        type="line"

      />

    </div>

  </div>)
}
export default LineChartNabenundRotor