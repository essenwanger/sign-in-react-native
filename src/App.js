import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {response: ''};
    this.onLoginFacebook = this.onLoginFacebook.bind(this);
    this.onLogoutFacebook = this.onLogoutFacebook.bind(this);
    this.onLoginGoogle = this.onLoginGoogle.bind(this);
    this.onLogoutGoogle = this.onLogoutGoogle.bind(this);
  }

  onLoginFacebook () {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          this.setState({response: 'Login was cancelled'});
        } else {
          this.setState({response: 'Login was successful with permissions: '
            + result.grantedPermissions.toString()});
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

  onLoginGoogle () {
    this.setState({response: 'LogIn falta implementar'});
  }

  onLogoutGoogle () {
    this.setState({response: 'LogOut falta implementar'});
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