// Importando bibliotecas para trabalhar com wifi
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

// Importando biblioteca para trabalhar com servidor web
#include <ESP8266WebServer.h>

// Importando biblioteca para trabalhar com o sensor DHT
#include <DHT.h>

// Definindo o tipo do sensor e o seu pino para transferência de dados
#define DHTTYPE DHT11 // ou DHT22
#define dht_dpin 0 // pino D3

// Setando o dht com o tipo DHT da biblioteca DHT.h
DHT dht (dht_dpin, DHTTYPE);

// Setando os pinos dos leds azul e verde
int LEDblue = 5; // pino D1
int LEDgreen = 4; // pino D2

// Setando os dados para conexão wifi
const char* ssid = "nome_da_rede_wifi";
const char* password = "senha_da_rede_wifi";

// Setando a porta de acesso
ESP8266WebServer server(80);

// Declarando variáveis que o sensor DHT irá informar
float humidity, temp;
String value = ""; // Variável vazia para receber o dado requisitado do sensor DHT

// Gravando a última leitura do sensor em um intervalo de 2 segundos
unsigned long previousMillis = 0; 
const long interval = 2000;

void setup() {
  // Iniciando comunicação serial
  Serial.begin(115200);

  // Iniciando a leitura do sensor DHT
  dht.begin();

  // Setando o pino do led azul como saída e inicialmente apagado
  pinMode(LEDblue, OUTPUT);
  digitalWrite(LEDblue, LOW);

  // Setando o pino do led verde como saída e inicialmente apagado
  pinMode(LEDgreen, OUTPUT);
  digitalWrite(LEDgreen, LOW);
  
  // Iniciando comunicação wifi
  WiFi.begin(ssid, password);

  // Esperando enquanto o status de conexão for diferente de conectado
  while(WiFi.status()!= WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  // Após conectar com wifi
  Serial.println("");
  Serial.print("NodeMCU conectado no IP: ");
  Serial.println (WiFi.localIP());
  Serial.print("Conexão efetuada com sucesso!!!");

  // Iniciando o servidor web
  server.begin();
  Serial.println("Webserver inicializado");
  delay(500);
  Serial.println("Acesse o endereço pelo: ");
  Serial.println (WiFi.localIP());

  // Setando rotas de requisições (endpoint):

  // Endpoint padrão/home
  server.on("/", [] () {
    // 1º parâmetro -> Código de status de resposta HTTP
    // 2º parâmetro -> Cabeçalho da requisição
    // 3º parâmetro -> Corpo da requisição
    server.send(200, "cabeçalho_da_requisição", "BEM VINDO AO SERVIDOR NODEMCU");
  });

  // Endpoint para acender o led azul
  server.on("/onblue", [] () {
    server.send(200, "cabeçalho_da_requisição", "Led azul ligado!");
    digitalWrite(LEDblue, HIGH);
    delay(1000);      
  });

  // Endpoint para apagar o led azul
  server.on("/offblue", [] () {
    server.send(200, "cabeçalho_da_requisição", "Led azul desligado!");
    digitalWrite(LEDblue, LOW);
    delay(1000);      
  });

  // Endpoint para acender o led verde
  server.on("/ongreen", [] () {
    server.send(200, "cabeçalho_da_requisição", "Led verde ligado!");
    digitalWrite(LEDgreen, HIGH);
    delay(1000);      
  });

  // Endpoint para apagar o led verde
  server.on("/offgreen", [] () {
    server.send(200, "cabeçalho_da_requisição", "Led verde desligado!");
    digitalWrite(LEDgreen, LOW);
    delay(1000);      
  });

  // Endpoint para pegar a leitura de umidade do sensor DHT
  server.on("/dht11/humi", [] () {
    // Chamando a função para pegar os dados da leitura
    getdatas();

    // Atribuindo o valor da leitura para a variável value, mas antes convertendo de float para int e por sua vez para String
    value = String((int) humidity);
    server.send(200, "cabeçalho_da_requisição", value);
  });

  // Endpoint para pegar a leitura de temperatura do sensor DHT
  server.on("/dht11/temp", [] () {
    getdatas();
    value = String((int) temp);
    server.send(200, "cabeçalho_da_requisição", value);
  });
}

void loop() {
  // Função para lidar com a conexão do cliente (aplicação react native)
  // Recebe a requisição, verifica qual rota o cliente disparou e faz o retorno da mesma
  server.handleClient(); 
}

// Função para pegar as leituras de temperatura e umidade do sensor DHT
void getdatas(){

  // Pegando os milissegundos atual
  unsigned long currentMillis = millis();

  // Condicional para realizar a leitura respeitando o intervalo
  if(currentMillis - previousMillis >= interval){
    previousMillis = currentMillis;
  
    // Obtendo os dados da leitura
    temp = dht.readTemperature();
    humidity = dht.readHumidity();

    // Verificando possível erro na leitura do sensor
    if(isnan (temp) || (humidity)){
      Serial.println("Falha na leitura do sensor!");
    return;                
    }
  }
}
