
import { error } from "console";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";


const PieChartHersteller: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);

  const [options, setOptions] = useState({
    chart: {
      type: 'donut' as const,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
    labels: [] as string[], // Labels dizisini başlangıçta boş olarak tanımlıyoruz
  });
  useEffect(() => {
    // API çağrısı
    fetch('http://localhost:8090/api/hersteller')
      .then((response) => response.json())
      .then((data: string[]) => {
        const herstellerCount: Record<string, number> = {};
        const filteredHersteller: Record<string, number> = { "Andere Hersteller": 0 };

        // Üretici firmaları sayma ve sınıflandırma
        data.forEach((hersteller) => {
          herstellerCount[hersteller] = (herstellerCount[hersteller] || 0) + 1;
        });

        for (const [hersteller, count] of Object.entries(herstellerCount)) {
          if (count < 10) {
            filteredHersteller["Andere Hersteller"] += count;
          } else {
            filteredHersteller[hersteller] = count;
          }
        }

        // State'i güncelleme
        setSeries(Object.values(filteredHersteller));
        setOptions((prevOptions) => ({
          ...prevOptions,
          labels: Object.keys(filteredHersteller),
        }));
      })
      .catch((error) => {
        console.error('Error!', error);
      });
  }, []);

  return (
    <div className="containerpie">
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width={600}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );

}




export default PieChartHersteller
