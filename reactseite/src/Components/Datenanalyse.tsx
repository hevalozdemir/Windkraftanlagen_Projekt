
import LineChartNabenhoehe from "../AllCharts/LINE_Charts/LineChartNabenhoehe";
import LineChartNabenundRotor from "../AllCharts/LINE_Charts/LineChartNabenundRotor";
import LineChartRotor from "../AllCharts/LINE_Charts/LineChartRotor";


const Datenanalyse: React.FC = () => {
    return(
        <div>
        <div className="column">
       
        <LineChartNabenhoehe/><br/><LineChartRotor/><br/><LineChartNabenundRotor/>
        </div>
    </div>

    )
    

}; export default Datenanalyse