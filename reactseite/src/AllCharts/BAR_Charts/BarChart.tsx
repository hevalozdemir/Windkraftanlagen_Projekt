import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";


const LeistungsklassenBarChart: React.FC = () => {
    // Veriyi tutmak için state tanımlıyoruz
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        fetch('http://localhost:8090/api/leistung')  // API isteği
            .then(response => response.json())  // JSON formatına çeviriyoruz
            .then(data => {
                // Her aralık için başlangıç sayısı sıfır olan bir sayma nesnesi
                const leistungsklassenCount = {
                    0: 0,  // 0-500 kW
                    500: 0,  // 500-1000 kW
                    1000: 0,  // 1000-1500 kW
                    1500: 0,  // 1500-2000 kW
                    2000: 0,  // 2000-2500 kW
                    2500: 0,  // 2500-3000 kW
                    3000: 0,  // 3000-3500 kW
                    3500: 0,  // 3500-4000 kW
                    4000: 0,  // 4000-4500 kW
                    4500: 0   // 4500-5000 kW
                };

                // Verileri gruplandırma ve sayma
                data.forEach((item: number) => {
                    if (item >= 0 && item < 500) {
                        leistungsklassenCount[0] += 1;
                    } else if (item >= 500 && item < 1000) {
                        leistungsklassenCount[500] += 1;
                    } else if (item >= 1000 && item < 1500) {
                        leistungsklassenCount[1000] += 1;
                    } else if (item >= 1500 && item < 2000) {
                        leistungsklassenCount[1500] += 1;
                    } else if (item >= 2000 && item < 2500) {
                        leistungsklassenCount[2000] += 1;
                    } else if (item >= 2500 && item < 3000) {
                        leistungsklassenCount[2500] += 1;
                    } else if (item >= 3000 && item < 3500) {
                        leistungsklassenCount[3000] += 1;
                    } else if (item >= 3500 && item < 4000) {
                        leistungsklassenCount[3500] += 1;
                    } else if (item >= 4000 && item < 4500) {
                        leistungsklassenCount[4000] += 1;
                    } else if (item >= 4500 && item <= 5000) {
                        leistungsklassenCount[4500] += 1;
                    }
                });

                // Sayısal verileri state'e kaydet
                setChartData(Object.values(leistungsklassenCount));  // Burada her bir aralık için sayıları alıyoruz
            })
            .catch(error => console.error('Veri çekilirken hata oluştu:', error));
    }, []);  // Bileşen yüklendiğinde sadece bir kez çalışır


    const series = [
        {
            name: "Anzahl der WKF",
            data: chartData,
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar", // "bar" string olarak değil, tip güvenliği ile tanımlanır.
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "60%",
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 3,
            colors: ["transparent"],
        },
        xaxis: {
            categories: [
                "0-500 kW",
                "500-1000 kW",
                "1000-1500 kW",
                "1500-2000 kW",
                "2000-2500 kW",
                "2500-3000 kW",
                "3000-3500 kW",
                "3500-4000 kW",
                "4000-4500 kW",
                "4500-5000 kW",

            ],
            title: {
                text: "Leistungsklassen",
            },
        },
        yaxis: {
            title: {
                text: "Anzahl der WKF",
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return `${val}`;
                },
            },
        },
    };

    return (
        <div className="containergf">
            <Chart
                options={options}
                series={series}
                type="bar"
                height={350} />
        </div>
    );
};

export default LeistungsklassenBarChart;


