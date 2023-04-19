import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, SafeAreaView, Alert, Platform} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, {useState, Component, useEffect} from 'react';
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const heightKey = '@MyApp:key';
const BMIKey = '@MyApp:WeightKey'


export default class App extends Component {
  state = {
    weight: '',
    storedWeight: '',
    height: '',
    storedHeight: '',
    BMI: '',
    storedBMI: '',
    condition: '',
  };
  constructor(props) {
    super(props);
    this.state
  }

  openDatabase = () => {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    };

    const db = SQLite.openDatabase("db.db");
    return db;
  }

  Items({ done: doneHeading, onPressItem }) {
    const [items, setItems] = useState(null);
    const db = openDatabase();
    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from items where done = ?;`,
          [doneHeading ? 1 : 0],
          (_, { rows: { _array } }) => setItems(_array)
        );
      });
    }, []);
  
    const heading = doneHeading ? "Completed" : "Todo";
  
    if (items === null || items.length === 0) {
      return null;
    }}

  onLoad = async () => {
    try {
      const storedHeight = await AsyncStorage.getItem(heightKey);
      const storedBMI = await AsyncStorage.getItem(BMIKey);
      this.setState({ storedBMI});
      this.setState({ storedHeight });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  }

  onSave = async () => {
    const { height } = this.state;
    const { BMI } = this.state;

    try {
      await AsyncStorage.setItem(heightKey, height);
      await AsyncStorage.setItem(BMIKey, BMI);
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }

  onChangeWeight = (weight) => {
    this.setState({ weight });
  }

  onChangeHeight = (height) => {
    this.setState({ height });
  }

  onChangeBMI = (BMI) => {
    this.setState({ BMI });
    this.onSave
    this.onChangeCondition(BMI)
  }

  onChangeCondition = (BMI) => {
    if (BMI <= 18.5) {
      condition = "Underweight"
      this.setState({ condition  });
    }
    else if (BMI <= 24.9) {
      condition = "Healthy"
      this.setState({ condition  });
    }
    else if (BMI <= 29.9) {
      condition = "Overweight"
      this.setState({ condition });
    }
    else {
      condition = "Obese"
      this.setState({ condition });
    }
  }

  render() {
    this.onLoad
    const {storedWeight, weight} = this.state;
    const {storedHeight, height} = this.state;
    const {storedBMI, BMI} = this.state;
    const {storedCondition, condition} = this.state;
    
    
  return (
    
    <SafeAreaView style={styles.container}>
      <Text style={styles.toolbar}>BMI Calculator</Text>
      <ScrollView style={styles.content}>
      

      <TextInput
      style={styles.input}
      placeholder="Weight in Pounds"
      value={weight}
      onChangeText={this.onChangeWeight}
      />
      <TextInput
      style={styles.input}
      placeholder={"Height in Inches"}
      value={height}
      onChangeText={this.onChangeHeight}
      />
      <Pressable style={styles.button}
        onPress={() => {
            this.onChangeBMI(((weight / (height * height)) * 703).toFixed(1)); this.onSave;
            }}>
            
            <Text style={{fontSize: 24,
                          color: "white", 
                          textAlign: "center"}}>Compute BMI</Text>
      </Pressable>
      {condition ? (<Text style={{fontSize: 28, textAlign: "center", marginTop: 20}}>{"Body Mass Index is " + BMI + "\n(" + condition + ")"}</Text>) : (null)}
      
      <ScrollView style={styles.listArea}>
            
          </ScrollView>
    </ScrollView>
    </SafeAreaView>
  )
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: "#f4511e",
    color: "white",
    textAlign: "center",
    padding: 25,
    fontWeight: "bold",
    fontSize: 28,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  input: {
    textAlign: "left",
    backgroundColor: "#ecf0f1",
    borderRadius: 3,
    height: 40,
    padding: 5,
    fontSize: 24,
    marginBottom: 10,
    flex: 1
  },
  button: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
    fontSize: 24,
  }
})
