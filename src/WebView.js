import React, { useRef, useState, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { isJsonString, storeHelper, generateScripts, getMessage } from './utils';

const propTypes = {
  websiteToken: PropTypes.string.isRequired,
  baseUrl: PropTypes.string.isRequired,
  cwCookie: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    email: PropTypes.string,
    identifier_hash: PropTypes.string,
  }),
  locale: PropTypes.string,
  customAttributes: PropTypes.shape({}),
  closeModal: PropTypes.func,
};

const defaultProps = {
  cwCookie: '',
  user: {},
  locale: 'en',
  customattributes: {},
};

const WebViewComponent = ({
  baseUrl,
  websiteToken,
  cwCookie,
  locale,
  user,
  customAttributes,
  closeModal,
}) => {
  let widgetUrl = `${baseUrl}/widget?website_token=${websiteToken}&locale=en`;
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  if (cwCookie) {
    widgetUrl = `${widgetUrl}&cw_conversation=${cwCookie}`;
  }
  const injectedJavaScript = generateScripts({
    user,
    locale,
    customAttributes,
  });

  
  
  const handleGoBack = () => {
    webViewRef.current.goBack();
  }

  const renderBackButton = useMemo(() => {
    if (!canGoBack) return null;
    return (<Pressable onPress={handleGoBack} style={styles.button}>
      <Text style={styles.buttonLabel}>{"<"}</Text>
    </Pressable>)
  })

  return (
    <WebView
      source={{
        uri: widgetUrl,
      }}
      onMessage={(event) => {
        const { data } = event.nativeEvent;
        const message = getMessage(data);
        if (isJsonString(message)) {
          const parsedMessage = JSON.parse(message);
          const { event: eventType, type } = parsedMessage;
          if (eventType === 'loaded') {
            const {
              config: { authToken },
            } = parsedMessage;
            storeHelper.storeCookie(authToken);
          }
          if (type === 'close-widget') {
            closeModal();
          }
        }
      }}
      scalesPageToFit
      useWebKit
      sharedCookiesEnabled
      javaScriptEnabled={true}
      domStorageEnabled={true}
      // !this doesn't point to anything
      style={styles.modal}
      injectedJavaScript={injectedJavaScript}
      scrollEnabled
      allowsBackForwardNavigationGestures
      ref={webViewRef}
      onNavigationStateChange={(navState) => {
        setCanGoBack(navState.canGoBack);
      }}
    >
      {renderBackButton}
    </WebView>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    // borderRadius: 4,
    overflow: 'hidden',
    position: "relative",
  },
  button: {
    height: 32,
    width: 32,
    borderRadius: 24,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    position: "absolute",
    top: 24,
    left: 24,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#EEEEEE",
    textAlignVertical: "center"
  }
});
WebViewComponent.defaultProps = defaultProps;
WebViewComponent.propTypes = propTypes;
export default WebViewComponent;
