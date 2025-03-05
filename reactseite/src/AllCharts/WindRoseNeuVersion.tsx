import React, { useCallback, useEffect, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import {
  PolarChart,
  CommonSeriesSettings,
  Series,
  ArgumentAxis,
  ValueAxis,
  Margin,
  Export,
} from 'devextreme-react/polar-chart';


const windSources = [
  { value: 'val1', name: '0-1 km/s' },
  { value: 'val2', name: '1-2 km/s' },
  { value: 'val3', name: '2-3 km/s' },
  { value: 'val4', name: '3-4 km/s' },
  { value: 'val5', name: '4-12 km/s' },
  { value: 'val6', name: '12-20 km/s' },
  { value: 'val7', name: '20-28 km/s' },
  { value: 'val8', name: '28-36 km/s' },
];


type ValuesType ={
  values: {
    arg: string,
    val1: number,
    val2: number,
    val3: number,
    val4: number,
    val5: number,
    val6: number,
    val7: number,
    val8: number,
  }[]
}
type WindRoseType = {
  period: string,
  values: ValuesType
} 

export const periodLabel = { 'aria-label': 'Period' };


function onLegendClick({ target: series }: any) {
  if (series.isVisible()) {
    series.hide();
  } else {
    series.show();
  }
}

function WindRoseNeuVersion() {
  const [windRoseData, setWindRoseData] = useState<WindRoseType[]>([])
  const [periodValues, setPeriodValues] = useState<any>([]);

  useEffect(() => {
    fetch("http://localhost:8090/api/grouppedDataTwo")
      .then(response => response.json())
      .then((data : ValuesType ) => {
   
        const formattedwindRoseData: WindRoseType[] = 
        [{
          period: 'Oct. 28, 2023 -  Feb. 24, 2024',
          values: data
        }]
        setWindRoseData(formattedwindRoseData)
        setPeriodValues(formattedwindRoseData[0].values)
      })
      .catch(error => console.error("Fehler!", error))
  }, [])

  //const [periodValues, setPeriodValues] = useState(windRoseData[0].values);

  const handleChange = useCallback(({ value }: any) => {
    setPeriodValues(value);
  }, [setPeriodValues]);




  return (
    <div id="chart-demo">
      <PolarChart
        id="radarChart"
        palette="Soft"
        dataSource={periodValues}
        onLegendClick={onLegendClick}
        title="Wind Rose, Kiel - Schleswig Holstein"
      >
        <CommonSeriesSettings type="stackedbar" />
        {windSources.map((item: any) => (
          <Series key={item.value} valueField={item.value} name={item.name} />
        ))}
        <Margin bottom={50} left={100} />
        <ArgumentAxis discreteAxisDivisionMode="crossLabels" firstPointOnStartAngle={true} />
        <ValueAxis valueMarginsEnabled={false} />
        <Export enabled={true} />
      </PolarChart>
      <div className="center">
        <SelectBox
          width="300"
          dataSource={windRoseData}
          inputAttr={periodLabel}
          displayExpr="period"
          valueExpr="values"
          value={periodValues}
          onValueChanged={handleChange}
        />
      </div>
    </div>
  );
}

export default WindRoseNeuVersion;
