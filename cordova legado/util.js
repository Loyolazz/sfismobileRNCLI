var version = "1.2.11";
//var version = "1.2.10-trainee";

var mensagemVersaoTrainee = '';
var configNomeAPK = 'SFISMobile';
//var mensagemVersaoTrainee = ' no ambiente de testes';
//var configNomeAPK = 'FiscalTrainee';

var versionAPK = '';
var NomeArquivoNotificacao = '';
var ManterConexaoApp = '';

function av_get() {
    return angular.fromJson(sessionStorage.getItem('arIrregularidadeAvulsa') || '[]');
}

function av_set(lista) {
    sessionStorage.setItem('arIrregularidadeAvulsa', angular.toJson(lista));
}

function av_add(irregularidade) {
    let lista = av_get();
    mergeIrregularidade(lista, irregularidade);
    av_set(lista);
}

function av_remove(id) {
    let lista = av_get().filter(function (item) { return item.IDIrregularidade !== id; });
    av_set(lista);
}

function ck_get() {
    return angular.fromJson(sessionStorage.getItem('arIrregularidadeChecklist') || '[]');
}

function ck_set(lista) {
    sessionStorage.setItem('arIrregularidadeChecklist', angular.toJson(lista));
}

function ck_addMany(itens) {
    let lista = ck_get();
    angular.forEach(itens, function (item) {
        mergeIrregularidade(lista, item);
    });
    ck_set(lista);
}

function ck_removeByIds(ids) {
    let lista = ck_get().filter(function (item) {
        return ids.indexOf(item.IDIrregularidade) === -1;
    });
    ck_set(lista);
}

function mergeIrregularidade(lista, novo) {
    if (!novo) return;
    let existente = lista.find(function (i) { return i.IDIrregularidade === novo.IDIrregularidade; });
    if (existente) {
        if (!existente.descricaoFato && novo.descricaoFato) {
            existente.descricaoFato = novo.descricaoFato;
        }
        if (!existente.acao && novo.acao) {
            existente.acao = novo.acao;
            existente.prazo = novo.prazo;
        }
        existente.evidencias = existente.evidencias || [];
        angular.forEach(novo.evidencias || [], function (ev) {
            if (!existente.evidencias.some(function (e) { return e.imagem === ev.imagem; })) {
                existente.evidencias.push(ev);
            }
        });
    } else {
        lista.push(angular.copy(novo));
    }
}

// Local
// var configUrlService = 'http://localhost/AntaqService/Services.asmx/';
// var configUrlAPK = 'http://10.61.0.40';
// var configPathAPK = '/Sistemas/SFISMobile/apk';

// DES
 var configUrlService = 'https://sfismobile.antaq.gov.br/AntaqService/Services.asmx/';
 var configUrlAPK = 'http://10.61.0.40';
 var configPathAPK = '/Sistemas/SFISMobile/apk';

// MAQUINA CRISPIMM
// var configUrlService = 'http://10.212.134.27/AntaqService/Services.asmx/';
// var configUrlAPK = 'http://10.212.134.27';
// var configPathAPK = '/Sistemas/SFISMobile/apk';

// HMG TRAINEE
// var configUrlService = 'https://10.111.2.68/AntaqServiceTRN/Services.asmx/';
// var configUrlAPK = 'https://sistemasinternet3hmg.antaq.gov.br';
// var configPathAPK = '/Sistemas/SFISMobile/apk-trainee';

// PRD OLD
// var configUrlService = 'http://apiprd.antaq.gov.br/AntaqService/Services.asmx/';
// var configUrlAPK = 'http://web.antaq.gov.br';
// var configPathAPK = '/Sistemas/SFISMobile';

// PRD ERRO PDF;
// var configUrlService = 'https://apiprd.antaq.gov.br/AntaqService/Services.asmx/';
// var configUrlAPK = 'https://web3.antaq.gov.br';
// var configPathAPK = '/Sistemas/SFISMobile';

// PRD NOVO;
// var configUrlService = 'https://web3.antaq.gov.br/AntaqService/Services.asmx/';
// var configUrlAPK = 'https://web3.antaq.gov.br';
// var configPathAPK = '/Sistemas/SFISMobile';


var SomenteConsulta = false;

function getMensagemVersaoTrainee(textoPrefixo, textoSufixo) {
    return (textoPrefixo || '') + mensagemVersaoTrainee + (textoSufixo || '');
}

function urlService() {
    //armazena o endereço do serviço
    return configUrlService;
}

function urlAPK() {
    return configUrlAPK;
}

function nomeAPK() {
    return configNomeAPK;
}

function getVersion($scope, $http) {
    $http({
        url: urlService() + 'GetVersion',
        method: "POST",
        data: {},
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(function (response) {
        console.log("Versão APP:" + version);
        console.log("Versão WS:" + response.data.d);
        versionAPK = response.data.d;
        if (response.data.d !== version) {

            var elemento = $("#modal");
            var instance = M.Modal.getInstance(elemento);
            instance.open();
        }
    }, function (response) {
        console.log(response.data.Message);

    });
    return version;
}

function getVersionSplash($scope, $http) {

    $http({
        url: urlService() + 'GetVersion',
        method: "POST",
        data: {}
    })
        .then(function (response) {
                console.log("Versão APP:" + version);
                console.log("Versão WS:" + response.data.d);
                versionAPK = response.data.d;
                if (response.data.d !== version) {
                    window.location = "index.html";
                }
            },
            function (response) { // optional
                console.log(response.data.Message);

            });
    return version;
}

function baixarAPK() {

    var fileURL = cordova.file.externalApplicationStorageDirectory + "Download/" + nomeAPK() + "-" + versionAPK + ".apk";

    //Concedeu permissão
    $("#DownloadAtt").hide();

    var fileTransfer = new FileTransfer();
    //PRD
    // url antiga (com erro na pasta /apk)
    //var uri = encodeURI(urlAPK() + "/Sistemas/SFISMobile/apk/SFISMobile-" + versionAPK + ".apk");
    var uri = encodeURI(urlAPK() + configPathAPK + "/" + nomeAPK() + "-" + versionAPK + ".apk");
    console.log('Uri', uri)
    $("#ProgressoDownload")[0].innerText = "Baixando atualização...";

    fileTransfer.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
            $("#ProgressoDownload")[0].innerText = "Baixando atualização " + Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%";
        }
    };

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download completo: " + entry.toURL());

            instalarApk(entry.toURL());
        },
        function (error) {
            $("#DownloadAtt").show();
            var mensagem = '<span>Error:' + error.source + ' entre em contato com a GPF.</span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3"});

            mensagem += '<span>Error Code:' + error.code + ' entre em contato com a GPF.</span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3"});

            mensagem += '<span>Error Target:' + error.target + ' entre em contato com a GPF.</span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3"});

            console.log("download erro código " + error.source);
            console.log("download erro target " + error.target);
            console.log("download erro code" + error.code);
        }, false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
}

