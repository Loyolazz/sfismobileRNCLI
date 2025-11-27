var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {
    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));

    $scope.embarcacoes = angular.fromJson(sessionStorage.getItem("arEmbarcacao"));

    $scope.embarcacoes = {};
    //$scope.embarcacoes = angular.fromJson(sessionStorage.getItem("arEmbarcacoes"));

    console.log('Embarcacoes no listar Embarcacoes',$scope.embarcacoes);

    document.body.style.backgroundColor = "white";

    try {

        var msg = null;
        var qtd = $scope.embarcacoes.length;

        if(qtd > 1 ) {
          msg = "<a>" + qtd + " Embarcações encontradas.</a>";
        }
        else if(qtd == 1 ) {
          msg = "<a> 1 Embarcação encontrada.</a>";
        }
        else if(qtd == 0) {
          msg = "<a> Nenhuma embarcação localizada.</a>";
        }

        document.getElementById("data-qtd").innerHTML = msg;

    } catch(ex) {
      console.log(ex.message);
    }


    preloaderStop();

    $scope.detalhar = async function (embarcacao) {
        //armaneza os dados da embarcacao na storage session
        sessionStorage.removeItem("arEmbarcacao");
        sessionStorage.setItem("arEmbarcacao", angular.toJson(embarcacao));

        gestorCarregarDadosEmpresaEmbarcacao(embarcacao.NRInscricao, embarcacao.NRInstrumento);
    }

})

