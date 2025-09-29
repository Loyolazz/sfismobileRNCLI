var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.embarcacao = {};
    $scope.embarcacao = angular.fromJson(sessionStorage.getItem("arEmbarcacao"));

    $scope.empresas = {};
    $scope.empresas = angular.fromJson(sessionStorage.getItem("arEmpresas"));

    document.body.style.backgroundColor = "white";

    preloaderStop();

    $scope.detalhar = async function (empresa) {
        //armaneza os dados da empresa na storage session
        sessionStorage.setItem('arEmpresa', angular.toJson(empresa));
        sessionStorage.removeItem("arEquipeSelecionada");
        window.location = "rotina.equipe.html"
    }

    $scope.formatarNRCnpj = function (nrCnpj) {
        if (nrCnpj) return mCNPJ(nrCnpj);
        return nrCnpj;
    }

    $scope.formatarData = function (data) {
        console.log(data);
        if (!data || data == '01/01/1900 00:00:00') {
            return null;
        } else {
            var split = data.split('/');
            var ano = split[2].split(' ')
            var novadata = split[0] + "/" + split[1] + "/" + ano[0];
            return novadata;
        }
    }

})
