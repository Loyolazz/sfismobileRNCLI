var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    var url_string = window.location.href;
    var url = new URL(url_string);
    var filtro = url.searchParams.get("pesquisar");
    var linkEmbarcacao = "empresa.embarcacao.html?";
    var linkTerminal = "empresa.geo.html?";


    var params = filtro;
    $http({
        // url: 'http://sfismobile.antaq.gov.br/Sistemas/AntaqService/Services.asmx/ConsultarEmpresasAutorizadas',
        //      'http://sfismobile.antaq.gov.br/Sistemas/AntaqService/Services.asmx?op=ConsultarEmpresasAutorizadas',
        url: urlService() + 'ConsultarEmpresas',
        method: "POST",
        data: { cnpjRazaosocial: params }
    })
      .then(function (response) {

          $scope.empresas = response.data.d;
          $scope.filtro = params;
          angular.forEach($scope.empresas, function (value, key) {
              if ($scope.empresas[key].ListaTipoEmpresa[0].IDTipoEmpresa == 9 || $scope.empresas[key].ListaTipoEmpresa[0].IDTipoEmpresa == 1) {
                  $scope.empresas[key].link = linkEmbarcacao;
              }
              else if ($scope.empresas[key].ListaTipoEmpresa[0].IDTipoEmpresa == 5) {
                  $scope.empresas[key].link = linkTerminal;
              } else {
                  $scope.empresas[key].link = "comum.tipo.html?";
              }
              console.log($scope.empresas[key].link);
          });

          console.log($scope.empresas);
          preloaderStop();

      },
      function (response) { // optional
          logErro('ConsultarEmpresas', response.message, JSON.stringify({'response':response}) );
      });

    $scope.detalhar = function (empresa) {

        //armaneza os dados da empresa na storage session
        sessionStorage.setItem('arEmpresa', angular.toJson(empresa));

        window.location = empresa.link;
    }

})

function preloaderStop() {
    var myEl = angular.element(document.querySelector('#preloader'));
    myEl.remove();
}
