
import AreaChart.areaChartRouten
import LineChart.lineChartRouten
import OpenStreetMap.openStreetMapRouten
import ScatterChart.scatterChartRouten
import TreeMap.treeMapRouten
import WindRose.windRoseRouten
import com.github.doyaaaaaken.kotlincsv.dsl.csvReader
import java.sql.Connection
import java.sql.DriverManager
import de.lambda9.database.generated.tables.records.WindhisttabelleRecord
import de.lambda9.database.generated.tables.records.WindtabelleRecord
import de.lambda9.database.generated.tables.references.WINDHISTTABELLE
import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*

import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import io.ktor.server.plugins.cors.routing.CORS
import kotlinx.serialization.KSerializer
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.modules.SerializersModule
import org.jooq.DSLContext
import org.jooq.impl.DSL
import java.math.BigDecimal
import java.time.LocalDate
import java.time.format.DateTimeFormatter

import kotlinx.serialization.builtins.ListSerializer

import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass




object BigDecimalSerializer : KSerializer<BigDecimal> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("BigDecimal", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: BigDecimal) {
        encoder.encodeString(value.toString())
    }

    override fun deserialize(decoder: Decoder): BigDecimal {
        return BigDecimal(decoder.decodeString())
    }
}
object LocalDateSerializer : KSerializer<LocalDate> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("LocalDate", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: LocalDate) {
        val result = value.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        encoder.encodeString(result)
    }

    override fun deserialize(decoder: Decoder): LocalDate {
        try {
            return LocalDate.parse(decoder.decodeString())

        } catch (e: Exception){
            throw e
        }
    }
}


@Serializable
data class Windkraftanlage(
    val kreis: String? =null,  // KREIS
    val gemeinde: String? = null,  // GEMEINDE
    val type: String? =null,  // TYP
    val hersteller: String? =null,  // HERSTELLER
    @Serializable(with = BigDecimalSerializer ::class)
    val nabenhoehe: BigDecimal? =null,  // NABENHOEHE
    @Serializable(with = BigDecimalSerializer ::class)
    val rotordurchmesser: BigDecimal? =null,  // ROTORDURCHMESSER
    val schallleistungspegel: String? = null,  // SCHALLLEISTUNGSPEGEL
    @Serializable(with = BigDecimalSerializer ::class)
    val leistung: BigDecimal? = null,  // LEISTUNG
    val leistungsbezug: String? = null,  // LEISTUNGSBEZUG
    @Serializable(with = BigDecimalSerializer ::class)
    val ostwert: BigDecimal? = null,  // OSTWERT
    @Serializable(with = BigDecimalSerializer ::class)
    val nordwert: BigDecimal? =null,  // NORDWERT
    @Serializable(with = LocalDateSerializer :: class)
    val genehmigtAm: LocalDate? =null , // GENEHMIGT_AM
    @Serializable(with = LocalDateSerializer :: class)
    val inbetriebnahme: LocalDate? =null,  // INBETRIEBNAHME
    val status: String? =null,  // STATUS
    @Serializable(with = BigDecimalSerializer ::class)
    val bstNr: BigDecimal? =null,  // BST_NR
    @Serializable(with = BigDecimalSerializer ::class)
    val anlNr: BigDecimal? =null,  // ANL_NR
    @Serializable(with = LocalDateSerializer :: class)
    val datendatum: LocalDate? =null,  // DATENDATUM
    val datenquelle: String? =null,  // DATENQUELLE
)
@Serializable
data class WindHistory(
    @Serializable(with = BigDecimalSerializer ::class)
    val windDirection: BigDecimal? =null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed: BigDecimal? =null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windDirection10MinAvg: BigDecimal?=null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed10MinAvg: BigDecimal?=null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed10MinGust: BigDecimal?=null,
    @Serializable(with = LocalDateSerializer :: class)
    val dateObserved : LocalDate? =null,
)


@Serializable
data class WindHistoryDatenBank(
    val id :Long? =null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windDirection: BigDecimal? =null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed: BigDecimal? =null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windDirection10MinAvg: BigDecimal?=null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed10MinAvg: BigDecimal?=null,
    @Serializable(with = BigDecimalSerializer ::class)
    val windSpeed10MinGust: BigDecimal?=null,
    @Serializable(with = LocalDateSerializer :: class)
    val dateObserved : LocalDate? =null,
)

