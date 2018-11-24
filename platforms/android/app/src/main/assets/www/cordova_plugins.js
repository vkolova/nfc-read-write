cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.blackberry.invoke.client",
    "file": "plugins/com.blackberry.invoke/www/client.js",
    "pluginId": "com.blackberry.invoke",
    "clobbers": [
      "blackberry.invoke"
    ]
  },
  {
    "id": "com.chariotsolutions.nfc.plugin.NFC",
    "file": "plugins/com.chariotsolutions.nfc.plugin/www/phonegap-nfc.js",
    "pluginId": "com.chariotsolutions.nfc.plugin",
    "runs": true
  },
  {
    "id": "org.apache.cordova.device.device",
    "file": "plugins/org.apache.cordova.device/www/device.js",
    "pluginId": "org.apache.cordova.device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "org.apache.cordova.vibration.notification",
    "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
    "pluginId": "org.apache.cordova.vibration",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-x-toast.Toast",
    "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
    "pluginId": "cordova-plugin-x-toast",
    "clobbers": [
      "window.plugins.toast"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com.blackberry.invoke": "1.0.0",
  "com.chariotsolutions.nfc.plugin": "0.4.6",
  "org.apache.cordova.device": "0.2.4",
  "org.apache.cordova.vibration": "0.3.4",
  "cordova-plugin-dialogs": "2.0.1",
  "cordova-plugin-x-toast": "2.7.2"
};
// BOTTOM OF METADATA
});