import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jooq.DSLContext
import org.jooq.impl.DSL

object TreeMap {

    private fun getKreisUndCount (dsl: DSLContext): Map<String?, Int>{
        return dsl.select(WINDTABELLE.KREIS, DSL.count())
            .from(WINDTABELLE)
            .groupBy(WINDTABELLE.KREIS)
            .fetch()
            .associate { record -> record[WINDTABELLE.KREIS] to record.get(DSL.count()) }
    }

    private fun getKreisUndHersteller (dsl: DSLContext) :Map<String?,Map<String?, Int>> {
        return dsl.select(WINDTABELLE.KREIS, WINDTABELLE.HERSTELLER, DSL.count())
            .from(WINDTABELLE)
            .groupBy(WINDTABELLE.KREIS, WINDTABELLE.HERSTELLER)
            .fetch()
            .groupBy(
                {record -> record[WINDTABELLE.KREIS]},
                {record -> record[WINDTABELLE.HERSTELLER] to record.get(DSL.count())}
            )
            .mapValues { entry -> entry.value.toMap() }

    }
    fun Route.treeMapRouten(dsl: DSLContext) {
         get("/kreisUndCount"){
             val result = getKreisUndCount(dsl)
             call.respond(result)
         }
        get("/kreisUndHersteller"){
            val result = getKreisUndHersteller(dsl)
            call.respond(result)
        }
    }
}