@Serializable
data class WindkraftanlageDatenBank(
    val id: Long? = null,
    val kreis: String? =null,  // KREIS
    val gemeinde: String? = null,  // GEMEINDE
    val type: String? =null,  // TYP
    val hersteller: String? =null,  // HERSTELLER
    @Serializable(with = BigDecimalSerializer ::class)
    val nabenhoehe: BigDecimal? =null,  // NABENHOEHE
    @Serializable(with = BigDecimalSerializer ::class)
    val rotordurchmesser: BigDecimal? =null,  // ROTORDURCHMESSER
    val schallleistungspegel: String? = null,  // SCHALLLEISTUNGSPEGEL
    @Serializable(with = BigDecimalSerializer ::class)
    val leistung: BigDecimal? = null,  // LEISTUNG
    val leistungsbezug: String? = null,  // LEISTUNGSBEZUG
    @Serializable(with = BigDecimalSerializer ::class)
    val ostwert: BigDecimal? = null,  // OSTWERT
    @Serializable(with = BigDecimalSerializer ::class)
    val nordwert: BigDecimal? =null,  // NORDWERT
    @Serializable(with = LocalDateSerializer :: class)
    val genehmigtAm: LocalDate? =null , // GENEHMIGT_AM
    @Serializable(with = LocalDateSerializer :: class)
    val inbetriebnahme: LocalDate? =null,  // INBETRIEBNAHME
    val status: String? =null,  // STATUS
    @Serializable(with = BigDecimalSerializer ::class)
    val bstNr: BigDecimal? =null,  // BST_NR
    @Serializable(with = BigDecimalSerializer ::class)
    val anlNr: BigDecimal? =null,  // ANL_NR
    @Serializable(with = LocalDateSerializer :: class)
    val datendatum: LocalDate? =null,  // DATENDATUM
    val datenquelle: String? =null,  // DATENQUELLE
)