function instalar(filename) {
    try {
        var contentType = 'application/vnd.android.package-archive';
        cordova.plugins.fileOpener2.open(
            filename,
            contentType, {
                error: function () {
                    var mensagem = '<span>Arquivo não encontrado, entre em contato com a GPF.</span>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3"});
                    $("#DownloadAtt").show();
                },
                success: function () {
                }
            }
        )
    } catch (error) {
        logErro('instalar', error.message, JSON.stringify({'filename': filename}));
    }
}

function instalarApk(filename) {
    cordova.plugins.fileOpener2.open(
        filename,
        'application/vnd.android.package-archive', {
            error: function (error) {
                var mensagem = '<p>Tentando abrir ' + filename + '</p>';
                M.toast({html: mensagem, classes: "#c62828 red darken-3"});

            },
            success: function () {
                console.log('file opened successfully');
            }
        }
    );
}

function validaEmbarcacao(empresa, linkEmbarcacao, linkTerminal) {
    // body...
    if (empresa.QTDEmbarcacao <= 0) {
        return linkTerminal;
    } else {
        return linkEmbarcacao;
    }
}
verificaAutorizacao,
function validaEmbarcacao_old(empresa, linkEmbarcacao, linkTerminal) {
    // body...
    if (!empresa.QTDEmbarcacao) {
        return linkTerminal;
    } else {
        return linkEmbarcacao;
    }
}

function verificaAutorizacao($scope, key, options) {

    var linkEmbarcacao = "empresa.trecho.html";
    var linkTerminal = "empresa.geo.html";
    var iconeEmbarcacao = 'img/icon-embarca.png';
    var iconeTerminal = 'img/icon-terminal.png';
    var operadorPortuario = 'img/icone-operario.png';

    //warley - acrescentado em 30/05/2019
    var linkEmbarcacaoTravessia = "empresa.embarcacao.html"; //"empresa.trecho.html";

    var modalidade = removerAcentos($scope.empresas[key].Modalidade);
    $scope.empresas[key].IDTipoInstalacaoPortuaria = '';

    switch (modalidade) {
        case 'Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario, Cabotagem, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //$scope.empresas[key].superintendencia = "15";
            //$scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Apoio Maritimo, Longo Curso, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //$scope.empresas[key].superintendencia = "15";
            //$scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Longo Curso, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //$scope.empresas[key].superintendencia = "15";
            //$scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario, Cabotagem':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Maritimo, Apoio Portuario, Cabotagem, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Apoio Maritimo, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Apoio Portuario, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Apoio Maritimo, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Apoio Maritimo, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Longo Curso, Apoio Maritimo, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Apoio Maritimo, Cabotagem':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Cabotagem, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Apoio Maritimo, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Apoio Maritimo, Longo Curso, Apoio Portuário':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Apoio Portuario, Apoio Maritimo':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Cabotagem':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Longo Curso':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Cabotagem, Longo Curso, Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Embarcacao em Construcao':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.11";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Longitudinal de Carga':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "1558";
            $scope.empresas[key].assunto = "421.3";
            //   $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Longitudinal de Passageiros':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "912";
            $scope.empresas[key].assunto = "421.3";
            //   $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Longitudinal Misto':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "912";
            $scope.empresas[key].assunto = "421.3";
            //   $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Travessia':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacaoTravessia, linkTerminal);
            ;
            //$scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "1274";
            $scope.empresas[key].assunto = "421.3";
            //  $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Travessia de Carga':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "1274";
            $scope.empresas[key].assunto = "421.3";
            //  $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Travessia de Passageiros':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "1274";
            $scope.empresas[key].assunto = "421.3";
            //  $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            // $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Travessia de Veiculos':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "1274";
            $scope.empresas[key].assunto = "421.3";
            //  $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Afretamento':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "330";
            //   $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Apoio Portuario':
            $scope.empresas[key].link = validaEmbarcacao($scope.empresas[key], linkEmbarcacao, linkTerminal);
            ;
            $scope.empresas[key].icone = iconeEmbarcacao;
            $scope.empresas[key].norma = "RN 18";
            $scope.empresas[key].assunto = "421.2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            break;
        case 'Arrendamento':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Arrendamento (Sob Liminar)':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            // $scope.empresas[key].superintendencia = "15";
            // $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Arrendamento e Operador Portuario':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Contrato de Transicao':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Contrato de Transicao e Operador Portuario':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Contrato de Uso Temporario':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "7";
            //  $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Estacao de transbordo de cargas':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "3";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Instalacao portuaria de turismo':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "5";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case "Operador Portuario":
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = operadorPortuario;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "6";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Porto Publico':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Estaleiro ate 1.000 TPB':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Estaleiro':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            $scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Instalacao de apoio':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "8";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Instalacao portuaria publica de pequeno porte':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "8";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Instalacao para transferencia de petroleo':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.11";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Instalacao rudimentar':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Registro - Instalacao temporaria':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "RN 13";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "1";
            // $scope.empresas[key].superintendencia = "15";
            //   $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        case 'Terminal de uso privado':
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.12";
            $scope.empresas[key].IDTipoInstalacaoPortuaria = "2";
            //  $scope.empresas[key].superintendencia = "15";
            //  $scope.empresas[key].SGsuperintendencia = "SPO";
            //$scope.empresas[key].NRInstrumento = "TA - " + $scope.empresas[key].NRInstrumento;
            $scope.empresas[key].NRInstrumento = $scope.empresas[key].NRInstrumento;
            break;
        default:
            $scope.empresas[key].link = linkTerminal;
            $scope.empresas[key].icone = iconeTerminal;
            $scope.empresas[key].norma = "3274";
            $scope.empresas[key].assunto = "421.11";

        //  $scope.empresas[key].superintendencia = "15";
        // $scope.empresas[key].SGsuperintendencia = "SPO";
    }
    return $scope;
}

function setSuperintendencia(area) {
    var retorno;
    if (area == 'Interior') {
        return {'Identificador': '91', 'sigla': 'SNI'};

    } else if (area == 'Maritima') {
        return {'Identificador': '90', 'sigla': 'SNM'};

    } else {
        return {'Identificador': '15', 'sigla': 'SPO'};

    }
}

