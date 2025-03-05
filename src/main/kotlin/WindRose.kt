import de.lambda9.database.generated.tables.references.WINDHISTTABELLE
import de.lambda9.database.generated.tables.references.WIND_DATA_GROUPPED
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import org.jooq.DSLContext
import java.math.BigDecimal


object WindRose {
    @Serializable
    data class GroupedWindData(
        val arg: String,
        @Serializable(with = BigDecimalSerializer ::class)
        val val1: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val2: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val3: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val4: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val5: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val6: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val7: BigDecimal,
        @Serializable(with = BigDecimalSerializer ::class)
        val val8: BigDecimal
    )

    private fun fetchGroupedWindData(dsl: DSLContext): List<GroupedWindData> {
        return dsl
            .select(
                WIND_DATA_GROUPPED.WIND_DIRECTION_GROUP,
                WIND_DATA_GROUPPED.VAL1,
                WIND_DATA_GROUPPED.VAL2,
                WIND_DATA_GROUPPED.VAL3,
                WIND_DATA_GROUPPED.VAL4,
                WIND_DATA_GROUPPED.VAL5,
                WIND_DATA_GROUPPED.VAL6,
                WIND_DATA_GROUPPED.VAL7,
                WIND_DATA_GROUPPED.VAL8
            )
            .from(WIND_DATA_GROUPPED)
            .fetch { record ->
                GroupedWindData(
                    arg = record.get(WIND_DATA_GROUPPED.WIND_DIRECTION_GROUP, String::class.java),
                    val1 = record.get(WIND_DATA_GROUPPED.VAL1, BigDecimal::class.java),
                    val2 = record.get(WIND_DATA_GROUPPED.VAL2, BigDecimal::class.java),
                    val3 = record.get(WIND_DATA_GROUPPED.VAL3, BigDecimal::class.java),
                    val4 = record.get(WIND_DATA_GROUPPED.VAL4, BigDecimal::class.java),
                    val5 = record.get(WIND_DATA_GROUPPED.VAL5, BigDecimal::class.java),
                    val6 = record.get(WIND_DATA_GROUPPED.VAL6, BigDecimal::class.java),
                    val7 = record.get(WIND_DATA_GROUPPED.VAL7, BigDecimal::class.java),
                    val8 = record.get(WIND_DATA_GROUPPED.VAL8, BigDecimal::class.java)
                )
            }
    }

    private fun getWindRose (dsl:DSLContext) :List<Double>{
       val result = dsl.select(WINDHISTTABELLE.WIND_SPEED)
           .from(WINDHISTTABELLE)
           .orderBy(WINDHISTTABELLE.WIND_SPEED.asc())
           .fetch()
           .map { record -> record[WINDHISTTABELLE.WIND_SPEED]?.toDouble() }
        return result
    }

    private fun allWindInfo(dsl: DSLContext) : List<WindHistory>{
        val windInfo = dsl
            .select(
                WINDHISTTABELLE.WIND_SPEED,
                WINDHISTTABELLE.WIND_DIRECTION,
                WINDHISTTABELLE.WIND_DIRECTION_10_MIN_AVG,
                WINDHISTTABELLE.WIND_DIRECTION_10_MIN_GUST,
                WINDHISTTABELLE.WIND_SPEED_10_MIN_AVG,
                WINDHISTTABELLE.DATE_OBSERVED
            )
            .from(WINDHISTTABELLE)
            .fetch()
            .map { record ->
                WindHistory(
                    windSpeed = record[WINDHISTTABELLE.WIND_SPEED],
                    windDirection = record[WINDHISTTABELLE.WIND_DIRECTION],
                    windDirection10MinAvg = record[WINDHISTTABELLE.WIND_DIRECTION_10_MIN_AVG],
                    windSpeed10MinGust = record[WINDHISTTABELLE.WIND_DIRECTION_10_MIN_GUST],
                    windSpeed10MinAvg = record[WINDHISTTABELLE.WIND_SPEED_10_MIN_AVG],
                    dateObserved = record[WINDHISTTABELLE.DATE_OBSERVED]
                )
            }
        return windInfo
    }

    fun Route.windRoseRouten(dsl: DSLContext){
        val filePathWindhistory ="/home/heval/Downloads/weather_history.csv"
        get("/windSpeed"){
            val result = getWindRose(dsl)
            call.respond(result)
        }
        get ("/allWindInfo"){
            val result = allWindInfo(dsl)
            call.respond(result)
        }
        get("/grouppedDataTwo"){
            val groupedData = fetchGroupedWindData(dsl)
            call.respond(groupedData)
        }

    }
}