fun readCsvFile(filePath: String): List<Windkraftanlage> {
    val turbines = mutableListOf<Windkraftanlage>()
    val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
    val formatter2: DateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yy")
    csvReader {
        autoRenameDuplicateHeaders = true
        delimiter = ';'  // Varsayılan ayırıcı olarak virgül kullanılır, dosyanıza uygunsa değiştirin!
        quoteChar = '"'  // Alıntı karakteri
       //escapeChar = '\\'  // Kaçış karakteri, eğer alıntı içinde alıntı işareti kullanılıyorsa
    }.open(filePath) {
        readAllWithHeaderAsSequence().forEach { row ->
            turbines.add(
                Windkraftanlage(
                    kreis = row["KREIS"] ?: "",
                    gemeinde = row["GEMEINDE"] ?: "",
                    type = row["TYP"] ?: "",
                    hersteller = row["HERSTELLER"] ?: "",
                    nabenhoehe = try { row["NABENHOEHE"]?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    rotordurchmesser = try{row["ROTORDURCHMESSER"]?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    schallleistungspegel = row["SCHALLLEISTUNGSPEGEL"] ?: "",
                    leistung = try{row["LEISTUNG"]?.replace(",", ".")?.toBigDecimal()}catch (e: NumberFormatException){ null},
                    leistungsbezug = row["LEISTUNGSBEZUG"]?: "",
                    ostwert =try{ row["OSTWERT"]?.drop(2)?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    nordwert = try{row["NORDWERT"]?.toBigDecimal()}catch (e: NumberFormatException){ null},
                    genehmigtAm =if(row["GENEHMIGT_AM"].isNullOrBlank()) null else LocalDate.parse(row["GENEHMIGT_AM"], formatter2),
                    inbetriebnahme  = if(row["INBETRIEBNAHME"].isNullOrBlank()) null else LocalDate.parse(row["INBETRIEBNAHME"], formatter2),
                    status = row["STATUS"] ?: "",
                    bstNr = try{row["BST_NR"]?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    anlNr = try{row["ANL_NR"]?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    datendatum =  if (row["DATENDATUM"].isNullOrBlank()) null else LocalDate.parse(row["DATENDATUM"], formatter),
                    datenquelle = row["DATENQUELLE"] ?: ""
                )
            )
        }
    }
    return turbines.toList()
}
fun saveWindkraftanlageToDatabase(dsl: DSLContext, turbines: List<Windkraftanlage>) {
    val newRecords = turbines.map {
        WindtabelleRecord().apply {
            kreis = it.kreis
            gemeinde = it.gemeinde
            type = it.type
            hersteller = it.hersteller
            nabenhoehe = it.nabenhoehe
            rotordurchmesser = it.rotordurchmesser
            schallleistungspegel = it.schallleistungspegel
            leistung = it.leistung
            leistungsbezug = it.leistungsbezug
            ostwert = it.ostwert
            nordwert = it.nordwert
            genehmigtAm = it.genehmigtAm
            inbetriebnahme = it.inbetriebnahme
            status = it.status
            bstNr = it.bstNr
            anlNr = it.anlNr
            datendatum = it.datendatum
            datenquelle = it.datenquelle
        }
    }
    dsl.batchInsert(newRecords).execute()
}
fun fetchAllWindkraftanlagen (dsl: DSLContext): List<WindkraftanlageDatenBank>{
    val allInfo = dsl.selectFrom(WINDTABELLE).fetch()
    return allInfo.map { record ->
        WindkraftanlageDatenBank(
            id = record.id,
            kreis = record.kreis,
            gemeinde = record.gemeinde,
            type = record.type,
            hersteller = record.hersteller,
            nabenhoehe = record.nabenhoehe,
            rotordurchmesser = record.rotordurchmesser,
            schallleistungspegel = record.schallleistungspegel,
            leistung = record.leistung,
            leistungsbezug = record.leistungsbezug,
            ostwert = record.ostwert,
            nordwert = record.nordwert,
            genehmigtAm = record.genehmigtAm,
            inbetriebnahme = record.inbetriebnahme,
            status = record.status,
            bstNr = record.bstNr,
            anlNr = record.anlNr,
            datendatum = record.datendatum,
            datenquelle = record.datenquelle
        )
    }
}


fun readCSVFileWind(filePath: String) : List<WindHistory> {
    val windhistory = mutableListOf<WindHistory>()
    val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX")
    csvReader { autoRenameDuplicateHeaders = true
        delimiter = ';'  // Varsayılan ayırıcı olarak virgül kullanılır, dosyanıza uygunsa değiştirin!
        quoteChar = '"'  // Alıntı karakteri
        //escapeChar = '\\'  // Kaçış karakteri, eğer alıntı içinde alıntı işareti kullanılıyorsa
    }.open(filePath){
        readAllWithHeaderAsSequence().forEach { row ->
            windhistory.add(
                WindHistory(
                    windDirection = try { row["windDirection"] ?.replace(",", ".")?.toBigDecimal() } catch (e: NumberFormatException){ null},
                    windSpeed = try {row["windSpeed"] ?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    windDirection10MinAvg =try{ row["windDirection10MinAvg"] ?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    windSpeed10MinAvg = try{row["windSpeed10MinAvg"] ?.replace(",", ".")?.toBigDecimal()} catch (e: NumberFormatException){ null},
                    windSpeed10MinGust = try{row["windSpeed10MinGust"] ?.replace(",", ".")?.toBigDecimal()}  catch (e: NumberFormatException){ null},
                    dateObserved =if (row["dateObserved"].isNullOrBlank()) null else LocalDate.parse(row["dateObserved"], formatter)
                )
            )
        }
    }
    return windhistory.toList()
}

//CSV-Daten in die DatenBank einfügen
fun saveWindhistoryToDatabase (dsl: DSLContext, windHistory: List<WindHistory>)  {
    val newRecords =windHistory.map {
        WindhisttabelleRecord().apply {
            windDirection =it.windDirection
            windSpeed =it.windSpeed
            windDirection_10MinAvg = it.windDirection10MinAvg
            windSpeed_10MinAvg =it.windSpeed10MinAvg
            windDirection_10MinGust =it.windSpeed10MinGust
            dateObserved=it.dateObserved
        }
    }
    dsl.batchInsert(newRecords).execute()
}
//Funktion, die alle WindHistory Informationen aus der Datenbank abruft
fun fetchAllWindHistory (dsl: DSLContext) : List<WindHistoryDatenBank> {
    val allInfo =dsl.selectFrom(WINDHISTTABELLE).fetch()
    return allInfo.map { record ->
        WindHistoryDatenBank(
            id = record.id,
            windDirection = record.windDirection,
            windSpeed = record.windSpeed,
            windDirection10MinAvg = record.windDirection_10MinAvg,
            windSpeed10MinAvg = record.windSpeed_10MinAvg,
            windSpeed10MinGust = record.windDirection_10MinGust,
            dateObserved = record.dateObserved
        )
    }
}


//Funktion, die Herstellerinformationen aus der Datenbank abruft
fun getHersteller (dsl: DSLContext) : List<String>{
    return  dsl.select(WINDTABELLE.HERSTELLER)
        .from(WINDTABELLE)
        .fetch()
        .map { record -> record.get(WINDTABELLE.HERSTELLER) }
}
//Funktion, die Gemeindeinformationen aus der Datenbank abruft
fun getGemeinde (dsl: DSLContext) : List<String> {
    return  dsl.select(WINDTABELLE.GEMEINDE)
        .from(WINDTABELLE)
        .fetch()
        .map { record -> record.get(WINDTABELLE.GEMEINDE) }
}


fun main() {
    val userName: String = "hozdemir"
    val password: String = "sql123"
    val port = "7120"
    val datenbank = "windkraftanlagen"
    val url: String = "jdbc:postgresql://localhost:$port/$datenbank"

    val con: Connection = DriverManager.getConnection(url, userName, password)
    con.schema = "ubung"
    val dsl: DSLContext = DSL.using(con)


    //val filePath = "/home/heval/Downloads/wka_sh_neu.csv"
    //val filePathWindhistory ="/home/heval/Downloads/weather_history.csv"
    println("the end")


    val server = embeddedServer(Netty, port =8090){
        install(ContentNegotiation){
            json(Json {
                prettyPrint= true
                isLenient=true
                useArrayPolymorphism = true
            })
        }
        install(CORS) {
            anyHost() // Geliştirme sırasında tüm kökenlerden gelen isteklere izin verir
            allowMethod(HttpMethod.Get) // GET isteklerine izin ver
            allowMethod(HttpMethod.Post) // POST isteklerine izin ver (Gerekiyorsa)
            allowHeader(HttpHeaders.AccessControlAllowHeaders) // Gerekli header izinlerini ekle
            allowCredentials = true // Kimlik doğrulama bilgilerini (credentials) taşıyan istekleri kabul et
        }
        routing {
            route("/api"){
                get("/hello"){
                    call.respondText("Hello Lambda9!")
                }
                get("/gemeinde"){
                    val gemeindevalue=getGemeinde(dsl)
                    call.respond(gemeindevalue)
                }

                get("/getAlleInfoWindHistory"){
                    val windHistory =fetchAllWindHistory(dsl)
                    call.respond(windHistory)
                }
                get("/hersteller"){
                    val herstellervalue =getHersteller(dsl)
                    call.respond(herstellervalue)
                }

                get("/getAlleInfoFromTabelle"){
                    val alleInfo= fetchAllWindkraftanlagen(dsl)
                    call.respond(alleInfo)
                }
                areaChartRouten(dsl) //hepsi calisti Afferinnnnn :)

                scatterChartRouten(dsl) //hepsi calisti Afferinnnnn :)

                treeMapRouten(dsl)  //hepsi calisti Afferinnnnn :)

                windRoseRouten(dsl) //hata : windSpeed,grouppedData! //düzeltme: hepsi tamam :)

                openStreetMapRouten(dsl) //hepsi calisti Afferinnnnn :)

                lineChartRouten(dsl) //hepsi calisti Afferinnnnn :)
            }
        }
    }
    server.start(wait = true)
}