function setUfs(sortBy) {
    let result = [
        {"nome": "Acre", "uf": "AC"},
        {"nome": "Alagoas", "uf": "AL"},
        {"nome": "Amapá", "uf": "AP"},
        {"nome": "Amazonas", "uf": "AM"},
        {"nome": "Bahia", "uf": "BA"},
        {"nome": "Ceará", "uf": "CE"},
        {"nome": "Distrito Federal", "uf": "DF"},
        {"nome": "Espírito Santo", "uf": "ES"},
        {"nome": "Goiás", "uf": "GO"},
        {"nome": "Maranhão", "uf": "MA"},
        {"nome": "Mato Grosso", "uf": "MT"},
        {"nome": "Mato Grosso do Sul", "uf": "MS"},
        {"nome": "Minas Gerais", "uf": "MG"},
        {"nome": "Pará", "uf": "PA"},
        {"nome": "Paraíba", "uf": "PB"},
        {"nome": "Paraná", "uf": "PR"},
        {"nome": "Pernambuco", "uf": "PE"},
        {"nome": "Piauí", "uf": "PI"},
        {"nome": "Rio de Janeiro", "uf": "RJ"},
        {"nome": "Rio Grande do Norte", "uf": "RN"},
        {"nome": "Rio Grande do Sul", "uf": "RS"},
        {"nome": "Rondônia", "uf": "RO"},
        {"nome": "Roraima", "uf": "RR"},
        {"nome": "Santa Catarina", "uf": "SC"},
        {"nome": "São Paulo", "uf": "SP"},
        {"nome": "Sergipe", "uf": "SE"},
        {"nome": "Tocantins", "uf": "TO"}
    ];
    if (sortBy && sortBy === 'uf') {
        result = result.sort((a, b) => (a.uf > b.uf) ? 1 : ((b.uf > a.uf) ? -1 : 0));
    }
    return result;
}

/**
 * Remove acentos de caracteres
 * @param  {String} stringComAcento [string que contem os acentos]
 * @return {String}                 [string sem acentos]
 */
function removerAcentos(newStringComAcento) {
    var string = newStringComAcento;
    var mapaAcentosHex = {
        a: /[\xE0-\xE6]/g,
        A: /[\xC0-\xC6]/g,
        e: /[\xE8-\xEB]/g,
        E: /[\xC8-\xCB]/g,
        i: /[\xEC-\xEF]/g,
        I: /[\xCC-\xCF]/g,
        o: /[\xF2-\xF6]/g,
        O: /[\xD2-\xD6]/g,
        u: /[\xF9-\xFC]/g,
        U: /[\xD9-\xDC]/g,
        c: /\xE7/g,
        C: /\xC7/g,
        n: /\xF1/g,
        N: /\xD1/g

    };

    for (var letra in mapaAcentosHex) {
        var expressaoRegular = mapaAcentosHex[letra];
        string = string.replace(expressaoRegular, letra);
    }

    return string;
}

function isEmpty(value) {
    return (!value || value.trim() === '');
}

function preloaderStop() {
    endStep();
    var myEl = angular.element(document.querySelector('#preloader'));
    myEl.remove();
}

function preloaderStopAll() {
    endStep();
    let elm = document.querySelector('#preloader');
    while (elm) {
        var myEl = angular.element(document.querySelector('#preloader'));
        myEl.remove();
        elm = document.querySelector('#preloader');
    }
}

function preloadInit(mensagem) {
    preloaderStop();

    var myEl = angular.element(document.querySelector('body'));

    if (!mensagem) {
        mensagem = "Carregando Dados";
    }

    if (preloadInit) {
        //myEl.append('<div style="margin-left: 45%;">');
        myEl.append('<div id="preloader" style="text-align: center;" class="preloader"><p class="mensagem-preloader">' + mensagem + '</p><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><div id="preloader-fundo" class="preloader-fundo"></div></div>');
        //myEl.append('</div>');
    } else {
        //myEl.append('<div style="margin-left: 45%;">');
        myEl.append('<div id="preloader" style="text-align: center;" class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><div id="preloader-fundo" class="preloader-fundo"></div>');
        //myEl.append('</div>');
    }
}

function initStep(nrEtapas, mensagemInicial, mensagemFinal) {
    if (document.querySelectorAll("body .stepbar").length > 0) {
        angular.element(document.querySelector('body .stepbar')).remove();
    }
    angular.element(document.querySelector('body')).append('<div class="stepbar hide-stepbar"><div class="stepbar-nav"><ul><li class="active"></li></ul></div><div class="stepbar-content"><div class="preloader"><div class="preloader-wrapper small active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div><i class="hide preloader-finished material-icons green-text small">check</i><p class="mensagem-preloader" data-finishedmessage="' + mensagemFinal + '"></p></div></div></div><div class="stepbar-fundo hide-stepbar"></div>');

    const stepbarUL = angular.element(document.querySelector(".stepbar .stepbar-nav ul"));
    for (var i = 1; i < nrEtapas; i++) {
        stepbarUL.append("<li></li>");
    }
    angular.element(document.querySelector(".stepbar .stepbar-content .mensagem-preloader")).html(mensagemInicial);
    angular.element(document.querySelector(".stepbar-fundo")).removeClass("hide-stepbar");
    angular.element(document.querySelector(".stepbar")).removeClass("hide-stepbar");
}

function endStep() {
    if (document.querySelectorAll("body .stepbar").length > 0) {
        angular.element(document.querySelector(".stepbar")).addClass("hide-stepbar");
        angular.element(document.querySelector(".stepbar-fundo")).addClass("hide-stepbar");
    }
}

function sleepMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function finishStep() {
    if (document.querySelectorAll("body .stepbar").length > 0) {
        var mensagemFinish = angular.element(document.querySelector(".stepbar .stepbar-content .mensagem-preloader")).attr("data-finishedmessage");
        if (!mensagemFinish) {
            mensagemFinish = "Finalizado!";
        }
        angular.element(document.querySelector(".stepbar .stepbar-content .mensagem-preloader")).html(mensagemFinish);
        const stepBarLength = document.querySelectorAll(".stepbar ul li").length;
        for (var i = 0; i < stepBarLength; i++) {
            angular.element(document.querySelectorAll(".stepbar ul li")).eq(i).addClass("active");
        }
        angular.element(document.querySelector(".stepbar-content .preloader-wrapper .spinner-layer")).addClass("hide");
        angular.element(document.querySelector(".stepbar-content .preloader-wrapper")).addClass("hide");
        angular.element(document.querySelector(".stepbar-content .preloader-finished")).removeClass("hide");
    }
}

function setNextStep(mensagem) {
    let currentIndex = document.querySelectorAll(".stepbar ul li.active").length - 1;
    const stepBarLength = document.querySelectorAll(".stepbar ul li").length;
    if (currentIndex >= (stepBarLength - 1)) return;
    currentIndex++
    angular.element(document.querySelectorAll(".stepbar ul li")).eq(currentIndex).addClass("active");
    angular.element(document.querySelector(".stepbar .stepbar-content .mensagem-preloader")).html(mensagem);
    if (currentIndex == (stepBarLength - 1)) {
        finishStep();
    }
}

