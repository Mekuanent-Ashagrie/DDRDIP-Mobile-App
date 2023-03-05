import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Alert  } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

// var db = openDatabase({ name: 'DDRIP.db' });
var tableData = [];
export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [capsules, setCapsules] = useState([]);
  
  
  const tableHead = ['Capsule Id', 'Status', 'Last Update', 'Action'];
 

  const getCapsules = () => {
    fetch('https://api.spacexdata.com/v4/capsules')
      .then((response) => response.json())
      .then((json) => setCapsules(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));      
  }

  const createTable = ()=>{
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Capsules'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Capsules', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Capsules(reuse_count	INTEGER, water_landings	INTEGER, land_landings	INTEGER, last_update	TEXT, serial	TEXT, status	TEXT, type	TEXT, cid	TEXT PRIMARY KEY)',              
              []
            );
          }
        }
      );
    })
  }

  const addDB = (cap) => {
    db.transaction(function (tx) {
      cap.map((item) =>{
        tx.executeSql(
          'INSERT INTO Capsules (reuse_count, water_landings, land_landings, last_update, serial, status, type, cid) VALUES (?,?,?,?,?,?,?,?)',
          [item.reuse_count, item.water_landings, item.land_landings, item.last_update, item.serial, item.status, item.type, item.cid],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              // Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          }
        );
      })
      
    });
  }

  const readFromDB=()=>{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Capsules',
        [],
        (tx, results) => {
          setCapsules(results);
        }
      );
    });
  }

  useEffect(() => {
      setLoading(true);
      getCapsules();
      // // create the table
      // createTable();
      // // add to db
      // addDB(capsules);
      // //read from database 
      // readFromDB();
  }, []);

  const element = (data, index) => (
    <TouchableOpacity onPress={() => _alertIndex(index)}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>See More</Text>
      </View>
    </TouchableOpacity>
  );

  const _alertIndex =(value)=> {
    Alert.alert(`Status: ${value}`);
  }

  return (
    <View style={styles.container}>
      <Text>List of Capsules</Text>     
      {capsules.map(element => {
              tableData.push([element.id, element.status, element.last_update, '']);
            })
            }
            {
              console.log(tableData)
            }
      <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          {            
            tableData.map((rowData, index) => (
              <Row
                      key={index}
                      data={rowData}
                      style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                      textStyle={styles.text}
                    />
            ))
          }
        </Table>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  singleHead: { width: 80, height: 40, backgroundColor: '#c8e1ff' },
  head: { flex: 1, backgroundColor: '#c8e1ff' },
  title: { flex: 2, backgroundColor: '#f6f8fa' },
  titleText: { marginRight: 6, textAlign:'right' },
  text: { textAlign: 'center' },
  btn: { width: 58, height: 18, marginLeft: 15, backgroundColor: '#c8e1ff', borderRadius: 2 },
  btnText: { textAlign: 'center' }
});
