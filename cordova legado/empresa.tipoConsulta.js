var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    var arUsuario = angular.fromJson(localStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;

    $scope.proxima = function (acao) {

        if(acao=='cnpj'){
             window.location = "empresa.consultarAutorizadas.html";
        } else if(acao=='modalidade'){
             window.location = "empresa.consultaArea.html";
        } else if(acao=='embarcacao'){
             window.location = "empresa.consultaEmbarcacao.html";
        } else {
            window.location = "empresa.consultaInstalacao.html";
        }
    };

})



