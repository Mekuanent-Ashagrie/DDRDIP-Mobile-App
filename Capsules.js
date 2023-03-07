import React from 'react';
import {
  StyleSheet, ScrollView, Dimensions
} from 'react-native';
import argonTheme from "./constants/Theme";
import Icon from 'react-native-vector-icons/FontAwesome';

// galio components
import {
  Button, Block, Text, 
} from 'galio-framework';
import theme from './theme';
import * as SQLite from 'expo-sqlite';


const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const { height, width } = Dimensions.get("screen");

const db = SQLite.openDatabase('DDRIP.db');

class Capsules extends React.Component {
  
  state = {
    capsuleList: []
  }

  componentDidMount(){ 

    //create capsules tables if not exist 
    db.transaction(txn => {    
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS Capsules(reuse_count	INTEGER, water_landings	INTEGER, land_landings	INTEGER, last_update	TEXT, serial	TEXT, status	TEXT, type	TEXT, cid	TEXT PRIMARY KEY)',             
       
      )
    }
  )
  //create capsule_launches tables if not exist 
  db.transaction(txn => {    
    txn.executeSql(
      'CREATE TABLE IF NOT EXISTS Capsule_launches(cid TEXT, launch	TEXT)',
      )
    }
  )

  // get data from capsules table
  db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Capsules',
       null,
        (tx, results) => {
          console.log("generated", results);
          this.setState({capsuleList: results.rows._array})
        }
      );
    });

  }  

  //delete existing tables --- for test
  deleteTb = () =>{       
    db.transaction(txn => {    
      txn.executeSql(
        'DROP TABLE Capsules',
        )
      }
    )
    db.transaction(txn => {    
      txn.executeSql(
        'DROP TABLE Capsule_launches',
      )
    }
  )
  }

  renderCard = (props, index, navigation) => {
    return (
      <Block row center card shadow space="between" style={styles.card} key={props.cid}>   
        <Block flex>
          <Text size={BASE_SIZE * 1.125}>Serial: {props.serial}</Text>
          <Text size={BASE_SIZE * 0.875} muted>Last Update: {props.last_update}</Text>
        </Block>
        <Button style={styles.right}>
          <Icon
            name="angle-right" 
            size={BASE_SIZE*1.5}
            onPress={() => navigation.navigate("Details",  {cid: props.cid})}
          />    
        </Button>
      </Block>
    );
  }

  renderCards = (navigation) => this.state.capsuleList.map((card, index) => this.renderCard(card, index, navigation))

  render() {
    const { navigation } = this.props;
    return (
      <Block safe flex> 
        <Button onPress={() => navigation.navigate("SpaceX")} style={styles.button}
                  color={argonTheme.COLORS.INFO}>Load From SpaceX</Button>
        
        <Button onPress={()=>{this.deleteTb(); navigation.navigate("Capsules")}} style={styles.button}
                  color={argonTheme.COLORS.WARNING}>Delete All - Only For Test</Button>  
        <ScrollView style={{ flex: 1 }}>
          {this.renderCards(navigation)}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.40,
  },
  menu: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  settings: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 0,
  }, 
  button: {
    width: width - theme.SIZES.BASE,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  }, 
});

export default Capsules;
