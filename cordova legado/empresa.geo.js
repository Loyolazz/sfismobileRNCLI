var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {

    $scope.empresa = {};

    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));
    sessionStorage.removeItem("arEquipeSelecionada");

    document.body.style.backgroundColor = "white";

    console.log($scope.empresas)
    console.log(angular.fromJson(sessionStorage.getItem("arEmpresas")))
    console.log($scope.empresa.NRInscricao);

    //$http({
    //    url: urlService() + 'ConsultarInstalacoesPortuarias',
    //    method: "POST",
    //    //verificar a necessidade de tantos campos obrigatórios
    //    data: {
    //        cnpj: $scope.empresa.NRInscricao
    //          , Nome: ''
    //          , DSEndereco: ''
    //          , TPInstalacaoPortuaria: ''
    //          , localizacao: ''
    //          , cdinstalacaoportuaria: ''
    //          , VLLatitude: ''
    //          , VLLongitude: ''
    //    }
    //})
    //  .then(function (response) {
    //      $scope.terminais = response.data.d;
    //      sessionStorage.setItem("arTerminais", angular.toJson($scope.terminais));
    //      console.log(response.data.d);
    //      //HOJE ESTÁ UM PARA UM, VERIFICAR SE AS INFORMAÇÕES ESTÃO ATUALIZADAS
    //      if ($scope.terminais.length > 0) {
    //
    //          carregarMapa($scope.terminais[0])
    //      } else {
    //          var mensagem = '<p>Empresa sem terminal vinculado</p>';
    //          M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
    //          window.location = "rotina.equipe.html";
    //      }
    //      preloaderStop();
    //  },
    //  function (response) { // optional
    //      console.log(response);
    //  });

    $scope.terminais = angular.fromJson(sessionStorage.getItem("arTerminais"));
    if ($scope.terminais.length > 0) {
        var terminal = $scope.terminais[0];
        if ($scope.empresa.Instalacao) {
            const len = $scope.terminais.length;
            for( let i = 0; i < len; i++ ){
                if ($scope.terminais[i].nome == $scope.empresa.Instalacao) {
                    terminal = $scope.terminais[i];
                    break;
                }
            }
        }

        carregarMapa(terminal)
    } else {
        if ($scope.empresa.AreaPPF.includes("Marítima")) {

            var mensagem = '<p>Não é possível cadastrar fiscalização de empresa de navegação marítima via SFIS Mobile!</p>';
            M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
            return;
        }

        var mensagem = '<p>Empresa sem terminal vinculado</p>';
        M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
        window.location = "rotina.equipe.html";

    }
    preloaderStop();



    $scope.empresa.NRInscricao = mCNPJ($scope.empresa.NRInscricao);


    sessionStorage.setItem("arEmpresa", angular.toJson($scope.empresa));

    $scope.iniciarFiscalizacao = function() {
        if ($scope.empresa.AreaPPF.includes("Marítima")) {
            var mensagem = '<p>Não é possível cadastrar fiscalização de empresa de navegação marítima via SFIS Mobile!</p>';
            M.toast({ html: mensagem, classes: "#c62828 red darken-3" });
            return;
        }
            navigator.notification.confirm(
                'Deseja iniciar a fiscalização?', // message
                function(buttonIndex) {
                    iniciaFiscalizacao(buttonIndex, $scope);
                    }, // callback to invoke with index of button pressed
                'Iniciar fiscalização', // title
                ['Sim','Não'] // buttonLabels
            );


    }

})

function carregarMapa(terminal) {

    try {
          //removendo os espaços
          var latitude = terminal.latitude.replace(/\s{2,}/g, '');
          var longitude = terminal.longitude.replace(/\s{2,}/g, '');

          //latitude = terminal.latitude.replace("O", 'W').replace("°","");
          //longitude = terminal.longitude.replace("O", 'W').replace("°","");



          let n = false;
          try {
                n = longitude.includes("O");
                if(n == true) {
                    latitude = ParseDMS(latitude);
                    longitude = ParseDMS(longitude);
                } else {

                    //latitude = ddToDmsLat(latitude);
                    //longitude = ddToDmsLng(longitude);

                    latitude = latitude.replace("°","");
                    longitude = longitude.replace("°","");

                    latitude = latitude.replace(",", '.');
                    longitude = longitude.replace(",", '.');

                    latitude = corrigirLatLong(latitude);
                    longitude = corrigirLatLong(longitude);
                }
            } catch (error) {
                console.log(error.message);
            }

          //latitude = ParseDMS(latitude);
          //longitude = ParseDMS(longitude);
          try {
            loadGoogleMaps(latitude, longitude, terminal);
          }
          catch (err) {
              logErro('carregarMapa->loadGoogleMaps', err.message, JSON.stringify({'terminal':terminal}) );
              //if(err.message == "google is not defined") {
              window.location = "rotina.equipe.html";
              //}
          }

  } catch (err) {
        logErro('carregarMapa', err.message, JSON.stringify({'terminal':terminal}) );
        //if(err.message == "google is not defined") {
        window.location = "rotina.equipe.html";
        //}
  }

}