var keyStr = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

function encode64(input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (application/pdf - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath, filename, content, contentType, convert = false) {
    // Convert the base64 string in a Blob

    if (convert) {
        content = _arrayBufferToBase64(content);
    }
    console.log("📄 Base64 COMPLETO do arquivo:", content);

    var DataBlob = b64toBlob(content, contentType);

    console.log("Starting to write the file :3");

    window.resolveLocalFileSystemURL(folderpath, function (dir) {
        console.log("Access to the directory granted succesfully");
        dir.getFile(filename, {create: true}, function (file) {
            console.log("File created succesfully.");
            file.createWriter(function (fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function () {
                alert('Unable to save file in path ' + folderpath);
            });
        });
    });
}

function mCNPJ(cnpj) {
    //99.999.999/9999-99
    cnpj = cnpj.replace(/\D/g, "")
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2")
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2")
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2")
    return cnpj
}

function removeMCNPJ(cnpj) {
    //99.999.999/9999-99
    cnpj = cnpj.replace(".", "");
    cnpj = cnpj.replace(".", "");
    cnpj = cnpj.replace("/", "");
    cnpj = cnpj.replace("-", "");
    return cnpj
}

function mProcesso(processo) {
    //50300.011685/2018-41
    if (!processo) {
        return processo;
    }
    processo = processo.replace(/\D/g, "");
    processo = processo.replace(/^(\d{5})(\d)/, "$1.$2");
    processo = processo.replace(/^(\d{5})\.(\d{6})(\d{4})(\d)/, "$1.$2/$3-$4");
    return processo;
}

function carregaLocalizacao() {

    preloadInit('Carregando dados GPS');

    var onSuccess = function (position) {
        //implementado por conta do time, o scope carrega antes do sucess da geo localização

        var localizacao = {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude,
            'altitude': position.coords.altitude
        };


        sessionStorage.setItem("position", angular.toJson(localizacao));
        preloaderStop();
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        let mensagem;

        if (error.code == 2) {
            mensagem = '<span><a href="comum.tipo.html">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Voc&ecirc; precisa conceder permiss&atilde;o do GPS</a></span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
        }
        if (error.code == 3) {
            mensagem = '<span><a href="comum.tipo.html">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Voc&ecirc; precisa habilitar o GPS</a></span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
        }

        if (error.code == 4) {
            mensagem = '<span><a href="comum.tipo.html">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Tempo de captura do GPS falhou, tente em lugar aberto.</a></span>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
        }

        var localizacao = {
            'latitude': ' --- ',
            'longitude': ' --- ',
            'altitude': ' --- '
        };

        sessionStorage.setItem("position", angular.toJson(localizacao));

        preloaderStop();
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 10000});

    //var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
}

function carregaLocalizacaoAtual(urlRecarregar) {
    var promiseLocalizacao = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {

            var onSuccess = function (position) {
                var localizacao = {
                    'latitude': position.coords.latitude,
                    'longitude': position.coords.longitude,
                    'altitude': position.coords.altitude
                };

                resolve(localizacao);
            };

            // onError Callback receives a PositionError object
            function onError(error) {
                let mensagem;

                if (error.code == 2) {
                    mensagem = '<span><a href="' + urlRecarregar + '">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Voc&ecirc; precisa conceder permiss&atilde;o do GPS</a></span>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
                }
                if (error.code == 3) {
                    mensagem = '<span><a href="' + urlRecarregar + '">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Voc&ecirc; precisa habilitar o GPS</a></span>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
                }

                if (error.code == 4) {
                    mensagem = '<span><a href="' + urlRecarregar + '">Erro: Tente novamente. <i class="material-icons Tiny white-text">refresh</i> </br>Tempo de captura do GPS falhou, tente em lugar aberto.</a></span>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3", inDuration: 1000});
                }

                var localizacao = {
                    'latitude': ' --- ',
                    'longitude': ' --- ',
                    'altitude': ' --- '
                };

                resolve(localizacao);
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true, timeout: 10000});
        } else {
            var localizacao = {
                'latitude': ' --- ',
                'longitude': ' --- ',
                'altitude': ' --- '
            };
            resolve(localizacao);
        }
    });

    return promiseLocalizacao;
}

function corrigirLatLong(valor) {
    let LatLong = '';
    try {
        var arrayOfStrings = valor.split('.');
        console.log(arrayOfStrings);
        for (let index = 0; index < arrayOfStrings.length; index++) {
            if (index > 0) {
                LatLong += arrayOfStrings[index];
            } else {
                LatLong += arrayOfStrings[index] + '.';
            }
        }
        console.log(LatLong);
    } catch (error) {
        console.log(error.message);
    }

    return LatLong;
}

function geraDigitoVerificador(numero) {
    var numero = numero.toString();
    var calculo = (numero.substring(5, 1) * 2) + (numero.substring(4, 1) * 3) + (numero.substring(3, 1) * 4) + (numero.substring(2, 1) * 5) + (numero.substring(1, 1) * 6) + (numero.substring(0, 1) * 7);
    var resultadoParcial = calculo * 10;
    var resto = resultadoParcial % 11;
    var digitoVerificador = resto.toString().substring(resto.toString().Length - 1, 1);
    return digitoVerificador;
}

