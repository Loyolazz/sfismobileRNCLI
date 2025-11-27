var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, $http) {

    $scope.empresa = {};

    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));

    console.log($scope.empresa);

    $scope.empresa.NRInscricao = mCNPJ($scope.empresa.NRInscricao);

    sessionStorage.setItem("arEmpresa", angular.toJson($scope.empresa));

    var Trechos = angular.fromJson(sessionStorage.getItem("arTrecho"));
    if(Trechos.length >= 1) {
        $scope.trechos = Trechos[0];

        sessionStorage.removeItem('arTrecho');
        sessionStorage.setItem('arTrecho', angular.toJson(Trechos[0]));

        //gestorCarregarDadosFrotaAlocada($scope.empresa.NRInscricao, NRInstrumentoSemTa);
        window.location = "empresa.embarcacao.html";
    }
    else {
        preloaderStop();
        var mensagem = '<p>Não existe rota ou modalidade de transporte associada a esta autorização.</br> Favor entrar em contato com a GPF</p>';
        M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
    }
    preloaderStop();


    $scope.fechaTeclado = function() {
        angular.element(document.activeElement.blur());
    };

    $scope.proxima = function (trecho){

        //armaneza os dados na storage session
        sessionStorage.setItem('arTrecho', angular.toJson(trecho));
        //verificar se tem definido trecho e linha

        if(sessionStorage.acao == "rotina"){
            window.location = "empresa.embarcacao.html";
        } else {
            //alert("Definir escopo para exibição dos detalhes");
            //mesmo em consultar autorizadas está indo para fiscalização de rotina.
            window.location = "empresa.embarcacao.html";
        }
    };

})




