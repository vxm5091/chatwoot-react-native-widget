import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';


// declare module '@chatwoot/react-native-widget' {

  export interface ChatWootUser {
    identifier?: string;
    name?: string;
    avatar_url?: string;
    email?: string;
    identifier_hash?: string;
  }

  export interface ChatWootWidgetProps {
    websiteToken: string;
    locale?: string;
    baseUrl: string;
    closeModal: () => void;
    isModalVisible: boolean;
    user?: ChatWootUser;
    // This can actually be any object
    customAttributes?: Record<string, unknown>;
    containerStyles?: StyleProp<ViewStyle>
    coverScreen?: boolean;
  }

  
declare class ChatWootWidget extends React.Component<ChatWootWidgetProps, any> { }  
export default ChatWootWidget;

