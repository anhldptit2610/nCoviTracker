#include "DHT.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "ArduinoJson.h"
#include <Wire.h>

#define Addr 0x4A

#define ssid "Mi"
#define password "1234567t8"
#define mqtt_server "broker.hivemq.com"

const uint16_t mqtt_port = 1883; //Port của MQT

#define topic1 "home/sensors/temperature-humidity"

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup()
{
  Serial.begin(115200);

  Wire.begin();
  // Initialise serial communication

  Wire.beginTransmission(Addr);
  Wire.write(0x02);
  Wire.write(0x40);
  Wire.endTransmission();
  delay(300);

  setup_wifi();                             //thực hiện kết nối Wifi
  client.setServer(mqtt_server, mqtt_port); // cài đặt server và lắng nghe client ở port 1883
  client.setCallback(callback);             // gọi hàm callback để thực hiện các chức năng publish/subcribe

  if (!client.connected())
  { // Kiểm tra kết nối
    reconnect();
  }
  client.subscribe("livingroomLight");
  client.subscribe("livingroomAirConditioner");
  client.subscribe("television");
  client.subscribe("bedroomLight");
  client.subscribe("bedroomAirConditioner");
  client.subscribe("airVent");

  pinMode(D1, OUTPUT); // livingroomLight
  pinMode(D2, OUTPUT); // livingroomAirConditioner
  pinMode(D3, OUTPUT); // television
  pinMode(D4, OUTPUT); // bedroomLight
  pinMode(D5, OUTPUT); // bedroomAirConditioner
  pinMode(D6, OUTPUT); // airVent
  dht.begin();
}

// Hàm kết nối wifi
void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  // in ra thông báo đã kết nối và địa chỉ IP của ESP8266
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Hàm call back để nhận dữ liệu
void callback(char *topic, byte *payload, unsigned int length)
{
  //-----------------------------------------------------------------
  //in ra tên của topic và nội dung nhận được
  Serial.print("Co tin nhan moi tu topic: ");
  Serial.println(topic);
  char p[length + 1];
  memcpy(p, payload, length);
  p[length] = NULL;
  String message(p);

  if (String(topic) == "livingroomLight")
  {
    if (message == "livingroomLightOn")
    {
      digitalWrite(D1, HIGH);
    }
    if (message == "livingroomLightOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  if (String(topic) == "livingroomAirConditioner")
  {
    if (message == "livingroomLightOn")
    {
      digitalWrite(D2, HIGH);
    }
    if (message == "livingroomLightOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  if (String(topic) == "television")
  {
    if (message == "televisionOn")
    {
      digitalWrite(D2, HIGH);
    }
    if (message == "televisionOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  if (String(topic) == "bedroomLight")
  {
    if (message == "bedroomLightOn")
    {
      digitalWrite(D2, HIGH);
    }
    if (message == "bedroomLightOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  if (String(topic) == "bedroomAirConditioner")
  {
    if (message == "bedroomAirConditionerOn")
    {
      digitalWrite(D2, HIGH);
    }
    if (message == "bedroomAirConditionerOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  if (String(topic) == "airVent")
  {
    if (message == "airVentOn")
    {
      digitalWrite(D2, HIGH);
    }
    if (message == "airVentOff")
    {
      digitalWrite(D2, LOW);
    }
  }

  Serial.println(message);
  //Serial.write(payload, length);
  Serial.println();
  //-------------------------------------------------------------------------
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect()
{
  while (!client.connected()) // Chờ tới khi kết nối
  {
    if (client.connect("Truong-ESP8266")) //kết nối vào broker
    {
      Serial.println("Đã kết nối:");
      //đăng kí nhận dữ liệu từ topic
      client.subscribe("livingroomLight");
      client.subscribe("livingroomAirConditioner");
      client.subscribe("television");
      client.subscribe("bedroomLight");
      client.subscribe("bedroomAirConditioner");
      client.subscribe("airVent");
    }
    else
    {
      // in ra trạng thái của client khi không kết nối được với broker
      Serial.print("Lỗi:, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}

long lastMsg = 0;
void loop()
{
  //  if (!client.connected()){// Kiểm tra kết nối
  //    reconnect();
  //  }
  client.loop();

  // Convert the data to lux
  int exponent = (data[0] & 0xF0) >> 4;
  int mantissa = ((data[0] & 0x0F) << 4) | (data[1] & 0x0F);
  float luminance = pow(2, exponent) * mantissa * 0.045;

  long now = millis();
  if (now - lastMsg > 6000)
  {
    lastMsg = now;
    int h = dht.readHumidity();
    // Read temperature as Celsius (the default)
    int t = dht.readTemperature();
    // Read temperature as Fahrenheit (isFahrenheit = true)

    unsigned int data[2];
    Wire.beginTransmission(Addr);
    Wire.write(0x03);
    Wire.endTransmission();

    // Request 2 bytes of data
    Wire.requestFrom(Addr, 2);

    // Read 2 bytes of data luminance msb, luminance lsb
    if (Wire.available() == 2)
    {
      data[0] = Wire.read();
      data[1] = Wire.read();
    }

    // Convert the data to lux
    int exponent = (data[0] & 0xF0) >> 4;
    int mantissa = ((data[0] & 0x0F) << 4) | (data[1] & 0x0F);
    float luminance = pow(2, exponent) * mantissa * 0.045;

    Serial.print("Ambient Light luminance :");
    Serial.print(luminance);
    Serial.println(" lux");
    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t))
    {
      Serial.println(F("Failed to read from DHT sensor!"));
      return;
    }

    char lightString[10];
    sprintf(lightString, "%f", luminance);
    Serial.print("  Light: ");
    Serial.print(lightString);

    char tempString[10];
    sprintf(tempString, "%d", t);
    Serial.print("  Temperature: ");
    Serial.print(tempString);

    char humiString[10];
    sprintf(humiString, "%d", h);
    Serial.print("  Humidity: ");
    Serial.println(humiString);

    StaticJsonDocument<100> doc;
    doc["Temperature"] = t;
    doc["Humidity"] = h;
    doc["Light"] = luminance;

    char buffer[100];
    serializeJson(doc, buffer);
    client.publish(topic1, buffer);
    Serial.println(buffer);
  }
}
