import KreisUndHersteller from "../AllCharts/BAR_Charts/KreisUndHersteller";
import PieChartHersteller from "../AllCharts/PieChartHersteller"
import WindRoseNeuVersion from "../AllCharts/WindRoseNeuVersion";


const Hersteller: React.FC = () => {
    return (
        <div>
            <div>
            <br/>Kreis - Hersteller
            <br/><br/> <KreisUndHersteller/>
            </div>

            <div>
            <br/>Hersteller 
            <br/><br/> <PieChartHersteller />
            </div>

            <div>
            <br/>WindRose Chart
            <br/><br/> <WindRoseNeuVersion/>
            </div>
        </div>
    )
}; export default Hersteller