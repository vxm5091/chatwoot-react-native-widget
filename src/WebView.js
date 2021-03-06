import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { isJsonString, storeHelper, generateScripts } from './utils';
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
};

const defaultProps = {
  cwCookie: '',
  user: {},
  locale: 'en',
  customattributes: {},
};

const WebViewComponent = ({ baseUrl, websiteToken, cwCookie, locale, user, customAttributes }) => {
  let widgetUrl = `${baseUrl}/widget?website_token=${websiteToken}&locale=en`;

  if (cwCookie) {
    widgetUrl = `${widgetUrl}&cw_conversation=${cwCookie}`;
  }
  const injectedJavaScript = generateScripts({
    user,
    locale,
    customAttributes,
  });
  return (
    <WebView
      source={{
        uri: widgetUrl,
      }}
      onMessage={(event) => {
        const { data } = event.nativeEvent;
        if (isJsonString(data)) {
          const { type, value } = JSON.parse(data);
          if (type === 'auth-token') {
            storeHelper.storeCookie(value);
          }
        }
      }}
      scalesPageToFit
      useWebKit
      sharedCookiesEnabled
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={styles.WebViewStyle}
      injectedJavaScript={injectedJavaScript}
      scrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
WebViewComponent.defaultProps = defaultProps;
WebViewComponent.propTypes = propTypes;
export default WebViewComponent;