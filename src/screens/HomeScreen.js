import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../components/context';

const HomeScreen = ({ navigation }) => {

    const { signOut } = React.useContext(AuthContext);
    const [data, setData] = React.useState({});

    React.useEffect(async () => {
        const getToken = await AsyncStorage.getItem('userToken');
        const json = await JSON.parse(getToken);
        setData(json);
    }, []);

    return (
        <View style={styles.container}>
            {/* <Image source={require('../../assets/avatar.png')} /> */}
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{data?.user?.nombres} {data?.user?.apellidos}</Text>
            <Text style={{marginBottom: 30}}>{data?.user?.email}</Text>
            <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet sint minus,
                provident commodi aliquam quos
                laboriosam labore ipsum. Fuga similique accusantium molestias voluptatem? Quis quam magnam nisi dignissimos,
                corporis voluptate!</Text>
            <TouchableOpacity style={styles.button}
                onPress={signOut}>
                <Text
                    style={{ color: 'white', fontWeight: 'bold' }}>CERRAR SESION</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20
    },
    button: {
        alignItems: "center",
        backgroundColor: "#b0d357",
        padding: 12,
        marginTop: 20
    }
})

export default HomeScreen;