import de.lambda9.database.generated.tables.references.WINDTABELLE
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.KSerializer
import kotlinx.serialization.Serializable
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import org.jooq.DSLContext
import org.locationtech.proj4j.CRSFactory
import org.locationtech.proj4j.CoordinateTransformFactory
import org.locationtech.proj4j.ProjCoordinate
import java.math.BigDecimal



object OpenStreetMap {


   @Serializable
    data class CoordinateAndInformation(
        val breite: Double,  // Enlem
        val laenge: Double , // Boylam)
        val hersteller: String, // Üretici bilgisi
        val leistung: Double     // Güç bilgisi (Leistung)
    )
//önceden burasi coordinates di ben ekleme yaptim.

    object ArrayListSerializer : KSerializer<ArrayList<CoordinateAndInformation>> {
        override val descriptor: SerialDescriptor = ListSerializer(CoordinateAndInformation.serializer()).descriptor

        override fun serialize(encoder: Encoder, value: ArrayList<CoordinateAndInformation>) {
            encoder.encodeSerializableValue(ListSerializer(CoordinateAndInformation.serializer()), value)
        }

        override fun deserialize(decoder: Decoder): ArrayList<CoordinateAndInformation> {
            return ArrayList(decoder.decodeSerializableValue(ListSerializer(CoordinateAndInformation.serializer())))
        }
    }



    private fun getOstwert(dsl: DSLContext): List<Double> {
        val result = dsl.select(WINDTABELLE.OSTWERT)
            .from(WINDTABELLE)
            .fetch()
            .map { record -> record[WINDTABELLE.OSTWERT]?.toDouble()}
        return result
    }


    private fun getNordwert(dsl: DSLContext): List<Double> {
        return dsl.select(WINDTABELLE.NORDWERT)
            .from(WINDTABELLE)
            .fetch()
            .map { record -> record[WINDTABELLE.NORDWERT]?.toDouble() }
    }



    private fun convertUTMToLatLon(easting: Double, northing: Double, zone: Int, northernHemisphere: Boolean, hersteller: String, leistung: BigDecimal?): CoordinateAndInformation{
        val crsFactory = CRSFactory()
        val utmCRS = crsFactory.createFromName("EPSG:326$zone")
        val wgs84CRS = crsFactory.createFromName("EPSG:4326")
        val transformFactory = CoordinateTransformFactory()
        val transform = transformFactory.createTransform(utmCRS, wgs84CRS)

        val utmCoord = ProjCoordinate(easting, northing)
        val latLonCoord = ProjCoordinate()

        transform.transform(utmCoord, latLonCoord)

        return CoordinateAndInformation(breite = latLonCoord.y, laenge = latLonCoord.x , hersteller= hersteller, leistung = leistung!!.toDouble())
    }


    private fun convertOstNordToLatLon(dsl: DSLContext): List<CoordinateAndInformation> {
        val zone = 32 // Örneğin, Avrupa'da yaygın olan bir UTM zonu
        val northernHemisphere = true // Çoğu Avrupa ülkesi Kuzey Yarımküre'de bulunur

        val result = dsl.select(WINDTABELLE.OSTWERT, WINDTABELLE.NORDWERT, WINDTABELLE.HERSTELLER, WINDTABELLE.LEISTUNG)
            .from(WINDTABELLE)
            .where(
                WINDTABELLE.OSTWERT.isNotNull.and(WINDTABELLE.OSTWERT.ne(BigDecimal.ZERO))
                    .and(WINDTABELLE.NORDWERT.isNotNull.and(WINDTABELLE.NORDWERT.ne(BigDecimal.ZERO)))

            )
            .fetch { record ->
                val easting = record[WINDTABELLE.OSTWERT]?.toDouble()
                val northing = record[WINDTABELLE.NORDWERT]?.toDouble()
                val hersteller = record[WINDTABELLE.HERSTELLER]!!
                val leistung = record[WINDTABELLE.LEISTUNG]

                    convertUTMToLatLon(
                        easting = easting!!,
                        northing = northing!!,
                        zone = zone,
                        northernHemisphere = northernHemisphere,
                        hersteller = hersteller,
                        leistung = leistung
                    )
            }
        return result
    }

    fun Route.openStreetMapRouten(dsl: DSLContext){
        get("/coordinates"){
            val coordinateAndInformation= convertOstNordToLatLon(dsl)
            call.respond(coordinateAndInformation)
        }
        get("/ostwert"){
            val ostwertvalue =getOstwert(dsl)
            call.respond(ostwertvalue)
        }
        get("/nordwert"){
            val nordwertvalue =getNordwert(dsl)
            call.respond(nordwertvalue)
        }

    }
}