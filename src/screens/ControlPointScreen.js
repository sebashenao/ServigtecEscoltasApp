import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ControlPointScreen = ({ navigation, route }) => {

    const { setOptions } = useNavigation();
    const [puntos, setPunto] = React.useState({});
    const [comisionId, setComisionId] = React.useState(0);

    React.useEffect(async () => {
        setOptions({ title: `Servicio #${route.params.data.numero}` });
        setPunto(route.params.data);
        setComisionId(route.params?.data?.puntos_control[0]?.comision_id);
    }, []);

    const puntoControl = puntos?.puntos_control?.map((item) => {
        return <TouchableOpacity key={item.id} style={styles.puntoControl}
            onPress={() => { navigation.push('Mapa', { data: item }) }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.departamento_nombre}</Text>
            <Text>{item.lugar}</Text>
        </TouchableOpacity>
    })

    return (
        <View style={styles.container}>
            <ScrollView>
                {puntoControl}
            </ScrollView>
            <TouchableOpacity style={styles.btnAddNovedad} onPress={() => {
                navigation.push('Novedades',
                    {
                        token: route?.params?.token,
                        comision: comisionId,
                        usuarioId: route?.params?.usuarioId,
                        tiposNovedad: route?.params?.tiposNovedad,
                        tiposReporte: route?.params?.tiposReporte
                    }
                )
            }}>
                <AntDesign
                    name="addfile"
                    color="white"
                    size={25}
                />
                <Text style={{ fontSize: 18, color: 'white'}}> Novedad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAddReporte} onPress={() => {
                navigation.push('Reportes',
                    {
                        token: route?.params?.token,
                        comision: comisionId,
                        usuarioId: route?.params?.usuarioId,
                        tiposNovedad: route?.params?.tiposNovedad,
                        tiposReporte: route?.params?.tiposReporte
                    }
                )
            }}>
                <AntDesign
                    name="addfile"
                    color="white"
                    size={25}
                />
                <Text style={{ fontSize: 18, color: 'white'}}> Reporte</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        height: '100%'
    },
    puntoControl: {
        marginVertical: 10,
        marginHorizontal: 20,
        borderWidth: 2,
        opacity: 0.5,
        padding: 12,
        borderColor: '#315993'
    },
    spinnerTextStyle: {
        fontSize: 15,
        color: 'white'
    },
    btnAddNovedad: {
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        right: 15,
        borderColor: '#b0d357',
        backgroundColor: '#b0d357',
        borderWidth: 1,
        width: 120,
        padding: 12,
        borderRadius: 50
    },
    btnAddReporte: {
        position: 'absolute',
        bottom: 70,
        alignItems: 'center',
        flexDirection: 'row',
        right: 15,
        borderColor: 'red',
        backgroundColor: 'red',
        borderWidth: 1,
        width: 120,
        padding: 10,
        borderRadius: 50
    }
});

export default ControlPointScreen;