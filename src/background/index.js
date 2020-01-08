/* eslint-disable no-undef */
console.log('Background.js LOADED');

/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

browser.runtime.onMessage.addListener(function (message) {
  console.log(message);
});

    // if (chrome.identity == null) {
    //   console.log("user is not registered")
    // }
    // else {
    //   chrome.identity.getProfileUserInfo(function(userInfo) {
    //     console.log(JSON.stringify(userInfo));
    //   });
    // }
