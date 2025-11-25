var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, $http) {

    var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;

    $scope.proxima = async function (acao) {

        if(acao=='interior'){
            let arTipoTransporte = await gestorCarregarDadosTipoTransporte();
            if (arTipoTransporte && arTipoTransporte.tipoTransporte) {
                sessionStorage.setItem("arTipoTransporte", angular.toJson(arTipoTransporte.tipoTransporte));
            }
            window.location = "prestador.navegacaoInterior.html";
        } else {
            window.location = "prestador.areaPortuaria.html";
        }
    };

})
