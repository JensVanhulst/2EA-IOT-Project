/* Created by Jens */

#include <DallasTemperature.h>
#include <OneWire.h>
#include <SPI.h>
#include <Ethernet.h>

#define __DEBUG__

#define ONE_WIRE_BUS 2
#define STATUS_LED 6

byte mac[] = { 0xA8, 0x61, 0x0A, 0xAE, 0x54, 0x8B };
// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 1, 107);
IPAddress myDns(192, 168, 1, 5);
//IPAddress server(142 , 93, 137, 51);
char server[] = "www.jensvanhulst.tech";  // also change the Host line in httpRequest()

unsigned long previousMillisLightSensor = 0;
unsigned long previousMillisTempSensor = 0;


//5min = 300000
//15min = 900000
unsigned long intervalLightSensor = 300000;
unsigned long intervalTempSensor = 900000;

typedef struct {
  String sensorID;
  String Name;
  String IPAddress;
  int sensorValue;
  int sensorPin;
} SENSOR;

SENSOR tempSensor;
SENSOR lightSensor;

// initialize the library instance:
EthernetClient client;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  #ifdef __DEBUG__
    #define __DEBUG_SENSORS__
    #define __DEBUG_HTTP__
  #endif

  pinMode(STATUS_LED, OUTPUT);

  tempSensor.Name = "LDR Sensor - Elego®";
  tempSensor.IPAddress = "192.168.1.177";
  tempSensor.sensorID = "SENSOR_001_TEMP";

  lightSensor.Name = "Digital Temperature Meter - Elego®";
  lightSensor.IPAddress = "192.168.1.178";
  lightSensor.sensorID = "SENSOR_002_LIGHT";
  lightSensor.sensorPin = A0;

  // start serial port:
  Serial.begin(9600);
  sensors.begin();

  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // start the Ethernet connection:
  Serial.println("Initialize Ethernet with DHCP:");
  if (Ethernet.begin(mac) == 0) {
      Serial.println("Failed to configure Ethernet using DHCP");
      // Check for Ethernet hardware present
      if (Ethernet.hardwareStatus() == EthernetNoHardware) {
        Serial.println("Ethernet shield was not found.  Sorry, can't run without hardware. :(");
        while (true) {
          delay(1); // do nothing, no point running without Ethernet hardware
        }
      }
      if (Ethernet.linkStatus() == LinkOFF) {
        Serial.println("Ethernet cable is not connected.");
      }
      // try to congifure using IP address instead of DHCP:
      Ethernet.begin(mac, ip, myDns);
      Serial.print("My IP address: ");
      Serial.println(Ethernet.localIP());
  } else {
      Serial.print("DHCP assigned IP ");
      Serial.println(Ethernet.localIP());
  }
  // give the Ethernet shield a second to initialize:
  delay(1000);
}

void loop() {
  unsigned long currentMillis = millis();

  #ifdef __DEBUG_HTTP__
    // if there's incoming data from the net connection.
    // send it out the serial port.  
    if (client.available()) {
      char c = client.read();
      Serial.write(c);
    }
  #endif

  if ((unsigned long)(currentMillis - previousMillisLightSensor) >= intervalLightSensor) {
    lightSensor.sensorValue = getLightSensitvity();
    httpRequest(lightSensor.sensorID, lightSensor.sensorValue);
      #ifdef __DEBUG_SENSORS__
        Serial.print("Light : ");
        Serial.println(lightSensor.sensorValue);
      #endif
    previousMillisLightSensor = currentMillis;
  }

  if ((unsigned long)(currentMillis - previousMillisTempSensor) >= intervalTempSensor) {
    tempSensor.sensorValue = getTemperature();
    httpRequest(tempSensor.sensorID, tempSensor.sensorValue);
      #ifdef __DEBUG_SENSORS__
        Serial.print("Temp : ");
        Serial.println(tempSensor.sensorValue);
      #endif
    previousMillisTempSensor = currentMillis;
  }
}

// this method makes a HTTP connection to the server:
void httpRequest(String id, int val) {
  String req = "GET /send.php?ID=" + id + "&Val=" + val + " HTTP/1.1";
  // close any connection before send a new request.
  client.stop();
  // if there's a successful connection:
  if (client.connect(server, 80)) {
    digitalWrite(STATUS_LED, HIGH);
    Serial.println("connecting...");
    // send the HTTP GET request:
    client.println(req);
    client.println("Host: www.jensvanhulst.tech");
    client.println("User-Agent: arduino-ethernet");
    client.println("Connection: close");
    client.println();
    digitalWrite(STATUS_LED, LOW);
  } else {
    Serial.println("connection failed");
  }
}

int getTemperature(void) {
  sensors.requestTemperatures();
  return sensors.getTempCByIndex(0);
}

int getLightSensitvity(void) {
  float adc=0.0048828125, ldr;
  int lux = 0;
  ldr= analogRead(lightSensor.sensorPin);
  lux=(250.000000/(adc*ldr))-50.000000;
  return lux;
}
