declare module 'react-native-qrcode-svg' {
  import { Component } from 'react';
  interface QRCodeProps {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    [key: string]: unknown;
  }
  export default class QRCode extends Component<QRCodeProps> {}
}
