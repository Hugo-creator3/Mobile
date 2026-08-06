import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'VIRTUALID_MOBILE',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlay: true,
      backgroundColor: '#00000000',
      style: 'LIGHT'
    }
  }
};

export default config;