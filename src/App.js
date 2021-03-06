import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {response: ''};
    this.onLoginFacebook = this.onLoginFacebook.bind(this);
    this.onLogoutFacebook = this.onLogoutFacebook.bind(this);
    this.onLoginGoogle = this.onLoginGoogle.bind(this);
    this.onLogoutGoogle = this.onLogoutGoogle.bind(this);
  }

  componentDidMount () {
    GoogleSignin.configure({
      webClientId: '809867189620-f4riqe8decsm4iuknvoliceltbf69ikf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  onLoginFacebook () {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          this.setState({response: 'Login was cancelled'});
        } else {
         AccessToken.getCurrentAccessToken().then(
            (data) => {
              const responseCallback = ((error, result) => {
                if (error) {
                  this.setState({response: 'Error data' + error});
                } else {
                  this.setState({response: 'Name ' + result.name + ' Email ' + result.email});
                }
              })
              const profileRequestParams = {
                fields: {
                  string: 'id, name, email, first_name, last_name, picture'
                }
              }
              const profileRequestConfig = {
                httpMethod: 'GET',
                version: 'v2.5',
                parameters: profileRequestParams,
                accessToken: data.accessToken.toString()
              }
              const profileRequest = new GraphRequest(
                '/me',
                profileRequestConfig,
                responseCallback,
              )
              new GraphRequestManager().addRequest(profileRequest).start();
            }
          )
        }
      }.bind(this),
      function(error) {
        this.setState({response: 'Login failed with error: ' + error});
      }.bind(this)
    );
  }

  onLogoutFacebook () {
    LoginManager.logOut();
    this.setState({response: 'LogOut Facebook'});
  }

  async onLoginGoogle () {
    try {
      const userInfo = await GoogleSignin.signIn();
      this.setState({ response: 'Name ' + userInfo.user.name + ' Email ' + userInfo.user.email });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  async onLogoutGoogle () {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({response: 'LogOut Google'});
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Example Login</Text>
        <Text style={styles.label}>Facebook</Text>
        <TouchableOpacity style={styles.buttonFacebook} onPress={this.onLoginFacebook}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonFacebook} onPress={this.onLogoutFacebook}>
          <Text style={styles.buttonText}>LogOut</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Google</Text>
        <TouchableOpacity style={styles.buttonGoogle} onPress={this.onLoginGoogle}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonGoogle} onPress={this.onLogoutGoogle}>
          <Text style={styles.buttonText}>LogOut</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Response</Text>
        <Text style={styles.label}>{this.state.response}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 30
  },
  label: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonFacebook: {
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#3B5998',
    padding: 10,
    alignItems: 'center',
  },
  buttonGoogle: {
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#dd4b39',
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff'
  }
});