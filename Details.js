import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  StatusBar
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import * as SQLite from 'expo-sqlite';
import { Images, argonTheme } from "./constants";

const StatusHeight = StatusBar.currentHeight;
const HeaderHeight = (theme.SIZES.BASE * 3.5 + (StatusHeight || 0));
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
const db = SQLite.openDatabase('DDRIP.db');

class Details extends React.Component {
  state={
    capsule: {},
    launchList: [],
  }
  cid  = this.props.route.params.cid;

  componentDidMount(){
  // get sepecific capsules 
  db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Capsules where cid='${this.cid}'`,
       null,
        (tx, results) => {
          // console.log("generated", results);
          this.setState({capsule: results.rows._array[0]})
        }
      );
    });

  //get launches from specific capsules 
  // get sepecific capsules 
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM Capsule_launches where cid='${this.cid}'`,
     null,
      (tx, results) => {
        console.log("generated", results);
        this.setState({launchList: results.rows._array})
      }
    );
  });

  }  

  renderLaunches = () => this.state.launchList.map((lau, index)=>{      
      return(
        <Block flex>
          <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
              {lau.launch}
        </Text>
        </Block>
        
      )
    })
   

  render() {
    
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={Images.ProfilePicture }
                    style={styles.avatar}
                  />
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.INFO, width: 75,
                        height: 28 }}
                    >
                      {this.state.capsule.serial}
                    </Button>
                    <Button
                      style={{ width: 75,
                        height: 28, backgroundColor: argonTheme.COLORS.DEFAULT }}
                    >
                      {this.state.capsule.status}
                    </Button>
                  </Block>
                  <Block row space="between">
                    <Block middle>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                        {this.state.capsule.reuse_count}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Reuse Count</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                       {this.state.capsule.land_landings}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Land Landings</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {this.state.capsule.water_landings}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Water Landings</Text>
                    </Block>
                  </Block>
                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      List of launches
                    </Text>
                    {this.renderLaunches()}               
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>                  
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Details;