//Gera relatorio da fiscalização
function gerarRelatorioFiscalizacao($http, arFiscalizacao, arData, CheckList, IrregularidadeEncontrada, tpExtraordinaria) {

    var d = new Date();

    //...
    arFiscalizacao.TpExtraordinaria = tpExtraordinaria;
    console.log(1)
    arData.fiscalizacao = arFiscalizacao;
    console.log(2)
    arData.CheckList = CheckList;
    console.log(3)
    arData.IrregularidadeEncontrada = IrregularidadeEncontrada;
    console.log(4)
    arData.DSNomeArquivo = "MOBI_RELATORIO_DA_FISCALIZACAO_" + arData.fiscalizacao.ObjetoFiscalizado.IDFiscalizacao + "_" + d.getTime() + ".pdf";
    console.log(5)
    arData.DSNomeArquivoNotificacao = sessionStorage.getItem("strFileName");
    console.log(6)
    arData.DSNomeArquivoAnexoFotografico = "ANEXO_FOTOGRAFICO_DA_FISCALIZACAO_" + arData.fiscalizacao.ObjetoFiscalizado.IDFiscalizacao + "_" + d.getTime() + ".pdf";
    console.log(7)
    sessionStorage.setItem("fileRelatorio", arData.DSNomeArquivo);
    console.log(8)
    sessionStorage.setItem("fileRelatorioAnexoFotografico", arData.DSNomeArquivoAnexoFotografico);
    console.log(9)
    arData.isNaoAutorizado = false;

    $http({
        url: urlService() + 'GerarPDF',
        method: "POST",
        data: arData
    })
        .then(function (response) {
                console.log(10)
                if (!response.d) {
                    finishStep();

                    // Remove seleções de irregularidades para evitar reaproveitamento indevido
                    sessionStorage.removeItem("arIrregularidade");
                    sessionStorage.removeItem("arIrregularidadeUnion");
                    sessionStorage.removeItem("arIrregularidadeAvulsa");
                    sessionStorage.removeItem("arIrregularidadeChecklist");
                    sessionStorage.removeItem("arFotoIrregularidade");
                    sessionStorage.removeItem("irreg_scope_key");

                    sleepMilliseconds(3000).then(() => {
                        preloaderStop();
                        window.location = "processo.html";
                    });
                } else {
                    console.log(response.d);
                }
            },
            function (response) { // optional
                console.log('Resposta do GerarPDF: ' + response)
                logErro('gerarRelatorioFiscalizacao->GerarPDF', response.data.Message, JSON.stringify({'response': response}));
                preloaderStop();

                var mensagem = null;
                if (response.status == 500) {
                    mensagem = '<p>Erro ao gravar relatorio da fiscalizacao. </p>' +
                        '\n' +
                        'Comunique a GPF' +
                        '\n' +
                        response.StackTrace;

                    M.toast({html: mensagem, classes: "#c62828 red darken-3"});
                } else {
                    mensagem = '<p>Erro ao gravar relatorio da fiscalizacao. </p>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3"});
                }
            });
}



function salvarAnexosRelatorioSNA($http, anexos, checkList, irregularidades) {
    const ensureArray = function(valor) {
        return Array.isArray(valor)
            ? valor.filter(function(item) {
                  return item != null;
              })
            : [];
    };

    const anexosList = ensureArray(anexos).map(function(item) {
        const copia = angular.extend({}, item);
        if (copia.IDIrregularidade == null) {
            copia.IDIrregularidade = 0;
        }
        return copia;
    });

    if (!anexosList.length) {
        return Promise.resolve();
    }

    try {
        setNextStep(getMensagemVersaoTrainee("Salvando foto(s)", "."));
    } catch (error) {
        console.log("salvarAnexosRelatorioSNA setNextStep erro:", error && error.message);
    }

    const payload = {
        IrregularidadeEncontrada: ensureArray(irregularidades),
        Anexos: anexosList,
        CheckList: ensureArray(checkList)
    };

    const requestData = JSON.parse(JSON.stringify(payload));

    return $http({
        url: urlService() + "InserirIrregularidadeAnexosCheckList",
        method: "POST",
        data: requestData,
        headers: { "Content-Type": "application/json;charset=utf-8" }
    })
        .then(function(response) {
            if (response && response.data && response.data.d) {
                console.log("salvarAnexosRelatorioSNA retorno:", response.data.d);
            }
            return response;
        })
        .catch(function(response) {
            var mensagem = (response && response.data && (response.data.Message || response.data.message)) || "";

            try {
                logErro(
                    "salvarAnexosRelatorioSNA->InserirIrregularidadeAnexosCheckList",
                    mensagem,
                    JSON.stringify({ response: response })
                );
            } catch (e) {
                console.log("salvarAnexosRelatorioSNA logErro erro:", e && e.message);
            }

            try {
                preloaderStop();
            } catch (e) {
                console.log("salvarAnexosRelatorioSNA preloaderStop erro:", e && e.message);
            }

            try {
                var texto = '<p>Erro ao cadastrar alguma foto.</br> Tente novamente</p>';
                M.toast({ html: texto, classes: "#c62828 red darken-3" });
            } catch (e) {
                console.log("salvarAnexosRelatorioSNA toast erro:", e && e.message);
            }

            throw response;
        });
}

function gerarRelatorioFiscalizacaoSNA(
    $http,
    arFiscalizacao,
    arData,
    CheckList = [],
    IrregularidadeEncontrada = [],
    tpExtraordinaria = false,
    Anexos = []
) {
    const ensureArray = (v) => (Array.isArray(v) ? v : []);
    const ensureStr = (v) => (v == null ? "" : String(v));

    var d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const dataPtBr = `${dd}/${mm}/${yyyy}`;
    const dataHoraPtBr = `${dataPtBr} ${hh}:${mi}`;

    arData = arData || {};
    arData.fiscalizacao = arFiscalizacao;
    arData.CheckList = ensureArray(CheckList);
    arData.IrregularidadeEncontrada = ensureArray(IrregularidadeEncontrada);
    arData.TpExtraordinaria = !!tpExtraordinaria;
    const anexosList = ensureArray(Anexos).filter(function(item) {
        return !!item;
    });
    arData.Anexos = anexosList;

    arData.cnpjEmpresa =
        arData.cnpjEmpresa ||
        arFiscalizacao?.ObjetoFiscalizado?.NRInscricao ||
        arFiscalizacao?.ObjetoFiscalizado?.Empresa?.NRInscricao ||
        "";

    arData.codigoEstruturado =
        arData.codigoEstruturado ||
        arFiscalizacao?.ObjetoFiscalizado?.assunto ||
        arFiscalizacao?.ObjetoFiscalizado?.Empresa?.assunto ||
        "";

    arData.dsLatitude =
        arData.dsLatitude ||
        arFiscalizacao?.DSLatitude ||
        arFiscalizacao?.ObjetoFiscalizado?.DSLatitude ||
        "";
    arData.dsLongitude =
        arData.dsLongitude ||
        arFiscalizacao?.DSLongitude ||
        arFiscalizacao?.ObjetoFiscalizado?.DSLongitude ||
        "";

    const idFisc =
        arFiscalizacao?.ObjetoFiscalizado?.IDFiscalizacao ||
        arData?.fiscalizacao?.ObjetoFiscalizado?.IDFiscalizacao ||
        "0";

    arData.DSNomeArquivo = "MOBI_RELATORIO_DA_FISCALIZACAO_" + arData.fiscalizacao.ObjetoFiscalizado.IDFiscalizacao + "_" + d.getTime() + ".pdf";
    arData.DSNomeArquivoAnexoFotografico = "ANEXO_FOTOGRAFICO_DA_FISCALIZACAO_" + arData.fiscalizacao.ObjetoFiscalizado.IDFiscalizacao + "_" + d.getTime() + ".pdf";
    arData.DSNomeArquivoNotificacao = ensureStr(
        sessionStorage.getItem("strFileName")
    );

    try {
        sessionStorage.setItem("fileRelatorio", arData.DSNomeArquivo);
        sessionStorage.setItem(
            "fileRelatorioAnexoFotografico",
            arData.DSNomeArquivoAnexoFotografico
        );
    } catch (e) {
        console.log("sessionStorage set error:", e && e.message);
    }

    arData.isNaoAutorizado = true;

    arData.dtInicioRealizacao = dataHoraPtBr;
    arData.dtFimRealizacao = dataPtBr;

    if (
        Array.isArray(arFiscalizacao?.Equipe) &&
        !arFiscalizacao.Equipe.some((m) => m.STCoordenador)
    ) {
        arFiscalizacao.Equipe[0].STCoordenador = true;
    }

    const enviarRelatorio = function() {
        return $http({
            url: urlService() + "GerarPDF",
            method: "POST",
            data: arData,
            headers: { "Content-Type": "application/json;charset=utf-8" },
        }).then(
            function (response) {
                try {
                    finishStep();
                    sessionStorage.removeItem("arIrregularidade");
                    sessionStorage.removeItem("arIrregularidadeUnion");
                    sessionStorage.removeItem("arIrregularidadeAvulsa");
                    sessionStorage.removeItem("arIrregularidadeChecklist");
                    sessionStorage.removeItem("arFotoIrregularidade");
                    sessionStorage.removeItem("irreg_scope_key");
                } catch (e) {
                    console.log("cleanup error:", e && e.message);
                }

                sleepMilliseconds(3000).then(() => {
                    preloaderStop();
                    window.location = "prestador.processo.html";
                });
            },
            function (response) {
                const rawMsg =
                    response?.data?.Message ||
                    response?.data?.d?.Message ||
                    response?.data?.ExceptionMessage ||
                    response?.statusText ||
                    "";

                try {
                    logErro(
                        "gerarRelatorioFiscalizacao->GerarPDF",
                        rawMsg,
                        JSON.stringify({ request: arData, status: response?.status })
                    );
                } catch (e) {
                    console.log("logErro fail:", e && e.message);
                }

                preloaderStop();
                const mensagem =
                    "<p>Erro ao gerar relatório da fiscalização.</p>\nComunique a GPF " +
                    (rawMsg || "");
                M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
            }
        );
    };

    if (anexosList.length) {
        return salvarAnexosRelatorioSNA(
            $http,
            anexosList,
            arData.CheckList,
            arData.IrregularidadeEncontrada
        )
            .then(enviarRelatorio)
            .catch(function(error) {
                console.log(
                    "salvarAnexosRelatorioSNA erro:",
                    error && error.message ? error.message : error
                );
                throw error;
            });
    }

    return enviarRelatorio();
}


