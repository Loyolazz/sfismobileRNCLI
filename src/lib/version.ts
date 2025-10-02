import { Linking } from "react-native";
import { Toast } from "toastify-react-native";

import { getVersion as fetchVersion } from "../api/operations/getVersion";
import appInfo from "../../package.json";

//DES
const APK_HOST = "http://10.61.0.40";
const APK_PATH = "/Sistemas/SFISMobile/apk";
const APK_NAME = "SFISMobile";

//MAQUINA CRISPIM
// const APK_HOST = "http://10.212.134.8";
// const APK_PATH = "/Sistemas/SFISMobile/apk";
// const APK_NAME = "SFISMobile";

//HMG
// const APK_HOST = "https://sistemasinternet3hmg.antaq.gov.br";
// const APK_PATH = "/Sistemas/SFISMobile/apk-trainee";
// const APK_NAME = "SFISMobile";

//PRD
// const APK_HOST = "https://web3.antaq.gov.br";
// const APK_PATH = "/Sistemas/SFISMobile";
// const APK_NAME = "SFISMobile";

export function getAppVersion() {
    return appInfo.version ?? "1.2.11";
}

export function getBuildNumber() {
    return (appInfo as any)?.buildNumber ?? "";
}

export async function ensureLatestVersion() {
  const current = getAppVersion();
  const latest = await fetchVersion();

  console.log("Versão atual do app:", current);
  console.log("Versão disponibilizada pela API:", latest);

  if (latest && latest !== current) {
    Toast.error("Versão desatualizada. Baixe a versão mais recente.");
    const url = `${APK_HOST}${APK_PATH}/${APK_NAME}-${latest}.apk`;
    await Linking.openURL(url);
    return false;
  }
  return true;
}
