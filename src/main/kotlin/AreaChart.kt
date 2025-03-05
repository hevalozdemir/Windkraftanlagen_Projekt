import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jooq.DSLContext



object AreaChart {
    private fun getWKAAnzahlNachGenehmiDatum(dsl: DSLContext) :Map<String?,Int>{
        val result = dsl.select(WINDTABELLE.GENEHMIGT_AM)
            .from(WINDTABELLE)
            .where(WINDTABELLE.GENEHMIGT_AM.isNotNull)
            .fetch()
            .map { record -> val datum = record[WINDTABELLE.GENEHMIGT_AM]?.toString()
                datum?.let {
                    val year = datum.substring(2,4)
                    if (year.toInt()>= 50) "19$year" else "20$year"
                } ?: "Unknown"
            }
        val result2 = result.groupingBy { it }.eachCount()
        return result2
    }

    private fun getWKAAnzahlNachInbetriebDatum(dsl: DSLContext): Map<String?, Int>{
        val result = dsl.select(WINDTABELLE.INBETRIEBNAHME)
            .from(WINDTABELLE)
            .where(WINDTABELLE.INBETRIEBNAHME.isNotNull)
            .fetch()
            .map { record -> val datum = record[WINDTABELLE.INBETRIEBNAHME]?.toString()
                datum?.let {
                    val year = datum.substring(2,4)
                    if (year.toInt()>= 50) "19$year" else "20$year"
                } ?: "Unknown"
            }
        val result2= result.groupingBy { it }.eachCount()
        return result2
    }

    fun Route.areaChartRouten(dsl: DSLContext){
        get("/genehmiValue"){
            val genehmiDatumValue= getWKAAnzahlNachGenehmiDatum(dsl)
            call.respond(genehmiDatumValue)
        }
        get("/inbetriebValue"){
            val inbetriebDatumValue = getWKAAnzahlNachInbetriebDatum(dsl)
            call.respond(inbetriebDatumValue)
        }
    }
}