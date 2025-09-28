var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.empresa = {};
    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));
    $scope.empresa.NRInscricao = mCNPJ($scope.empresa.NRInscricao);

    sessionStorage.setItem("arEmpresa", angular.toJson($scope.empresa));

    $scope.embarcacoes = angular.fromJson(sessionStorage.getItem("arEmbarcacao"));
    console.log('embarcacoes', $scope.embarcacoes);

    // Verificação de erro — embarcação não encontrada
    if (!$scope.embarcacoes || !$scope.embarcacoes.length) {
        preloaderStop();
        const mensagem = '<p>Não existem embarcações cadastradas para este trecho.</br> Favor entrar em contato com a GPF</p>';
        M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
        return;
    }

    preloaderStop();

    $scope.fechaTeclado = function () {
        angular.element(document.activeElement.blur());
    };

    $scope.semEmbarcacao = function () {
        sessionStorage.setItem('arEmbarcacao', angular.toJson({ naoAplica: true }));
        sessionStorage.removeItem("arEquipeSelecionada");
        window.location = "rotina.equipe.html";
    };

    $scope.proxima = function (embarcacao) {
        sessionStorage.setItem('arEmbarcacao', angular.toJson(embarcacao));
        sessionStorage.removeItem("arEquipeSelecionada");
        window.location = "rotina.equipe.html"
    };

});

function preloaderStop() {
    var myEl = angular.element(document.querySelector('#preloader'));
    myEl.remove();
}
