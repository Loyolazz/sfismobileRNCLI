var app = angular.module('app', []);
app.controller('MainCtrl', function ($scope, $http) {

    try {

        listDados = document.getElementById("data-list");


        //...   
        var arData = {};

        if(sessionStorage.filtroConsultaCadastro == "Interior") {
            arData =  [ 
                  { Tipo: "Longitudinal Misto" }
                , { Tipo: "Longitudinal de Passageiros" } 
                , { Tipo: "Longitudinal de Carga" } 
                , { Tipo: "Travessia" } 
                , { Tipo: "Embarcação em Construção" } 
            ];
        } if(sessionStorage.filtroConsultaCadastro == "Marítima") {
            arData =  [ 
                  { Tipo: "Apoio Marítimo" }
                , { Tipo: "Apoio Portuário" } 
                , { Tipo: "Cabotagem" } 
                , { Tipo: "Longo Curso" } 
                , { Tipo: "Embarcação em Construção" } 
            ];
        } if(sessionStorage.filtroConsultaCadastro == "Terminais Públicos") {
            arData =  [ 
                { Tipo: "Arrendamento" }
              , { Tipo: "Contrato de Uso Temporário" } 
              , { Tipo: "Contrato de Transição" } 
          ];
        } if(sessionStorage.filtroConsultaCadastro == "Terminais Privados") {
            arData =  [ 
                { Tipo: "Terminal de Uso Privado (TUP)" }
              , { Tipo: "Estação de Transbordo de Cargas (ETC)" } 
              , { Tipo: "Instalação Portuária de Turismo (IPT)" } 
              , { Tipo: "Registro (IPR)" }
          ];
        } if(sessionStorage.filtroConsultaCadastro == "Operadores Portuários") {
            arData =  [ 
                { Tipo: "Operador Portuário" }
          ];
        } if(sessionStorage.filtroConsultaCadastro == "Porto Organizado") {
            arData =  [ 
                { Tipo: "Porto Organizado" }
          ];
        }

        //...
        var dadosHtml = "";
        angular.forEach(arData, async function (value, key) {
            //dadosHtml += "<a onclick='detalhar(" + '"' + arData.empresas[key].NRInscricao + '"' + ',"' + arData.empresas[key].NRInstrumento + '"' +")' class='collection-item avatar'>";
            dadosHtml += "<a onclick='abrirPesquisaNivel3(" + '"' + arData[key].Tipo + '"' +")' class='collection-item avatar'>";
            //dadosHtml += "<img src='"+ arData.empresas[key].icone +"' alt='' class='circle'>";
            dadosHtml += "<img src='img/icon-consultar.png' alt='' class='circle'>";
            dadosHtml += "<span class='title'>"+ arData[key].Tipo +"</span>";
            
            dadosHtml += "<i class='material-icons right'>chevron_right</i>";
            dadosHtml += "<p class='detalhe'><b>" + sessionStorage.filtroConsultaCadastro + "</b></p>";
            //dadosHtml += "<p class='detalhe'> CNPJ: <b>" + arData.empresas[key].NRInscricao +"</b></p>";
            //dadosHtml += "<p class='detalhe'> CNPJ: <b>Descrição</b></p>";
            //dadosHtml += "<p class='detalhe'> Endereço: <b>" + arData.empresas[key].DSEndereco +"</b></p>";
            //dadosHtml += "<p class='detalhe'> Modalidade: <b>" + arData.empresas[key].Modalidade + "</b></p>";

            dadosHtml += "</a>"
        });

        //...
        listDados.innerHTML = dadosHtml;
        //document.getElementById("data-list").appendChild(listDados);
                

                
    } catch(ex) {
        console.log(ex.message);
    }

    

})

function abrirPesquisaNivel3(filtro) {
    sessionStorage.filtroConsultaCadastroNivel3 = filtro;
    window.location = "empresa.cadastroAutorizadas.html";
}