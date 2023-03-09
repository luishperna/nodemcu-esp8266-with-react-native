import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';

// Biblioteca de icones do expo
import {MaterialIcons} from '@expo/vector-icons'

import axios from 'axios'

export default function App() {

  // Constantes led azul
  const [isEnable, setIsEnable] = useState(false)

  const isSwitch = () => {
    setIsEnable(previousState => !previousState)
  }

  const ledBlue = () => {
    if (isEnable == false){
      axios.get('http://{ip_do_esp8266}/onblue')
      .then(response => {console.log('Led azul ligada')})
      .catch((error) => {
        console.log('Erro! Contato o administrador.')
        Alert.alert('ERRO: Não foi possível acender o led azul.')
      })
    }
    else{
      axios.get('http://{ip_do_esp8266}/offblue')
      .then(response => {console.log('Led azul desligada')})
      .catch((error) => {
        console.log('Erro! Contato o administrador.')
        Alert.alert('ERRO: Não foi possível apagar o led azul.')
      })
    }
  }

  // Constantes led verde
  const [isEnable2, setIsEnable2] = useState(false)

  const isSwitch2 = () => {
    setIsEnable2(previousState => !previousState)
  }

  const ledGreen = () => {
    if (isEnable2 == false){
      axios.get('http://{ip_do_esp8266}/ongreen')
      .then(response => {console.log('Led verde ligada')})
      .catch((error) => {
        console.log('Erro! Contato o administrador.')
        Alert.alert('ERRO: Não foi possível acender o led verde.')
      })
    }
    else{
      axios.get('http://{ip_do_esp8266}/offgreen')
      .then(response => {console.log('Led verde desligada')})
      .catch((error) => {
        console.log('Erro! Contato o administrador.')
        Alert.alert('ERRO: Não foi possível apagar o led verde.')
      })
    }
  }

  // Constantes dht11 umidade
  const [dhtUmi, setDhtUmi] = useState('--')

  const umidity = () => {
    axios.get('http://{ip_do_esp8266}/dht11/humi')
    .then(response => {
      // Setando o dado da resposta
      setDhtUmi(dhtUmidity => response.data)
      console.log(`A umidade está em: ${dhtUmi} %`)
    })
    .catch((error) => {
      console.log('Erro! Sensor com problema.')
      Alert.alert('ERRO: Não foi possível capturar dado de umidade.')
    })
  }
  
  // Constantes dht11 temperatura
  const [dhtTemp, setDhtTemp] = useState('--')
  
  const temperature = () => {
    axios.get('http://{ip_do_esp8266}/dht11/temp')
    .then(response => {
      // Setando o dado da resposta
      setDhtTemp(dhtTemperature => response.data)
      console.log(`A umidade está em: ${dhtTemp} °C`)
    })
    .catch((error) => {
      console.log('Erro! Sensor com problema.')
      Alert.alert('ERRO: Não foi possível capturar dado de temperatura.')
    })
  }

  return (
<>

{/* Preservando a barra de notificação */}
<StatusBar />

  <ScrollView>

    <View style={styles.container}>

      <Text style={styles.title}>Led Azul</Text>

      <View style={styles.status}>
        <Text style={isEnable ? styles.ON : styles.OFF}> {isEnable ? 'Ligado' : 'Desligado'} </Text>
        <Switch 
        onValueChange={isSwitch}
        value={isEnable}
        onChange={ledBlue}
        />
      </View>

      <Text style={styles.title}>Led Verde</Text>

      <View style={styles.status}>
        <Text style={isEnable2 ? styles.ON : styles.OFF}> {isEnable2 ? 'Ligado' : 'Desligado'} </Text>
        <Switch 
        onValueChange={isSwitch2}
        value={isEnable2}
        onChange={ledGreen}
        />
      </View>

      <Text style={styles.title}>Umidade</Text>

      <View style={styles.status}>
        <Text style={styles.details}>Medida: <Text style={styles.value}>{dhtUmi}</Text> %</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={umidity}>
            <MaterialIcons name='sync' size={45} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Temperatura</Text>

      <View style={styles.status}>
        <Text style={styles.details}>Medida: <Text style={styles.value}>{dhtTemp}</Text> °C</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={temperature}>
            <MaterialIcons name='sync' size={45} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>

    </View>

  </ScrollView>

  <Text style={{alignSelf: 'center'}}>Versão Alfa 0.1</Text>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 15,
    marginLeft: 25
  }, 
  details: {
    fontSize: 20,
    textAlign: 'justify',
    marginTop: 25,
    color: '#696969'
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  ON: {
    fontSize: 15,
    textAlign: 'justify',
    marginTop: 15,
    color: '#2ecc71',
    fontWeight: 'bold'
  },
  OFF: {
    fontSize: 15,
    textAlign: 'justify',
    marginTop: 15,
    color: '#CC4040',
    fontWeight: 'bold'
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    marginTop: 25,
    borderRadius: 4
  },
  value: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4b8b3b'
  }
});
