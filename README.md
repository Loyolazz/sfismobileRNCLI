# SFIS Mobile

Este repositório contém o aplicativo mobile da SFIS construído com React Native e TypeScript. Este README documenta como preparar o ambiente, executar o projeto localmente e gerar um pacote APK para distribuição interna.

## 📄 Visão geral do projeto
- **Framework**: React Native (CLI)
- **Linguagem**: TypeScript
- **Gerenciador de pacotes**: npm
- **Plataformas**: Android e iOS

## 📝 Pré-requisitos
Certifique-se de ter os seguintes softwares instalados:

1. **Node.js 18 LTS** ou superior e **npm** (instalado junto com o Node).
2. **Java Development Kit (JDK) 17** para builds Android.
3. **Android Studio** (ou apenas o Android SDK e emuladores), com as seguintes dependências instaladas:
   - Android SDK Platform 34 (Android 14) ou a plataforma alvo do projeto.
   - Android SDK Build-Tools 34.0.0 ou mais recente.
   - Android Emulator (opcional, apenas se for usar emulador).
4. **Watchman** (macOS) para melhor desempenho de hot reload.
5. **CocoaPods** (apenas macOS) para builds iOS: `sudo gem install cocoapods`.

> 📊 **Dica**: Use o guia oficial da React Native para preparar seu ambiente se estiver configurando tudo pela primeira vez: https://reactnative.dev/docs/environment-setup

## 🔍 Configurações iniciais
1. Instale as dependências JavaScript:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` (se necessário) com as variáveis do projeto. Consulte a equipe caso haja um modelo.
3. (Opcional) Execute `npm audit fix` para corrigir eventuais vulnerabilidades menores.

## 🔄 Executar o app em desenvolvimento
### 1. Inicie o Metro Bundler
```bash
npm start
```
Deixe essa aba do terminal aberta. O Metro é o empacotador que compila o JavaScript em tempo real.

### 2. Executar no Android
Em uma nova aba do terminal:
```bash
npm run android
```
Isso irá:
- Compilar o aplicativo.
- Instalar a versão debug no dispositivo/emulador conectado.
- Abrir o app automaticamente.

> 📢 Certifique-se de ter um emulador Android ativo ou um dispositivo físico com **depuração USB** habilitada.

### 3. Executar no iOS (somente macOS)
1. Instale as dependências nativas:
   ```bash
   cd ios
   bundle install        # apenas na primeira vez
   bundle exec pod install
   cd ..
   ```
2. Com o Metro rodando, execute:
   ```bash
   npm run ios
   ```

## 🛠 Scripts úteis
- `npm run lint`: verifica padrões de código.
- `npm test`: executa testes unitários (Jest).
- `npm run android -- --variant=release`: gera um build release diretamente pelo React Native CLI.

## 💻 Gerar APK release (Android)
Para distribuir internamente via APK, siga estes passos:

1. **Gerar/instalar a keystore** (uma única vez):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/sfis-release-key.keystore \
     -alias sfisrelease -keyalg RSA -keysize 2048 -validity 10000
   ```
   Guarde a senha e adicione a keystore ao `.gitignore`. Compartilhe a senha somente com pessoas autorizadas.

2. **Configurar as credenciais** em `android/gradle.properties` (crie se não existir):
   ```properties
   SFIS_RELEASE_STORE_FILE=sfis-release-key.keystore
   SFIS_RELEASE_KEY_ALIAS=sfisrelease
   SFIS_RELEASE_STORE_PASSWORD=sua_senha
   SFIS_RELEASE_KEY_PASSWORD=sua_senha
   ```

3. **Atualizar** `android/app/build.gradle` (se ainda não estiver configurado) adicionando dentro de `android { signingConfigs { ... } }`:
   ```gradle
   signingConfigs {
       release {
           if (project.hasProperty("SFIS_RELEASE_STORE_FILE")) {
               storeFile file(SFIS_RELEASE_STORE_FILE)
               storePassword SFIS_RELEASE_STORE_PASSWORD
               keyAlias SFIS_RELEASE_KEY_ALIAS
               keyPassword SFIS_RELEASE_KEY_PASSWORD
           }
       }
   }

   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled false
           shrinkResources false
           proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
       }
   }
   ```

4. **Gerar o APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. O APK será criado em `android/app/build/outputs/apk/release/app-release.apk`. Copie esse arquivo para o local desejado e distribua.

> 💬 **Nota**: Para publicar na Play Store, é recomendado gerar um **Android App Bundle (AAB)** usando `./gradlew bundleRelease`.

## 📦 Gerar IPA (iOS)
Para distribuição iOS é necessário ter uma conta Apple Developer e um Mac. Em linhas gerais:
1. Abra `ios/SFISMobile.xcworkspace` no Xcode.
2. Configure o `Signing & Capabilities` com o time da SFIS.
3. Selecione o esquema `Release` e um dispositivo genérico iOS.
4. Em **Product > Archive**, gere o artefato.
5. Use o **Organizer** do Xcode para exportar um `.ipa` para distribuição interna ou enviar para a App Store Connect.

## 📂 Estrutura de pastas (resumo)
```
.
├── App.tsx              # Ponto de entrada principal
├── src/                 # Código-fonte do aplicativo
├── assets/              # Imagens e fontes
├── android/             # Projeto nativo Android
├── ios/                 # Projeto nativo iOS
├── __tests__/           # Testes unitários (Jest)
└── package.json         # Configurações e scripts do npm
```

## 💬 Suporte
- Use o Slack/Teams interno para dúvidas rápidas.
- Crie issues neste repositório para bugs ou melhorias.
- Documente decisões arquiteturais importantes e mantenha este README atualizado.

Bom desenvolvimento! 💪
