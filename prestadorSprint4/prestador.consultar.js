var app = angular.module('app', []);

function incluirMascara(){
    setTimeout(function() {
        if ($('select#tipo').val()=="cpf") {
            const formatado = formataCpf($('#pesquisar').val());
            $('#pesquisar').val(formatado);
        }
        else if ($('select#tipo').val()=="cnpj") {
            const formatado = formataCnpj($('#pesquisar').val());
            $('#pesquisar').val(formatado);
        }
    },1);
}

function mudarTipo(){
    setTimeout(function(){
        $('select#tipo').formSelect();
        const texto = $('select#tipo option:selected').data('texto');
        $('#label-pesquisa').html(texto);
        incluirMascara();
        M.updateTextFields();
    }, 200)
}

$(document).ready(function() {
    $('#pesquisar').on("keyup", function() {
        incluirMascara();
    });
});

app.controller('MainCtrl', function ($scope, $http) {

    var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

    $scope.arUsuario = arUsuario;

    $scope.pesquisar = function () {
        let valorPesquisa = document.getElementById('pesquisar').value;
        const tipoPesquisa = $('select#tipo').val();
        const valorPesquisaSemMascara = tipoPesquisa == 'cpf' || tipoPesquisa == 'cnpj' ? valorPesquisa.replace(/\D/g, "") : valorPesquisa.trim();
        if (valorPesquisaSemMascara.length < 3) {
            let mensagem = '<p>Informe ao menos 3 caracteres para pesquisar</p>';
            M.toast({html: mensagem, classes:"#c62828 red darken-3"});
            return;
        }

        if (tipoPesquisa=='cpf' && valorPesquisaSemMascara.length == 11 && !validarCpf(valorPesquisa)) {
            let mensagem = '<p>O CPF informado é inválido</p>';
            M.toast({html: mensagem, classes:"#c62828 red darken-3"});
            return;
        }
        else if (tipoPesquisa=='cnpj' && valorPesquisaSemMascara.length == 14 && !validarCnpj(valorPesquisa)) {
            let mensagem = '<p>O CNPJ informado é inválido</p>';
            M.toast({html: mensagem, classes:"#c62828 red darken-3"});
            return;
        }

        gestorCarregarDadosPrestadores(valorPesquisaSemMascara, tipoPesquisa);
    }

})
