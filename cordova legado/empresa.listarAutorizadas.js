var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {


    $scope.empresas = {};
    $scope.empresas = angular.fromJson(sessionStorage.getItem("arEmpresas"));
    $scope.empresa = {};

    $scope.historicoEmAndamento = [];
    $scope.historicoJulgados = [];
    $scope.historicoAutoInfracao = [];
    $scope.historicoNotificacao = [];
    $scope.acoesFiscalizadoras = [];
    $scope.listaAnosAcoesFiscalizadoras = [];
    $scope.anoReferenciaAcoesFiscalizadoras = "" + new Date().getFullYear();
    $scope.embarcacoes = angular.fromJson(sessionStorage.getItem("arTrecho"));

    document.body.style.backgroundColor = "white";

    console.log('Empresas',angular.fromJson(sessionStorage.getItem("arEmpresas")))
    console.log('Trechos',angular.fromJson(sessionStorage.getItem("arTrecho")))

    try {

        var msg = null;
        var qtd = $scope.empresas.length;

        if(qtd > 1 ) {
          msg = "<a>" + qtd + " Empresas encontradas.</a>";
        }
        else if(qtd == 1 ) {
          msg = "<a> 1 Empresa encontrada.</a>";
        }
        else if(qtd == 0) {
          msg = "<a> Nenhuma empresa localizada.</a>";
        }

        document.getElementById("data-qtd").innerHTML = msg;

    } catch(ex) {
      console.log(ex.message);
    }


    preloaderStop();

    //var url_string = window.location.href;
    //var url = new URL(url_string);
    //var filtro = url.searchParams.get("pesquisar");
    //var modalidade = url.searchParams.get("modalidade");

    //var params = filtro;
    //if(modalidade) {
    //  data = {modalidade: modalidade, cnpjRazaosocial: '' }
    //}
    //if(filtro){
    //  data = { cnpjRazaosocial: filtro, modalidade: '' }
    //}

    //$http({
    //    url: urlService() + 'ConsultarEmpresasAutorizadas',
    //    method: "POST",
    //    data: data
    //})
    //  .then(function (response) {
    //      $scope.empresas = response.data.d;
    //      $scope.filtro = params;
    //      console.log($scope.empresas);
    //      angular.forEach($scope.empresas, function (value, key) {
    //          //acesso à util.js para montar os link e associar as normas... a util.js precisa estar na sua HTML
    //          $scope = verificaAutorizacao($scope, key);
    //      });
    //      preloaderStop();
    //      console.log($scope.empresas);
    //  },
    //  function (response) { // optional
    //      console.log(response.message);
    //  });

    $scope.detalhar = async function (empresa) {
        //armaneza os dados da empresa na storage session
        sessionStorage.setItem('arEmpresa', angular.toJson(empresa));

        if(empresa.link === "empresa.geo.html")
        {
          gestorCarregarDadosInstalacoesPortuarias(empresa.NRInscricao, empresa.Instalacao, empresa.Modalidade);
        }
        else if (empresa.link === "empresa.trecho.html")
        {
           console.log('trecho');
           gestorCarregarDadosTrechoLinhaTipoTransporteListar(empresa.NRInscricao, empresa.NRInstrumento, empresa.Instalacao);
        }
        else if (empresa.link === "empresa.embarcacao.html")
        {
            sessionStorage.setItem("origemEmbarcacao", "empresa.listarAutorizadas.html");
            console.log('embarcacao');
            gestorCarregarDadosFrotaAlocada(empresa.NRInscricao, empresa.NRInstrumento, "F");
        }
        else
        {
           window.location = empresa.link;
        }
    }

    $scope.formatarNRCnpj = function (nrCnpj) {
      if (nrCnpj) return mCNPJ(nrCnpj);
      return nrCnpj;
  }

    $scope.formatarData = function (data) {
        if (!data || data == '01/01/1900 00:00:00') {
            return null;
        } else {
            var split = data.split('/');
            var ano = split[2].split(' ')
            var novadata = split[0] + "/" + split[1] + "/" + ano[0];
            return novadata;
        }
    }

    $scope.selecionarPasso = function(passoSelecionar) {
      $('.modal-passo').addClass("hide");
      $(passoSelecionar).removeClass("hide");
      $("#modal_historico").scrollTop(0);
    };

    $scope.muda = function(){
      setTimeout(function(){
              $('select').formSelect();
              let acoesFiscalizadoras = $scope.acoesFiscalizadoras.filter((item) => {
                  return item.NRAnoFiscalizacao == $scope.anoReferenciaAcoesFiscalizadoras;
              });
              window.myPie.destroy();
              $scope.graficoAcoesFiscalizadoras(acoesFiscalizadoras);
          }, 200)
    }

    $scope.listaPeriodoReferencia = async function (acoesFiscalizadoras) {
        try {

            let periodo = [];
            let existeAno = false;

            if (acoesFiscalizadoras.length > 0)
            {
              acoesFiscalizadoras.forEach(function(item) {
                    let ano = item.NRAnoFiscalizacao;
                    if ($scope.anoReferenciaAcoesFiscalizadoras == ano)
                        existeAno = true;
                    if (periodo.indexOf(ano) < 0)
                        periodo.push(ano);
                });
            }

           $scope.listaAnosAcoesFiscalizadoras = periodo;
           if (!existeAno && periodo.length > 0)
                $scope.anoReferenciaAcoesFiscalizadoras = periodo[periodo.length -1];
           $scope.$apply();

            setTimeout(function(){
                $('select').formSelect();
            }, 1000)

        } catch (error) {
            console.log('listaPeriodoReferencia' + error.message);
        }
    }

    $scope.graficoAcoesFiscalizadoras = function(acoesFiscalizadoras) {
      const chartColors = [
          'rgb(255, 99, 132)', // red
          'rgb(255, 159, 64)', // orange
          'rgb(255, 205, 86)', // yellow
          'rgb(75, 192, 192)', // green
          'rgb(54, 162, 235)', // blue
          'rgb(153, 102, 255)', // purple
          'rgb(201, 203, 207)', // grey
          'rgb(187,204,226)', // blue01
          'rgb(116,162,220)', // blue02
          'rgb(89,124,169)', // blue03
          'rgb(49,68,92)' // blue04
      ];

      const totalAcoes = acoesFiscalizadoras.reduce((n, {QTFiscalizacao}) => n + QTFiscalizacao, 0);
      var arData = [];
      var arLabels = [];
      var arColors = [];
      for(var i = 0; i < acoesFiscalizadoras.length; i++) {
        let valor = (acoesFiscalizadoras[i].QTFiscalizacao*100/totalAcoes).toFixed(0);
        arData.push(valor);
        arLabels.push(acoesFiscalizadoras[i].TipoFiscalizacao);
        arColors.push(chartColors[i]);
      }

      var config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: arData,
                backgroundColor: arColors,
                label: 'Ações Fiscalizadoras'
            }],
            labels: arLabels
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return ' ' + data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
                }
              }
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(114,114,114)',
                    fontSize: 16
                }
            },
        }
      };

      var ctx = document.getElementById('chart-area').getContext('2d');
      window.myPie = new Chart(ctx, config);
    }

    $scope.modalHistoricoFiscalizacoes = function(historicoFiscalizacoes) {
      $scope.historicoEmAndamento = [];
      $scope.historicoJulgados = [];
      $scope.historicoAutoInfracao = [];
      $scope.historicoNotificacao = [];
      $scope.acoesFiscalizadoras = [];

      // console.log(historicoFiscalizacoes);
      if (historicoFiscalizacoes.HistoricoProcessosEmpresa) {
          $scope.historicoEmAndamento = historicoFiscalizacoes.HistoricoProcessosEmpresa.filter((historico) => {
              return historico.TPHistorico == "1";
          });
          $scope.historicoJulgados = historicoFiscalizacoes.HistoricoProcessosEmpresa.filter((historico) => {
              return historico.TPHistorico == "2";
          });
          $scope.historicoAutoInfracao = historicoFiscalizacoes.HistoricoProcessosEmpresa.filter((historico) => {
              return historico.TPHistorico == "3";
          });
          $scope.historicoNotificacao = historicoFiscalizacoes.HistoricoProcessosEmpresa.filter((historico) => {
              return historico.TPHistorico == "4";
          });
      }
      if (historicoFiscalizacoes.HistoricoAcoesFiscalizadoras && historicoFiscalizacoes.HistoricoAcoesFiscalizadoras.length > 0) {
        $scope.acoesFiscalizadoras = historicoFiscalizacoes.HistoricoAcoesFiscalizadoras;
        $scope.listaPeriodoReferencia($scope.acoesFiscalizadoras);
        setTimeout(function(){
          inicializarMaterializeSelect();
          let acoesFiscalizadoras = $scope.acoesFiscalizadoras.filter((item) => {
              return item.NRAnoFiscalizacao == $scope.anoReferenciaAcoesFiscalizadoras;
          });
          $scope.graficoAcoesFiscalizadoras(acoesFiscalizadoras);
        }, 200)
      }

      $scope.selecionarPasso('#passoProcessosAndamento');
      var elemento = $("#modal_historico");
      var instance = M.Modal.getInstance(elemento);
      instance.open();
    };

    //...
    $scope.exibirHistorico = async function (empresa) {

        $scope.empresa = empresa;
        preloadInit(getMensagemVersaoTrainee("Consultando histórico da empresa", "."));
        var arData = { nrinscricao: empresa.NRInscricao };

        $http({
            url: urlService() + 'ConsultarHistoricoFiscalizacoesPorEmpresa',
            method: "POST",
            data: arData
        }).then(async function(response) {
                // console.log(response);

                /*.......*/
                var arHistorico = response.data.d;

                /*.......*/
                preloaderStop();
                if (response.status == 200) {
                    if (arHistorico.length == 0) {
                      $scope.empresa = {};
                      notificar(response.data.Message, "Erro consultar histórico de fiscalizações!", 'exibirHistorico->ConsultarHistoricoFiscalizacoesPorEmpresa', JSON.stringify({'response':response, 'arData':arData}) );
                    }
                    else
                        $scope.modalHistoricoFiscalizacoes(arHistorico);
                } else {
                  $scope.empresa = {};
                  notificar(response.data.Message, "Erro consultar histórico de fiscalizações!", 'exibirHistorico->ConsultarHistoricoFiscalizacoesPorEmpresa', JSON.stringify({'response':response, 'arData':arData}) );
                }
            },
            function(response) {
                $scope.empresa = {};
                preloaderStop();
                notificar(response.data.Message, "Erro consultar histórico de fiscalizações!", 'exibirHistorico->ConsultarHistoricoFiscalizacoesPorEmpresa', JSON.stringify({'response':response, 'arData':arData}) );
            });
    }

    $scope.fechar = function (modal) {
        var elemento = $("#"+modal);
        var instance = M.Modal.getInstance(elemento);
        instance.close();
    }

})

