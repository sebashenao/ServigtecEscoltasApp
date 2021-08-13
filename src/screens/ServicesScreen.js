import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../shared/env'
import Spinner from 'react-native-loading-spinner-overlay';
import Moment from 'moment';

const ServicesScreen = ({ navigation }) => {

    const [data, setData] = React.useState({});
    const [servicios, setServicios] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);


    const consultarServicios = async () => {
        const getToken = await AsyncStorage.getItem('userToken');
        const json = await JSON.parse(getToken);
        setData(json);
        console.log(json);
        const options = {
            method: 'POST',
            body: [],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${json?.access_token}`
            }
        };
        const query = await fetch(`${environment.api}/comisiones/${json?.user?.escolta_id}`, options)
        const res = await query.json();
        setServicios(res.response);
        console.log(servicios?.tipos_novedad);
        console.log(servicios?.tipos_reporte);
        setIsLoading(false);
    }

    // 839247229

    React.useEffect(async () => {
        consultarServicios()
    }, []);

    const lista = servicios?.comisiones?.map((item) => {
        return <TouchableOpacity key={item.numero} style={styles.servicios}
            onPress={() => {
                navigation.push('Servicio',
                    {
                        data: item,
                        tiposNovedad: servicios?.tipos_novedad,
                        tiposReporte: servicios?.tipos_reporte,
                        token: data?.access_token,
                        usuarioId: data?.user?.escolta_id
                    }
                )
            }}>
            <Text style={{ color: 'black', position: 'absolute', right: 5, top: 3 }}>{Moment(item.fecha_solicitud).format('MMMM d, y')}</Text>
            <Text style={{ fontSize: 20, marginBottom: 0 }}>{item.numero}</Text>
            <Text>{item.observaciones}</Text>
            <Text>{item.punto_encuentro}</Text>
            <Text>Puntos de control - reportados: 0/{item.puntos_control.length}</Text>
        </TouchableOpacity>
    })

    return (
        <ScrollView style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Consultando servicios, espere un momento...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor='rgba(0, 0, 0, 0.7)'
            />
            {lista}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20
    },
    servicios: {
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
    }
});

export default ServicesScreen;