var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.pesquisar = function () {
        let valorPesquisa = document.getElementById('pesquisar').value;
        console.log(valorPesquisa);
        gestorCarregarDadosAutorizadas(valorPesquisa,'INSTALACAO');

    }

    document.body.style.backgroundColor = "white";

})