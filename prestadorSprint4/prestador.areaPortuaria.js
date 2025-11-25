var app = angular.module('app', []);

app.controller('MainCtrl', function($scope, $http) {

    var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;
    $scope.areaPortuaria = '';

    $scope.prosseguir = async function () {

        var prestador = angular.fromJson(sessionStorage.getItem("arPrestador"));

        prestador.IDTipoEntidade = definirTipoEntidadePorAreaAtuacao($scope.areaPortuaria);
        prestador.IDTipoTransporte = null;
        prestador.IDTrechoLinha = null;
        prestador.Modalidade = recuperarModalidade(prestador.IDTipoEntidade);
        prestador = verificaModalidade(prestador);
        sessionStorage.removeItem("arPrestador");
        sessionStorage.setItem("arPrestador", angular.toJson(prestador));

        await gestorInserirPrestadorSincronizar($http, prestador, "prestador.cadastrarInstalacao.html");
    }

})
