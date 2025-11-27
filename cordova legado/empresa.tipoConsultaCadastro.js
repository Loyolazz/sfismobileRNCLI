var nivel2 = false;
var btn01 = null;
var btn02 = null;

var imgBtn01 = null;
var imgBtn02 = null;

var listDados = null;

var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    try {

        document.body.style.backgroundColor = "#ddd";
        document.body.style.fontWeight = "500";

        btn01 = document.getElementById('btn_card_01');
        btn02 = document.getElementById('btn_card_02');

        imgBtn01 = document.getElementById('img_card_01');
        imgBtn02 = document.getElementById('img_card_02');

        listDados = document.getElementById("data-list");

    } catch(ex) {
        console.log(ex.message);
    }
    
    var arUsuario = angular.fromJson(localStorage.getItem("arUsuario"));
    $scope.arUsuario = arUsuario;

    $scope.proxima = function (filtro) {
        //sessionStorage.filtroConsultaCadastro = filtro;
        //window.location = "empresa.cadastroAutorizadas.html";
        if(filtro == "navegacao") { 
            carrgarListaNavegacaoNivel2($scope);
        } else {
            carrgarListaPortuariaNivel2($scope)
        }
    };

    

})

function carrgarListaNavegacaoNivel2($scope) {
    try {
        //...
        listDados.innerHTML = "";
        listDados.style.visibility = "visible";

        //...
        var arData = {};
        arData =  [ 
              { Tipo: "Interior" }
            , { Tipo: "Marítima" } 
        ];

        try {
            if(nivel2 == false){
                btn02.remove();
                nivel2 = true;

                

                //...
                var dadosHtml = "";
                angular.forEach(arData, async function (value, key) {
                    //dadosHtml += "<a onclick='detalhar(" + '"' + arData.empresas[key].NRInscricao + '"' + ',"' + arData.empresas[key].NRInstrumento + '"' +")' class='collection-item avatar'>";
                    dadosHtml += "<a onclick='abrirPesquisa(" + '"' + arData[key].Tipo + '"' +")' class='collection-item avatar'>";
                    //dadosHtml += "<img src='"+ arData.empresas[key].icone +"' alt='' class='circle'>";
                    dadosHtml += "<img src='img/icon-consultar.png' alt='' class='circle'>";
                    dadosHtml += "<span class='title'>"+ arData[key].Tipo +"</span>";
                    
                    dadosHtml += "<i class='material-icons right'>chevron_right</i>";
                    //dadosHtml += "<p class='detalhe'> CNPJ: <b>" + arData.empresas[key].NRInscricao +"</b></p>";
                    //dadosHtml += "<p class='detalhe'> CNPJ: <b>Descrição</b></p>";
                    //dadosHtml += "<p class='detalhe'> Endereço: <b>" + arData.empresas[key].DSEndereco +"</b></p>";
                    //dadosHtml += "<p class='detalhe'> Modalidade: <b>" + arData.empresas[key].Modalidade + "</b></p>";

                    dadosHtml += "</a>"
                });

                //...
                listDados.innerHTML = dadosHtml;
                document.getElementById("lista-elementos").appendChild(listDados);

                //listDados.animate({ height: 'toggle' });
                listDados.animate({ scrollHeight: 'toggle' });

                fadeOut("img_card_01", 0.6, "T");
                //fadeIn("img_card_02", 1, "F");

            } else {                            
                document.getElementById("lista-elementos").appendChild(btn01);
                document.getElementById("lista-elementos").appendChild(btn02);

                try {
                    listDados.remove();    
                } catch (error) {
                    console.log(error.message);
                }

                fadeIn("img_card_01", 0.6, "F");

                nivel2 = false;
            }
        } catch (error) {
            console.log(error.message);
        }

    } catch (error) {
        console.log(error.message);
    }
}

function carrgarListaPortuariaNivel2($scope) {
    try {
        //...
        listDados.innerHTML = "";
        listDados.style.visibility = "visible";

        try {
            if(nivel2 == false){
                btn01.remove();
                nivel2 = true;

                //...
                var arData = {};
                arData =  [ 
                      { Tipo: "Terminais Públicos" }
                    , { Tipo: "Terminais Privados" } 
                    , { Tipo: "Operadores Portuários" }
                    , { Tipo: "Porto Organizado" }
                ];

                //...
                var dadosHtml = "";
                angular.forEach(arData, async function (value, key) {
                    //dadosHtml += "<a onclick='detalhar(" + '"' + arData.empresas[key].NRInscricao + '"' + ',"' + arData.empresas[key].NRInstrumento + '"' +")' class='collection-item avatar'>";
                    dadosHtml += "<a onclick='abrirPesquisa(" + '"' + arData[key].Tipo + '"' +")' class='collection-item avatar'>";
                    //dadosHtml += "<img src='"+ arData.empresas[key].icone +"' alt='' class='circle'>";
                    dadosHtml += "<img src='img/icon-consultar.png' alt='' class='circle'>";
                    dadosHtml += "<span class='title'>"+ arData[key].Tipo +"</span>";
                    
                    dadosHtml += "<i class='material-icons right'>chevron_right</i>";
                    //dadosHtml += "<p class='detalhe'> CNPJ: <b>" + arData.empresas[key].NRInscricao +"</b></p>";
                    //dadosHtml += "<p class='detalhe'> CNPJ: <b>Descrição</b></p>";
                    //dadosHtml += "<p class='detalhe'> Endereço: <b>" + arData.empresas[key].DSEndereco +"</b></p>";
                    //dadosHtml += "<p class='detalhe'> Modalidade: <b>" + arData.empresas[key].Modalidade + "</b></p>";

                    dadosHtml += "</a>"
                });

                //...
                listDados.innerHTML = dadosHtml;
                document.getElementById("lista-elementos").appendChild(listDados);

                //$("div").animate({ height: 'toggle' });
                listDados.animate({ scrollHeight: 'toggle' });

                fadeOut("img_card_02", 0.6, "T");
                //fadeIn("img_card_01", 1, "F");
            } else {                            
                document.getElementById("lista-elementos").appendChild(btn01);
                document.getElementById("lista-elementos").appendChild(btn02);

                fadeIn("img_card_01", 0.6, "F");
                fadeIn("img_card_02", 0.6, "F");

                try {
                    listDados.remove();    
                } catch (error) {
                    console.log(error.message);
                }

                nivel2 = false;
            }
        } catch (error) {
            console.log(error.message);
        }

    } catch (error) {
        console.log(error.message);
    }
}

function abrirPesquisa(filtro) {
    sessionStorage.filtroConsultaCadastro = filtro;
    window.location = "empresa.tipoConsultaCadastroNivel3.html";
}


