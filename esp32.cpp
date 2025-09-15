#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHTesp.h"

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

#define API_KEY "AIzaSyANWp3XMw2toLxgj0j0aenWLyoJ8kFkQns"
#define DATABASE_URL "https://iot-dht22-5ddc9-default-rtdb.firebaseio.com/" 

#define USER_EMAIL "contactcoutinho506@gmail.com"
#define USER_PASSWORD "CoutinhoX"

const int DHT_PIN = 4;
DHTesp dhtSensor;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int interval = 5000; 

void setup() {
  Serial.begin(115200);

  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nConectado ao WiFi!");


  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;


  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

 
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);


  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);
}

void loop() {
  TempAndHumidity data = dhtSensor.getTempAndHumidity();

  if (millis() - sendDataPrevMillis > interval) {
    sendDataPrevMillis = millis();

    Serial.println("Temp: " + String(data.temperature, 2) + "°C");
    Serial.println("Umidade: " + String(data.humidity, 1) + "%");
    Serial.println("---");

    if (Firebase.setFloat(fbdo, "sensores/temperatura", data.temperature)) {
      Serial.println("Temperatura enviada com sucesso");
    } else {
      Serial.println("Erro ao enviar temperatura: " + fbdo.errorReason());
    }

    if (Firebase.setFloat(fbdo, "sensores/umidade", data.humidity)) {
      Serial.println("Umidade enviada com sucesso");
    } else {
      Serial.println("Erro ao enviar umidade: " + fbdo.errorReason());
    }
  }
}