// function onDeviceReady()
// {
//   CarregarDadosAutorizadas();
// }

// function CarregarDadosAutorizadas()
// {
//   try
//   {
//       preloadInit("Carregando Dados");

//       db = openDB();

//       var query = "SELECT "
//         +"  ID "
//         +" ,AREAPPF "
//         +" ,DSBAIRRO "
//         +" ,DSENDERECO "
//         +" ,DTADITAMENTO "
//         +" ,DTOUTORGA "
//         +" ,EMAIL "
//         +" ,INSTALACAO "
//         +" ,LISTATIPOEMPRESA "
//         +" ,MODALIDADE "
//         +" ,NOMUNICIPIO "
//         +" ,NORAZAOSOCIAL "
//         +" ,NRADITAMENTO "
//         +" ,NRCEP "
//         +" ,NRINSCRICAO "
//         +" ,NRINSTRUMENTO "
//         +" ,NOMECONTATO "
//         +" ,QTDEMBARCACAO "
//         +" ,SGUF "
//         +" ,TPINSCRICAO "
//       +" FROM EMPRESASAUTORIZADAS"
//       +" WHERE UPPER(NORAZAOSOCIAL) LIKE UPPER('%PIPES%')";

//       var arData = {};
//       arData.empresas = [];

//       /*===============================================*/
//       db.transaction(function(tx) {
//         tx.executeSql(query, [], function(tx,res) {
//             for(var i = 0; i < res.rows.length; i++)
//             {
//               //...
//                 arData.empresas.push({
//                   //ID: res.rows.item(i).ID
//                   AreaPPF: res.rows.item(i).AREAPPF,
//                   DSBairro: res.rows.item(i).DSBAIRRO,
//                   DSEndereco: res.rows.item(i).DSENDERECO,
//                   DTAditamento: res.rows.item(i).DTADITAMENTO,
//                   DTOutorga: res.rows.item(i).DIAUTORGA,
//                   Email: res.rows.item(i).EMAIL,
//                   Instalacao: res.rows.item(i).INSTALACAO,
//                   ListaTipoEmpresa:res.rows.item(i).LISTATIPOEMPRESA,
//                   Modalidade: res.rows.item(i).MODALIDADE,
//                   NOMunicipio: res.rows.item(i).NOMUNICIPIO,
//                   NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
//                   NRAditamento: res.rows.item(i).NRADITAMENTO,
//                   NRCEP: res.rows.item(i).NRCEP,
//                   NRInscricao: res.rows.item(i).NRINSCRICAO,
//                   NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
//                   NomeContato: res.rows.item(i).NOMECONTATO,
//                   QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
//                   SGUF: res.rows.item(i).SGUF,
//                   TPInscricao: res.rows.item(i).TPINSCRICAO
//                 });
//             }

//             //...
//             //$scope.empresas = arData;
//             console.log(arData.empresas);

//             //...
//             angular.forEach(arData.empresas, function (value, key) {
//                       arData = verificaAutorizacao(arData, key);
//             });

//             console.log(arData.empresas);
//         }
//      );


//     }, function(err){
//         alert('CarregarDadosAutorizadas: An error occured while displaying saved notes');
//     });
//   }
//   catch (erro)
//   {
//     console.log('CarregarDadosAutorizadas', erro.message);
//   }
//   finally
//   {
//     preloaderStop();
//   }
// }












