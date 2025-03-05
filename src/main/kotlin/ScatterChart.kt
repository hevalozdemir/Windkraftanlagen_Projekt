import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jooq.DSLContext
import java.math.BigDecimal

object ScatterChart {
    @Serializable
    data class BetriebData(
        val nabenhoehe: Double,
        val leistung : Double ,
        val status: String? =null
    )
    private fun getBetriebData (dsl: DSLContext): List<BetriebData> {
        val result =
            dsl.select(WINDTABELLE.NABENHOEHE, WINDTABELLE.LEISTUNG, WINDTABELLE.STATUS)
                .from(WINDTABELLE)
                .fetch()

        val betriebDataList = result.map { record -> BetriebData(
            nabenhoehe = record[WINDTABELLE.NABENHOEHE]!!.toDouble(),
            leistung = record[WINDTABELLE.LEISTUNG]!!.toDouble(),
            status = record[WINDTABELLE.STATUS]
        ) }
        return betriebDataList
    }


    fun Route.scatterChartRouten(dsl: DSLContext) {
        get("/betriebData"){
            val betriebDataValue = getBetriebData(dsl)
            call.respond(betriebDataValue)

        }
    }
}