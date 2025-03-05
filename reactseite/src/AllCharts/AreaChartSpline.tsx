import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

type SeriesType = {
    name: string,
    data: number[]
}

function AreaChartSpline() {

    const [series, setSeries] = useState<SeriesType[]>([])
    const [categories, setCategories] = useState<String[]>([])

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:8090/api/genehmiValue").then(response => response.json()),
            fetch("http://localhost:8090/api/inbetriebValue").then(response => response.json())
        ])
            .then(([genehmiValu, inbetriebValue]) => {

                // API'den gelen veriyi işleme
                const genehmiData = Object.entries(genehmiValu);
                const inbetriebData = Object.entries(inbetriebValue);
                /*
                const inbetriebValue = {
                                    "2020": 3,
                                    "2021": 8,
                                    "2022": 6
                                    };
                 Bu sekilde olan :Map<String,Int> tipini;    
                 [
                    ["2020", 3],
                    ["2021", 8],
                    ["2022", 6]
                  ]
                Bu hale dönüstürüyor.            
                */

                // Veriyi string olarak alıyoruz
                const categories = genehmiData.map(([year,count]) => year) as String[]; // Type assertion burada yapıldı

                // Count (WKA) değeri 0 olmayan veriler için filtreleme _: ben bu degiskeni / degerleri kullanmayacagim!
                const filteredGenehmiData = genehmiData
                    .filter(([_, count]) => count !== 0)  // WKA değeri 0 olanları çıkarıyoruz
                    .map(([year, count]) => [year, count]); //Veriyi tekrar eski formatina döndürmek icin kullanilir!

                const filteredInbetriebData = inbetriebData
                    .filter(([_, count]) => count !== 0)  // WKA değeri 0 olanları çıkarıyoruz
                    .map(([year, count]) => [year, count]); //Veriyi tekrar eski formatina döndürmek icin kullanilir!

                const filteredCategories = filteredGenehmiData.map(([year, count]) => year) as String[];
                //console.log("FilteredCategories", filteredCategories)
                const formattedSeries: SeriesType[] = [{
                    name: 'Genehmigungsdatum',
                    data: filteredGenehmiData.map(([_, count]) => count) as number[]
                },
                {
                    name: 'Inbetriebnahme',
                    data: filteredInbetriebData.map(([_, count]) => count) as number[]
                }];

                // Güncellenmiş serileri ve kategorileri state'e kaydediyoruz
                setSeries(formattedSeries);
                setCategories(filteredCategories);
            })
            .catch(error => console.error("Fehler Fehler Fehler!", error))

    }, [])


    const options: ApexOptions = {
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
            categories: categories,
            title: {
                text: "Datum"
            }
            ,
            labels: {
                style: {
                    fontSize: '10px'  // Yazı boyutunu küçültür
                }
            }
        },
        yaxis: {
            title: {
                text: 'Anzahl der WKF'
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy'
            },
        },
    }

    return (<div id="chart" className="containergf">
        <ReactApexChart
            options={options}
            series={series}
            height={350}
            type="area" />
    </div>)
}

export default AreaChartSpline;
