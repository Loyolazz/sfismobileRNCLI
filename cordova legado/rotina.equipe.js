var app = angular.module('app', []);

app.controller('MainCtrl', function ($scope, $http) {
    preloadInit('Carregando equipe');


    $scope.completo = false;
    $scope.empresa = {};

    $scope.empresa = angular.fromJson(sessionStorage.getItem("arEmpresa"));

    document.body.style.backgroundColor = "#ddd";

    console.log($scope.empresa);

    $scope.arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));
    console.log($scope.arUsuario);

    if (!$scope.arUsuario.servidor) {
        $scope.arUsuario.servidor = [];
        if (!$scope.arUsuario.servidor.SGUnidade) {
            $scope.arUsuario.servidor.SGUnidade = 'CSI';
        }
    }

    $scope.servidores = {};
    $scope.servidores = angular.fromJson(sessionStorage.getItem("arEquipe"));
    $scope.unidadesFiscalizacao = mapearUnidadeOrganizacional($scope.servidores);
    $scope.unidadeFiscalizacao = $scope.arUsuario.servidor.IDUnidadeOrganizacional;
    $scope.coordenadorCPF = null;

    //var arData = { Sigla: $scope.arUsuario.servidor.SGUnidade, NomeUsuario: '', Matricula: '', IdUnidadeOrganizacional: '' };
    //console.log(arData);
    //$http({
    //    url: urlService() + 'ConsultarServidores',
    //    method: "POST",
    //    data: arData
    //}).then(function (response) {
    //           $scope.servidores = angular.fromJson(response.data.d);
    //            console.log($scope.servidores);
    //            $scope.completo = true;
    //            preloaderStop();
    //        },
    //        function (response) { // optional
    //            $scope.completo = false;
    //        });


    /*
     $.ajax({
               type: "POST",
               url: "http://sfismobile.antaq.gov.br/AntaqService/Services.asmx/ConsultarServidores",
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               data: arData,
               error: function (XMLHttpRequest, textStatus, errorThrown)
                   {
                     console.log(XMLHttpRequest)
                   },
               success: function (msg)
               {
                   alert(msg.d.Message);
               }
     });
     */
    $scope.fechaTeclado = function () {
        angular.element(document.activeElement.blur());
    };

    $scope.decotificar = function (foto) {
        if (foto && Object.keys(foto).length > 0) {
            let retorno = _arrayBufferToBase64(foto);
            return retorno;
        }
        return null;
    }

    $scope.atualizarEquipe = function () {
        $scope.completo = false;
        preloadInit('Carregando equipe');
        gestorCarregarDadosEquipe().then(function () {
            $scope.servidores = angular.fromJson(sessionStorage.getItem("arEquipe"));
            $scope.unidadesFiscalizacao = mapearUnidadeOrganizacional($scope.servidores);
            $scope.unidadeFiscalizacao = $scope.arUsuario.servidor.IDUnidadeOrganizacional;
            $scope.inicializarEquipeSelecionada();
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

    $scope.filtroSelecionados = function(servidor) {
        return servidor.check === true;
    }

    $scope.definirCoordenador = function(servidor) {
        if ($scope.coordenadorCPF === servidor.NRCPF) {
            $scope.coordenadorCPF = null;
            sessionStorage.removeItem('coordenadorSelecionado');
        } else {
            $scope.coordenadorCPF = servidor.NRCPF;
            $scope.unidadeFiscalizacao = servidor.IDUnidadeOrganizacional;
            sessionStorage.setItem('coordenadorSelecionado', angular.toJson(servidor));
        }

        angular.forEach($scope.servidores, function (value) {
            value.STCoordenador = (value.NRCPF === $scope.coordenadorCPF);
        });
        var arEquipeSelecionada = angular.fromJson(sessionStorage.getItem("arEquipeSelecionada") || '[]');
        angular.forEach(arEquipeSelecionada, function(value) {
            value.STCoordenador = (value.NRCPF === $scope.coordenadorCPF);
        });
        sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipeSelecionada));
    }

    //verificar se os servidor já fui marcado
    $scope.onCheck = function (servidor) {

        var arServidor = $scope.servidores;
        var arEquipeSelecionada = [];
        angular.forEach(arServidor, function (value, key) {
            if (arServidor[key]['check'] == true) {
                arEquipeSelecionada.push(arServidor[key]);
            }
        });

        if (!servidor.check && $scope.coordenadorCPF === servidor.NRCPF) {
            $scope.coordenadorCPF = null;
            sessionStorage.removeItem('coordenadorSelecionado');
        }

        angular.forEach(arEquipeSelecionada, function(value) {
            value.STCoordenador = (value.NRCPF === $scope.coordenadorCPF);
        });

        //if (servidor.check) {
        //    //console.log(servidor);
        //    arServidor.push(servidor);
        //} else {
        //    angular.forEach(arServidor, function (value, key) {
        //        if (arServidor[key]['NRCPF'] == servidor.NRCPF) {
        //            arServidor.splice(key, 1);
        //        }
        //    });
        //}

        sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipeSelecionada));

    };

    $scope.detalhar = function () {
        var arServidor = $scope.servidores;
        var arEquipeSelecionada = [];
        angular.forEach(arServidor, function (value, key) {
            if (arServidor[key]['check'] == true) {
                arEquipeSelecionada.push(arServidor[key]);
            }
        });

        if (arEquipeSelecionada.length === 0) {
            alert("Selecione ao menos um servidor para a equipe.");
            return;
        }
        if (!$scope.coordenadorCPF) {
            alert("Selecione o coordenador da fiscalização.");
            return;
        }

        angular.forEach(arEquipeSelecionada, function(value) {
            value.STCoordenador = (value.NRCPF === $scope.coordenadorCPF);
        });
        var coord = arEquipeSelecionada.find(function(e){ return e.NRCPF === $scope.coordenadorCPF; });
        if (coord) {
            sessionStorage.setItem('coordenadorSelecionado', angular.toJson(coord));
        }

        sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipeSelecionada));

        var coordenador = arEquipeSelecionada.find(function(e){ return e.STCoordenador === true; });
        if (coordenador) {
            sessionStorage.setItem("coordenadorSelecionado", angular.toJson({
                NRMatricula: coordenador.NRMatriculaServidor || coordenador.NRMatricula,
                SGUnidade: coordenador.SGUnidade
            }));
        }

        window.location = "comum.tipo.html";
    }

    $scope.inicializarEquipeSelecionada = function() {
        var arServidor = $scope.servidores;
        var arEquipeSelecionada = angular.fromJson(sessionStorage.getItem("arEquipeSelecionada") || '[]');
        $scope.idCoordenador = sessionStorage.getItem("idCoordenador");


        if (arEquipeSelecionada.length === 0) {
            var usuario = arServidor.find(function(e){ return e.NRCPF === $scope.arUsuario.servidor.NRCPF; });
            if (usuario) {
                usuario.check = true;
                arEquipeSelecionada.push(usuario);
            }
        }

        var coordenador = arEquipeSelecionada.find(e => e.STCoordenador === true);
        if (coordenador) {
            $scope.coordenadorCPF = coordenador.NRCPF;
            sessionStorage.setItem('coordenadorSelecionado', angular.toJson(coordenador));
        }

        angular.forEach(arServidor, function (value, key) {

            if (arEquipeSelecionada.find(e => e.NRCPF == arServidor[key]['NRCPF'])) {
                arServidor[key]['check'] = true;
            }
            if (arEquipeSelecionada.find(e => e.NRCPF == arServidor[key]["NRCPF"] && e.STCoordenador)) {
                $scope.idCoordenador = arServidor[key]["NRCPF"];

            }
        });

        sessionStorage.setItem("idCoordenador", $scope.idCoordenador);
        sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipeSelecionada));
        $scope.completo = true;
        preloaderStop();
    }

    $scope.inicializarEquipeSelecionada();

})

function preloaderStop() {
    var myEl = angular.element(document.querySelector('#preloader'));
    myEl.remove();
}

function mapearUnidadeOrganizacional(servidores) {
    function mapaUnidade (e) {
        return {
            IDUnidadeOrganizacional: e.IDUnidadeOrganizacional,
            SGUnidade: e.SGUnidade,
            NOUnidadeOrganizacional: e.NOUnidadeOrganizacional,
            DSUnidade: e.SGUnidade + ' - ' + e.NOUnidadeOrganizacional
        };
    }

    var unidades = _.uniq(_.map(servidores, mapaUnidade), 'IDUnidadeOrganizacional');
    return unidades;
}
