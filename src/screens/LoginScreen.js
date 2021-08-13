import React from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import * as AnimateTable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { environment } from '../shared/env'
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../components/context';

const LoginScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        error: ''
    });

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            data.error,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
        );
    };

    const [isLoading, setIsLoading] = React.useState(false);

    const { signIn } = React.useContext(AuthContext);

    const textInputChange = (val) => {
        setData({
            ...data,
            username: val,
            check_textInputChange: val.length > 0 ? true : false,
            isValidUser: val.length > 0 ? true : false
        })
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val,
            isValidPassword: val.length > 0 ? true : false
        })
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry,
        })
    }

    const loginHandle = (userName = 0, password = 0) => {
        if (userName.length == 0 || password.length == 0) {
            setIsLoading(false);
            setData({
                ...data,
                isValidUser: userName?.length > 0 ? true : false,
                isValidPassword: password?.length > 0 ? true : false
            })
        }
        else {
            let data = JSON.stringify({
                documento: userName,
                password: password
            })

            const url = `${environment.api}/login`;
            const requestOptions = { method: 'POST', body: data, headers: { 'Content-Type': 'application/json' } };

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data_response => {
                    setIsLoading(false);
                    if (data_response.error) {
                        setData({ ...data, error: data_response.error })
                        setData({ ...data, error: '' })
                    }
                    else {
                        setData({
                            ...data,
                            error: '',
                        })
                        signIn(data_response)
                    }
                })
                .catch(err => { console.log(err) });
        }
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Validando datos de acceso, espere un momento...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor='rgba(0, 0, 0, 0.7)'
            />
            <AnimateTable.View animation="fadeInUpBig">
                {data.error != '' ?
                    showToastWithGravityAndOffset()
                    : null
                }
                <Image source={require('../../assets/logo.png')} />
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color="#315993"
                        size={20}
                    />
                    <TextInput
                        placeholder='Digite su usuario'
                        placeholderTextColor="#666666"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange(val)}
                        onEndEditing={(e) => textInputChange(e.nativeEvent.text)}
                    />
                    {
                        data.check_textInputChange ?
                            <AnimateTable.View
                                animation="bounceIn">
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </AnimateTable.View>
                            : null
                    }
                </View>
                {
                    data.isValidUser ? null :
                        <AnimateTable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Usuario no puede ser vacio, campo requerido</Text>
                        </AnimateTable.View>
                }

                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color="#315993"
                        size={20}
                    />
                    <TextInput
                        placeholder='Digite su password'
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => handlePasswordChange(val)}
                        onEndEditing={(e) => handlePasswordChange(e.nativeEvent.text)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>
                {
                    data.isValidPassword ? null :
                        <AnimateTable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password no puede ser vacio, campo requerido</Text>
                        </AnimateTable.View>
                }


                <TouchableOpacity onPress={() => { navigation.push('Recuperar Contraseña') }}>
                    <Text style={{ color: '#009387', marginTop: 10 }}>Olvide mi contraseña</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setIsLoading(true)
                            loginHandle(data.username, data.password)
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>INGRESAR</Text>
                    </TouchableOpacity>
                </View>
            </AnimateTable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        height: 45
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderColor: '#315993',
        borderWidth: 1.5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 13,
    },
    button: {
        alignItems: "center",
        backgroundColor: "#b0d357",
        padding: 12,
        marginTop: 10
    },
    signIn: {
        flex: 1,
        height: 50,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    spinnerTextStyle: {
        fontSize: 15,
        color: 'white'
    }
})

export default LoginScreen;