var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    //var url_string = window.location.href;
    //var url = new URL(url_string);
    //var filtro = url.searchParams.get("pesquisar");
    //var modalidade = url.searchParams.get("modalidade");

    //var params = filtro;
    //if(modalidade) {
    //  data = {modalidade: modalidade, cnpjRazaosocial: '' }
    //}
    //if(filtro){
    //  data = { cnpjRazaosocial: filtro, modalidade: '' }
    //}

    //document.addEventListener("deviceready", onDeviceReady, false);

    $scope.pesquisar = function () {
        let valorPesquisa = document.getElementById('pesquisar').value;
        console.log(valorPesquisa);
        //CarregarDadosAutorizadas(valorPesquisa);
        gestorCarregarDadosAutorizadas(valorPesquisa, 'NORAZAOSOCIAL');

        //armaneza os dados da empresa na storage session
        //sessionStorage.setItem('arEmpresa', angular.toJson(empresa));
    }

    document.body.style.backgroundColor = "white";
    
})