function loadGoogleMaps(latitude, longitude, terminal) {
    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.53&key=AIzaSyBByE0Uc7WXYndpyTk_3he-TqgSQ4Pyhbw&callback=initMap';
    script.async = true;

    // Attach your callback function to the `window` object
    window.initMap = function() {
        // JS API is loaded and available
        var latLong = new google.maps.LatLng(latitude, longitude);

        var mapOptions = {
            center: latLong,
            zoom: 13,
            MapTypeId: google.maps.MapTypeId.ROADMAP,
            gestureHandling: 'greedy'
        };

        var conteudo = '<p> Terminal com a situação ' + terminal.situacao + '</p>'
                + '<p> Modalidade ' + terminal.modalidade + '</p>'
                + '<p> Localizada na ' + terminal.regiaohidrografica + '</p>'
                + '<p> <a href="rotina.equipe.html"> Iniciar Fiscalização </a></p>';

        var infowindow = new google.maps.InfoWindow({
            content: conteudo
        });

        var map = new google.maps.Map(document.getElementById("mapa"), mapOptions)

        var marker = new google.maps.Marker({
            position: latLong,
            map: map,
            icon: 'img/icon-terminal2.png',
            title: terminal.nome
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });

        map.setCenter(marker.getPosition());
    };

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
}

// Função que constrói a string de conversão
// de coordenadas em DD para DMS.
function ddToDmsLat(lat) {

   var lat = lat;
   var latResult, dmsResult;

   lat = parseFloat(lat);

   latResult = (lat >= 0)? 'N' : 'S';

   // Chamada à função getDms(lat) para as coordenadas da Latitude em DMS.
   // O resultado será adicionado à variável latResult.
   latResult += getDms(lat);



   // Agora é só juntar as duas variáveis e separá-las com um espaço.
   dmsResult = latResult;

   // Devolvendo a string
   return dmsResult;
}

// Função que constrói a string de conversão
// de coordenadas em DD para DMS.
function ddToDmsLng(lng) {


   var lng = lng;
   var lngResult, dmsResult;


   lng = parseFloat(lng);



   lngResult = (lng >= 0)? 'E' : 'W';

   // Chamada à função getDms(lng) para as coordenadas da Longitude em DMS.
   // O resultado será adicionado à variável lngResult.
   lngResult += getDms(lng);

   // Agora é só juntar as duas variáveis e separá-las com um espaço.
   dmsResult = lngResult;

   // Devolvendo a string
   return dmsResult;
}

function getDms(val) {

  var valDeg, valMin, valSec, result;

  val = Math.abs(val);

  valDeg = Math.floor(val);
  result = valDeg + "°";

  valMin = Math.floor((val - valDeg) * 60);
  result += valMin + "'";

  valSec = Math.round((val - valDeg - valMin / 60) * 3600 * 1000) / 1000;
  result += valSec + '"';

  return result;
}

function ParseDMS(input) {
    var parts = input.split(/[^\d\w\.]+/);
    var latLng = ConvertDMSToDD(parts[0], parts[1], parts[2] + "." + parts[3], parts[4]);
    return latLng;
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {

    var dd = parseInt(degrees) + (minutes / 60) + (seconds / (60 * 60));
    //var dd = degrees, minutes, seconds, direction;

    if (direction == "S" || direction == "W" || direction == "O") {
        dd = dd * -1;

    } // Don't do anything for N or E
    return dd;
}

function iniciaFiscalizacao(buttonIndex, $scope)
{
    try {

      if(buttonIndex == 1) {

          window.location = "rotina.equipe.html";
      }
      else {
          var msgCancelar = '<p>Cancelado!</p>';
          M.toast({html: msgCancelar, classes:"#c62828 green darken-3"});
      }

    } catch(erro) {
        console.log(erro.message);
    }
}



