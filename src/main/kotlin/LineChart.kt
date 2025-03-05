import de.lambda9.database.generated.tables.references.LEISTUNG_NABENHOEHE_AVG
import de.lambda9.database.generated.tables.references.LEISTUNG_ROTORDURCHMESSER_AVG
import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.util.TreeMap

object LineChart {
    private fun getLeistunggruppen(dsl: DSLContext): List<Double> {
        return dsl.select(WINDTABELLE.LEISTUNG)
            .from(WINDTABELLE)
            .where(WINDTABELLE.LEISTUNG.isNotNull)
            .fetch()
            .map { record -> record[WINDTABELLE.LEISTUNG]?.toDouble() }
    }


     private fun getNabenhoehe(dsl:DSLContext): List<Double> {
     val nabenhoeheRecords = dsl.select(WINDTABELLE.NABENHOEHE)
         .from(WINDTABELLE)
         .where(WINDTABELLE.NABENHOEHE.isNotNull)
         .fetch()

         val nabenhohex = nabenhoeheRecords .map {
             record -> record.get(WINDTABELLE.NABENHOEHE)?.toDouble()
         }
         return nabenhohex
    }

    private fun getRotordurchmesser(dsl: DSLContext): List<Double> {
      val rotordurchmesserRecords = dsl.select(WINDTABELLE.ROTORDURCHMESSER)
          .from(WINDTABELLE)
          .where(WINDTABELLE.ROTORDURCHMESSER.isNotNull)
          .fetch()

        val rotordurchx = rotordurchmesserRecords.map {
            record -> record.get(WINDTABELLE.ROTORDURCHMESSER)?.toDouble()
        }
        return rotordurchx
    }




    @Serializable
    data class SeriesData(
        val name: String,
        val value: Double
    )

    private fun fetchAverageLeistungGroupedByRotordurchmesser(dsl: DSLContext): List<SeriesData> {
        val result = dsl
            .select(LEISTUNG_ROTORDURCHMESSER_AVG.ROTORDURCHMESSER_GROUP, LEISTUNG_ROTORDURCHMESSER_AVG.AVG_LEISTUNG)
            .from(LEISTUNG_ROTORDURCHMESSER_AVG)
            .fetch()

        // Sonuçları SeriesData formatına dönüştürüyoruz
        return result.map { record ->
            SeriesData(
                name = record.get(LEISTUNG_ROTORDURCHMESSER_AVG.ROTORDURCHMESSER_GROUP).toString(),
                value = record.get(LEISTUNG_ROTORDURCHMESSER_AVG.AVG_LEISTUNG)!!.toDouble()
            )
        }
    }

    private fun fetchAverageLeistungGroupedByNabenhoehe(dsl: DSLContext): List<SeriesData> {
        val result = dsl
            .select(LEISTUNG_NABENHOEHE_AVG.NABENHOEHE_GROUP, LEISTUNG_NABENHOEHE_AVG.AVG_LEISTUNG)
            .from(LEISTUNG_NABENHOEHE_AVG)
            .fetch()

        // Sonuçları SeriesData formatına dönüştürüyoruz
        return result.map { record ->
            SeriesData(
                name = record.get(LEISTUNG_NABENHOEHE_AVG.NABENHOEHE_GROUP).toString(),
                value = record.get(LEISTUNG_NABENHOEHE_AVG.AVG_LEISTUNG)!!.toDouble()
            )
        }
    }

    fun Route.lineChartRouten(dsl: DSLContext) {
            get("/leistung") {
                val leistunggruppe = getLeistunggruppen(dsl)
                call.respond(leistunggruppe)
            }
            get("/nabenhoehe") {
                val nabenhoeheValue = getNabenhoehe(dsl)
                call.respond(nabenhoeheValue)
            }
            get("/rotordurchmesser") {
                val rotordurchmesserValue = getRotordurchmesser(dsl)
                call.respond(rotordurchmesserValue)
            }

            get("/averageLeistungsMitGroupFürNabenhoehe") {
                val averageLeistung = fetchAverageLeistungGroupedByNabenhoehe(dsl)
                call.respond(averageLeistung)
            }

            get("/averageLeistungsMitGroupFürRotor"){
                val averageLeistung = fetchAverageLeistungGroupedByRotordurchmesser(dsl)
                call.respond(averageLeistung)
            }
        }
    }




