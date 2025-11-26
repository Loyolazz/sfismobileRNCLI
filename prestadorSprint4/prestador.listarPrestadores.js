var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.prestadores = {};
    $scope.prestadores = angular.fromJson(sessionStorage.getItem("arPrestadores"));

    document.body.style.backgroundColor = "white";

    try {
        var msg = null;
        var qtd = $scope.prestadores.length;

        if(qtd > 1 ) {
          msg = "<a>" + qtd + " Prestadores encontrados.</a>";
        }
        else if(qtd == 1 ) {
          msg = "<a> 1 Prestador encontrado.</a>";
        }
        else if(qtd == 0) {
          msg = "<a> Nenhuma empresa localizada.</a>";
        }

        document.getElementById("data-qtd").innerHTML = msg;

    } catch(ex) {
      console.log(ex.message);
    }

    preloaderStop();

    $scope.proxima = function (acao) {

        if(acao=='cadastrar'){
             window.location = "prestador.cadastrar.html";
        }
    };

    $scope.detalhar = async function (prestador) {
        //armaneza os dados do prestador na storage session
        sessionStorage.setItem("arPrestador", angular.toJson(prestador));

        window.location = "prestador.areaAtuacao.html";
    }

    $scope.tipoInscricao = function (tpInscricao) {
        return tpInscricao == 1 ? 'CNPJ' : 'CPF';
    }

    $scope.formatarInscricao = function (tpInscricao, nrInscricao) {
      if (tpInscricao == 1) {
        return formataCnpj(nrInscricao);
      }

      return formataCpf(nrInscricao);
    }

})