//Abre aquivo armazenado sistema de fiscalização
function abreArquivo(folderpath, fileRelatorio, contentType) {

    setTimeout(function () {
        cordova.plugins.fileOpener2.open(
            folderpath + fileRelatorio,
            contentType, {
                error: function (error) {
                    var mensagem = '<p>Tentando abrir ' + fileRelatorio + '</p>';
                    M.toast({html: mensagem, classes: "#c62828 red darken-3"});

                },
                success: function () {
                    preloaderStop();
                }
            }
        );
    }, 1000);
}

function contarDias(DataFinal) {
    var Qtd = "";

    try {
        var d = new Date();
        var dia = d.getDate();
        var mes = d.getMonth() + 1;
        var ano = d.getFullYear();
        var dataAtual = ano + "/" + mes + "/" + dia;

        DataFinal = formatDate(DataFinal);

        var date_diff_indays = function (date1, date2) {
            let dt1 = new Date(date1);
            let dt2 = new Date(date2);
            return Math.floor((
                Date.UTC(
                    dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
        }

        Qtd = date_diff_indays(dataAtual, DataFinal);

        console.log('Dias para desconectar: ', Qtd);
    } catch (error) {
        console.log(error.message);
    }

    return Qtd;
}

//console.log(formatDate('23/04/2018'));
//console.log(formatDate('2018-04-01', 'pt-br'));
function formatDate(data, formato) {
    if (formato == 'pt-br') {
        return (data.substring(0, 10).split('-').reverse().join('/'));
    } else {
        return (data.substring(0, 10).split('/').reverse().join('-'));
    }
}

function formataImoCapitania(v) {
    v = v.replace(/[^a-zA-Z0-9]/g, "");
    return v;
}

function formataAcao(acao, stfiscalizacaoprestador, codprocessoprogramada) {
    if (typeof acao !== "undefined" && acao !== null && acao !== "undefined" && acao !== "null")
        return acao;

    if (stfiscalizacaoprestador == '0') {
        if (typeof codprocessoprogramada !== "undefined" && codprocessoprogramada !== null && codprocessoprogramada !== "undefined")
            return null;

        return "rotina";
    }
    return "naoautorizado";
}

function mascaraCnpj(Cnpj) {
    var val = '';

    try {
        val = Cnpj.substring(0, 2) + '.' + Cnpj.substring(2, 5) + '.' + Cnpj.substring(5, 8) + '/' + Cnpj.substring(8, 12) + '-' + Cnpj.substring(12, 14);
    } catch (error) {
        console.log(error.message);
    }

    return val;
}

function formataCnpj(v) {
    v = v.replace(/\D/g, "");
    if (v.length <= 5)
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    else if (v.length <= 8)
        v = v.replace(/^(\d{2})(\d{3})(\d)/, "$1.$2.$3");
    else if (v.length <= 12)
        v = v.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3/$4");
    else if (v.length > 12) {
        v = v.substring(0, 14);
        v = v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5");
    }
    return v;
}

function validarCnpj(v) {
    var patt = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!patt.test(v)) return false;
    if ((v = v.replace(/[^\d]/g, "").split("")).length != 14) return false;
    if (v == "00000000000000" || v == "11111111111111" ||
        v == "22222222222222" || v == "33333333333333" ||
        v == "44444444444444" || v == "55555555555555" ||
        v == "66666666666666" || v == "77777777777777" ||
        v == "88888888888888" || v == "99999999999999") return false;
    for (var s = 5, n = 0, i = 0; s >= 2; n += v[i++] * s--) ;
    for (var s = 9; s >= 2; n += v[i++] * s--) ;
    if (v[12] != (((n %= 11) < 2) ? 0 : 11 - n)) return false;
    for (var s = 6, n = 0, i = 0; s >= 2; n += v[i++] * s--) ;
    for (var s = 9; s >= 2; n += v[i++] * s--) ;
    return (v[13] == (((n %= 11) < 2) ? 0 : 11 - n));
}

function formataCpf(v) {
    v = v.replace(/\D/g, "");
    if (v.length <= 6)
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
    else if (v.length <= 9)
        v = v.replace(/(\d{3})(\d{3})(\d)/, "$1.$2.$3");
    else if (v.length > 9) {
        v = v.substring(0, 11);
        v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4")
    }
    return v;
}

function validarCpf(v) {
    var patt = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/i;
    if (!patt.test(v)) {
        return false;
    }
    if ((v = v.replace(/[^\d]/g, "").split("")).length != 11) {
        return false;
    }
    for (var s = 10, n = 0, i = 0; s >= 2; n += v[i++] * s--) {
    }
    if (v[9] != (((n %= 11) < 2) ? 0 : 11 - n)) {
        return false;
    }
    for (var s = 11, n = 0, i = 0; s >= 2; n += v[i++] * s--) {
    }
    return (v[10] == (((n %= 11) < 2) ? 0 : 11 - n));
}

function formataCep(v) {
    v = v.replace(/\D/g, "");
    if (v.length <= 5)
        v = v.replace(/(\d{2})(\d)/, "$1.$2");
    else if (v.length > 5) {
        v = v.substring(0, 8);
        v = v.replace(/(\d{2})(\d{3})(\d{1,3})$/, "$1.$2-$3")
    }
    return v;
}

function formataNumero(v) {
    v = v.replace(/\D/g, "");
    return v;
}

function coordenadaParaTexto(v) {
    v = v.toString().replace(".", ",");
    return v;
}

function formataCoordenada(v) {
    v = v.replace(/[^-,\d]/g, "");
    v = v.replace(/(?!^)-/g, "");
    v = v.replace(/^,+/, "");
    v = v.replace(/^\-,+/, "-");
    v = v.replace(/,/g, (a, n, str) => str.indexOf(a) == n ? a : "");
    return v;
}

function logErro(acao, descricaoErro, parametros) {
    let arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));
    const url = window.location.pathname;

    if (arUsuario)
        gestorInserirLogErro(arUsuario.NOLoginUsuario, arUsuario.NRMatricula, url, acao, descricaoErro, parametros).then(r => console.log(acao, descricaoErro))
}

