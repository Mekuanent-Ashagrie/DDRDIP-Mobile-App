import React from 'react';
import {
  StyleSheet, ScrollView, Dimensions
} from 'react-native';
import argonTheme from "./constants/Theme";

import * as SQLite from 'expo-sqlite';

// galio components
import {
  Button, Block, Icon, Text, 
} from 'galio-framework';
import theme from './theme';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_RED = theme.COLORS.INFO;
const { height, width } = Dimensions.get("screen");

const db = SQLite.openDatabase('DDRIP.db');

class SpaceX extends React.Component {

  state = {
    capsuleList: []
  }

  renderCard = (props, index) => {

    return (
      <Block row center card shadow space="between" style={styles.card} key={props.id}>    

        <Block flex>
          <Text size={BASE_SIZE * 1.125}>{props.serial}</Text>
          <Text size={BASE_SIZE * 0.875} muted>{props.last_update}</Text>
        </Block>
        <Button style={styles.right}>
          <Icon size={BASE_SIZE} name="minimal-right" family="Galio" color={COLOR_RED} />
        </Button>
      </Block>
    );
  }

  getCapsules = () => {
    fetch('https://api.spacexdata.com/v4/capsules')
      .then((response) => response.json())
      .then((json) => this.setState({capsuleList: json}))
      .catch((error) => console.error(error))   
  }

  addToDb = () => {
    this.state.capsuleList.map(capsule=>{
      // insert capsules 
      db.transaction(tx => {    
        tx.executeSql(
          `INSERT OR IGNORE INTO Capsules (reuse_count, water_landings, land_landings, last_update, serial, status, type, cid) VALUES (${capsule.reuse_count}, ${capsule.water_landings}, ${capsule.land_landings}, '${capsule.last_update}', '${capsule.serial}', '${capsule.status}', '${capsule.type}', '${capsule.id}')`,       
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
             console.log('Data Inserted Successfully....');
            } else console.log('Failed....');
          }
        );     
      
      }); 
    })
     //iterate over launces and add to capsule launch
     this.state.capsuleList.map(capsule=>{
      capsule.launches.map(lau=>{
        db.transaction(tx => {    
          tx.executeSql(
            `INSERT OR IGNORE INTO Capsule_launches (cid, launch) VALUES ('${capsule.id}', '${lau}')`,       
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
              console.log('Data Inserted Successfully....');
              } else console.log('Failed....');
            }
          );          
      });
    }) 
   })
  }

  componentDidMount(){
    this.getCapsules();    
  }

  renderCards = () => this.state.capsuleList.map((card, index) => this.renderCard(card, index))

  render() {
    return (
      <Block safe flex> 
        <Button  style={styles.button} onPress={this.addToDb()}
                  color={argonTheme.COLORS.INFO}>{(this.state.capsuleList).length>0? 'Add all ('+ (this.state.capsuleList).length+') Capsules to DB': 'Loading . . .'}</Button>
        {/* <Text>Total Number of Capsules Fetched: {(this.state.capsuleList).length}</Text>       */}
        <ScrollView style={{ flex: 1 }}>
          {this.renderCards()}
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

export default SpaceX;
