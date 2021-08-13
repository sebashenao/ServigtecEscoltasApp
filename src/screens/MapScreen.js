import React from "react";
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const MapScreen = ({ navigation, route }) => {
    const { setOptions } = useNavigation();
    const [coordenadas, setCoordenadas] = React.useState({});

    React.useEffect(async () => {
        setOptions({ title: `${route.params.data.departamento_nombre} (${route.params.data.lugar})` });
        let data = {
            latitud: route.params.data.latitud,
            longitud: route.params.data.longitud,
            radio: route.params.data.radio
        }
        setCoordenadas(data);
    }, []);

    const script = `
    (function() {
        document.dispatchEvent(new MessageEvent('message', {
          data: ${JSON.stringify(coordenadas)}
        }));
      })();
    `
    return (
        <WebView
            source={{ uri: 'file:///android_asset/map/index.html' }}
            injectedJavaScript={script}
        />
    )
}

export default MapScreen;