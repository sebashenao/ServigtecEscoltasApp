import React from 'react';
import { launchCamera } from 'react-native-image-picker';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ToastAndroid,
    PermissionsAndroid,
    Platform,
    TextInput,
    FlatList
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
// import RNFetchBlob from 'rn-fetch-blob'
import { environment } from '../shared/env'
import Spinner from 'react-native-loading-spinner-overlay';
import Moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';

const ReportesScreen = ({ navigation, route }) => {

    const [fotos, setFotos] = React.useState([]);
    const [incremento, setIncremento] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [token, setToken] = React.useState('');
    const [comisionId, setComisionId] = React.useState(0);
    const [usuarioId, setUsuarioId] = React.useState(0);
    const [observacion, setObservacion] = React.useState('');
    const [latitud, setLatitud] = React.useState(0);
    const [longitud, setLongitud] = React.useState(0);
    const [direccion, setDireccion] = React.useState('');
    const [tipo, setTipo] = React.useState("");
    const [recording, setRecording] = React.useState(false);

    // AUDIO
    const [recordSecs, setRecordSecs] = React.useState(0);
    const [recordTime, setRecordTime] = React.useState('00:00:00');
    const [currentPositionSec, setCurrentPositionSec] = React.useState(0);
    const [currentDurationSec, setCurrentDurationSec] = React.useState(0);
    const [playTime, setPlayTime] = React.useState('00:00:00');
    const [duration, setDuration] = React.useState('00:00:00');
    const [audio, setAudio] = React.useState('');

    const [audioRecorderPlayer, setAudioRecorderPlayer] = React.useState(new AudioRecorderPlayer());
    audioRecorderPlayer.setSubscriptionDuration(0.1)

    React.useEffect(async () => {
        setToken(route.params.token);
        setComisionId(route.params.comision);
        setUsuarioId(route.params.usuarioId);
        await validarPermisos();
        await obtenerLocalizacion();
    }, []);

    const obtenerLocalizacion = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                setLatitud(position?.coords?.latitude);
                setLongitud(position?.coords?.longitude);
                const address = await Geocoder.geocodePosition({ lat: position?.coords?.latitude, lng: position?.coords?.longitude });
                setDireccion(address[0].formattedAddress);
            },
            (error) => {
                showToastWithGravityAndOffset(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const showToastWithGravityAndOffset = (msg) => {
        ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
        );
    };

    const abrirCamara = async () => {
        validarPermisos()
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            quality: 0.3
        };

        if (fotos.length === 10) {
            showToastWithGravityAndOffset('No puede agregar mas de 10 fotos al reporte');
        }
        else {
            launchCamera(options, response => {
                if (response.assets) {
                    const newFoto = {
                        id: incremento,
                        fileUri: response.assets[0].uri,
                        fileName: response.assets[0].fileName,
                        type: response.assets[0].type
                    };
                    const arrFotos = [...fotos, newFoto];
                    setIncremento(incremento + 1);
                    setFotos(arrFotos)
                }
            });
        }

    };

    const validarPermisos = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                ]);

                // console.log('write external stroage', grants);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.RECORD_AUDIO'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.CAMERA'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.ACCESS_COARSE_LOCATION'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.ACCESS_FINE_LOCATION'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    // console.log('Permissions granted');
                    return true;
                } else {
                    // console.log('All required permissions not granted');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        else {
            // console.log('ENTRO_IOS');
        }
    }

    const upload = async () => {

        try {
            var text = '';
            fotos?.length == 0 && (text += '\nDebe agregar al menos 1 foto a la reporte.');
            audio?.length == 0 && (text += '\nDebe agregar al menos 1 audio a la reporte');
            direccion?.length == 0 && (
                text += '\nCampo ubicacion requerido, validar nuevamente permisos de localizacion.',
                await validarPermisos(),
                await obtenerLocalizacion()
            );
            observacion?.length == 0 && (text += '\nCampo observacion requerido.');

            if (text?.length > 0) {
                showToastWithGravityAndOffset(text);
                setIsLoading(false)
            }
            else {
                let data = [];
                fotos?.map(foto => {
                    const { fileUri, fileName, type } = foto;
                    let file = { name: 'fotos[]', filename: fileName, type: type, data: RNFetchBlob.wrap(fileUri) };
                    data.push(file);
                });

                let audioFile = { name: 'audio', filename: 'hello.mp3', type: 'audio/mpeg', data: RNFetchBlob.wrap(audio) };
                data.push(audioFile);

                data.push({ name: 'comision_id', data: `${comisionId}` })
                data.push({ name: 'fecha_reporte', data: `${Moment(new Date()).format('Y-MM-d H:mm:s')}` });
                data.push({ name: 'usuario_id', data: `${usuarioId}` })
                data.push({ name: 'observaciones', data: `${observacion}` });
                data.push({ name: 'tipo_id', data: `${route.params.tiposReporte?.[0]?.nombre == 'Periódico' && route.params.tiposReporte?.[0]?.id}` });
                data.push({ name: 'longitud', data: `${longitud}` });
                data.push({ name: 'latitud', data: `${latitud}` });
                data.push({ name: 'precision', data: '50' });
                data.push({ name: 'ubicacion', data: `${direccion}` });

                RNFetchBlob.fetch('POST', `${environment.api}/reporte`, {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }, data
                ).then((res) => {
                    const json = JSON.parse(res.data);
                    if (json.error) {
                        showToastWithGravityAndOffset(json.error.mensaje)
                    }
                    else {
                        showToastWithGravityAndOffset('Reporte almacenado con exito.');
                        navigation.goBack()
                    }
                    setIsLoading(false)
                }).catch((err) => { console.log(err); setIsLoading(false) })
            }


        } catch (error) {
            showToastWithGravityAndOffset(JSON.stringify(error));
            setIsLoading(false)
        }
    }

    const onStartRecord = async () => {
        try {
            setRecording(true);
            const dirs = RNFetchBlob.fs.dirs;
            const path = Platform.select({
                ios: 'hello.m4a',
                android: `${dirs.CacheDir}/hello.mp3`,
            });

            const audioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
            };

            const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
            audioRecorderPlayer.addRecordBackListener((e) => {
                setRecordSecs(e.currentPosition);
                setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            });
            setAudio(uri);
        } catch (error) {
            showToastWithGravityAndOffset(error);
        }
    };

    const onStopRecord = async () => {
        setRecording(false);
        const stop = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        // showToastWithGravityAndOffset(stop);
    };

    const onStartPlay = async (e) => {
        // console.log('onStartPlay');
        audioRecorderPlayer.startPlayer(audio);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration) {
                // console.log('finished');
                audioRecorderPlayer.stopPlayer();
            }
            setCurrentPositionSec(e.currentPosition);
            setCurrentDurationSec(e.duration);
            setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
        });
    };

    // const onPausePlay = (e) => {
    //     audioRecorderPlayer.pausePlayer();
    // };

    const onStopPlay = async (e) => {
        // console.log('onStopPlay');
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setPlayTime('00:00:00');
        await onStartPlay()
    };

    const renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <Image key={item.id} source={{ uri: item.fileUri }} style={styles.images} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={isLoading}
                textContent={'Almacenando Reporte, espere un momento...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor='rgba(0, 0, 0, 0.7)'
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 5 }}>Observacion</Text>
            <TextInput
                placeholderTextColor="#EEEEEE"
                style={styles.textArea}
                // autoFocus={true}
                multiline
                numberOfLines={4}
                onChangeText={(val) => setObservacion(val)}
                value={observacion}
                maxLength={200}
            />
            <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center', marginHorizontal: 85 }}>
                <View style={{ alignItems: 'center', margingRight: 100 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{recordTime}</Text>
                    <Text style={{ fontSize: 15 }}>{playTime} / {duration}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                    <TouchableOpacity
                        style={{
                            marginHorizontal: 5,
                            width: 47,
                            height: 47,
                            backgroundColor: 'red',
                            borderRadius: 50,
                        }}
                        onPress={() => {
                            recording ? onStopRecord() : onStartRecord()
                        }}>
                        <FontAwesome
                            style={{ marginHorizontal: 18, marginVertical: 15 }}
                            name="microphone"
                            color="white"
                            size={16}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            marginHorizontal: 5,
                            alignItems: 'center',
                            width: 47,
                            height: 47,
                            backgroundColor: 'red',
                            borderRadius: 50
                        }}
                        onPress={async () => { await onStopPlay() }}>
                        <FontAwesome
                            style={{ marginHorizontal: 15, marginVertical: 15 }}
                            name="play"
                            color="white"
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => { abrirCamara() }}
                style={styles.buttonFoto}
            >
                <FontAwesome
                    name="camera"
                    color="white"
                    size={15}
                />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>TOMAR FOTO</Text>
            </TouchableOpacity>
            <FlatList
                data={fotos}
                renderItem={renderItem}
                horizontal={true}
                keyExtractor={(item, index) => index}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setIsLoading(true)
                    upload()
                }}
            >
                <FontAwesome
                    name="save"
                    color="white"
                    size={20}
                />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>ALMACENAR NOVEDAD</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 20,
        marginHorizontal: 10
    },
    textInput: {
        borderColor: '#DEDEDE',
        borderWidth: 1.5,
        borderRadius: 10
    },
    textArea: {
        borderColor: '#DEDEDE',
        borderWidth: 1.5,
        borderRadius: 10,
        justifyContent: "flex-start",
        textAlignVertical: 'top'
    },
    images: {
        width: 370,
        height: 370,
        marginHorizontal: 2,
        marginVertical: 24,
    },
    spinnerTextStyle: {
        fontSize: 15,
        color: 'white'
    },
    button: {
        alignItems: "center",
        backgroundColor: "#315993",
        padding: 12,
        marginTop: 10
    },
    buttonFoto: {
        alignItems: "center",
        backgroundColor: "#315993",
        padding: 12,
        marginVertical: 5
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        // paddingBottom: 100,
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
});

export default ReportesScreen;