function inicializarMaterializeSelect() {
    $('select').formSelect();
    $('select[required]').css({
        display: 'inline',
        position: 'absolute',
        float: 'left',
        padding: 0,
        margin: 0,
        border: '1px solid rgba(255,255,255,0)',
        height: 0,
        width: 0,
        top: '3em',
        left: '7.5em',
        opacity: 0
    });
}

function atuacaoNavegacaoInterior(tipoEntidade) {
    return tipoEntidade == 22; // Transportador não autorizado como EBN
}

function atuacaoPortuarioTup(tipoEntidade) {
    return tipoEntidade == 16; // Terminal de Uso Privado
}

function atuacaoPortuarioRegistro(tipoEntidade) {
    return tipoEntidade == 23; // Empresa com Instalação Registrada
}

function recuperarModalidade(tipoEntidade, tipoTransporte) {
    if (tipoEntidade == 22) // Navegação Interior
    {
        switch (tipoTransporte.toString()) {
            case "1":
                return 'Longitudinal de Carga';
            case "2":
                return 'Longitudinal de Passageiros';
            case "6":
                return 'Longitudinal Misto (Passageiros e Cargas)';
            case "3":
                return 'Travessia de Carga';
            case "4":
                return 'Travessia de Passageiros';
            case "5":
                return 'Travessia de Veiculos';
            case "7":
                return 'Travessia de Veículos (Motocicletas)';
            default:
                return '';
                ;
        }
    } else if (tipoEntidade == 16)
        return "Terminal de Uso Privado";
    else if (tipoEntidade == 23)
        return "Registro";
}

function definirTipoEntidadePorAreaAtuacao(areaAtuacao) {
    if (areaAtuacao == 'navegacaointerior')
        return 22; // Transportador não autorizado como EBN
    else if (areaAtuacao == 'tup')
        return 16; // Terminal de Uso Privado
    else if (areaAtuacao == 'registro')
        return 23; // Empresa com Instalação Registrada
}

function recuperarAreaAtuacaoPorTipoEntidade(tipoEntidade) {
    if (tipoEntidade == 22)
        return "1"; // Navegação Interior
    else if (tipoEntidade == 16)
        return "2"; // Área Portuária TUP
    else if (tipoEntidade == 23)
        return "3"; // Área Portuária Registro
}

function recuperarAreaAtuacao(tipoEntidade) {
    if (tipoEntidade == 22)
        return "Navegação Interior";
    else if (tipoEntidade == 16)
        return "Área Portuária TUP";
    else if (tipoEntidade == 23)
        return "Área Portuária Registro";
}

function recuperarSuperintendenciaPorTipoEntidade(tipoEntidade) {
    if (tipoEntidade == 22) // Navegação Interior
        return {'Identificador': '91', 'sigla': 'SNI'};
    else if (tipoEntidade == 16) // Área Portuária TUP
        return {'Identificador': '15', 'sigla': 'SPO'};
    else if (tipoEntidade == 23) // Área Portuária Registro
        return {'Identificador': '15', 'sigla': 'SPO'};
}

function recuperarAutorizadaPorTipoEntidade(tipoEntidade) {
    if (tipoEntidade == 22) // Navegação Interior
        return false;
    else if (tipoEntidade == 16) // Área Portuária TUP
        return null;
    else if (tipoEntidade == 23) // Área Portuária Registro
        return null;
}

function recuperarTipoInstalacaoPortuariaPorTipoEntidade(tipoEntidade) {
    if (tipoEntidade == 22) // Navegação Interior
        return null;
    else if (tipoEntidade == 16) // Área Portuária TUP
        return "2";
    else if (tipoEntidade == 23) // Área Portuária Registro
        return "8";
}


function verificaModalidade(prestador) {

    var iconeEmbarcacao = 'img/icon-embarca.png';
    var iconeTerminal = 'img/icon-terminal.png';

    var modalidade = removerAcentos(prestador.Modalidade);

    switch (modalidade) {
        case 'Longitudinal de Carga':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "1558";
            prestador.assunto = "421.3";
            break;
        case 'Longitudinal de Passageiros':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "912";
            prestador.assunto = "421.3";
            break;
        case 'Longitudinal Misto (Passageiros e Cargas)':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "912";
            prestador.assunto = "421.3";
            break;
        case 'Travessia de Carga':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "1274";
            prestador.assunto = "421.3";
            break;
        case 'Travessia de Passageiros':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "1274";
            prestador.assunto = "421.3";
            break;
        case 'Travessia de Veiculos':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "1274";
            prestador.assunto = "421.3";
            break;
        case 'Travessia de Veículos (Motocicletas)':
            prestador.icone = iconeEmbarcacao;
            prestador.norma = "1274";
            prestador.assunto = "421.3";
            break;
        case 'Registro':
            prestador.icone = iconeTerminal;
            prestador.norma = "RN 13";
            prestador.assunto = "421.12";
            break;
        case 'Terminal de uso privado':
            prestador.icone = iconeTerminal;
            prestador.norma = "3274";
            prestador.assunto = "421.12";
            break;
        default:
            prestador.icone = iconeTerminal;
            prestador.norma = "3274";
            prestador.assunto = "421.11";
    }
    return prestador;
}

