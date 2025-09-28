var app = angular.module('app', []);

function incluirMascaraImoCapitania(){
    setTimeout(function() {
        const formatado = formataImoCapitania($('#numero').val());
        $('#numero').val(formatado);
    },1);
}

$(document).ready(function() {
    $('#numero').on("keyup", function() {
        incluirMascaraImoCapitania();
    });
});

app.controller('MainCtrl', function ($scope, $http) {

    $scope.pesquisar = function () {
        let valorNumero = document.getElementById('numero').value;
        let valorNome = document.getElementById('nome').value;
        console.log(valorNumero, valorNome);
        if (!valorNumero && !valorNome) {
            var mensagem = '<p>Informe ao menos um filtro para seguir</p>';
            M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
            return;
        }
        gestorCarregarDadosEmbarcacoes(valorNome, valorNumero);
    }

    document.body.style.backgroundColor = "white";

})