var app = angular.module('app', []);

function incluirMascara(){
    setTimeout(function() {
        if ($('select#tipo').val()=="cpf") {
            const formatado = formataCpf($('#inscricao').val());
            $('#inscricao').val(formatado);
        }
        else if ($('select#tipo').val()=="cnpj") {
            const formatado = formataCnpj($('#inscricao').val());
            $('#inscricao').val(formatado);
        }
    },1);
}

function incluirMascaraCep(){
    setTimeout(function() {
        const formatado = formataCep($('#cep').val());
        $('#cep').val(formatado);
    },1);
}

function incluirMascaraNumero(){
    setTimeout(function() {
        const formatado = formataNumero($('#numero').val());
        $('#numero').val(formatado);
    },1);
}

function mudarTipo(){
    setTimeout(function(){
        $('select#tipo').formSelect();
        const texto = $('select#tipo option:selected').data('texto');
        $('#label-inscricao').html(texto);
        incluirMascara();
        M.updateTextFields();
    }, 200)
}

$(document).ready(function() {
    $('#inscricao').on("keyup", function() {
        incluirMascara();
    });
    $('#numero').on("keyup", function() {
        incluirMascaraNumero();
    });
    $('#cep').on("keyup", function() {
        incluirMascaraCep();
    });
});

app.controller('MainCtrl', function ($scope, $http) {
    let ufsArrayOriginal = setUfs('uf');
    $scope.ufsArray = ufsArrayOriginal;

    var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;

    $scope.arData = {};
    $scope.municipiosArray = [];

    $scope.filtrarMunicipios = async function () {
        if (!$scope.siglaUf) return;
        setTimeout(async() => {
            preloadInit("Carregando Municípios");
            $scope.municipiosArray = [];
            $scope.arData = await gestorCarregarDadosMunicipios($scope.siglaUf);
            if ($scope.arData && $scope.arData.municipios) {
                $scope.municipiosArray = $scope.arData.municipios;
            }
            $scope.$apply();
            $('#municipio').formSelect();
            preloaderStop();
        }, 2)
    };

    $scope.inicializarFormulario = function() {
        var storageForm = sessionStorage.getItem("arFormPrestadorCadastrar");
        if (!_.isEmpty(storageForm)) {
            var arForm = angular.fromJson(storageForm);
            $scope.inscricao = arForm.NRInscricao;
            $scope.razaosocial = arForm.NORazaoSocial;
            $scope.endereco = arForm.DSEndereco;
            $scope.numero = arForm.NREndereco;
            $scope.complemento = arForm.EDComplemento;
            $scope.bairro = arForm.DSBairro;
            $scope.cep = arForm.NRCEP;
            $scope.municipio = arForm.CDMunicipio;
            $scope.siglaUf = arForm.SGUF;
        } else {
            $scope.inscricao = '';
            $scope.razaosocial = '';
            $scope.endereco = '';
            $scope.numero = '';
            $scope.complemento = '';
            $scope.bairro = '';
            $scope.cep = '';
            $scope.municipio = '';
            $scope.siglaUf = '';
        }
    };
    $scope.inicializarFormulario();

    $scope.persistirFormularioAvancar = function(objPrestador) {

        let arFormPrestadorCadastrar = {
            TPInscricao: objPrestador.TPInscricao,
            NRInscricao: objPrestador.NRInscricao,
            NORazaoSocial: objPrestador.NORazaoSocial,
            DSEndereco: objPrestador.DSEndereco,
            NREndereco: objPrestador.NREndereco,
            EDComplemento: objPrestador.EDComplemento,
            DSBairro: objPrestador.DSBairro,
            NRCEP: objPrestador.NRCEP,
            CDMunicipio: objPrestador.CDMunicipio,
            NOMunicipio: objPrestador.NOMunicipio,
            SGUF: objPrestador.SGUF,
        };

        sessionStorage.setItem("arFormPrestadorCadastrar", angular.toJson(arFormPrestadorCadastrar));
        sessionStorage.setItem("arPrestador", angular.toJson(objPrestador));
        window.location = "prestador.areaAtuacao.html";
    };

    $scope.cadastrar = async function () {

        const tipoInscricao = $('select#tipo').val();
        if (tipoInscricao=="cpf" && !validarCpf($scope.inscricao)) {
            let mensagem = '<p>O CPF informado é inválido</p>';
            M.toast({html: mensagem, classes:"#c62828 red darken-3"});
            return;
        }
        else if (tipoInscricao=='cnpj' && !validarCnpj($scope.inscricao)) {
            let mensagem = '<p>O CNPJ informado é inválido</p>';
            M.toast({html: mensagem, classes:"#c62828 red darken-3"});
            return;
        }

        var objPrestador = await gestorPesquisarDadosPrestadores($scope.inscricao, tipoInscricao);
        if (!_.isEmpty(objPrestador)) {
            var msgNome = objPrestador.NORazaoSocial ? "pertence ao prestador '"+objPrestador.NORazaoSocial.trim()+"', previamente cadastrado" : "já está cadastrada";

            navigator.notification.confirm(
                "A inscrição '"+$scope.inscricao+"' "+msgNome+". \n" +
                "Deseja continuar com este prestador de serviço?",
                async(buttonIndex) => {
                    if (buttonIndex == 1) {
                        //armaneza os dados do prestador na storage session
                        $scope.persistirFormularioAvancar(objPrestador);
                    } else {
                        return;
                    }
                },
                'Continuar com prestador de serviço', ['Sim', 'Não']
            );
        } else {
            let noMunicipio = $('select#municipio').val() ? $('select#municipio option:selected').text() : ''
            let prestador = {
                STCadastrarNovo: true,
                TPInscricao: tipoInscricao=="cnpj" ? '1' : '2',
                NRInscricao: formataNumero($scope.inscricao),
                NORazaoSocial: $scope.razaosocial,
                DSEndereco: $scope.endereco,
                NREndereco: $scope.numero,
                EDComplemento: $scope.complemento,
                DSBairro: $scope.bairro,
                NRCEP: formataNumero($scope.cep),
                CDMunicipio: $scope.municipio,
                NOMunicipio: noMunicipio,
                SGUF: $scope.siglaUf,
                QTDEmbarcacao: 0
            };

            $scope.persistirFormularioAvancar(prestador);
        }
    }

})
