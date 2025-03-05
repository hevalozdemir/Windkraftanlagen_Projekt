import AreaChartSpline from "../AllCharts/AreaChartSpline";
import LeistungsklassenBarChart from "../AllCharts/BAR_Charts/BarChart";
import ScatterChart from "../AllCharts/ScatterChart";
import TreeMapChart from "../AllCharts/TREEMAP_HEATMAP_Charts/TreeMapChart";
const Leistung: React.FC = () => {
    return (
        <div className="three-column-layout">

            <div className="column">
                <br />BarChart<br /><br/><LeistungsklassenBarChart/>
                <div className="conteinertext">
                    <p style={{ fontSize: '15px', color: "black" }}>Dieser Chart stellt die Verteilung der Leistungsklassen von Windkraftanlagen (WKF) in verschiedenen Leistungsbereichen dar.
                        Die X-Achse zeigt die Leistungskategorien (z.B. 0-500 kW, 500-1000 kW usw.),
                        und die Y-Achse zeigt die Anzahl der Windkraftanlagen in jeder Kategorie. </p>
                </div>
                <br /> Scatter Chart <br/><br/> <ScatterChart />
            </div>
            <div className="column">
            <br />Area Chart <br /><br/><AreaChartSpline/><br />
                <div className="containertext">
                    <p style={{ fontSize: '15px', color: "black" }}> Dieses Diagramm ist ein Spline-Flächendiagramm und vergleicht zwei wichtige Metriken von Windkraftanlagen:
                        die Genehmigungsdaten und die Inbetriebnahmedaten über die Jahre hinweg.
                        Die X-Achse stellt die Jahre dar, während die Y-Achse die Anzahl der Windkraftanlagen in jedem Jahr zeigt.
                        Das Diagramm ermöglicht es, die Entwicklung der Windkraftanlagen hinsichtlich ihrer Genehmigung und Inbetriebnahme im zeitlichen Verlauf visuell zu analysieren.</p>
                </div>
                <br/>
                TreeMap Chart<br/>
                <TreeMapChart/>
                
                
            </div>
        </div>
    )
}; export default Leistung