function recuperarTPNavegacaoPorAreaPPF(areaPPF) {
    areaPPF = areaPPF.toLowerCase().trim();

    if (areaPPF == 'interior') // Navegação Interior
        return 1;
    else if (areaPPF == 'marítima' || areaPPF == 'maritima') // Navegação Marítima
        return 2;
    else if (areaPPF == 'porto') // Serviço Portuário
        return 3;
}

function recuperarIDSuperintendenciaPorAreaPPF(areaPPF) {
    areaPPF = areaPPF.toLowerCase().trim();

    if (areaPPF == 'interior') // Navegação Interior
        return 91;
    else if (areaPPF == 'marítima' || areaPPF == 'maritima') // Navegação Marítima
        return 90;
    else if (areaPPF == 'porto') // Serviço Portuário
        return 15;
}

function recuperarUnidadeFiscalCoordenador(padrao) {
    try {
        var equipe = angular.fromJson(sessionStorage.getItem("arEquipeSelecionada") || '[]');
        var coordenador = angular.fromJson(sessionStorage.getItem('coordenadorSelecionado')) ||
            equipe.find(function (e) { return e.STCoordenador === true; });
        if (coordenador) {
            sessionStorage.setItem('coordenadorSelecionado', angular.toJson(coordenador));
            return { Sigla: coordenador.SGUnidade, Identificador: coordenador.IDUnidadeOrganizacional };
        }
        if (equipe.length > 0) {
            return { Sigla: equipe[0].SGUnidade, Identificador: equipe[0].IDUnidadeOrganizacional };
        }
    } catch (error) {
        console.log(error.message);
    }

    try {
        var usuario = angular.fromJson(sessionStorage.getItem("arUsuario") || '{}');
        var servidor = usuario.servidor || {};
        return { Sigla: servidor.SGUnidade, Identificador: servidor.IDUnidadeOrganizacional };
    } catch (erro) {
        console.log(erro.message);

    }
    return { Sigla: '', Identificador: '' };
}

function limparCoordenadorSelecionado() {
    try {
        sessionStorage.removeItem('coordenadorSelecionado');
        sessionStorage.removeItem('idCoordenador');
    } catch (error) {
        console.log('limparCoordenadorSelecionado erro:', error && error.message);
    }
}


//Interacoes de tela
//=========================================================================================================================
//fadeOut("logo01", 0.9);
//fadeIn("logo01", 1);
function fadeOut(id, time, remover) {
    fade(id, time, 100, 0, remover);
}

function fadeIn(id, time, remover) {
    fade(id, time, 0, 100, remover);
}

function fade(id, time, ini, fin, remover) {
    var target = document.getElementById(id);
    var alpha = ini;
    var inc;
    if (fin >= ini) {
        inc = 2;
    } else {
        inc = -2;
    }

    try {
        if (remover == "F") {
            target.style.display = "block";
        }
    } catch (error) {
        console.log(error.message);
    }

    let timer = (time * 1000) / 50;
    var i = setInterval(
        function () {
            if ((inc > 0 && alpha >= fin) || (inc < 0 && alpha <= fin)) {
                clearInterval(i);

                try {
                    if (remover == "T") {
                        target.style.display = "none";
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
            setAlpha(target, alpha, remover);
            alpha += inc;
        }, timer);
}

function setAlpha(target, alpha, remover) {
    target.style.filter = "alpha(opacity=" + alpha + ")";
    target.style.opacity = alpha / 100;
}

//=========================================================================================================================

function UserException(message, title) {
    this.message = message;
    this.name = "UserException";
    this.title = title;
}

function notificarReleaseDismissed() {
    try {
        gestorMarcarLogVersao();
    } catch (ex) {
        console.log(ex.message);
    }
}

function notificarRelease(mensagem, titulo) {
    try {
        navigator.notification.alert(mensagem, notificarReleaseDismissed, titulo, 'Entendi');
    } catch (ex) {
        console.log(ex.message);
    }
}

function notificarMensagem(mensagem, titulo) {
    try {
        navigator.notification.alert(mensagem, null, titulo, 'Fechar');
    } catch (ex) {
        console.log(ex.message);
    }
}

// Helpers
function montarListaNumerada(novidades = []) {
    return (novidades || [])
        .filter(item => item && String(item).trim().length > 0)
        .map((item, i) => `${i + 1}. ${item}`)
        .join("\n");
}

function listarContagemNovidades(releases = []) {
    return (releases || []).map(r => {
        // remove o prefixo "Versão " se vier no objeto
        const versao = (r.versao || '').replace(/^vers[aã]o\s+/i, '').trim();
        const qtd = (r.novidades || []).filter(n => n && String(n).trim()).length;
        return { versao, quantidade: qtd };
    });
}

// Substitua por esta
async function VerficarLogVersao() {
    try {
        const arDados = await gestorVerificarLogVersao();
        const releases = carregarNovidadesVersao();

        // A lista que você quer de retorno: [{ versao: "1.2.11", quantidade: 3 }, ...]
        const lista = listarContagemNovidades(releases);

        if (!arDados || arDados.length <= 0) {
            const ultimaVersao = getUltimaVersao(); // assume releases[0] é a mais recente
            const titulo = `Novidades da ${ultimaVersao.versao}`;
            const corpo = montarListaNumerada(ultimaVersao.novidades);

            // Abre o modal/notificação já com a lista "1. ...\n2. ...\n3. ..."
            notificarRelease(corpo, titulo);

            // Retorno completo pra quem quiser usar programaticamente
            return {
                versaoAtual: (ultimaVersao.versao || '').replace(/^vers[aã]o\s+/i, '').trim(),
                novidades: ultimaVersao.novidades || [],
                novidadesFormatadas: corpo,
                lista // ex.: [{versao:"1.2.11", quantidade:3}, ...]
            };
        } else {
            // Mantém sua lógica do tour
            const arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));
            if (arDados[0].FlagTuor !== "T" && arUsuario.servidor.IDPerfilFiscalizacao !== 1) {
                $('.tap-target').tapTarget('open');
            }

            // Mesmo assim retorna a lista pedida
            return { lista };
        }
    } catch (error) {
        console.log(error.message);
        return { erro: true, mensagem: error.message, lista: [] };
    }
}

