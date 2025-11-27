// EXTRAÍDO de gestor_bd.js — Tabelas e funções relacionadas a EMPRESASAUTORIZADAS, FROTAALOCADA, LOGATUALIZACAO, LOGERRO
// Mantida a assinatura e corpo conforme o arquivo original.


// ===== CREATE TABLE: EMPRESASAUTORIZADAS =====

tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,AREAPPF VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,DTADITAMENTO VARCHAR " +
                    " ,DTOUTORGA VARCHAR " +
                    " ,EMAIL VARCHAR " +
                    " ,INSTALACAO VARCHAR " +
                    " ,INSTALACAOSEMACENTOS VARCHAR " +
                    " ,LISTATIPOEMPRESA VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRADITAMENTO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NOMECONTATO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO INTEGER " +
                    " ,VLMONTANTEINVESTIMENTO VARCHAR " +
                    " ,NRTLO VARCHAR " +
                    " ,NRRESOLUCAO VARCHAR " +
                    " ,AUTORIDADEPORTUARIA VARCHAR " +
                    " ,NRINSCRICAOINSTALACAO VARCHAR " +
                    " ,NORAZAOSOCIALINSTALACAO VARCHAR " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");


// ===== Funções relacionadas a EMPRESASAUTORIZADAS (total 27) =====

// ---- exportDadosDetalhados ----
function exportDadosDetalhados(cnpj, nrinstrumento) {
    openDB();
    db.transaction(function (tx) {
        var params = [],
            statement =
                " select " +
                "     empresa.AREAPPF 'Área', " +
                "     empresa.MODALIDADE 'Tipo de Serviço', " +
                "     empresa.NRINSCRICAO 'CNPJ', " +
                "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                "     CASE                                                       " +
                "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                "       ELSE empresa.DTOUTORGA " +
                "     END AS 'Data de Outorga',                                   " +
                "     empresa.SGUF 'UF', " +
                "     empresa.NOMUNICIPIO 'Município', " +
                "     frota.NOME 'Embarcação', " +
                "     frota.STATUS 'Status' " +
                " from EMPRESASAUTORIZADAS empresa  " +
                " left join ( select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADA " +
                " union " +
                " select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADAMARITIMA ) " +
                " frota on frota.NRINSCRICAO = empresa.NRINSCRICAO " +
                " where 1=1 ";
        if (cnpj && cnpj != "undefined") {
            statement += " and empresa.NRINSCRICAO = ? ";
            params.push(cnpj);
        }
        if (nrinstrumento && nrinstrumento != "undefined") {
            statement += " and empresa.NRINSTRUMENTO = ? ";
            params.push(nrinstrumento);
        }
        tx.executeSql(statement, params, function (tx, results) {
            var rows = [];
            for (let i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                row["CNPJ"] = mCNPJ(row["CNPJ"]);
                row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                rows.push(row);
            }
            triggerXlsxDownload(rows, nomeAPK() + "-Detalhes_Empresa");
        });
    });
}


// ---- exportDadosEmpresa ----
function exportDadosEmpresa(nomeArquivo, searchTerm, modalidade, empresas) {
    let columns = ["Área", "Tipo de Serviço", "CNPJ", "Razão Social", "Instalação/Trecho/Linha", "Nº Outorga", "Data de Outorga", "UF", "Município", "CNPJ Instalação", "Razão Social Instalação"];
    if (!empresas) {
        openDB();
        db.transaction(function (tx) {

            var params = [],
                statement =
                    " select " +
                    "     empresa.AREAPPF 'Área', " +
                    "     empresa.MODALIDADE 'Tipo de Serviço', " +
                    "     empresa.NRINSCRICAO 'CNPJ', " +
                    "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                    "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                    "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                    "     CASE                                                       " +
                    "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                    "       ELSE empresa.DTOUTORGA " +
                    "     END AS 'Data de Outorga',                                   " +
                    "     empresa.SGUF 'UF', " +
                    "     empresa.NOMUNICIPIO 'Município', " +
                    "     empresa.NRINSCRICAOINSTALACAO 'CNPJ Instalação', " +
                    "     empresa.NORAZAOSOCIALINSTALACAO 'Razão Social Instalação' " +
                    " from EMPRESASAUTORIZADAS empresa " +
                    " where 1=1" +
                    "     and empresa.NRINSCRICAO is not null " +
                    '     and empresa.NRINSCRICAO <> "" ';

            if (modalidade && modalidade != "undefined") {
                statement += " and empresa.MODALIDADE = ? ";
                params.push(modalidade);
            }
            if (searchTerm && searchTerm != "undefined") {
                statement +=
                    " and (empresa.NRINSCRICAO like ? or upper(empresa.NORAZAOSOCIAL) like upper(?)) ";
                params.push(searchTerm);
                params.push("%" + searchTerm + "%");
            }
            tx.executeSql(statement, params, function (tx, results) {
                var rows = [];
                for (let i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    if (row["CNPJ Instalação"] && row["CNPJ"] != row["CNPJ Instalação"]) {
                        row["CNPJ Instalação"] = mCNPJ(row["CNPJ Instalação"]);
                    } else {
                        row["CNPJ Instalação"] = "";
                        row["Razão Social Instalação"] = "";
                    }
                    row["CNPJ"] = mCNPJ(row["CNPJ"]);
                    row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                    rows.push(row);
                }
                triggerXlsxDownload(rows, nomeArquivo);
            }, (e) => {
                console.log(e);
            });
        });
        return;
    }

    let treatedArray = empresas.map((e) => {
        let cnpj = mCNPJ(e.NRInscricao);
        let cnpjInstalacao = "";
        let razaoSocialInstalacao = "";
        if (e.NRInscricaoInstalacao && e.NRInscricao != e.NRInscricaoInstalacao) {
            cnpjInstalacao = mCNPJ(e.NRInscricaoInstalacao);
            razaoSocialInstalacao = e.NORazaoSocialInstalacao;
        }

        let dtOutorga = (e.Modalidade && e.Modalidade == 'Porto Publico') ? 'NULL' : (e.DTOutorga ? formatDate(e.DTOutorga, "pt-br") : 'NULL');
        return {
            "Área": e.AreaPPF,
            "Tipo de Serviço": e.Modalidade,
            "CNPJ": cnpj,
            "Razão Social": e.NORazaoSocial,
            "Instalação/Trecho/Linha": e.Instalacao,
            "Nº Outorga": e.NRInstrumento,
            "Data de Outorga": dtOutorga,
            "UF": e.SGUF,
            "Município": e.NOMunicipio,
            "CNPJ Instalação": cnpjInstalacao,
            "Razão Social Instalação": razaoSocialInstalacao,
        }
    })

    triggerXlsxDownload(treatedArray, nomeArquivo);

}


// ---- gestorCarregarAutorizadasWeb ----
function gestorCarregarAutorizadasWeb($http) {
    try {
        gestorAbrirNotificacao(idSincAutorizadas, 'Sincronizando dados', ' Iniciando...', 'T');

        preloadInit("Atualizando Dados");

        var data = {modalidade: '', cnpjRazaosocial: ''}
        $http({
            url: urlService() + 'ListarEmpresasAutorizadas',
            method: "POST",
            data: data
        })
            .then(function (response) {
                try {
                    if (response.status == 200) {
                        idSincFinalizar = 0;

                        //...
                        openDB();

                        //...
                        db.transaction(function (tx) {
                            //...
                            tx.executeSql("DELETE FROM EMPRESASAUTORIZADAS");

                            //...
                            var empresas = response.data.d;

                            //...
                            angular.forEach(empresas, function (value, key) {
                                var razaosocial = removerAcentos(empresas[key].NORazaoSocial);
                                var modalidade = removerAcentos(empresas[key].Modalidade);
                                var cgc = formatarCNPJ(empresas[key].NRInscricao);
                                var instalacaosemacentos = removerAcentos(empresas[key].Instalacao);

                                var norepresentante = "";
                                var nrtelefone = "";
                                var eerepresentante = "";

                                if (empresas[key].STIntimacaoViaTelefone || empresas[key].STIntimacaoViaEmail) {
                                    norepresentante = empresas[key].NORepresentante;
                                    if (empresas[key].STIntimacaoViaTelefone) {
                                        nrtelefone = empresas[key].NRTelefone;
                                    }
                                    if (empresas[key].STIntimacaoViaEmail) {
                                        eerepresentante = empresas[key].EERepresentante;
                                    }
                                }

                                var query = "INSERT INTO EMPRESASAUTORIZADAS ( " +
                                    "  ID" +
                                    " ,AREAPPF " +
                                    " ,DSBAIRRO " +
                                    " ,DSENDERECO " +
                                    " ,DTADITAMENTO " +
                                    " ,DTOUTORGA " +
                                    " ,EMAIL " +
                                    " ,INSTALACAO " +
                                    " ,INSTALACAOSEMACENTOS " +
                                    " ,LISTATIPOEMPRESA " +
                                    " ,MODALIDADE " +
                                    " ,NOMUNICIPIO " +
                                    " ,NORAZAOSOCIAL " +
                                    " ,NRADITAMENTO " +
                                    " ,NRCEP " +
                                    " ,NRINSCRICAO " +
                                    " ,NRINSTRUMENTO " +
                                    " ,NOMECONTATO " +
                                    " ,QTDEMBARCACAO " +
                                    " ,SGUF " +
                                    " ,TPINSCRICAO " +
                                    " ,NRINSCRICAOINSTALACAO " +
                                    " ,NORAZAOSOCIALINSTALACAO " +
                                    " ,NOREPRESENTANTE " +
                                    " ,NRTELEFONE " +
                                    " ,EEREPRESENTANTE " +
                                    " ,NRDOCUMENTOSEI " +
                                    " ) " +
                                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                tx.executeSql(query, [
                                        key, empresas[key].AreaPPF, empresas[key].DSBairro, empresas[key].DSEndereco, empresas[key].DTAditamento, empresas[key].DTOutorga, empresas[key].Email, empresas[key].Instalacao, instalacaosemacentos, empresas[key].ListaTipoEmpresa, modalidade, empresas[key].NOMunicipio, razaosocial, empresas[key].NRAditamento, empresas[key].NRCEP, cgc, empresas[key].NRInstrumento, empresas[key].NomeContato, empresas[key].QTDEmbarcacao, empresas[key].SGUF, empresas[key].TPInscricao
                                        , empresas[key].NRInscricaoInstalacao, empresas[key].NORazaoSocialInstalacao, norepresentante, nrtelefone, eerepresentante, empresas[key].NRDocumentoSEI
                                    ], function (tx, res) {
                                        console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                    },
                                    function (tx, error) {
                                        preloaderStop();
                                        console.log('INSERT error: ' + error.message);
                                    });
                            });

                            //...
                            gestorMarcarAtualizacao("EMPRESASAUTORIZADAS");

                            //...
                            gestorCarregarEquipeWeb($http);

                            //...
                            gestorFecharNotificacao(idSincAutorizadas, 'Sincronizando Autorizadas', 'Os dados foram atualizados', 'F');

                        });
                    }
                } catch (erro) {
                    logErro('gestorCarregarAutorizadasWeb', erro.message, JSON.stringify({'linha': erro.lineNumber}));
                    preloaderStop();
                    idSincFinalizar = 2;
                }
            }).catch(function () {
            preloaderStop();
            idSincFinalizar = 2;
        });
    } catch (erro) {
        logErro('gestorCarregarAutorizadasWeb', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
        idSincFinalizar = 2;
    }
}


// ---- gestorCarregarAutorizadasWebAsinc ----
function gestorCarregarAutorizadasWebAsinc($http) {
    try {

        preloadInit("Atualizando Dados");

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var data = {modalidade: '', cnpjRazaosocial: ''}
            $http({
                url: urlService() + 'ListarEmpresasAutorizadas',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                tx.executeSql("DELETE FROM EMPRESASAUTORIZADAS");

                                //..
                                tx.executeSql("DELETE FROM EMPRESACONTRATO");

                                //...
                                var empresas = response.data.d;

                                //...
                                angular.forEach(empresas, async function (value, key) {
                                    var razaosocial = removerAcentos(empresas[key].NORazaoSocial);
                                    var modalidade = removerAcentos(empresas[key].Modalidade);
                                    var cgc = formatarCNPJ(empresas[key].NRInscricao);
                                    var instalacaosemacentos = removerAcentos(empresas[key].Instalacao);

                                    var norepresentante = "";
                                    var nrtelefone = "";
                                    var eerepresentante = "";

                                    if (empresas[key].STIntimacaoViaTelefone || empresas[key].STIntimacaoViaEmail) {
                                        norepresentante = empresas[key].NORepresentante;
                                        if (empresas[key].STIntimacaoViaTelefone) {
                                            nrtelefone = empresas[key].NRTelefone;
                                        }
                                        if (empresas[key].STIntimacaoViaEmail) {
                                            eerepresentante = empresas[key].EERepresentante;
                                        }
                                    }

                                    //if(cgc == '21160021000144')
                                    //{
                                    //    console.log(empresas[key].NRInstrumento);
                                    //}

                                    var query = "INSERT INTO EMPRESASAUTORIZADAS ( " +
                                        "  ID" +
                                        " ,AREAPPF " +
                                        " ,DSBAIRRO " +
                                        " ,DSENDERECO " +
                                        " ,DTADITAMENTO " +
                                        " ,DTOUTORGA " +
                                        " ,EMAIL " +
                                        " ,INSTALACAO " +
                                        " ,INSTALACAOSEMACENTOS " +
                                        " ,LISTATIPOEMPRESA " +
                                        " ,MODALIDADE " +
                                        " ,NOMUNICIPIO " +
                                        " ,NORAZAOSOCIAL " +
                                        " ,NRADITAMENTO " +
                                        " ,NRCEP " +
                                        " ,NRINSCRICAO " +
                                        " ,NRINSTRUMENTO " +
                                        " ,NOMECONTATO " +
                                        " ,QTDEMBARCACAO " +
                                        " ,SGUF " +
                                        " ,TPINSCRICAO " +
                                        " ,IDCONTRATOARRENDAMENTO " +
                                        " ,VLMONTANTEINVESTIMENTO " +
                                        " ,NRTLO " +
                                        " ,NRRESOLUCAO " +
                                        " ,AUTORIDADEPORTUARIA " +
                                        " ,NRINSCRICAOINSTALACAO " +
                                        " ,NORAZAOSOCIALINSTALACAO " +
                                        " ,NOREPRESENTANTE " +
                                        " ,NRTELEFONE " +
                                        " ,EEREPRESENTANTE " +
                                        " ,NRDOCUMENTOSEI " +
                                        " ) " +
                                        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                    tx.executeSql(query, [
                                            key, empresas[key].AreaPPF, empresas[key].DSBairro, empresas[key].DSEndereco, empresas[key].DTAditamento, empresas[key].DTOutorga, empresas[key].Email, empresas[key].Instalacao, instalacaosemacentos, empresas[key].ListaTipoEmpresa, modalidade, empresas[key].NOMunicipio, razaosocial, empresas[key].NRAditamento, empresas[key].NRCEP, cgc, empresas[key].NRInstrumento, empresas[key].NomeContato, empresas[key].QTDEmbarcacao, empresas[key].SGUF, empresas[key].TPInscricao

                                            , empresas[key].IDContratoArrendamento, empresas[key].VLMontanteInvestimento, empresas[key].NRTLO, empresas[key].NRResolucao, empresas[key].AutoridadePortuaria
                                            , empresas[key].NRInscricaoInstalacao, empresas[key].NORazaoSocialInstalacao, norepresentante, nrtelefone, eerepresentante, empresas[key].NRDocumentoSEI
                                        ], function (tx, res) {
                                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                        },
                                        function (tx, error) {
                                            preloaderStop();
                                            console.log('INSERT error: ' + error.message);
                                        });

                                    try {
                                        if (empresas[key].IDContratoArrendamento > 0) {
                                            var queryContrato = "INSERT INTO EMPRESACONTRATO ( " +
                                                "  ID " +
                                                " ,NRCNPJ " +
                                                " ,IDCONTRATOARRENDAMENTO " +
                                                " ,IDCLASSIFICAOSUBCLASSIFICAOCARGA " +
                                                " ,IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI " +
                                                " ,IDGRUPOMERCADORIA " +
                                                " ,IDNATUREZACARGA " +
                                                " ,NRVERSAO " +
                                                " ,CDCONTRATO " +
                                                " ,NOGRUPOMERCADORIA " +
                                                " ,VLAREATOTAL " +
                                                " ,IDTIPOSERVICO " +
                                                " ,NOTIPOSERVICO " +
                                                " ,NOCLASSIFICACAOCARGA " +
                                                " ) " +
                                                " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                            tx.executeSql(queryContrato, [
                                                    key, empresas[key].ContratoEmpresa[0].NRCnpj, empresas[key].ContratoEmpresa[0].IDContratoArrendamento, empresas[key].ContratoEmpresa[0].IDClassificaoSubclassificaoCarga, empresas[key].ContratoEmpresa[0].IDClassificaoSubclassificaoCargaPai, empresas[key].ContratoEmpresa[0].IDGrupoMercadoria, empresas[key].ContratoEmpresa[0].IDNaturezaCarga, empresas[key].ContratoEmpresa[0].NRVersao, empresas[key].ContratoEmpresa[0].CDContrato, empresas[key].ContratoEmpresa[0].NOGrupoMercadoria, empresas[key].ContratoEmpresa[0].VLAreaTotal, empresas[key].ContratoEmpresa[0].IDTipoServico, empresas[key].ContratoEmpresa[0].NOTipoServico, empresas[key].ContratoEmpresa[0].NOClassificacaoCarga
                                                ], function (tx, res) {
                                                    console.log("rowsAffectedContratoEmpresa: " + res.rowsAffected + " -- should be 1");
                                                },
                                                function (tx, error) {
                                                    preloaderStop();
                                                    console.log('INSERT ContratoEmpresa error: ' + error.message);
                                                });
                                        }
                                    } catch (error) {
                                        console.log("Erro contrato empresa" + error.message);
                                    }

                                });

                                //...
                                gestorMarcarAtualizacao("EMPRESASAUTORIZADAS");

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        logErro('gestorCarregarAutorizadasWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
                        preloaderStop();
                        resolve(true);
                    }

                })
                .catch(async function () {
                    preloaderStop();
                    resolve(true);
                });

        }, function (err) {
            logErro('gestorCarregarAutorizadasWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorCarregarAutorizadasWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}


// ---- gestorCarregarCadastroAutorizadas ----
function gestorCarregarCadastroAutorizadas(valor, tipo, nrinstrumento) {

    var arData = {};
    arData.empresas = [];
    arData.contrato = [];
    let flagAgruparInterior = false;
    let modalidade = null;

    try {
        modalidade = removerAcentos(sessionStorage.filtroConsultaCadastroNivel3);
        modalidade = modalidade.replace(" (TUP)", "");
        modalidade = modalidade.replace(" (ETC)", "");
        modalidade = modalidade.replace(" (IPT)", "");
        modalidade = modalidade.replace(" (IPR)", "");
    } catch (error) {
        console.log(error.message);
    }

    try {
        openDB();

        var query = "SELECT ";
        query += "  EMPRESASAUTORIZADAS.ID ";
        query += " ,EMPRESASAUTORIZADAS.AREAPPF ";
        query += " ,EMPRESASAUTORIZADAS.DSBAIRRO ";
        query += " ,EMPRESASAUTORIZADAS.DSENDERECO ";
        query += " ,EMPRESASAUTORIZADAS.DTADITAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.DTOUTORGA ";
        query += " ,EMPRESASAUTORIZADAS.EMAIL ";
        query += " ,EMPRESASAUTORIZADAS.INSTALACAO ";
        query += " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA ";
        if ((modalidade != null) && (modalidade != "undefined")) {
            query += " ,'" + modalidade + "' as MODALIDADE ";
        } else {
            query += " ,EMPRESASAUTORIZADAS.MODALIDADE ";
        }
        query += " ,EMPRESASAUTORIZADAS.NOMUNICIPIO ";
        query += " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL ";
        query += " ,EMPRESASAUTORIZADAS.NRADITAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NRCEP ";
        query += " ,EMPRESASAUTORIZADAS.NRINSCRICAO ";
        query += " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NOMECONTATO ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADAMARITIMA WHERE FROTAALOCADAMARITIMA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAOMARITIMA ";
        query += " ,(SELECT COUNT(*) FROM EMBARCACAOCONSTRUCAO WHERE EMBARCACAOCONSTRUCAO.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAOCONSTRUCAO ";
        query += " ,EMPRESASAUTORIZADAS.SGUF ";
        query += " ,EMPRESASAUTORIZADAS.TPINSCRICAO ";
        query += " ,EMPRESASAUTORIZADAS.IDCONTRATOARRENDAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.VLMONTANTEINVESTIMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NRTLO ";
        query += " ,EMPRESASAUTORIZADAS.NRRESOLUCAO ";
        query += " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA "
        query += " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO "
        query += " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO "
        query += " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE "
        query += " ,EMPRESASAUTORIZADAS.NRTELEFONE "
        query += " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE "
        query += " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI "
        query += " FROM EMPRESASAUTORIZADAS ";

        if (tipo == "AUTORIZADA") {
            query += " WHERE (EMPRESASAUTORIZADAS.NRINSCRICAO = '" + valor + "' ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO = '" + valor + "') ";

            query += " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento.replace("TA - ", "") + "' ";

            try {
                if ((modalidade != null) && (modalidade != "undefined")) {
                    query += "AND UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + modalidade + "%') ";
                }
            } catch (error) {
                console.log(error.message);
            }

            query += " LIMIT 1 ";

        } else if (tipo == "AUTORIZADAS") {

            query += " WHERE UPPER( EMPRESASAUTORIZADAS.NORAZAOSOCIAL ) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
            query += " OR UPPER( EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO ) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";

            //...
            query += " GROUP BY EMPRESASAUTORIZADAS.NRINSCRICAO, EMPRESASAUTORIZADAS.MODALIDADE, EMPRESASAUTORIZADAS.NRINSTRUMENTO ";

        } else {

            query += " WHERE ";

            try {

                if (modalidade != null) {
                    let n = false;
                    try {
                        //boolean inserido para evitar a mesclagem de Ex.: Registro de Estacao .... com Estacao de transbordo de carga
                        n = modalidade.toUpperCase().includes("LONGO CURSO");
                        if (n == false) {
                            n = modalidade.toUpperCase().includes("CABOTAGEM");
                        }

                        if (n == false) {
                            n = modalidade.toUpperCase().includes("APOIO PORTUARIO");
                        }

                        if (n == false) {
                            n = modalidade.toUpperCase().includes("APOIO MARITIMO");
                        }
                    } catch (error) {
                        console.log(error.message);
                    }


                    try {
                        //boolean inserido para evitar a mesclagem de Ex.: Registro de Estacao .... com Estacao de transbordo de carga
                        flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL DE CARGA");
                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL DE PASSAGEIROS");
                        }

                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL MISTO");
                        }

                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("TRAVESSIA");
                        }
                    } catch (error) {
                        console.log(error.message);
                    }

                    if (n == true) {
                        query += " UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + modalidade + "%') ";
                    } else {
                        query += " UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('" + modalidade + "%') ";

                    }


                }
            } catch (error) {
                console.log(error.message);
            }

            try {
                if ((valor != null) && (valor != "")) {
                    valor = removerAcentos(valor);
                    valor = valor.toUpperCase();

                    query += " AND UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIAL) LIKE UPPER('%" + valor + "%') ";
                    query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
                    query += " OR UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO) LIKE UPPER('%" + valor + "%') ";
                    query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";
                }

            } catch (error) {
                console.log(error.message);
            }

            if (flagAgruparInterior == true) {
                query += " GROUP BY EMPRESASAUTORIZADAS.NRINSCRICAO, EMPRESASAUTORIZADAS.MODALIDADE, EMPRESASAUTORIZADAS.NRINSTRUMENTO ";
            }

            query += " ORDER BY EMPRESASAUTORIZADAS.NORAZAOSOCIAL ";
            query += " LIMIT 3000 ";
        }


        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {
                    let qtdRegAutorizada = res.rows.length;

                    for (let i = 0; i < qtdRegAutorizada; i++) {
                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            QTDEmbarcacaoMaritima: res.rows.item(i).QTDEMBARCACAOMARITIMA,
                            QTDEmbarcacaoConstrucao: res.rows.item(i).QTDEMBARCACAOCONSTRUCAO,
                            IDContratoArrendamento: res.rows.item(i).IDCONTRATOARRENDAMENTO,
                            VLMontanteInvestimento: res.rows.item(i).VLMONTANTEINVESTIMENTO,
                            NRTLO: res.rows.item(i).NRTLO,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }

                    //...
                    angular.forEach(arData.empresas, function (value, key) {
                        arData = verificaAutorizacao(arData, key);
                    });

                    //...
                    try {
                        let qtdEmpresas = 0;
                        qtdEmpresas = arData.empresas.length;
                        if (qtdEmpresas > 0) {
                            for (var emp = 0; emp < qtdEmpresas; emp++) {
                                if (arData.empresas[emp].IDContratoArrendamento > 0) {
                                    var resultSet01 = [];
                                    resultSet01 = await gestorExecuteReaderArray("SELECT * FROM EMPRESACONTRATO WHERE IDCONTRATOARRENDAMENTO = " +
                                        arData.empresas[emp].IDContratoArrendamento);

                                    console.log(resultSet01);
                                    let qtd = 0;
                                    qtd = resultSet01.length;
                                    if (qtd > 0) {
                                        for (var x = 0; x < qtd; x++) {
                                            arData.contrato = {
                                                NRCnpj: resultSet01[x].NRCNPJ,
                                                IDContratoArrendamento: resultSet01[x].IDCONTRATOARRENDAMENTO,
                                                IDClassificaoSubclassificaoCarga: resultSet01[x].IDCLASSIFICAOSUBCLASSIFICAOCARGA,
                                                IDClassificaoSubclassificaoCargaPai: resultSet01[x].IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI,
                                                IDGrupoMercadoria: resultSet01[x].IDGRUPOMERCADORIA,
                                                IDNaturezaCarga: resultSet01[x].IDNATUREZACARGA,
                                                NRVersao: resultSet01[x].NRVERSAO,
                                                CDContrato: resultSet01[x].CDCONTRATO,
                                                NOGrupoMercadoria: resultSet01[x].NOGRUPOMERCADORIA,
                                                VLAreaTotal: resultSet01[x].VLAREATOTAL,
                                                IDTipoServico: resultSet01[x].IDTIPOSERVICO,
                                                NOTipoServico: resultSet01[x].NOTIPOSERVICO,
                                                NOClassificacaoCarga: resultSet01[x].NOCLASSIFICACAOCARGA
                                            }
                                        }
                                    }

                                } else {
                                    arData.contrato = {
                                        NRCnpj: "",
                                        IDContratoArrendamento: "",
                                        IDClassificaoSubclassificaoCarga: "",
                                        IDClassificaoSubclassificaoCargaPai: "",
                                        IDGrupoMercadoria: "",
                                        IDNaturezaCarga: "",
                                        NRVersao: "",
                                        CDContrato: "",
                                        NOGrupoMercadoria: "",
                                        VLAreaTotal: "",
                                        IDTipoServico: "",
                                        NOTipoServico: "",
                                        NOClassificacaoCarga: ""
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.log("Erro ao carregar contrato: " + error.message);
                    }


                    if (tipo == "AUTORIZADA") {
                        //...
                        sessionStorage.removeItem("arEmpresa");
                        sessionStorage.setItem("arEmpresa", angular.toJson(arData.empresas[0]));

                        //...
                        sessionStorage.removeItem("arEmpresaCadastros");
                        sessionStorage.setItem("arEmpresaCadastros", angular.toJson(arData));

                    } else {
                        //...
                        sessionStorage.removeItem("arEmpresaCadastros");
                        sessionStorage.setItem("arEmpresaCadastros", angular.toJson(arData));
                    }

                    console.log(arData.empresas);

                    resolve(true);
                });


            }, function (err) {
                logErro('gestorCarregarCadastroAutorizadas', err.message, JSON.stringify({
                    'valor': valor,
                    'tipo': tipo,
                    'nrinstrumento': nrinstrumento
                }));
                resolve(true);
                alert('gestorCarregarCadastroAutorizadas' + err.message);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarCadastroAutorizadas', erro.message, JSON.stringify({
            'valor': valor,
            'tipo': tipo,
            'nrinstrumento': nrinstrumento
        }));
    }

    return arData;
}


// ---- gestorCarregarDadosAutorizada ----
function gestorCarregarDadosAutorizada(nrinscricao, nrinstrumento, flagEnviada) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'" +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);

                //flagEnviada = "F";
                if (flagEnviada != "T") {
                    //...
                    //sessionStorage.setItem("dados_off", angular.toJson(arData));
                    //sessionStorage.setItem("empresa_off", angular.toJson(arData.empresas));


                    //...
                    window.location = "comum.tipo.html";

                    //window.location = "comum.tipo.naoenviada.html";
                    //window.location = "minhasfiscalizacoes.naoenviadas.listar.html";
                } else {
                    //var mensagem = '<p>Os dados desta fiscalizacao ja foram enviados!</p>';
                    //M.toast({ html: mensagem, classes: "#c62828 red darken-3" });

                    //...
                    window.location = "comum.fiscalizacaoenviada.html";
                }

            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizada', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento,
                'flagEnviada': flagEnviada
            }));
            alert('gestorCarregarDadosAutorizada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento,
            'flagEnviada': flagEnviada
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosAutorizadaProgramada ----
function gestorCarregarDadosAutorizadaProgramada(nrinscricao) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'";
        //+" AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '"+ nrinstrumento +"'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);


                //...
                window.location = "comum.tipo.html";


            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizadaProgramada', err.message, JSON.stringify({'nrinscricao': nrinscricao}));
            alert('gestorCarregarDadosAutorizadaProgramada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizadaProgramada', erro.message, JSON.stringify({'nrinscricao': nrinscricao}));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosAutorizadas ----
function gestorCarregarDadosAutorizadas(valor, tipo, valorNumero) {
    try {
        valor = removerAcentos(valor);
        valor = valor.toUpperCase();

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRRESOLUCAO " +
            " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS";


        if (tipo == "MODALIDADE") {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + valor + "%') ";
        } else if (tipo == "AUTORIZADA") {
            query += " WHERE (EMPRESASAUTORIZADAS.NRINSCRICAO = '%" + valor + "%' OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO = '%" + valor + "%') ";
        } else if (tipo == "INSTALACAO") {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.AREAPPF) = 'PORTO' AND UPPER(EMPRESASAUTORIZADAS.INSTALACAOSEMACENTOS) LIKE UPPER('%" + valor + "%') ";
        } else {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIAL) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
            query += " OR UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";
        }


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).MODALIDADE != "Contrato de Passagem") {

                        let novoInstrumento = null;
                        novoInstrumento = unirTermosRepetidos(res.rows.item(i).MODALIDADE, res.rows.item(i).NRINSTRUMENTO);

                        let DescInstrumento = "";

                        let n = res.rows.item(i).MODALIDADE.includes("Longo Curso");

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Cabotagem");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Portuario");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Maritimo");
                        }


                        if (n == true) {
                            DescInstrumento = "Termo de Autorização: " + novoInstrumento;
                        } else {
                            DescInstrumento = "Instrumento: " + novoInstrumento;
                        }

                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: novoInstrumento, //res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            DescricaoNRInstrumento: DescInstrumento,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }
                }

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });


                console.log(arData.empresas);
                sessionStorage.removeItem("arEmpresas");
                sessionStorage.setItem("arEmpresas", angular.toJson(arData.empresas));


                window.location = "empresa.listarAutorizadas.html";

            });


        }, function (err) {
            logErro('CarregarDadosAutorizadas', err.message, JSON.stringify({
                'valor': valor,
                'tipo': tipo,
                'valorNumero': valorNumero
            }));
            alert('CarregarDadosAutorizadas: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('CarregarDadosAutorizadas', erro.message, JSON.stringify({
            'valor': valor,
            'tipo': tipo,
            'valorNumero': valorNumero
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosEmbarcacoes ----
function gestorCarregarDadosEmbarcacoes(valor, valorNumero) {
    try {
        valor = removerAcentos(valor);
        valor = valor.toUpperCase();

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  ID " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,IDEMBARCACAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM EMBARCACOESINTERIOR ";

        query += " WHERE EXISTS (SELECT NULL FROM EMPRESASAUTORIZADAS WHERE " +
            " IFNULL(EMBARCACOESINTERIOR.TPINSCRICAO,1) = CAST(IFNULL(EMPRESASAUTORIZADAS.TPINSCRICAO,1) AS INT) " +
            " AND EMBARCACOESINTERIOR.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " AND EMBARCACOESINTERIOR.NRINSTRUMENTO = EMPRESASAUTORIZADAS.NRINSTRUMENTO) ";

        if (valor && valor != "") {
            query += " AND UPPER(EMBARCACOESINTERIOR.NOEMBARCACAO) LIKE UPPER('%" + valor + "%') ";
        }

        if (valorNumero && valorNumero != "") {
            valorNumero = removerAcentos(valorNumero);
            valorNumero = valorNumero.toUpperCase().trim();
            query += " AND UPPER(EMBARCACOESINTERIOR.NRCAPITANIA) LIKE UPPER('%" + valorNumero + "%') ";
        }

        var embarcacoes = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    embarcacoes.push({
                        IDFrota: res.rows.item(i).IDFROTA,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        IDEmbarcacao: res.rows.item(i).IDEMBARCACAO,
                        STEmbarcacao: res.rows.item(i).STEMBARCACAO,
                        DTInicio: res.rows.item(i).DTINICIO,
                        DTTermino: res.rows.item(i).DTTERMINO,
                        TPAfretamento: res.rows.item(i).TPAFRETAMENTO,
                        STRegistro: res.rows.item(i).STREGISTRO,
                        IDFrotaPai: res.rows.item(i).IDFROTAPAI,
                        STHomologacao: res.rows.item(i).STHOMOLOGACAO,
                        NoEmbarcacao: res.rows.item(i).NOEMBARCACAO,
                        NRCapitania: res.rows.item(i).NRCAPITANIA,
                        TipoEmbarcacao: res.rows.item(i).TIPOEMBARCACAO,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO
                    });
                }

                console.log(embarcacoes);
                sessionStorage.removeItem("arEmbarcacoes");
                sessionStorage.setItem("arEmbarcacoes", angular.toJson(embarcacoes));

                window.location = "empresa.listarEmbarcacoes.html";

            });


        }, function (err) {
            logErro('CarregarDadosEmbarcacoes', err.message, JSON.stringify({
                'valor': valor,
                'valorNumero': valorNumero
            }));
            alert('gestorCarregarDadosEmbarcacoes: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosEmbarcacoes', erro.message, JSON.stringify({
            'valor': valor,
            'valorNumero': valorNumero
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosEmpresaEmbarcacao ----
function gestorCarregarDadosEmpresaEmbarcacao(nrinscricao, nrinstrumento) {
    try {
        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRRESOLUCAO " +
            " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS";

        query += " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "' " +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "' ";

        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).MODALIDADE != "Contrato de Passagem") {

                        let novoInstrumento = null;
                        novoInstrumento = unirTermosRepetidos(res.rows.item(i).MODALIDADE, res.rows.item(i).NRINSTRUMENTO);

                        let DescInstrumento = "";

                        let n = res.rows.item(i).MODALIDADE.includes("Longo Curso");

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Cabotagem");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Portuario");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Maritimo");
                        }


                        if (n == true) {
                            DescInstrumento = "Termo de Autorização: " + novoInstrumento;
                        } else {
                            DescInstrumento = "Instrumento: " + novoInstrumento;
                        }

                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: novoInstrumento, //res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            DescricaoNRInstrumento: DescInstrumento,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }
                }

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });


                console.log(arData.empresas);
                var empresas = [];
                if (arData.empresas.length > 0)
                    empresas.push(arData.empresas[0]);
                sessionStorage.removeItem("arEmpresas");
                sessionStorage.setItem("arEmpresas", angular.toJson(empresas));

                window.location = "empresa.detalharEmbarcacao.html";

            });


        }, function (err) {
            logErro('gestorCarregarDadosEmpresaEmbarcacao', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento
            }));
            alert('gestorCarregarDadosEmpresaEmbarcacao: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosEmpresaEmbarcacao', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarEsquemasOperacionais ----
function gestorCarregarEsquemasOperacionais(sentido, partida, chegada) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT " +
            "  ESQUEMASOPERACIONAIS.ID" +
            " ,ESQUEMASOPERACIONAIS.NRINSCRICAO" +
            " ,ESQUEMASOPERACIONAIS.SENTIDO" +
            " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO" +
            " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA" +
            " ,ESQUEMASOPERACIONAIS.HRPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.UFPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA" +
            " ,ESQUEMASOPERACIONAIS.HRCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.UFCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO" +
            " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL" +
            " ,ESQUEMASOPERACIONAIS.STIDAVOLTA" +
            " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA" +
            " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA" +
            " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA" +
            " ,ESQUEMASOPERACIONAIS.NRORDEM" +
            " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL" +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " FROM ESQUEMASOPERACIONAIS " +
            "WHERE ESQUEMASOPERACIONAIS.ID >= 0 ";

        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";

        //query +="AND ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";
        //query +="SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        //query +=" OR ( ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + partida + "') ";
        //
        //query +=") ";
        //
        //query +="AND ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";
        //query +="SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + chegada + "' ";
        //query +=") ";

        //if(partida != "") {
        //   query += " AND ESQUEMASOPERACIONAIS.PARTIDAPORTO =  '" + partida + "'";
        //}

        //if(chegada != "") {
        //    query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA =  '" + chegada + "'";
        //    query += " OR ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + chegada + "' ";
        //}

        //query +=" AND ESQUEMASOPERACIONAIS.PORTOCHEGADA <> '" + partida + "' ";
        //query +=" GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";

        query += " ORDER BY ESQUEMASOPERACIONAIS.NRORDEM ";
        //query+= " LIMIT 100 ";

        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //if( (res.rows.item(i).PARTIDAPORTO == partida ) || (res.rows.item(i).PORTOCHEGADA == partida ) ) {
                        if (res.rows.item(i).PARTIDAPORTO == partida) {

                            let flagChegada = false;
                            let portoChegada = "";
                            portoChegada = res.rows.item(i).PORTOCHEGADA;

                            let idEsquema = res.rows.item(i).IDESQUEMAOPERACIONAL;
                            let cnpj = res.rows.item(i).NRINSCRICAO;

                            if (chegada != "") {
                                let verificou = await gestorVerificarChegadaEsquemaOperacional(
                                    idEsquema, chegada, cnpj
                                );

                                if (verificou > 0) {
                                    portoChegada = await gestorCarregarDadosChegada(idEsquema, sentido, cnpj, chegada);
                                    flagChegada = true;
                                }
                            } else {
                                flagChegada = true;
                            }

                            var tema = null;
                            var temaCor = null;
                            if (res.rows.item(i).NRORDEM == "1") {
                                tema = '#31445C';
                                temaCor = 'cortema';
                            } else {
                                tema = '#F7AA17';
                                temaCor = 'orange';
                            }

                            //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                            //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                            let nomeDiaSemana;
                            let nomeDiaSemanaChegada;

                            //if(dia == diaSemana ) {
                            //    nomeDiaSemana = "Hoje";
                            //} else {
                            nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                            nomeDiaSemana = nomeDiaSemana.replace("-Feira", "");
                            //}

                            //if(dia == diaSemanaChegada ) {
                            //    nomeDiaSemanaChegada = "Hoje";
                            //} else {
                            nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                            nomeDiaSemanaChegada = nomeDiaSemanaChegada.replace("-Feira", "");
                            //}

                            //...
                            if (flagChegada == true) {
                                arData.push({
                                    id: (res.rows.item(i).ID + 1) //"2618-3156"
                                    ,
                                    idEsquemaOperacional: res.rows.item(i).IDESQUEMAOPERACIONAL,
                                    CDLocalPartida: res.rows.item(i).CDLOCALPARTIDA,
                                    price: (res.rows.item(i).ID + 1),
                                    requests: 5,
                                    pledge: 150,
                                    weight: 50,
                                    sender: res.rows.item(i).NORAZAOSOCIAL
                                    //, sender: 'Empresa Autorizada'
                                    ,
                                    senderImg: 'img/icon-consultar.png',
                                    themeColor: temaCor,
                                    themeColorHex: '#1C4A6B',
                                    bgImgUrl: 'img/fundo.png',
                                    rating: 5,
                                    ratingCount: 26,
                                    fromStreet: res.rows.item(i).PARTIDAPORTO
                                    //, fromStreet: 'Mácapa'
                                    ,
                                    fromCity: res.rows.item(i).UFPARTIDA
                                    //, fromCity: 'Pará, PA 10025'
                                    ,
                                    toStreet: res.rows.item(i).PORTOCHEGADA //portoChegada
                                    //, toStreet: 'Almeirim'
                                    ,
                                    toCity: res.rows.item(i).UFCHEGADA
                                    //, toCity: 'Santarém, PA 11101'
                                    ,
                                    delivTime: res.rows.item(i).HRPARTIDA
                                    //, delivTime: '06:30 pm'
                                    ,
                                    delivDate: 'Maio 16, 2015'
                                    //, delivDateNoun: 'Hoje'
                                    ,
                                    delivDateNoun: nomeDiaSemana,
                                    reqDl: res.rows.item(i).HRCHEGADA,
                                    latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                                    longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                                    latTo: res.rows.item(i).VLLATITUDECHEGADA,
                                    longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                                    qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                                    diasemanachegada: nomeDiaSemanaChegada
                                });
                            }
                        }
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionais', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'chegada': chegada
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionais', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'chegada': chegada
        }));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisPesquisa(sentido, partida, destino) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.ID ";
        query += " ,ESQUEMASOPERACIONAIS.NRINSCRICAO ";
        query += " ,ESQUEMASOPERACIONAIS.SENTIDO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.UFPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.UFCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " ,ESQUEMASOPERACIONAIS.STIDAVOLTA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.NRORDEM ";
        query += " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO ";
        query += " FROM ESQUEMASOPERACIONAIS ";


        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "'";

        //+" LIMIT 70 ";


        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        var tema = null;
                        var temaCor = null;
                        if (res.rows.item(i).SENTIDO == "Ida") {
                            tema = '#74A2DC';
                            temaCor = 'cortemapartida';
                        } else {
                            tema = '#31445C';
                            temaCor = 'cortema';
                        }

                        //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                        //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                        let nomeDiaSemana;
                        let nomeDiaSemanaChegada;

                        //if(dia == diaSemana ) {
                        //    nomeDiaSemana = "Hoje";
                        //} else {
                        nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                        //}

                        //if(dia == diaSemanaChegada ) {
                        //    nomeDiaSemanaChegada = "Hoje";
                        //} else {
                        nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                        //}


                        //...
                        arData.push({
                            id: (res.rows.item(i).ID + 1) //"2618-3156"
                            ,
                            price: (res.rows.item(i).ID + 1),
                            requests: 5,
                            pledge: 150,
                            weight: 50,
                            sender: res.rows.item(i).NORAZAOSOCIAL
                            //, sender: 'Empresa Autorizada'
                            ,
                            senderImg: 'img/icon-consultar.png',
                            themeColor: temaCor,
                            themeColorHex: tema,
                            bgImgUrl: 'img/fundo.png',
                            rating: 5,
                            ratingCount: 26,
                            fromStreet: res.rows.item(i).PARTIDAPORTO
                            //, fromStreet: 'Mácapa'
                            ,
                            fromCity: res.rows.item(i).UFPARTIDA
                            //, fromCity: 'Pará, PA 10025'
                            ,
                            toStreet: res.rows.item(i).PORTOCHEGADA
                            //, toStreet: 'Almeirim'
                            ,
                            toCity: res.rows.item(i).UFCHEGADA
                            //, toCity: 'Santarém, PA 11101'
                            ,
                            delivTime: res.rows.item(i).HRPARTIDA
                            //, delivTime: '06:30 pm'
                            ,
                            delivDate: 'Maio 16, 2015'
                            //, delivDateNoun: 'Hoje'
                            ,
                            delivDateNoun: nomeDiaSemana,
                            reqDl: '24 minutes',
                            latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                            longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                            latTo: res.rows.item(i).VLLATITUDECHEGADA,
                            longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                            qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            ordem: res.rows.item(i).NRORDEM,
                            horaChegada: res.rows.item(i).HRCHEGADA,
                            diasemanachegada: nomeDiaSemanaChegada,
                            sentido: res.rows.item(i).SENTIDO
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPesquisa', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'destino': destino
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPesquisa', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'destino': destino
        }));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisPartida(sentido) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += " ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " GROUP BY ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        arData.push({
                            ID: (i + 1),
                            partidaPorto: res.rows.item(i).PARTIDAPORTO,
                            CDLocalPartida: res.rows.item(i).CDLOCALPARTIDA
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPartida', err.message, JSON.stringify({'sentido': sentido}));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPartida', erro.message, JSON.stringify({'sentido': sentido}));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisChegada(sentido) {
    let arData = [];

    try {

        let partida = null;
        partida = angular.fromJson(sessionStorage.getItem("partida"));

        openDB();
        var query = "SELECT ";
        query += " ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";

        query += "SELECT ";
        query += " ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        query += ") ";

        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA <> '" + partida + "' ";
        query += " GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";

        //var query = "SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        //query +=" GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        arData.push({
                            ID: (i + 1),
                            chegadaPorto: res.rows.item(i).PORTOCHEGADA,
                            CDLocalChegada: res.rows.item(i).CDLOCALCHEGADA
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisChegada', err.message, JSON.stringify({'sentido': sentido}));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisChegada', erro.message, JSON.stringify({'sentido': sentido}));
    }

    return arData;
}

async function gestorVerificarChegadaEsquemaOperacional(IDEsquemaOperacional, chegada, NRInscricao) {

    var ID = 0;

    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT count(*) AS mycount FROM ESQUEMASOPERACIONAIS WHERE IDESQUEMAOPERACIONAL = ? AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = ? AND ESQUEMASOPERACIONAIS.NRINSCRICAO = ?', [IDEsquemaOperacional, chegada, NRInscricao], async function (tx, rs) {

                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    resolve(true);

                }, async function (error) {
                    logErro('gestorVerificarChegadaEsquemaOperacional transaction', error.message, JSON.stringify({
                        'IDEsquemaOperacional': IDEsquemaOperacional,
                        'chegada': chegada,
                        'NRInscricao': NRInscricao
                    }));
                    resolve(true);
                }, async function () {
                    console.log('gestorVerificarChegadaEsquemaOperacional transaction ok');
                    resolve(true);
                });
            })
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorVerificarChegadaEsquemaOperacional', err.message, JSON.stringify({
            'IDEsquemaOperacional': IDEsquemaOperacional,
            'chegada': chegada,
            'NRInscricao': NRInscricao
        }));
        alert('gestorVerificarChegadaEsquemaOperacional: ' + err.message);
    }

    return ID;
}

async function gestorCarregarDadosChegada(IDEsquemaOperacional, sentido, cnpj, chegada) {
    let strChegada;

    try {
        openDB();
        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL = " + IDEsquemaOperacional;
        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + chegada + "' ";
        query += " AND ESQUEMASOPERACIONAIS.NRINSCRICAO = '" + cnpj + "' ";


        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        strChegada = res.rows.item(i).PORTOCHEGADA +
                            " - " + res.rows.item(i).CHEGADADIASEMANA +
                            " - " + res.rows.item(i).HRCHEGADA;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarDadosChegada', err.message, JSON.stringify({
                    'IDEsquemaOperacional': IDEsquemaOperacional,
                    'sentido': sentido,
                    'cnpj': cnpj,
                    'chegada': chegada
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarDadosChegada', erro.message, JSON.stringify({
            'IDEsquemaOperacional': IDEsquemaOperacional,
            'sentido': sentido,
            'cnpj': cnpj,
            'chegada': chegada
        }));
    }

    return strChegada;
}

/*==============================================================*/
async function gestorCarregarEmbarcacoesInteriorWebAsinc($http) {
    try {

        preloadInit("Atualizando Dados");

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var data = {NRCapitania: '', NOEmbarcacao: ''}
            $http({
                url: urlService() + 'ConsultarEmbarcacoesPorNomeOuCapitania',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                tx.executeSql("DELETE FROM EMBARCACOESINTERIOR");

                                //...
                                var embarcacoes = response.data.d;

                                //...
                                angular.forEach(embarcacoes, async function (value, key) {
                                    var nomeEmbarcacao = removerAcentos(embarcacoes[key].NoEmbarcacao);
                                    var numeroCapitania = removerAcentos(embarcacoes[key].NRCapitania);

                                    var query = "INSERT INTO EMBARCACOESINTERIOR ( " +
                                        "  ID " +
                                        " ,TPINSCRICAO " +
                                        " ,NRINSCRICAO " +
                                        " ,NRINSTRUMENTO " +
                                        " ,IDFROTA " +
                                        " ,IDFROTAPAI " +
                                        " ,IDEMBARCACAO " +
                                        " ,NOEMBARCACAO " +
                                        " ,STEMBARCACAO " +
                                        " ,TIPOEMBARCACAO " +
                                        " ,NRCAPITANIA " +
                                        " ,DTINICIO " +
                                        " ,DTTERMINO " +
                                        " ,TPAFRETAMENTO " +
                                        " ,STREGISTRO " +
                                        " ,STHOMOLOGACAO " +
                                        " ) " +
                                        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                    tx.executeSql(query, [
                                            key, embarcacoes[key].TPInscricao, embarcacoes[key].NRInscricao, embarcacoes[key].NRInstrumento, embarcacoes[key].IDFrota, embarcacoes[key].IDFrotaPai, embarcacoes[key].IDEmbarcacao, nomeEmbarcacao,
                                            embarcacoes[key].STEmbarcacao, embarcacoes[key].TipoEmbarcacao, numeroCapitania, embarcacoes[key].DTInicio, embarcacoes[key].DTTermino, embarcacoes[key].TPAfretamento,
                                            embarcacoes[key].STRegistro, embarcacoes[key].STHomologacao
                                        ], function (tx, res) {
                                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                        },
                                        function (tx, error) {
                                            preloaderStop();
                                            console.log('INSERT error: ' + error.message);
                                        });

                                });

                                //...
                                gestorMarcarAtualizacao("EMBARCACOESINTERIOR");

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        preloaderStop();
                        resolve(true);
                    }

                })
                .catch(async function () {
                    preloaderStop();
                    resolve(true);
                });

        }, function (err) {
            logErro('gestorCarregarEmbarcacoesInteriorWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorCarregarEmbarcacoesInteriorWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}

/*==============================================================*/
async function gestorCarregarFiscalizacoesRealizadasWebAsinc($http) {
    try {

        preloadInit("Atualizando Dados");

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

            var data = {matricula: arUsuario.NRMatricula, anoInicial: null}
            $http({
                url: urlService() + 'ConsultarFiscalizacoesRealizadasPorMatricula',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                tx.executeSql("DELETE FROM FISCALIZACOESREALIZADAS");

                                //...
                                var fiscalizacoes = response.data.d;

                                //...
                                angular.forEach(fiscalizacoes, async function (value, key) {

                                    var query = "INSERT INTO FISCALIZACOESREALIZADAS ( " +
                                        "  IDFISCALIZACAOREALIZADA " +
                                        " ,NRMATRICULA " +
                                        " ,QTDFISCALIZACAOENVIADA " +
                                        " ,QTDFISCALIZACAOENVIADAINTERIOR " +
                                        " ,QTDFISCALIZACAOENVIADAMARITIMA " +
                                        " ,QTDFISCALIZACAOENVIADAPORTO " +
                                        " ,QTDEMPRESAFISCALIZADA " +
                                        " ,QTDEMPRESAFISCALIZADAINTERIOR " +
                                        " ,QTDEMPRESAFISCALIZADAMARITIMA " +
                                        " ,QTDEMPRESAFISCALIZADAPORTO " +
                                        " ,QTDFISCALIZACAOAUTOINFRACAO " +
                                        " ,QTDFISCALIZACAONOTIFICACAO " +
                                        " ,QTDAUTOINFRACAO " +
                                        " ,QTDNOTIFICACAO " +
                                        " ,QTEXTRAORDINARIA " +
                                        " ,QTAPARTADO " +
                                        " ,QTROTINA " +
                                        " ,QTPROGRAMADA " +
                                        " ,NRMES " +
                                        " ,NRANO " +
                                        " ) " +
                                        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                    tx.executeSql(query, [
                                            key, arUsuario.NRMatricula, fiscalizacoes[key].QTFiscalizacao, fiscalizacoes[key].QTFiscalizacaoInterior, fiscalizacoes[key].QTFiscalizacaoMaritima, fiscalizacoes[key].QTFiscalizacaoPorto,
                                            fiscalizacoes[key].QTNRInscricao, fiscalizacoes[key].QTNRInscricaoInterior, fiscalizacoes[key].QTNRInscricaoMaritima, fiscalizacoes[key].QTNRInscricaoPorto,
                                            fiscalizacoes[key].QTFiscalizacaoAutoInfracao, fiscalizacoes[key].QTFiscalizacaoNotificacao,
                                            fiscalizacoes[key].QTProcedimentoAutoInfracao, fiscalizacoes[key].QTProcedimentoNoci, fiscalizacoes[key].QTProcedimentoExtraordinaria,
                                            fiscalizacoes[key].QTProcedimentoApartado, fiscalizacoes[key].QTProcedimentoRotina, fiscalizacoes[key].QTProcedimentoProgramada, fiscalizacoes[key].Mes, fiscalizacoes[key].Ano
                                        ], function (tx, res) {
                                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                        },
                                        function (tx, error) {
                                            preloaderStop();
                                            console.log('INSERT error: ' + error.message);
                                        });

                                });

                                //...
                                gestorMarcarAtualizacao("FISCALIZACOESREALIZADAS");

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        preloaderStop();
                        resolve(true);
                    }

                })
                .catch(async function () {
                    preloaderStop();
                    resolve(true);
                });

        }, function (err) {
            logErro('gestorCarregarFiscalizacoesRealizadasWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorCarregarFiscalizacoesRealizadasWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}

/*==============================================================*/
async function gestorMarcarAtualizacao(campo) {

    var ID = 0;

    try {
        var d = new Date();
        var mes = d.getMonth() + 1;
        var dia = d.getDate();
        var ano = d.getFullYear();

        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var dataAtualizacao = ano + "/" + mes + "/" + dia + " " + h + ":" + m + ":" + s;

        console.log(dataAtualizacao);

        openDB();

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT COUNT(*) AS mycount FROM LOGATUALIZACAO', [], async function (tx, rs) {
                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    var query01 = "INSERT INTO LOGATUALIZACAO (ID, DATA" + campo + ") VALUES (?,?)";
                    var query02 = "UPDATE LOGATUALIZACAO SET DATA" + campo + " = '" + dataAtualizacao + "' WHERE ID = ?";

                    if (ID == 0) {
                        tx.executeSql(query01, [1, dataAtualizacao], async function (tx, res) {
                                resolve(true);
                                console.log("INSERIU LOG: " + res.insertId + " = " + campo);
                            },
                            function (tx, error) {
                                resolve(true);
                                console.log('INSERIU LOG error: ' + error.message);
                            });
                    } else {
                        tx.executeSql(query02, [1], async function (tx, res) {
                                resolve(true);
                                console.log("ATUALIZOU LOG " + campo);
                            },
                            async function (tx, error) {
                                resolve(true);
                                console.log('ATUALIZOU LOG error: ' + error.message);
                            });
                    }

                });
            }, async function (error) {
                logErro('gestorMarcarAtualizacao transaction', error.message, JSON.stringify({'campo': campo}));
                resolve(true);
            }, async function () {
                resolve(true);
                console.log('gestorMarcarAtualizacao transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorMarcarAtualizacao', err.message, JSON.stringify({'campo': campo}));
        alert('gestorMarcarAtualizacao: ' + err.message);
    }
}

async function gestorVerificarAtualizacao() {
    let Qtd = 0;

    try {

        openDB();

        var query = "SELECT * FROM LOGATUALIZACAO";

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let qtd = res.rows.length;

                    for (var i = 0; i < res.rows.length; i++) {
                        var DATAFROTAALOCADA = res.rows.item(i).DATAFROTAALOCADA;

                        //...
                        let dataA = new Date(DATAFROTAALOCADA);

                        let dataConvertida = "";


                        //...
                        var d = new Date();
                        var dia = d.getDate();
                        var mes = d.getMonth() + 1;
                        var ano = d.getFullYear();
                        var dataAtual = ano + "/" + mes + "/" + dia;

                        dataConvertida = dataA.getFullYear() + "/" + (dataA.getMonth() + 1) + "/" + dataA.getDate();


                        var date_diff_indays = function (date1, date2) {
                            let dt1 = new Date(date1);
                            let dt2 = new Date(date2);
                            return Math.floor((
                                Date.UTC(
                                    dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                        }

                        //console.log(date_diff_indays('2014/07/03', '2014/07/14'));
                        Qtd = date_diff_indays(dataAtual, dataConvertida);
                        console.log('Dias para atualizar: ', Qtd);


                    }

                    if (qtd == 0) {
                        Qtd = -1;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorVerificarAtualizacao', err.message);
                resolve(true);
                alert("Não foi possível carregar os dados do usuário");
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorVerificarAtualizacao', erro.message);
    }

    return Qtd;
}

function formatarCNPJ(nrinscricao) {
    try {
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace("-", "");
        nrinscricao = nrinscricao.replace("/", "");
        nrinscricao = nrinscricao.replace(" ", "");
    } catch (erro) {
        console.log('formatarCNPJ', erro.message);
    }

    return nrinscricao;
}


function gestorAbrirNotificacao(id, title, msg, mostrar) {
    try {
        if (mostrar == "T") {
            //Get the device's operating system name
            var plat = device.platform;
            var model = device.model;
            var vers = device.version;
            var deviceManufacturer = device.manufacturer;
            var seri = device.serial;

            /*available: true
            cordova: "8.0.0"
            isVirtual: false
            manufacturer: "LGE"
            model: "LG-K430"
            platform: "Android"
            serial: "LGK430MRJJIVJF"
            uuid: "c2b6de2f86c1ec41"
            version: "6.0"*/

            //if(vers == "8.1.0")
            //{
            //    cordova.plugins.notification.local.schedule({
            //                            id: id,
            //                            title: title,
            //                            text: msg,
            //                            sticky: true, // Only use this is you want your notification to be sticky / ongoing!
            //                            lockscreen: true, // Only use this if you want the notification to be shown in lockscreen!
            //                            foreground: true, // Only use this if you want to show the notification when app is in foreground
            //                            vibrate: false,
            //                            sound: false,
            //                            priority: 2
            //                        });
            //}
            //else
            //{
            var mensagem = '<p>' + title + ': ' + msg + '.</p>';
            M.toast({html: mensagem, classes: "#c62828 black darken-3"});
            //}
        }
    } catch (erro) {
        console.log('gestorAbrirNotificacao', erro.message);
    }
}

function gestorFecharNotificacao(id, title, msg, mostrar) {
    try {
        if (mostrar == "T") {
            //Get the device's operating system name
            var plat = device.platform;
            var model = device.model;
            var vers = device.version;
            var deviceManufacturer = device.manufacturer;
            var seri = device.serial;

            /*available: true
            cordova: "8.0.0"
            isVirtual: false
            manufacturer: "LGE"
            model: "LG-K430"
            platform: "Android"
            serial: "LGK430MRJJIVJF"
            uuid: "c2b6de2f86c1ec41"
            version: "6.0"*/

            //if(vers == "8.1.0")
            //{
            //    cordova.plugins.notification.local.cancel(id);
            //}
            //else
            //{
            var mensagem = '<p>' + title + ': ' + msg + '.</p>';
            M.toast({html: mensagem, classes: "#c62828 black darken-3"});
            //}
        }
    } catch (erro) {
        console.log('gestorFecharNotificacao', erro.message);
    }
}


async function gestorSalvarDadosFiscalizacao(IdFiscalizacaoSalva, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, CodProcessoProgramada, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao, acao, latitude, longitude, altitude, arEmbarcacao, tpFiscalizacaoProgramada, arFotoIrregularidade, nrMatricula) {
    try {

        let ID = 0;

        ID = await pegarIdFiscalizacao(data, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao);

        console.log('Pegou id: ', ID);

        await gestorSalvarFiscalizacao(ID, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, nrnotificacao, CodProcessoProgramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula);
        await gestorSalvarFiscalizacaoIrregularidades(ID, arIrregularidades);
        await gestorSalvarFiscalizacaoEquipe(ID, arEquipe);
        await gestorSalvarFiscalizacaoTrecho(ID, arTrecho);
        await gestorSalvarFiscalizacaoCheckList(ID, arPerguntas);
        await gestorSalvarFiscalizacaoQuestionario(ID, arQuestionario);
        await gestorSalvarFiscalizacaoFotos(ID, arRotina);
        await gestorSalvarFiscalizacaoEvidencia(ID, arEvidencias);
        await gestorSalvarFiscalizacaoEmbarcacao(ID, arEmbarcacao);
        await gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa(ID, arFotoIrregularidade);


        if (IdFiscalizacaoSalva > 0) {
            await gestorExcluirFiscalizacao(IdFiscalizacaoSalva, null);
        }
    } catch (err) {
        logErro('gestorSalvarDadosFiscalizacao', err.message, JSON.stringify({
            'IdFiscalizacaoSalva': IdFiscalizacaoSalva,
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'CodProcessoProgramada': CodProcessoProgramada,
            'nrnotificacao': nrnotificacao,
            'acao': acao,
            'latitude': latitude,
            'longitude': longitude,
            'altitude': altitude,
            'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorSalvarDadosFiscalizacao: ' + err.message);
    }
}

async function pegarIdFiscalizacao(data, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao) {

    var ID = 0;

    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], async function (tx, rs) {

                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }


                    if (ID == 0) {
                        ID = 1;
                    }


                    let objFiscalizacaoTemp = {IdFiscalizacaoTemp: ID};
                    sessionStorage.removeItem("arFiscalizacaoTemp");
                    sessionStorage.setItem("arFiscalizacaoTemp", angular.toJson(objFiscalizacaoTemp));


                    resolve(true);

                }, async function (error) {
                    logErro('pegarIdFiscalizacao transaction', error.message, JSON.stringify({
                        'cnpjautorizada': cnpjautorizada,
                        'norazaosocial': norazaosocial,
                        'assunto': assunto,
                        'areappf': areappf,
                        'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
                        'obsfiscalizacao': obsfiscalizacao,
                        'nrnotificacao': nrnotificacao
                    }));
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('pegarIdFiscalizacao', err.message, JSON.stringify({
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'nrnotificacao': nrnotificacao
        }));
        alert('pegarIdFiscalizacao: ' + err.message);
    }

    return ID;
}

async function gestorSalvarFiscalizacao(id, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, nrnotificacao, codprocessoprogramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula) {
    try {

        openDB();

        cnpjautorizada = formatarCNPJ(cnpjautorizada);

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO " +
                    ", DATA " +
                    ", HORA " +
                    ", CNPJAUTORIZADA " +
                    ", FLAGENVIADA " +
                    ", OBS " +
                    ", NRNOTIFICACAO " +
                    ", CODPROCESSOPROGRAMADA " +
                    ", ACAO " +
                    ", LATITUDE " +
                    ", LONGITUDE " +
                    ", ALTITUDE " +
                    ", TPFISCALIZACAOPROGRAMADA" +
                    ", NRMATRICULA" +
                    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [id, data, hora, cnpjautorizada, "F", obsfiscalizacao, nrnotificacao, codprocessoprogramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula]);

                // ...
                var queryEmpresa = "INSERT INTO FISCALIZACAOEMPRESA (" +
                    " IDFISCALIZACAO " +
                    ", NRINSCRICAO " +
                    ", NORAZAOSOCIAL " +
                    ", ASSUNTO " +
                    ", AREAPPF " +
                    ", IDTIPOINSTALACAOPORTUARIA " +
                    ", NRINSTRUMENTO " +
                    " ) VALUES (?,?,?,?,?,?,?);";

                tx.executeSql(queryEmpresa, [
                    id, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, arEmpresa.NRInstrumento
                ]);
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'cnpjautorizada': cnpjautorizada,
                    'norazaosocial': norazaosocial,
                    'assunto': assunto,
                    'areappf': areappf,
                    'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
                    'obsfiscalizacao': obsfiscalizacao,
                    'nrnotificacao': nrnotificacao,
                    'codprocessoprogramada': codprocessoprogramada,
                    'acao': acao,
                    'latitude': latitude,
                    'longitude': longitude,
                    'altitude': altitude,
                    'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
                    'numeroMatricula': nrMatricula
                }));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacao', err.message, JSON.stringify({
            'id': id,
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'nrnotificacao': nrnotificacao,
            'codprocessoprogramada': codprocessoprogramada,
            'acao': acao,
            'latitude': latitude,
            'longitude': longitude,
            'altitude': altitude,
            'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorSalvarFiscalizacao: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoIrregularidades(id, arIrregularidades) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arIrregularidades.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOIRREGULARIDADES (" +
                        " IDFISCALIZACAOIRREGULARIDADE " +
                        " ,ORDEM " +
                        " ,DSALINEA " +
                        " ,DSINCISO " +
                        " ,DSNORMA " +
                        " ,DSNORMACOMPLETA " +
                        " ,DSNORMATIVA " +
                        " ,DSREQUISITO " +
                        " ,IDFISCALIZACAO " +
                        " ,IDIRREGULARIDADE " +
                        " ,IDREQUISITO " +
                        " ,IDSUPERINTENDENCIA " +
                        " ,NOREQUISITO " +
                        " ,NRARTIGO " +
                        " ,NRPARAGRAFO " +
                        " ,NRPRAZO " +
                        " ,STNOTIFICAVEL " +
                        " ,STQUINZENAL " +
                        " ,TPINFRACAO " +
                        " ,TPNAVEGACAO " +
                        " ,VLMULTAMAXIMA " +
                        " ,FLAGCHECK " +
                        " ,DESCRICAOFATO " +
                        " ,IDSECAO " +
                        " ,STACAOVARIAVEL" +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";


                    tx.executeSql(query, [
                        id, i, arIrregularidades[i].DSAlinea, arIrregularidades[i].DSInciso, arIrregularidades[i].DSNorma, arIrregularidades[i].DSNormaCompleta, arIrregularidades[i].DSNormativa, arIrregularidades[i].DSRequisito, arIrregularidades[i].IDFiscalizacao, arIrregularidades[i].IDIrregularidade, arIrregularidades[i].IDRequisito, arIrregularidades[i].IDSuperintendencia, arIrregularidades[i].NORequisito, arIrregularidades[i].NRArtigo, arIrregularidades[i].NRParagrafo, arIrregularidades[i].NRPrazo, arIrregularidades[i].STNotificavel, arIrregularidades[i].STQuinzenal, arIrregularidades[i].TPInfracao, arIrregularidades[i].TPNavegacao, arIrregularidades[i].VLMultaMaxima, arIrregularidades[i].check, arIrregularidades[i].descricaoFato, arIrregularidades[i].IDSecao, arIrregularidades[i].STACAOVARIAVEL
                    ]);
                }
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoIrregularidades transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoIrregularidades transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoIrregularidades', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoIrregularidades: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEquipe(id, arEquipe) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arEquipe.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOEQUIPE (" +
                        "  IDFISCALIZACAO " +
                        " ,NRMATRICULA " +
                        " ,NOUSUARIO " +
                        " ,NRCPF " +
                        " ,STCOORDENADOR " +
                        " ,NOCARGO " +
                        " ,NOUNIDADEORGANIZACIONAL " +
                        " ) VALUES (?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arEquipe[i].NRMatriculaServidor, arEquipe[i].NOUsuario, arEquipe[i].NRCPF, null, null, null
                    ]);
                }
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoEquipe transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoEquipe transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEquipe', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoEquipe: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoCheckList(id, arPerguntas) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arPerguntas.length; i++) {
                    // ...
                    var imagemirregularidade = arPerguntas[i].Foto && arPerguntas[i].Foto.imagem ? arPerguntas[i].Foto.imagem : null;
                    var tituloimagemirregularidade = arPerguntas[i].Foto && arPerguntas[i].Foto.titulo ? arPerguntas[i].Foto.titulo : null;

                    var query = "INSERT INTO FISCALIZACAOCHECKLIST (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IDCHECKLIST " +
                        " ,IDOBJETOFISCALIZADO " +
                        " ,IDQUESTIONARIO " +
                        " ,IDPERGUNTA " +
                        " ,NRMATRICULA " +
                        " ,CDLATITUDE " +
                        " ,CDLONGITUDE " +
                        " ,DTCADASTRO " +
                        " ,STRESPOSTA " +
                        " ,DSPERGUNTA "
                        //DADOS PERGUNTA
                        +
                        " ,DSSECAO " +
                        " ,IDSECAO " +
                        " ,DESCRICAOFATO " +
                        " ,RESPOSTA " +
                        " ,IDIRREGULARIDADE " +
                        " ,IMAGEMIRREGULARIDADE " +
                        " ,TITULOIMAGEMIRREGULARIDADE " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, 1, 0, arPerguntas[i].IDQuestionario, arPerguntas[i].IDPergunta, arPerguntas[i].NRMatricula, arPerguntas[i].latitude, arPerguntas[i].longitude, null, arPerguntas[i].STResposta, arPerguntas[i].DSPergunta

                        //DADOS PERGUNTA
                        , arPerguntas[i].DSSecao, arPerguntas[i].IDSecao, arPerguntas[i].descricaoFato, arPerguntas[i].resposta, arPerguntas[i].IDIrregularidade, imagemirregularidade, tituloimagemirregularidade
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoCheckList transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoCheckList transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoCheckList', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoCheckList: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoTrecho(id, arTrecho) {
    try {

        if (arTrecho != null) {

            openDB();

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    var query = "INSERT INTO FISCALIZACAOTRECHO (" +
                        "  IDFISCALIZACAO " +
                        " ,IDTIPOTRANSPORTE " +
                        " ,IDTRECHOLINHA " +
                        " ) VALUES (?,?,?);";

                    tx.executeSql(query, [
                        id, arTrecho.IDTipoTransporte, arTrecho.IDTrechoLinha
                    ]);

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoTrecho transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);
                }, async function () {
                    console.log('gestorSalvarFiscalizacaoTrecho transaction ok');
                    resolve(true);
                });
            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoTrecho', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorSalvarFiscalizacaoQuestionario(id, arQuestionario) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arQuestionario.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOQUESTIONARIO (" +
                        "  IDFISCALIZACAO "

                        + " ,DSNORMA " +
                        " ,DSSECAO " +
                        " ,DTCRIACAO " +
                        " ,IDQUESTIONARIO " +
                        " ,IDSECAO " +
                        " ,NOQUESTIONARIO " +
                        " ,MARQUE "


                        +
                        " ) VALUES (?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arQuestionario[i].DSNorma, arQuestionario[i].DSSecao, arQuestionario[i].DTCriacao, arQuestionario[i].IDQuestionario, arQuestionario[i].IDSecao, arQuestionario[i].NOQuestionario, arQuestionario[i].check
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoQuestionario transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoQuestionario transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoQuestionario', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoQuestionario: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoFotos(id, arRotina) {
    try {
        if (!arRotina || !arRotina.fotos || arRotina.fotos.length == 0) return;

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arRotina.fotos.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOFOTOS (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IMAGEM " +
                        " ,TITULO " +
                        " ) VALUES (?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, arRotina.fotos[i].imagem, arRotina.fotos[i].titulo
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoFotos transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);

            }, async function () {
                console.log('gestorSalvarFiscalizacaoFotos transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoFotos', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoFotos: ' + err.message);
    }
}

async function gestorMarcarEnvioFiscalizacao(id, nrMatricula, idfiscalizacaoenviada, idobjetofiscalizadoenviada) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET FLAGENVIADA = 'T', IDFISCALIZACAOENVIADA = " + idfiscalizacaoenviada +
                    ", IDOBJETOFISCALIZADOENVIADA = " + idobjetofiscalizadoenviada + ", NRMATRICULA = '" + nrMatricula + "' WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorMarcarEnvioFiscalizacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'idfiscalizacaoenviada': idfiscalizacaoenviada,
                    'idobjetofiscalizadoenviada': idobjetofiscalizadoenviada,
                    'numeroMatricula': nrMatricula
                }));
                resolve(true);
            }, async function () {
                console.log('gestorMarcarEnvioFiscalizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorMarcarEnvioFiscalizacao', err.message, JSON.stringify({
            'id': id,
            'idfiscalizacaoenviada': idfiscalizacaoenviada,
            'idobjetofiscalizadoenviada': idobjetofiscalizadoenviada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorMarcarEnvioFiscalizacao: ' + err.message);
    }
}

async function gestorRegistrarNumeroNotificacao(id, nrnotificacao) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET NRNOTIFICACAO = " + nrnotificacao + " WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorRegistrarNumeroNotificacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'nrnotificacao': nrnotificacao
                }));
                resolve(true);
            }, async function () {
                console.log('gestorRegistrarNumeroNotificacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRegistrarNumeroNotificacao', err.message, JSON.stringify({
            'id': id,
            'nrnotificacao': nrnotificacao
        }));
        alert('gestorRegistrarNumeroNotificacao: ' + err.message);
    }
}

async function gestorRegistrarNumeroAutoInfracao(id, nrautoinfracao) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET NRAUTOINFRACAO = '" + nrautoinfracao + "' WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorRegistrarNumeroAutoInfracao transaction', error.message, JSON.stringify({
                    'id': id,
                    'nrautoinfracao': nrautoinfracao
                }));
                resolve(true);
            }, async function () {
                console.log('gestorRegistrarNumeroAutoInfracao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRegistrarNumeroAutoInfracao', err.message, JSON.stringify({
            'id': id,
            'nrautoinfracao': nrautoinfracao
        }));
        alert('gestorRegistrarNumeroAutoInfracao: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEvidencia(id, arEvidencias) {
    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arEvidencias.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOEVIDENCIA (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IMAGEM " +
                        " ,TITULO " +
                        " ) VALUES (?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, arEvidencias[i].imagem, arEvidencias[i].titulo
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoEvidencia transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);

            }, async function () {
                console.log('gestorSalvarFiscalizacaoEvidencia transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEvidencia', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoEvidencia: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEmbarcacao(id, arEmbarcacao) {
    try {

        if (arEmbarcacao != null) {

            openDB();

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    var query = "INSERT INTO FISCALIZACAOEMBARCACAO (" +
                        "  IDFISCALIZACAO " +
                        " ,IDEMBARCACAO " +
                        " ,IDFROTA " +
                        " ,TPINSCRICAO " +
                        " ,STEMBARCACAO " +
                        " ,DTINICIO " +
                        " ,DTTERMINO " +
                        " ,TPAFRETAMENTO " +
                        " ,STREGISTRO " +
                        " ,IDFROTAPAI " +
                        " ,STHOMOLOGACAO " +
                        " ,NOEMBARCACAO " +
                        " ,NRCAPITANIA " +
                        " ,TIPOEMBARCACAO " +
                        " ,NRINSCRICAO " +
                        " ,NRINSTRUMENTO " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arEmbarcacao.IDEmbarcacao, arEmbarcacao.IDFrota, arEmbarcacao.TPInscricao, arEmbarcacao.STEmbarcacao, arEmbarcacao.DTInicio, arEmbarcacao.DTTermino, arEmbarcacao.TPAfretamento, arEmbarcacao.STRegistro, arEmbarcacao.IDFrotaPai, arEmbarcacao.STHomologacao, arEmbarcacao.NOEmbarcacao, arEmbarcacao.NRCapitania, arEmbarcacao.TipoEmbarcacao, arEmbarcacao.NRInscricao, arEmbarcacao.NRInstrumento
                    ]);

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoEmbarcacao transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);
                }, async function () {
                    console.log('gestorSalvarFiscalizacaoEmbarcacao transaction ok');
                    resolve(true);
                });
            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEmbarcacao', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa(id, arFotoIrregularidade) {
    try {
        openDB();

        if (arFotoIrregularidade != null) {

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    for (var i = 0; i < arFotoIrregularidade.length; i++) {
                        // ...
                        var query = "INSERT INTO FISCALIZACAOFOTOIRREGULARIDADE (" +
                            "  IDFISCALIZACAO " +
                            " ,IDIRREGULARIDADE " +
                            " ,IMAGEM " +
                            " ,TITULO " +
                            " ) VALUES (?,?,?,?);";

                        tx.executeSql(query, [
                            id, arFotoIrregularidade[i].IDIrregularidade, arFotoIrregularidade[i].Foto.imagem, arFotoIrregularidade[i].Foto.titulo
                        ]);
                    }

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);

                }, async function () {
                    console.log('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa transaction ok');
                    resolve(true);

                });

            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorExcluirFiscalizacao(idFiscalizacaoSalva, local) {
    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            //todo: db não possui executeSql, apenas o tx (comentário abaixo)
            // ...
            //let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
            let query01 = "UPDATE FISCALIZACAO SET FLAGEXCLUIDO = 'T' WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query01, [idFiscalizacaoSalva]);

            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(300);

            let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAOIRREGULARIDADE = ?;";
            db.executeSql(query02, [idFiscalizacaoSalva]);
            await delay(300);

            let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query03, [idFiscalizacaoSalva]);
            await delay(300);

            let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query04, [idFiscalizacaoSalva]);
            await delay(300);

            let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query05, [idFiscalizacaoSalva]);
            await delay(300);

            let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query06, [idFiscalizacaoSalva]);
            await delay(300);

            let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query07, [idFiscalizacaoSalva]);
            await delay(300);

            let query08 = "DELETE FROM FISCALIZACAOEMBARCACAO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query08, [idFiscalizacaoSalva]);
            await delay(300);

            let query09 = "DELETE FROM FISCALIZACAOFOTOIRREGULARIDADE WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query09, [idFiscalizacaoSalva]);
            await delay(300);


            if (local != null) {
                try {

                    gestorLimparCache();

                    gestorCarregarDadosEquipe();

                    var msgCancelar = '<p>Excluido!</p>';
                    M.toast({html: msgCancelar, classes: "#c62828 blue darken-3"});
                    window.location = local;
                } catch (erro) {
                    console.log("erro ao excluir fiscalizacao!");
                }

            }

            resolve(true);
            /*
                        db.transaction(async function (tx) {
                            // ...
                            //let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
                            let query01 = "UPDATE FISCALIZACAO SET FLAGEXCLUIDO = 'T' WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query01, [idFiscalizacaoSalva]);

                            // const delay = ms => new Promise(res => setTimeout(res, ms));
                            // await delay(300);

                            let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAOIRREGULARIDADE = ?;";
                            tx.executeSql(query02, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query03, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query04, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query05, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query06, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query07, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query08 = "DELETE FROM FISCALIZACAOEMBARCACAO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query08, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query09 = "DELETE FROM FISCALIZACAOFOTOIRREGULARIDADE WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query09, [idFiscalizacaoSalva]);
                            // await delay(300);


                            if (local != null) {
                                try {

                                    gestorLimparCache();

                                    gestorCarregarDadosEquipe();

                                    var msgCancelar = '<p>Excluido!</p>';
                                    M.toast({ html: msgCancelar, classes: "#c62828 blue darken-3" });
                                    window.location = local;
                                } catch (erro) {
                                    console.log("erro ao excluir fiscalizacao!");
                                }

                            }

                            resolve(true);
                        }, async function (error) {
                            console.log('gestorExcluirFiscalizacao transaction error: ' + error.message);
                        }, async function () {
                            console.log('gestorExcluirFiscalizacao transaction ok');
                        });*/
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorExcluirFiscalizacao', err.message, JSON.stringify({
            'idFiscalizacaoSalva': idFiscalizacaoSalva,
            'local': local
        }));
        resolve(true);
        alert('gestorExcluirFiscalizacao: ' + err.message);
    }
}

async function gestorExcluirFiscalizacao_OLD(id) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query01, [id]);

                let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query02, [id]);

                let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query03, [id]);

                let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query04, [id]);

                let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query05, [id]);

                let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query06, [id]);

                let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query07, [id]);

                resolve(true);

            }, async function (error) {
                console.log('gestorExcluirFiscalizacao transaction error: ' + error.message);
                resolve(true);

            }, async function () {
                console.log('gestorExcluirFiscalizacao transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExcluirFiscalizacao: ' + err.message);
    }
}

async function gestorLimparCache() {
    try {

        let firstFunction = new Promise(function (resolve, reject) {

            sessionStorage.removeItem("arFiscalizacao");
            sessionStorage.removeItem("arEmpresa");
            sessionStorage.removeItem("arEquipeSelecionada");
            sessionStorage.removeItem("arEquipe");
            sessionStorage.removeItem("arIrregularidade");
            sessionStorage.removeItem("arQuestionario");
            sessionStorage.removeItem("arPergunta");
            sessionStorage.removeItem("totalIrregularidades");
            sessionStorage.removeItem("NRAutoInfracao");
            sessionStorage.removeItem("NRNotificacao");
            sessionStorage.removeItem("rotina");
            sessionStorage.removeItem("notificado");
            sessionStorage.removeItem("notificante");
            sessionStorage.removeItem("testemunha1");
            sessionStorage.removeItem("testemunha2");

            sessionStorage.removeItem("arTerminais");
            sessionStorage.removeItem('arTrecho');
            sessionStorage.removeItem("arEmbarcacao");
            sessionStorage.removeItem("arEmbarcacaoConstrucao");
            sessionStorage.removeItem("arEmbarcacaoMaritima");
            sessionStorage.removeItem("arIrregularidades");
            sessionStorage.removeItem("arEmpresas");
            sessionStorage.removeItem("arFiscalizacaoTemp");
            sessionStorage.removeItem("arEvidencias");
            sessionStorage.removeItem("arFotoIrregularidade");
            sessionStorage.removeItem("arFormInstalacaoCadastrar");
            sessionStorage.removeItem("arFormPrestadorCadastrar");

            resolve(true);

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorLimparCache', erro.message);
        resolve(true);
    }
}


async function gestorSalvarUsuario(arUsuario, manterconectado, datalogoff) {
    try {

        let firstFunction = new Promise(function (resolve, reject) {
            openDB();

            db.transaction(async function (tx) {

                tx.executeSql("DELETE FROM USUARIO");

                //for(var i = 0; i < arUsuario.length; i++)
                if (arUsuario.IDUsuario > 0) {
                    // ...
                    var query = "INSERT INTO USUARIO (" +
                        "  IDUSUARIO " +
                        " ,DSSENHA " +
                        " ,EEFUNCIONARIO " +
                        " ,NOLOGINUSUARIO " +
                        " ,NRMATRICULA " +
                        " ,FOTO " +
                        " ,IDUNIDADEORGANIZACIONAL " +
                        " ,NOCARGO " +
                        " ,NOUNIDADEORGANIZACIONAL " +
                        " ,NOUSUARIO " +
                        " ,NRCPF " +
                        " ,NRMATRICULASERVIDOR " +
                        " ,SGUNIDADE " +
                        " ,MANTERCONECTADO " +
                        " ,DATALOGOFF " +
                        " ,IDPOSTOAVANCADO " +
                        " ,DSPOSTOAVANCADO " +
                        " ,IDPERFILFISCALIZACAO " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    let fotoUsuario = "";
                    let idUnidade = "";
                    let cargo = "";
                    let Unidade = "";
                    let usuario = "";
                    let nrCpf = "";
                    let nrMatricula = "";
                    let sgUnidade = "";
                    let idPostoAvancado = "";
                    let dsPostoAvancado = "";

                    try {

                        fotoUsuario = arUsuario.servidor.Foto;

                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {
                        idPostoAvancado = arUsuario.servidor.IDPostoAvancado;
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {
                        dsPostoAvancado = arUsuario.servidor.DSPostoAvancado;
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {

                        idUnidade = arUsuario.servidor.IDUnidadeOrganizacional;
                        cargo = arUsuario.servidor.NOCargo;
                        Unidade = arUsuario.servidor.NOUnidadeOrganizacional;
                        usuario = arUsuario.servidor.NOUsuario;
                        nrCpf = arUsuario.servidor.NRCPF;
                        nrMatricula = arUsuario.servidor.NRMatriculaServidor;
                        sgUnidade = arUsuario.servidor.SGUnidade;

                    } catch (ex) {
                        console.log(ex.message);
                    }

                    tx.executeSql(query, [
                        arUsuario.IDUsuario, arUsuario.DSSenha, arUsuario.EEFuncionario, arUsuario.NOLoginUsuario, arUsuario.NRMatricula

                        , fotoUsuario, idUnidade, cargo, Unidade, usuario, nrCpf, nrMatricula, sgUnidade, manterconectado, datalogoff, idPostoAvancado, dsPostoAvancado, arUsuario.servidor.IDPerfilFiscalizacao
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarUsuario transaction', error.message);
            }, async function () {
                console.log('gestorSalvarUsuario transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarUsuario', err.message);
        alert('gestorSalvarUsuario: ' + err.message);
    }
}

function gestorRemoverUsuario(enviarParaTelaInicial) {
    try {
        openDB();

        db.transaction(function (tx) {
            // ...
            let query = "DELETE FROM USUARIO";
            tx.executeSql(query, []);

            // ...
            //let query01 = "DELETE FROM LOGATUALIZACAO";
            //tx.executeSql(query01, []);

        }, function (error) {
            logErro('gestorRemoverUsuario transaction', error.message);
        }, function () {
            if (enviarParaTelaInicial == 'T') {
                window.location = "index.html";
            }
            console.log('gestorRemoverUsuario transaction ok');
        });
    } catch (err) {
        logErro('gestorRemoverUsuario', err.message);
        alert('gestorRemoverUsuario: ' + err.message);
    }
}

async function gestorRemoverLogAtualizacao() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "DELETE FROM LOGATUALIZACAO;"

                tx.executeSql(query, []);

                resolve(true);
            }, async function (error) {
                logErro('gestorRemoverLogAtualizacao transaction', error.message);
                resolve(true);
            }, async function () {
                console.log('gestorRemoverLogAtualizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRemoverLogAtualizacao', err.message);
    }
}


async function gestorCarregarDadosFiscalizacao(id) {
    try {
        openDB();

        var query = "SELECT " +
            " FISCALIZACAO.IDFISCALIZACAO " +
            ", FISCALIZACAO.DATA " +
            ", FISCALIZACAO.HORA " +
            ", FISCALIZACAO.CNPJAUTORIZADA " +
            ", FISCALIZACAO.FLAGENVIADA " +
            ", FISCALIZACAO.OBS " +
            ", FISCALIZACAO.NRNOTIFICACAO " +
            ", FISCALIZACAO.CODPROCESSOPROGRAMADA " +
            ", FISCALIZACAO.ACAO " +
            ", FISCALIZACAO.IDFISCALIZACAOENVIADA " +
            ", FISCALIZACAO.IDOBJETOFISCALIZADOENVIADA " +
            ", FISCALIZACAO.LATITUDE " +
            ", FISCALIZACAO.LONGITUDE " +
            ", FISCALIZACAO.ALTITUDE "

            + ", FISCALIZACAOEMPRESA.NORAZAOSOCIAL " +
            ", FISCALIZACAOEMPRESA.AREAPPF " +
            ", FISCALIZACAOEMPRESA.NORMA " +
            ", FISCALIZACAOEMPRESA.NRINSTRUMENTO " +
            ", FISCALIZACAOEMPRESA.IDTIPOINSTALACAOPORTUARIA "

            +
            " FROM FISCALIZACAO " +
            " JOIN FISCALIZACAOEMPRESA ON FISCALIZACAO.IDFISCALIZACAO = FISCALIZACAOEMPRESA.IDFISCALIZACAO " +
            " WHERE FISCALIZACAO.IDFISCALIZACAO = ?";

        var query03 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,ORDEM " +
            " ,IDCHECKLIST " +
            " ,IDOBJETOFISCALIZADO " +
            " ,IDQUESTIONARIO " +
            " ,IDPERGUNTA " +
            " ,NRMATRICULA " +
            " ,CDLATITUDE " +
            " ,CDLONGITUDE " +
            " ,DTCADASTRO " +
            " ,STRESPOSTA " +
            " ,DSPERGUNTA "
            //DADOS PERGUNTA
            +
            " ,DSSECAO " +
            " ,IDSECAO " +
            " ,DESCRICAOFATO " +
            " ,RESPOSTA " +
            " ,IDIRREGULARIDADE " +
            " ,IMAGEMIRREGULARIDADE " +
            " ,TITULOIMAGEMIRREGULARIDADE " +
            " FROM FISCALIZACAOCHECKLIST " +
            " WHERE FISCALIZACAOCHECKLIST.IDFISCALIZACAO = ?";


        var query07 = "SELECT " +
            "  FISCALIZACAOEVIDENCIA.IDFISCALIZACAO " +
            " ,FISCALIZACAOEVIDENCIA.ORDEM " +
            " ,FISCALIZACAOEVIDENCIA.IMAGEM " +
            " ,FISCALIZACAOEVIDENCIA.TITULO " +
            " FROM FISCALIZACAOEVIDENCIA " +
            " WHERE FISCALIZACAOEVIDENCIA.IDFISCALIZACAO = ?";

        var arData = [];
        var arEmpresa = [];

        var qtdIrregularidadesCheck = 0;


        var arPergunta = [];
        var arPerguntas = [];
        var arEvidencias = [];
        var arRotina = {};

        var arDadosEmpresa = [];

        let flagEnviada = "F";

        /*======================================================================================================*/
        var arIrregularidade = [];
        arIrregularidade = await carregarFiscalizacaoIrregularidades(id);
        if (arIrregularidade.length > 0) {
            sessionStorage.removeItem("arIrregularidade");
            sessionStorage.setItem("arIrregularidade", angular.toJson(arIrregularidade) || '[]');
        }

        /*======================================================================================================*/
        var arEquipe = [];
        arEquipe = await carregarFiscalizacaoEquipe(id);
        if (arEquipe.length > 0) {
            sessionStorage.removeItem("arEquipeSelecionada");
            sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipe));
        }

        /*======================================================================================================*/
        var arPerguntasIrregularidade = [];
        arPerguntasIrregularidade = await carregarFiscalizacaoPerguntaIrregularidade(id);

        /*======================================================================================================*/
        var arQuestionario = [];
        arQuestionario = await carregarFiscalizacaoQuestionario(id);
        if (arQuestionario.length > 0) {
            sessionStorage.removeItem("arQuestionario");
            sessionStorage.setItem("arQuestionario", angular.toJson(arQuestionario));
        }

        arRotina.fotos = [];
        arRotina.fotos = await carregarFiscalizacaoFotos(id);


        /*======================================================================================================*/
        var arTrecho = [];
        arTrecho = await carregarFiscalizacaoTrecho(id);
        sessionStorage.removeItem("arTrecho");
        sessionStorage.setItem("arTrecho", angular.toJson(arTrecho));

        var arEmbarcacao = {};
        arEmbarcacao = await carregarFiscalizacaoEmbarcacao(id);
        sessionStorage.removeItem("arEmbarcacao");
        sessionStorage.setItem("arEmbarcacao", angular.toJson(arEmbarcacao));

        let arFotoIrregularidade = {};
        arFotoIrregularidade = await carregarFiscalizacaoFotoIrregularidadeAvulsa(id);
        sessionStorage.removeItem("arFotoIrregularidade");
        sessionStorage.setItem("arFotoIrregularidade", angular.toJson(arFotoIrregularidade));

        db.transaction(async function (tx) {
            /*======================================================================================================*/
            tx.executeSql(query03, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    arPerguntas.push({
                        IDCheckList: res.rows.item(i).IDCHECKLIST,
                        IDFiscalizacao: 0,
                        IDQuestionario: res.rows.item(i).IDQUESTIONARIO,
                        DSSecao: res.rows.item(i).DSSECAO,
                        IDSecao: res.rows.item(i).IDSECAO,
                        IDPergunta: res.rows.item(i).IDPERGUNTA,
                        NRMatricula: res.rows.item(i).NRMATRICULA,
                        CDLatitude: res.rows.item(i).CDLATITUDE,
                        CDLongitude: res.rows.item(i).CDLONGITUDE,
                        DTCadastro: res.rows.item(i).DTCADASTRO,
                        STResposta: null,
                        resposta: res.rows.item(i).STRESPOSTA,
                        DSPergunta: res.rows.item(i).DSPERGUNTA
                    });

                    if (res.rows.item(i).STRESPOSTA == 'nao') {
                        qtdIrregularidadesCheck += 1;
                    }

                    var fotoPergunta = null;
                    if (res.rows.item(i).IMAGEMIRREGULARIDADE && res.rows.item(i).TITULOIMAGEMIRREGULARIDADE)
                        fotoPergunta = {
                            "imagem": res.rows.item(i).IMAGEMIRREGULARIDADE
                            , "titulo": res.rows.item(i).TITULOIMAGEMIRREGULARIDADE
                        };

                    arPergunta.push({
                        DSPergunta: res.rows.item(i).DSPERGUNTA,
                        IDQuestionario: res.rows.item(i).IDQUESTIONARIO,
                        DSSecao: res.rows.item(i).DSSECAO,
                        IDSecao: res.rows.item(i).IDSECAO,
                        descricaoFato: res.rows.item(i).DESCRICAOFATO,
                        resposta: res.rows.item(i).RESPOSTA,
                        IDIrregularidade: res.rows.item(i).IDIRREGULARIDADE,
                        IDPergunta: res.rows.item(i).IDPERGUNTA,
                        Foto: fotoPergunta
                    });

                }

                for (var x = 0; x < arPerguntas.length; x++) {
                    let IDPerg = arPerguntas[x].IDPergunta;

                    angular.forEach(arPerguntasIrregularidade, async function (value, key) {
                        let IDPerg2 = arPerguntasIrregularidade[key].IDPergunta;
                        if (IDPerg2 == IDPerg) {
                            arPergunta[x].Irregularidades = [];
                            arPergunta[x].Irregularidades[0] = arPerguntasIrregularidade[key];
                        }
                    });
                }

                sessionStorage.removeItem("totalIrregularidades");
                sessionStorage.setItem("totalIrregularidades", angular.toJson(qtdIrregularidadesCheck));

                sessionStorage.removeItem("arPerguntas");
                sessionStorage.setItem("arPerguntas", angular.toJson(arPerguntas));

                sessionStorage.removeItem("arPergunta");
                sessionStorage.setItem("arPergunta", angular.toJson(arPergunta));
            });


            /*======================================================================================================*/
            tx.executeSql(query07, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    arEvidencias.push({
                        imagem: res.rows.item(i).IMAGEM,
                        titulo: res.rows.item(i).TITULO
                    });
                }

                sessionStorage.removeItem("arEvidencias");
                sessionStorage.setItem("arEvidencias", angular.toJson(arEvidencias));
            });


            /*======================================================================================================*/
            tx.executeSql(query, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.push({NORAZAOSOCIAL: res.rows.item(i).NORAZAOSOCIAL});

                    flagEnviada = res.rows.item(i).FLAGENVIADA;

                    sessionStorage.acao = formataAcao(res.rows.item(i).ACAO, "0", res.rows.item(i).CODPROCESSOPROGRAMADA);
                    sessionStorage.idfiscalizacaoenviada = res.rows.item(i).IDFISCALIZACAOENVIADA;
                    sessionStorage.idobjetofiscalizadoenviada = res.rows.item(i).IDOBJETOFISCALIZADOENVIADA;

                    try {
                        let objFiscalizacaoTemp = {IdFiscalizacaoTemp: res.rows.item(i).IDFISCALIZACAO};
                        sessionStorage.removeItem("arFiscalizacaoTemp");
                        sessionStorage.setItem("arFiscalizacaoTemp", angular.toJson(objFiscalizacaoTemp));
                    } catch (error) {
                        console.log(error.message);
                    }

                    try {
                        var localizacao = {
                            'latitude': res.rows.item(i).LATITUDE,
                            'longitude': res.rows.item(i).LONGITUDE,
                            'altitude': res.rows.item(i).ALTITUDE
                        };
                        sessionStorage.setItem("position", angular.toJson(localizacao));
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    //...
                    arEmpresa.push({
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRInscricao: res.rows.item(i).CNPJAUTORIZADA,
                        DSEndereco: "endereco",
                        Modalidade: "modalidade",
                        norma: res.rows.item(i).NORMA,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        IDTipoInstalacaoPortuaria: res.rows.item(i).IDTIPOINSTALACAOPORTUARIA
                    });

                    //...
                    var Observacao = res.rows.item(i).OBS;
                    //let myObj = { descricao: Observacao, fotos: [] };
                    let myObj = {
                        descricao: Observacao,
                        IdFiscalizacaoBd: res.rows.item(i).IDFISCALIZACAO,
                        DataFiscalizacaoBd: res.rows.item(i).DATA,
                        HoraFiscalizacaoBd: res.rows.item(i).HORA,
                        fotos: arRotina.fotos
                    };


                    //Pegar processo da fiscalizacao programada
                    let CodProcessoProgramada = null;
                    try {
                        CodProcessoProgramada = res.rows.item(i).CODPROCESSOPROGRAMADA;
                        if (CodProcessoProgramada != null) {
                            await gestorCarregarDadosProgramada(res.rows.item(i).CNPJAUTORIZADA, CodProcessoProgramada);
                        }
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    sessionStorage.removeItem("rotina");
                    sessionStorage.setItem("rotina", angular.toJson(myObj));

                    sessionStorage.removeItem("NRNotificacao");
                    sessionStorage.setItem("NRNotificacao", angular.toJson(res.rows.item(i).NRNOTIFICACAO));
                }

                //...
                gestorCarregarDadosAutorizada(arEmpresa[0].NRInscricao, arEmpresa[0].NRInstrumento, flagEnviada);
            });

        }, function (err) {
            logErro('gestorCarregarDadosFiscalizacao', err.message, JSON.stringify({'id': id}));
            alert("An error occured while displaying saved notes", err.message);
        });
    } catch (erro) {
        logErro('gestorCarregarDadosFiscalizacao', erro.message, JSON.stringify({'id': id}));
    }
}

async function carregarFiscalizacaoIrregularidades(id) {
    var resultSet01 = [];
    var arDados = [];
    try {
        var query01 = "SELECT " +
            " IDFISCALIZACAO " +
            " ,ORDEM " +
            " ,DSALINEA " +
            " ,DSINCISO " +
            " ,DSNORMA " +
            " ,DSNORMACOMPLETA " +
            " ,DSNORMATIVA " +
            " ,DSREQUISITO " +
            " ,IDFISCALIZACAO " +
            " ,IDIRREGULARIDADE " +
            " ,IDREQUISITO " +
            " ,IDSUPERINTENDENCIA " +
            " ,NOREQUISITO " +
            " ,NRARTIGO " +
            " ,NRPARAGRAFO " +
            " ,NRPRAZO " +
            " ,STNOTIFICAVEL " +
            " ,STQUINZENAL " +
            " ,TPINFRACAO " +
            " ,TPNAVEGACAO " +
            " ,VLMULTAMAXIMA " +
            " ,FLAGCHECK " +
            " ,DESCRICAOFATO " +
            " ,IDSECAO " +
            " ,STACAOVARIAVEL" +
            " FROM FISCALIZACAOIRREGULARIDADES " +
            " WHERE FISCALIZACAOIRREGULARIDADES.IDFISCALIZACAOIRREGULARIDADE = " + id;

        resultSet01 = await gestorExecuteReaderArray(query01);

        console.log(resultSet01);
        let qtdIrregularidades = 0;
        qtdIrregularidades = resultSet01.length;
        if (qtdIrregularidades > 0) {
            for (var i = 0; i < qtdIrregularidades; i++) {
                let stnotificavel = false;
                if (resultSet01[i].STNOTIFICAVEL === "true") {
                    stnotificavel = true;
                }

                let stquinzenal = false;
                if (resultSet01[i].STQUINZENAL === "true") {
                    stquinzenal = true;
                }

                let flagcheck = false;
                if (resultSet01[i].FLAGCHECK === "true") {
                    flagcheck = true;
                }

                let stacaovariavel = false;
                if (resultSet01[i].FLAGCHECK === "true") {
                    flagcheck = true;
                }

                if (!flagcheck) continue;

                arDados.push({
                    DSAlinea: resultSet01[i].DSALINEA, //null
                    DSInciso: resultSet01[i].DSINCISO, //"V"
                    DSNorma: resultSet01[i].DSNORMA, //"1274 ANTAQ, 13 02/14"
                    DSNormaCompleta: resultSet01[i].DSNORMACOMPLETA, //"1274-ANTAQ, 13/02/14 - ART 23, Inciso V"
                    DSNormativa: resultSet01[i].DSNORMATIVA, //"deixar de manter, no local de prestação dos serviços, formulário próprio ↵para registro das reclamações dos usuários"
                    DSRequisito: resultSet01[i].DSREQUISITO, //""
                    IDFiscalizacao: resultSet01[i].IDFISCALIZACAO, //null
                    IDIrregularidade: resultSet01[i].IDIRREGULARIDADE, //475
                    IDRequisito: resultSet01[i].IDREQUISITO, //27
                    IDSuperintendencia: resultSet01[i].IDSUPERINTENDENCIA, //91
                    NORequisito: resultSet01[i].NOREQUISITO, //"Téc/Jur/Fisc/Econ."
                    NRArtigo: resultSet01[i].NRARTIGO, //23
                    NRParagrafo: resultSet01[i].NRPARAGRAFO, //null
                    NRPrazo: resultSet01[i].NRPRAZO, //null
                    STNotificavel: stnotificavel, //res.rows[i].STNOTIFICAVEL,//false
                    STQuinzenal: stquinzenal, //res.rows[i].STQUINZENAL,//false
                    TPInfracao: resultSet01[i].TPINFRACAO, //1
                    TPNavegacao: resultSet01[i].TPNAVEGACAO, //1
                    VLMultaMaxima: resultSet01[i].VLMULTAMAXIMA, //"1000"
                    check: flagcheck, //res.rows.item(i).FLAGCHECK,//true
                    descricaoFato: resultSet01[i].DESCRICAOFATO, //"Aaa"
                    IDSecao: resultSet01[i].IDSecao,
                    STAcaaoVariavel: stacaovariavel
                });
            }
        }
    } catch (ex) {
        logErro('carregarFiscalizacaoIrregularidades', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoEquipe(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query02 = "SELECT " +
            " IDFISCALIZACAO " +
            " ,NRMATRICULA " +
            " ,NOUSUARIO " +
            " ,NRCPF " +
            " ,STCOORDENADOR " +
            " ,NOCARGO " +
            " ,NOUNIDADEORGANIZACIONAL " +
            " FROM FISCALIZACAOEQUIPE " +
            " WHERE FISCALIZACAOEQUIPE.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    NOUsuario: resultSet01[i].NOUSUARIO,
                    NRMatricula: resultSet01[i].NRMATRICULA,
                    NRCPF: resultSet01[i].NRCPF,
                    IDFiscalizacao: "",
                    STCoordenador: "",
                    NOCargo: "",
                    NOUnidadeOrganizacional: "",
                    NRMatriculaServidor: resultSet01[i].NRMATRICULA
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoEquipe', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoPerguntaIrregularidade(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query06 = "SELECT " +
            "  PERGUNTASIRREGULARIDADES.ID " +
            " ,PERGUNTASIRREGULARIDADES.DSALINEA " +
            " ,PERGUNTASIRREGULARIDADES.DSINCISO " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMA " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMACOMPLETA " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMATIVA " +
            " ,PERGUNTASIRREGULARIDADES.DSREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.IDFISCALIZACAO " +
            " ,PERGUNTASIRREGULARIDADES.IDIRREGULARIDADE " +
            " ,PERGUNTASIRREGULARIDADES.IDREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.IDSUPERINTENDENCIA " +
            " ,PERGUNTASIRREGULARIDADES.NOREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.NRARTIGO " +
            " ,PERGUNTASIRREGULARIDADES.NRPARAGRAFO " +
            " ,PERGUNTASIRREGULARIDADES.NRPRAZO " +
            " ,PERGUNTASIRREGULARIDADES.STNOTIFICAVEL " +
            " ,PERGUNTASIRREGULARIDADES.STQUINZENAL " +
            " ,PERGUNTASIRREGULARIDADES.TPINFRACAO " +
            " ,PERGUNTASIRREGULARIDADES.TPNAVEGACAO " +
            " ,PERGUNTASIRREGULARIDADES.VLMULTAMAXIMA " +
            " ,PERGUNTASIRREGULARIDADES.IDPERGUNTA " +
            " ,PERGUNTASIRREGULARIDADES.IDSECAO " +
            " ,PERGUNTASIRREGULARIDADES.STACAOVARIAVEL " +
            " FROM PERGUNTASIRREGULARIDADES ";
        //+" WHERE UPPER(PERGUNTASIRREGULARIDADES.DSNORMA) LIKE UPPER('%1274%')";

        resultSet01 = await gestorExecuteReaderArray(query06);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    DSAlinea: resultSet01[i].DSALINEA,
                    DSInciso: resultSet01[i].DSINCISO,
                    DSNorma: resultSet01[i].DSNORMA,
                    DSNormaCompleta: resultSet01[i].DSNORMACOMPLETA,
                    DSNormativa: resultSet01[i].DSNORMATIVA,
                    DSRequisito: resultSet01[i].DSREQUISITO,
                    IDFiscalizacao: resultSet01[i].IDFISCALIZACAO,
                    IDIrregularidade: resultSet01[i].IDIRREGULARIDADE,
                    IDPergunta: resultSet01[i].IDPERGUNTA,
                    IDRequisito: resultSet01[i].IDREQUISITO,
                    IDSuperintendencia: resultSet01[i].IDSUPERINTENDENCIA,
                    NORequisito: resultSet01[i].NOREQUISITO,
                    NRArtigo: resultSet01[i].NRARTIGO,
                    NRParagrafo: resultSet01[i].NRPARAGRAFO,
                    NRPrazo: resultSet01[i].NRPRAZO,
                    STNotificavel: resultSet01[i].STNOTIFICAVEL,
                    STQuinzenal: resultSet01[i].STQUINZENAL,
                    TPInfracao: resultSet01[i].TPINFRACAO,
                    TPNavegacao: resultSet01[i].TPNAVEGACAO,
                    VLMultaMaxima: resultSet01[i].VLMULTAMAXIMA,
                    IDSecao: resultSet01[i].IDSECAO,
                    STACAOVARIAVEL: resultSet01[i].STACAOVARIAVEL
                    //resposta: "sim"
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoPerguntaIrregularidade', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoQuestionario(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query04 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,DSNORMA " +
            " ,DSSECAO " +
            " ,DTCRIACAO " +
            " ,IDQUESTIONARIO " +
            " ,IDSECAO " +
            " ,NOQUESTIONARIO " +
            " ,MARQUE " +
            " FROM FISCALIZACAOQUESTIONARIO " +
            " WHERE FISCALIZACAOQUESTIONARIO.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query04);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    DSNorma: resultSet01[i].DSNORMA,
                    DSSecao: resultSet01[i].DSSECAO,
                    DTCriacao: resultSet01[i].DTCRIACAO,
                    IDQuestionario: resultSet01[i].IDQUESTIONARIO,
                    IDSecao: resultSet01[i].IDSECAO,
                    NOQuestionario: resultSet01[i].NOQUESTIONARIO,
                    check: resultSet01[i].MARQUE
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoQuestionario', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoFotos(id) {
    var resultSet01 = [];
    var arDados = [];

    try {

        var query05 = "SELECT " +
            "  FISCALIZACAOFOTOS.IDFISCALIZACAO " +
            " ,FISCALIZACAOFOTOS.ORDEM " +
            " ,FISCALIZACAOFOTOS.IMAGEM " +
            " ,FISCALIZACAOFOTOS.TITULO " +
            " FROM FISCALIZACAOFOTOS " +
            " WHERE FISCALIZACAOFOTOS.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query05);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    imagem: resultSet01[i].IMAGEM,
                    titulo: resultSet01[i].TITULO
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoFotos', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoTrecho(id) {
    var resultSet01 = [];
    var arDados = {};

    try {
        var query02 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,IDTIPOTRANSPORTE " +
            " ,IDTRECHOLINHA " +
            " FROM FISCALIZACAOTRECHO " +
            " WHERE IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados = {
                    IDTipoTransporte: resultSet01[i].IDTIPOTRANSPORTE,
                    IDTrechoLinha: resultSet01[i].IDTRECHOLINHA,
                    Instalacao: "",
                    Modalidade: "",
                    NRInscricao: "",
                    NRInstrumento: ""
                }
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoTrecho', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoEmbarcacao(id) {
    var resultSet01 = [];
    var arDados = null;

    try {
        var query02 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,IDEMBARCACAO " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM FISCALIZACAOEMBARCACAO " +
            " WHERE IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados = {
                    IDFrota: resultSet01[i].IDFROTA,
                    TPInscricao: resultSet01[i].TPINSCRICAO,
                    IDEmbarcacao: resultSet01[i].IDEMBARCACAO,
                    STEmbarcacao: resultSet01[i].STEMBARCACAO,
                    DTInicio: resultSet01[i].DTINICIO,
                    DTTermino: resultSet01[i].DTTERMINO,
                    TPAfretamento: resultSet01[i].TPAFRETAMENTO,
                    STRegistro: resultSet01[i].STREGISTRO,
                    IDFrotaPai: resultSet01[i].IDFROTAPAI,
                    STHomologacao: resultSet01[i].STHOMOLOGACAO,
                    NoEmbarcacao: resultSet01[i].NOEMBARCACAO,
                    NRCapitania: resultSet01[i].NRCAPITANIA,
                    TipoEmbarcacao: resultSet01[i].TIPOEMBARCACAO,
                    NRInscricao: resultSet01[i].NRINSCRICAO,
                    NRInstrumento: resultSet01[i].NRINSTRUMENTO
                }
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoEmbarcacao', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoFotoIrregularidadeAvulsa(id) {
    var resultSet01 = [];
    var arDados = [];
    //arDados.Foto = [];

    try {

        var query05 = "SELECT " +
            "  FISCALIZACAOFOTOIRREGULARIDADE.IDFISCALIZACAO " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.IDIRREGULARIDADE " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.IMAGEM " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.TITULO " +
            " FROM FISCALIZACAOFOTOIRREGULARIDADE " +
            " WHERE FISCALIZACAOFOTOIRREGULARIDADE.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query05);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados[i] = {"IDIrregularidade": resultSet01[i].IDIRREGULARIDADE};
                arDados[i].Foto = {
                    "imagem": resultSet01[i].IMAGEM,
                    "titulo": resultSet01[i].TITULO
                };
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoFotoIrregularidadeAvulsa', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}


async function gestorCarregarDadosAutorizada(nrinscricao, nrinstrumento, flagEnviada) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'" +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);

                //flagEnviada = "F";
                if (flagEnviada != "T") {
                    //...
                    //sessionStorage.setItem("dados_off", angular.toJson(arData));
                    //sessionStorage.setItem("empresa_off", angular.toJson(arData.empresas));


                    //...
                    window.location = "comum.tipo.html";

                    //window.location = "comum.tipo.naoenviada.html";
                    //window.location = "minhasfiscalizacoes.naoenviadas.listar.html";
                } else {
                    //var mensagem = '<p>Os dados desta fiscalizacao ja foram enviados!</p>';
                    //M.toast({ html: mensagem, classes: "#c62828 red darken-3" });

                    //...
                    window.location = "comum.fiscalizacaoenviada.html";
                }

            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizada', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento,
                'flagEnviada': flagEnviada
            }));
            alert('gestorCarregarDadosAutorizada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento,
            'flagEnviada': flagEnviada
        }));
    } finally {
        preloaderStop();
    }
}

async function gestorCarregarDadosAutorizadaProgramada(nrinscricao) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'";
        //+" AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '"+ nrinstrumento +"'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);


                //...
                window.location = "comum.tipo.html";


            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizadaProgramada', err.message, JSON.stringify({'nrinscricao': nrinscricao}));
            alert('gestorCarregarDadosAutorizadaProgramada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizadaProgramada', erro.message, JSON.stringify({'nrinscricao': nrinscricao}));
    } finally {
        preloaderStop();
    }
}


function gestorCarregarDados() {
    try {
        openDB();

        var query = "SELECT " +
            " FISCALIZACAO.IDFISCALIZACAO " +
            ", FISCALIZACAO.DATA " +
            ", FISCALIZACAO.CNPJAUTORIZADA " +
            ", FISCALIZACAO.FLAGENVIADA " +
            ", FISCALIZACAOEMPRESA.NORAZAOSOCIAL " +
            " FROM FISCALIZACAO " +
            " JOIN FISCALIZACAOEMPRESA ON FISCALIZACAO.IDFISCALIZACAO = FISCALIZACAOEMPRESA.IDFISCALIZACAO ";

        var arData = [];


        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {

                for (var i = 0; i < res.rows.length; i++) {
                    arData.push({NORAZAOSOCIAL: res.rows.item(i).NORAZAOSOCIAL});
                }

                dataFiscalizacoesNaoEnviadas = arData;

                sessionStorage.setItem("dados_off", angular.toJson(localizacao));
            });
        }, function (err) {
            logErro('gestorCarregarDados', err.message);
            alert("An error occured while displaying saved notes");
        });
    } catch (erro) {
        logErro('gestorCarregarDados', erro.message);
    } finally {
        //preloaderStop();
    }
}

function gestorTesteIrregularidades(arIrregularidades) {
    var ordem = 0;
    for (var i = 0; i < arIrregularidades.length; i++) {
        arIrregularidades[i].IDIrregularidade
    }
}


function gestorGetDataFiscalizacoes() {

    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    dataFiscalizacoesNaoEnviadas.push({
                        IDFISCALIZACAO: resultSet.rows.item(x).IDFISCALIZACAO,
                        DATA: resultSet.rows.item(x).DATA,
                        CNPJAUTORIZADA: resultSet.rows.item(x).CNPJAUTORIZADA,
                    });
                }
            },
            function (tx, error) {
                logErro('gestorGetDataFiscalizacoes SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorGetDataFiscalizacoes transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function gestorPegarDados() {
    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    dataFiscalizacoesNaoEnviadas.push({
                        IDFISCALIZACAO: resultSet.rows.item(x).IDFISCALIZACAO,
                        DATA: resultSet.rows.item(x).DATA,
                        CNPJAUTORIZADA: resultSet.rows.item(x).CNPJAUTORIZADA,
                    });
                }
            },
            function (tx, error) {
                logErro('gestorPegarDados SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorPegarDados transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });

    return dataFiscalizacoesNaoEnviadas;
}

function gestorGetData() {

    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    console.log("First name: " + resultSet.rows.item(x).IDFISCALIZACAO +
                        ", Acct: " + resultSet.rows.item(x).CNPJAUTORIZADA);
                }
            },
            function (tx, error) {
                logErro('gestorGetData SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorGetData transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function gestorGetData2(last) {

    db.transaction(function (tx) {

        var query = "SELECT firstname, lastname, acctNo FROM customerAccounts WHERE lastname = ?";

        tx.executeSql(query, [last], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    console.log("First name: " + resultSet.rows.item(x).firstname +
                        ", Acct: " + resultSet.rows.item(x).acctNo);
                }
            },
            function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}


function gestorSalvarDadosFiscalizacao_OLD(arFiscalizacao, CheckList, IrregularidadeEncontrada) {
    try {

        openDB();

        db.transaction(function (tx) {
            // ...
            tx.executeSql('CREATE TABLE IF NOT EXISTS FISCALIZACAO (IDFISCALIZACAO INTEGER NOT NULL, DATA VARCHAR, CNPJAUTORIZADA VARCHAR, PRIMARY KEY ( IDFISCALIZACAO ) );');

            tx.executeSql("DELETE FROM FISCALIZACAO;");

            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [1, '12/06/2019', '99999999999999']);
            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [2, '12/06/2019', '99999999999999']);
            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [3, '12/06/2019', '99999999999999']);

        }, function (error) {
            console.log('transaction error: ' + error.message);
        }, function () {
            console.log('transaction ok');
        });
    } catch (err) {
        alert('gestorSalvarFiscalizacao: ' + err.message);
    }
}

function pegarIdTabela() {

    var ID = 0;

    try {
        openDB();

        //todo: db não possui executeSql, apenas o tx (comentário abaixo)
        db.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], function (rs) {
            console.log('Record count (expected to be 2): ' + res.rows.item(0).mycount);
            ID = rs.rows.item(0).mycount;
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        if (ID == 0) {
            ID = 1;
        }
        /*
                db.transaction(function (tx) {
                    tx.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], function(rs) {
                        console.log('Record count (expected to be 2): ' + res.rows.item(0).mycount);
                        ID = rs.rows.item(0).mycount;
                    }, function(error) {
                        console.log('SELECT SQL statement ERROR: ' + error.message);
                    });

                    if (ID == 0) {
                        ID = 1;
                    }
                }, function(err){
                    alert('pegarIdTabela: An error occured while getting idTabela');
                });
        */
    } catch (err) {
        alert('pegarIdTabela: ' + err.message);
    }

    return ID;
}

function inserirFiscalizacao(idfiscalizacao, data, cnpjautorizada) {

    openDB();

    db.transaction(function (tx) {

        var query = "INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);";

        tx.executeSql(query, [idfiscalizacao, data, cnpjautorizada], function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (tx, error) {
                console.log('INSERT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function addItem(first, last, acctNum) {

    openDB();

    db.transaction(function (tx) {

        var query = "INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?)";

        tx.executeSql(query, [idfiscalizacao, data, cnpjautorizada], function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (tx, error) {
                console.log('INSERT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function verificaAutorizacaoFiscalizacao(unidade) {

    let flagSomenteConsulta = true;

    switch (unidade) {
        case 'SFC':
        case 'GFP':
        case 'GFN':
        case 'GPF':
        case 'URESP':
        case 'URERJ':
        case 'UREFL':
        case 'UREBL':
        case 'UREMN':
        case 'URERE':
        case 'UREPV':
        case 'UREFT':
        case 'URESV':
        //case 'UREPR':  --ESSA URE MODOU DE NOME PARA URECB - Conforme Victor Heimburger 12/02/2020
        case 'URECB':
        case 'UREPL':
        case 'URECO':
        case 'UREVT':
        case 'URESL':
            flagSomenteConsulta = false;
            break;
    }


    if (flagSomenteConsulta == true) {
        console.log("USUARIO DE CONSULTA");
    } else {
        console.log("USUARIO DE FISCALIZACAO");
    }

    return flagSomenteConsulta;
}


/*=============================================================
                            DASHBOARD
=============================================================*/
async function gestorCarregarDadosDashBoard() {
    try {

        let qtdEmpresas = 0;
        let qtdAutorgas = 0;
        let qtdMaritima = 0;
        let qtdInterior = 0;
        let qtdPorto = 0;
        let ArQtdModalidade = [];

        qtdEmpresas = await pegarQtdEmpresas();
        qtdAutorgas = await pegarQtdAutorgas();
        qtdMaritima = await pegarQtdMaritima();
        qtdInterior = await pegarQtdInterior();
        qtdPorto = await pegarQtdPorto();

        ArQtdModalidade = await pegarQtdPorModalidade();

        let dadosTemp = {
            QtdEmpresas: qtdEmpresas,
            QtdAutorgas: qtdAutorgas,
            QtdMaritima: qtdMaritima,
            QtdInterior: qtdInterior,
            QtdPorto: qtdPorto,
            Modalidades: ArQtdModalidade
        };


        sessionStorage.removeItem("arDashBoard");
        sessionStorage.setItem("arDashBoard", angular.toJson(dadosTemp));

        console.log(dadosTemp)

        //await gestorSalvarFiscalizacaoIrregularidades(ID, arIrregularidades);
        //await gestorSalvarFiscalizacaoEquipe(ID, arEquipe);
        //await gestorSalvarFiscalizacaoTrecho(ID, arTrecho);
        //await gestorSalvarFiscalizacaoCheckList(ID, arPerguntas);
        //await gestorSalvarFiscalizacaoQuestionario(ID, arQuestionario);
        //await gestorSalvarFiscalizacaoFotos(ID, arRotina);
        //await gestorSalvarFiscalizacaoEvidencia(ID, arEvidencias);


    } catch (err) {
        alert('gestorCarregarDadosDashBoard: ' + err.message);
    }
}

async function pegarQtdEmpresas() {

    let qtdEmpresas = 0;

    try {
        qtdEmpresas = await gestorExecuteReaderInteger('SELECT COUNT(DISTINCT NRINSCRICAO) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdEmpresas == null) {
            qtdEmpresas = 0;
        }
    } catch (err) {
        alert('pegarQtdEmpresas: ' + err.message);
    }

    return qtdEmpresas;
}

async function pegarQtdAutorgas() {

    let qtdAutorgas = 0;

    try {
        qtdAutorgas = await gestorExecuteReaderInteger('SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdAutorgas == null) {
            qtdAutorgas = 0;
        }
    } catch (err) {
        alert('pegarQtdAutorgas: ' + err.message);
    }

    return qtdAutorgas;
}

async function pegarQtdMaritima() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdInterior() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";

        query += ") ";

        query += " GROUP BY NRINSCRICAO, MODALIDADE ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdPorto() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "NOT IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";
        query += " ,'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdPorModalidade() {

    let arDados = 0;

    try {
        var query = "SELECT SUM(mycount) as mycount, MODALIDADE, AREAPPF, TIPO FROM ( ";

        query += " SELECT 1 AS ORDEM, COUNT(*) as mycount, 'Porto Publico' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Porto Publico%') ";
        query += " UNION ALL ";
        query += " SELECT 2 AS ORDEM, COUNT(*) as mycount, 'Arrendamento' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Arrendamento%') ";
        query += " UNION ALL ";
        query += " SELECT 3 AS ORDEM, COUNT(*) as mycount, 'Contrato de Transicao' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Transicao%') ";
        query += " UNION ALL ";
        query += " SELECT 4 AS ORDEM, COUNT(*) as mycount, 'Contrato de Passagem' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Passagem%') ";
        query += " UNION ALL ";
        query += " SELECT 5 AS ORDEM, COUNT(*) as mycount, 'Contrato de Uso Temporario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Uso Temporario%') ";
        query += " UNION ALL ";
        query += " SELECT 6 AS ORDEM, COUNT(*) as mycount, 'Operador Portuario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Operador Portuario%') ";
        query += " UNION ALL ";
        query += " SELECT 7 AS ORDEM, COUNT(*) as mycount, 'Terminal de uso privado' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Terminal de uso privado%') ";
        query += " UNION ALL ";
        query += " SELECT 8 AS ORDEM, COUNT(*) as mycount, 'Estacao de transbordo de cargas' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Estacao de transbordo de cargas%') ";
        query += " UNION ALL ";
        query += " SELECT 9 AS ORDEM, COUNT(*) as mycount, 'Instalacao portuaria de turismo' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Instalacao portuaria de turismo') ";
        query += " UNION ALL ";

        query += " SELECT 10 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro') ";
        query += " UNION ALL ";
        query += " SELECT 11 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estacao de transbordo de cargas') ";
        query += " UNION ALL ";
        query += " SELECT 12 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao para transferencia de petroleo') ";
        query += " UNION ALL ";
        query += " SELECT 13 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao temporaria') ";
        query += " UNION ALL ";
        query += " SELECT 14 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao flutuante') ";
        query += " UNION ALL ";
        query += " SELECT 15 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Terminal de uso privado') ";
        query += " UNION ALL ";
        query += " SELECT 16 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro ate 1.000 TPB') ";
        query += " UNION ALL ";
        query += " SELECT 17 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao portuaria publica de pequeno porte') ";
        query += " UNION ALL ";
        query += " SELECT 18 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao rudimentar') ";
        query += " UNION ALL ";
        query += " SELECT 19 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro') ";
        query += " UNION ALL ";
        query += " SELECT 20 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao de apoio') ";
        query += " UNION ALL ";

        query += " SELECT 21 AS ORDEM, COUNT(*) as mycount, 'Longo Curso' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Longo Curso%')";
        query += " UNION ALL ";
        query += " SELECT 22 AS ORDEM, COUNT(*) as mycount, 'Cabotagem' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Cabotagem%') ";
        query += " UNION ALL ";
        query += " SELECT 23 AS ORDEM, COUNT(*) as mycount, 'Apoio Maritimo' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Maritimo%') ";
        query += " UNION ALL ";
        query += " SELECT 24 AS ORDEM, COUNT(*) as mycount, 'Apoio Portuario' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Portuario%') ";
        query += " UNION ALL ";


        query += " SELECT 26 AS ORDEM, 1 as mycount, 'Longitudinal de Carga' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Carga')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 27 AS ORDEM, 1 as mycount, 'Longitudinal de Passageiros' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Passageiros')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 28 AS ORDEM, 1 as mycount, 'Longitudinal Misto' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal Misto')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 29 AS ORDEM, 1 as mycount, 'Travessia' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Travessia')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";

        //query += " UNION ALL ";
        //query += " SELECT 30 AS ORDEM, COUNT(*) as mycount, 'Embarcacao em Construcao' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Embarcacao em Construcao%') ";


        //query += " UNION ALL ";
        //query += " SELECT COUNT(*) as mycount, 'Interior' AS MODALIDADE, AREAPPF FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Interior') ";


        query += " ) where mycount > 0 GROUP BY MODALIDADE, AREAPPF ORDER BY ORDEM ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = 0;
        }
    } catch (err) {
        alert('pegarQtdPorModalidade: ' + err.message);
    }

    return arDados;
}

/*=============================================================*/


/*=============================================================
                            RELATORIO MOBILE
=============================================================*/
async function gestorCarregarDadosRelatorioUsuario() {
    try {

        let ArFiscalizacoesRealizadas = [];
        let ArEmpresasFiscalizadas = [];
        let ArFiscalizacoes = [];

        ArFiscalizacoesRealizadas = await pegarQtdFiscalizacoesRealizadas();
        ArEmpresasFiscalizadas = await pegarQtdEmpresasFiscalizadas();
        ArFiscalizacoes = await pegarQtdFiscalizacoes();

        let dadosTemp = {
            FiscalizacoesRealizadas: ArFiscalizacoesRealizadas,
            EmpresasFiscalizadas: ArEmpresasFiscalizadas,
            Fiscalizacoes: ArFiscalizacoes,
        };

        sessionStorage.removeItem("arRelatorioUsuario");
        sessionStorage.setItem("arRelatorioUsuario", angular.toJson(dadosTemp));

        console.log(dadosTemp)
    } catch (err) {
        alert('gestorCarregarDadosRelatorioUsuario: ' + err.message);
    }
}

async function pegarQtdFiscalizacoesRealizadas() {

    let arDados = [];

    try {
        let query = "SELECT QTDAUTOINFRACAO, QTDNOTIFICACAO, QTEXTRAORDINARIA, QTAPARTADO, QTROTINA, QTPROGRAMADA, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdFiscalizacoesRealizadas: ' + err.message);
    }

    return arDados;
}

async function pegarQtdEmpresasFiscalizadas() {

    let arDados = [];

    try {
        let query = "SELECT SUM(QTDEMPRESAFISCALIZADAINTERIOR) AS QTDINTERIOR, SUM(QTDEMPRESAFISCALIZADAMARITIMA) AS QTDMARITIMA, SUM(QTDEMPRESAFISCALIZADAPORTO) AS QTDPORTO, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "GROUP BY NRMES, NRANO ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdEmpresasFiscalizadas: ' + err.message);
    }

    return arDados;
}

async function pegarQtdFiscalizacoes() {

    let arDados = [];

    try {
        let query = "SELECT SUM(QTDFISCALIZACAOAUTOINFRACAO) AS QTDAUTOINFRACAO, SUM(QTDFISCALIZACAONOTIFICACAO) AS QTDNOTIFICACAO, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "GROUP BY NRMES, NRANO ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdFiscalizacoes: ' + err.message);
    }

    return arDados;
}

/*=============================================================*/


/*==============================================================*/
async function gestorExecuteReaderInteger(sqlQuery) {

    let qtd = 0;

    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {
                    if (rs.rows.length > 0) {
                        qtd = rs.rows.item(0).mycount;
                    }

                    if (qtd == null) {
                        qtd = 0;
                    }

                    resolve(true);

                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReader: ' + err.message);
    }

    return qtd;
}

async function gestorExecuteReaderString(sqlQuery) {

    let valor = "";

    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {

                    valor = rs.rows.item(0).VALOR;
                    if (valor == null) {
                        valor = "";
                    }
                    resolve(true);

                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            await firstFunction
        }

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReaderString: ' + err.message);
    }

    return valor;
}

async function gestorExecuteReaderArray(sqlQuery) {

    var resultSet = [];

    try {

        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {

                    for (var x = 0; x < rs.rows.length; x++) {
                        resultSet.push(rs.rows.item(x));
                    }

                    resolve(true);
                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReader: ' + err.message);
    }

    return resultSet;
}

function exportDadosEmpresa(nomeArquivo, searchTerm, modalidade, empresas) {
    let columns = ["Área", "Tipo de Serviço", "CNPJ", "Razão Social", "Instalação/Trecho/Linha", "Nº Outorga", "Data de Outorga", "UF", "Município", "CNPJ Instalação", "Razão Social Instalação"];
    if (!empresas) {
        openDB();
        db.transaction(function (tx) {

            var params = [],
                statement =
                    " select " +
                    "     empresa.AREAPPF 'Área', " +
                    "     empresa.MODALIDADE 'Tipo de Serviço', " +
                    "     empresa.NRINSCRICAO 'CNPJ', " +
                    "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                    "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                    "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                    "     CASE                                                       " +
                    "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                    "       ELSE empresa.DTOUTORGA " +
                    "     END AS 'Data de Outorga',                                   " +
                    "     empresa.SGUF 'UF', " +
                    "     empresa.NOMUNICIPIO 'Município', " +
                    "     empresa.NRINSCRICAOINSTALACAO 'CNPJ Instalação', " +
                    "     empresa.NORAZAOSOCIALINSTALACAO 'Razão Social Instalação' " +
                    " from EMPRESASAUTORIZADAS empresa " +
                    " where 1=1" +
                    "     and empresa.NRINSCRICAO is not null " +
                    '     and empresa.NRINSCRICAO <> "" ';

            if (modalidade && modalidade != "undefined") {
                statement += " and empresa.MODALIDADE = ? ";
                params.push(modalidade);
            }
            if (searchTerm && searchTerm != "undefined") {
                statement +=
                    " and (empresa.NRINSCRICAO like ? or upper(empresa.NORAZAOSOCIAL) like upper(?)) ";
                params.push(searchTerm);
                params.push("%" + searchTerm + "%");
            }
            tx.executeSql(statement, params, function (tx, results) {
                var rows = [];
                for (let i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    if (row["CNPJ Instalação"] && row["CNPJ"] != row["CNPJ Instalação"]) {
                        row["CNPJ Instalação"] = mCNPJ(row["CNPJ Instalação"]);
                    } else {
                        row["CNPJ Instalação"] = "";
                        row["Razão Social Instalação"] = "";
                    }
                    row["CNPJ"] = mCNPJ(row["CNPJ"]);
                    row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                    rows.push(row);
                }
                triggerXlsxDownload(rows, nomeArquivo);
            }, (e) => {
                console.log(e);
            });
        });
        return;
    }

    let treatedArray = empresas.map((e) => {
        let cnpj = mCNPJ(e.NRInscricao);
        let cnpjInstalacao = "";
        let razaoSocialInstalacao = "";
        if (e.NRInscricaoInstalacao && e.NRInscricao != e.NRInscricaoInstalacao) {
            cnpjInstalacao = mCNPJ(e.NRInscricaoInstalacao);
            razaoSocialInstalacao = e.NORazaoSocialInstalacao;
        }

        let dtOutorga = (e.Modalidade && e.Modalidade == 'Porto Publico') ? 'NULL' : (e.DTOutorga ? formatDate(e.DTOutorga, "pt-br") : 'NULL');
        return {
            "Área": e.AreaPPF,
            "Tipo de Serviço": e.Modalidade,
            "CNPJ": cnpj,
            "Razão Social": e.NORazaoSocial,
            "Instalação/Trecho/Linha": e.Instalacao,
            "Nº Outorga": e.NRInstrumento,
            "Data de Outorga": dtOutorga,
            "UF": e.SGUF,
            "Município": e.NOMunicipio,
            "CNPJ Instalação": cnpjInstalacao,
            "Razão Social Instalação": razaoSocialInstalacao,
        }
    })

    triggerXlsxDownload(treatedArray, nomeArquivo);

}

function exportDadosDetalhados(cnpj, nrinstrumento) {
    openDB();
    db.transaction(function (tx) {
        var params = [],
            statement =
                " select " +
                "     empresa.AREAPPF 'Área', " +
                "     empresa.MODALIDADE 'Tipo de Serviço', " +
                "     empresa.NRINSCRICAO 'CNPJ', " +
                "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                "     CASE                                                       " +
                "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                "       ELSE empresa.DTOUTORGA " +
                "     END AS 'Data de Outorga',                                   " +
                "     empresa.SGUF 'UF', " +
                "     empresa.NOMUNICIPIO 'Município', " +
                "     frota.NOME 'Embarcação', " +
                "     frota.STATUS 'Status' " +
                " from EMPRESASAUTORIZADAS empresa  " +
                " left join ( select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADA " +
                " union " +
                " select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADAMARITIMA ) " +
                " frota on frota.NRINSCRICAO = empresa.NRINSCRICAO " +
                " where 1=1 ";
        if (cnpj && cnpj != "undefined") {
            statement += " and empresa.NRINSCRICAO = ? ";
            params.push(cnpj);
        }
        if (nrinstrumento && nrinstrumento != "undefined") {
            statement += " and empresa.NRINSTRUMENTO = ? ";
            params.push(nrinstrumento);
        }
        tx.executeSql(statement, params, function (tx, results) {
            var rows = [];
            for (let i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                row["CNPJ"] = mCNPJ(row["CNPJ"]);
                row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                rows.push(row);
            }
            triggerXlsxDownload(rows, nomeAPK() + "-Detalhes_Empresa");
        });
    });
}

function triggerXlsxDownload(content, fileName) {

    if (window.cordova.platformId === "browser") {
        var encodedUri =
            "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + content);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
    } else {
        downloadFile(fileName, content);
    }
}

function downloadFile(fileName, content) {
    var fileURL =
        cordova.file.externalApplicationStorageDirectory + "Download/" + fileName + '.xlsx';
    var uri = createXlsx(content, fileName);
    var fileTransfer = new FileTransfer();
    var mensagem = '<p> Iniciando Download... </p>';
    M.toast({html: mensagem, classes: "#c62828 green darken-3"});
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download completo");
            var mensagem = '<p> Download Completo! </p>';
            M.toast({html: mensagem, classes: "#c62828 green darken-3"});
            cordova.plugins.fileOpener2.open(fileURL, "application/vnd.ms-excel", {
                error: function () {
                },
                success: function () {
                },
            });
        },
        function (error) {
            console.log(error);
            var mensagem = '<p> Ocorreu um erro ao baixar o arquivo </p>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3"});
        }
    );

}


function createXlsx(data, sheetName) {
    let sheet = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, sheetName);

    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    var out = XLSX.write(wb, {type: 'base64'});
    return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + out;
}

function retornarBit(campo) {
    return campo ? '1' : '0';
}


// ---- gestorCarregarEsquemasOperacionaisPesquisa ----
function gestorCarregarEsquemasOperacionaisPesquisa(sentido, partida, destino) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.ID ";
        query += " ,ESQUEMASOPERACIONAIS.NRINSCRICAO ";
        query += " ,ESQUEMASOPERACIONAIS.SENTIDO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.UFPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.UFCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " ,ESQUEMASOPERACIONAIS.STIDAVOLTA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.NRORDEM ";
        query += " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO ";
        query += " FROM ESQUEMASOPERACIONAIS ";


        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "'";

        //+" LIMIT 70 ";


        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        var tema = null;
                        var temaCor = null;
                        if (res.rows.item(i).SENTIDO == "Ida") {
                            tema = '#74A2DC';
                            temaCor = 'cortemapartida';
                        } else {
                            tema = '#31445C';
                            temaCor = 'cortema';
                        }

                        //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                        //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                        let nomeDiaSemana;
                        let nomeDiaSemanaChegada;

                        //if(dia == diaSemana ) {
                        //    nomeDiaSemana = "Hoje";
                        //} else {
                        nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                        //}

                        //if(dia == diaSemanaChegada ) {
                        //    nomeDiaSemanaChegada = "Hoje";
                        //} else {
                        nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                        //}


                        //...
                        arData.push({
                            id: (res.rows.item(i).ID + 1) //"2618-3156"
                            ,
                            price: (res.rows.item(i).ID + 1),
                            requests: 5,
                            pledge: 150,
                            weight: 50,
                            sender: res.rows.item(i).NORAZAOSOCIAL
                            //, sender: 'Empresa Autorizada'
                            ,
                            senderImg: 'img/icon-consultar.png',
                            themeColor: temaCor,
                            themeColorHex: tema,
                            bgImgUrl: 'img/fundo.png',
                            rating: 5,
                            ratingCount: 26,
                            fromStreet: res.rows.item(i).PARTIDAPORTO
                            //, fromStreet: 'Mácapa'
                            ,
                            fromCity: res.rows.item(i).UFPARTIDA
                            //, fromCity: 'Pará, PA 10025'
                            ,
                            toStreet: res.rows.item(i).PORTOCHEGADA
                            //, toStreet: 'Almeirim'
                            ,
                            toCity: res.rows.item(i).UFCHEGADA
                            //, toCity: 'Santarém, PA 11101'
                            ,
                            delivTime: res.rows.item(i).HRPARTIDA
                            //, delivTime: '06:30 pm'
                            ,
                            delivDate: 'Maio 16, 2015'
                            //, delivDateNoun: 'Hoje'
                            ,
                            delivDateNoun: nomeDiaSemana,
                            reqDl: '24 minutes',
                            latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                            longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                            latTo: res.rows.item(i).VLLATITUDECHEGADA,
                            longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                            qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            ordem: res.rows.item(i).NRORDEM,
                            horaChegada: res.rows.item(i).HRCHEGADA,
                            diasemanachegada: nomeDiaSemanaChegada,
                            sentido: res.rows.item(i).SENTIDO
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPesquisa', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'destino': destino
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPesquisa', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'destino': destino
        }));
    }

    return arData;
}


// ---- gestorCarregarInstalacaoNavInterior ----
function gestorCarregarInstalacaoNavInterior(nrinscricao, nrinstrumento) {

    var resultSet = [];
    try {

        let query = "";
        query += " SELECT INSTALACAO FROM EMPRESASAUTORIZADAS WHERE NRINSCRICAO = '" + nrinscricao + "' AND NRINSTRUMENTO = '" + nrinstrumento.replace("TA - ", "") + "' GROUP BY INSTALACAO ";

        resultSet = await gestorExecuteReaderArray(query);

    } catch (error) {

    }

    return resultSet;
}


// ---- gestorVerificarEstrutura_versao1_1_12_A1 ----
function gestorVerificarEstrutura_versao1_1_12_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " NRRESOLUCAO " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).NRRESOLUCAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: NRRESOLUCAO") {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NRRESOLUCAO", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura_versao1_1_12_A1: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura_versao1_1_12_A1', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_1_13_A2 ----
function gestorVerificarEstrutura_versao1_1_13_A2() {
    try {
        openDB();

        var query = "SELECT " +
            " AUTORIDADEPORTUARIA " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).AUTORIDADEPORTUARIA
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: AUTORIDADEPORTUARIA") {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "AUTORIDADEPORTUARIA", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura_versao1_1_13_A2: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura_versao1_1_13_A2', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_1_9_A1 ----
function gestorVerificarEstrutura_versao1_1_9_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " IDCONTRATOARRENDAMENTO " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: IDCONTRATOARRENDAMENTO") {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "IDCONTRATOARRENDAMENTO", "INTEGER");
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "VLMONTANTEINVESTIMENTO", "VARCHAR");
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NRTLO", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_1_A3 ----
function gestorVerificarEstrutura_versao1_2_1_A3() {
    try {
        openDB();

        var query = "SELECT " +
            " INSTALACAOSEMACENTOS " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: INSTALACAOSEMACENTOS" ||
                    err.message.toLowerCase().includes("no such column: INSTALACAOSEMACENTOS".toLowerCase())) {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "INSTALACAOSEMACENTOS", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_5_A2 ----
function gestorVerificarEstrutura_versao1_2_5_A2() {
    try {
        openDB();

        var query = "SELECT " +
            " NRINSCRICAOINSTALACAO " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: NRINSCRICAOINSTALACAO" ||
                    err.message.toLowerCase().includes("no such column: NRINSCRICAOINSTALACAO".toLowerCase())) {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NRINSCRICAOINSTALACAO", "VARCHAR");
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NORAZAOSOCIALINSTALACAO", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_6_A2 ----
function gestorVerificarEstrutura_versao1_2_6_A2() {
    try {
        openDB();

        var query = "SELECT " +
            " NOREPRESENTANTE " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: NOREPRESENTANTE" ||
                    err.message.toLowerCase().includes("no such column: NOREPRESENTANTE".toLowerCase())) {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NOREPRESENTANTE", "VARCHAR");
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NRTELEFONE", "VARCHAR");
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "EEREPRESENTANTE", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOPROGRAMADA", "NOREPRESENTANTE", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOPROGRAMADA", "NRTELEFONE", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOPROGRAMADA", "EEREPRESENTANTE", "VARCHAR");
                    await gestorCriarCampoTabela("PRESTADORESSERVICOS", "NOREPRESENTANTE", "VARCHAR");
                    await gestorCriarCampoTabela("PRESTADORESSERVICOS", "NRTELEFONE", "VARCHAR");
                    await gestorCriarCampoTabela("PRESTADORESSERVICOS", "EEREPRESENTANTE", "VARCHAR");
                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_6_A5 ----
function gestorVerificarEstrutura_versao1_2_6_A5() {
    try {
        openDB();

        var query = "SELECT " +
            " NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message === "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: NRDOCUMENTOSEI" ||
                    err.message.toLowerCase().includes("no such column: NRDOCUMENTOSEI".toLowerCase())) {
                    await gestorCriarCampoTabela("EMPRESASAUTORIZADAS", "NRDOCUMENTOSEI", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOPROGRAMADA", "NRDOCUMENTOSEI", "VARCHAR");
                    await gestorCriarCampoTabela("PRESTADORESSERVICOS", "NRDOCUMENTOSEI", "VARCHAR");
                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarTabelas ----
function gestorVerificarTabelas() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS FISCALIZACAO');
                //tx.executeSql('DELETE FROM FISCALIZACAO');


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", CNPJAUTORIZADA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    ", OBS VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", CODPROCESSOPROGRAMADA VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", TPFISCALIZACAOPROGRAMADA VARCHAR " +
                    ", NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMPRESA (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", AREAPPF VARCHAR " +
                    ", DSBAIRRO VARCHAR " +
                    ", DSENDERECO VARCHAR " +
                    ", DTADITAMENTO VARCHAR " +
                    ", DTAUTORGA VARCHAR " +
                    ", EMAIL VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    ", INSTALACAO VARCHAR " +
                    ", LISTATIPOEMPRESA VARCHAR " +
                    ", MODALIDADE VARCHAR " +
                    ", NOMUNICIPIO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", NRADITAMENTO VARCHAR " +
                    ", NRCEP VARCHAR " +
                    ", NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    ", NOMECONTATO VARCHAR " +
                    ", QTDEMBARCACAO VARCHAR " +
                    ", SGUF VARCHAR " +
                    ", TPINSCRICAO VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", ICONE VARCHAR " +
                    ", LINK VARCHAR " +
                    ", NORMA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOIRREGULARIDADES (" +
                    " IDFISCALIZACAOIRREGULARIDADE INTEGER NOT NULL" +
                    ", ORDEM INTEGER NOT NULL" +
                    ", DSALINEA VARCHAR " +
                    ", DSINCISO VARCHAR " +
                    ", DSNORMA VARCHAR " +
                    ", DSNORMACOMPLETA VARCHAR " +
                    ", DSNORMATIVA VARCHAR " +
                    ", DSREQUISITO VARCHAR " +
                    ", IDFISCALIZACAO VARCHAR " +
                    ", IDIRREGULARIDADE VARCHAR " +
                    ", IDREQUISITO VARCHAR " +
                    ", IDSUPERINTENDENCIA VARCHAR " +
                    ", NOREQUISITO VARCHAR " +
                    ", NRARTIGO VARCHAR " +
                    ", NRPARAGRAFO VARCHAR " +
                    ", NRPRAZO VARCHAR " +
                    ", STNOTIFICAVEL VARCHAR " +
                    ", STQUINZENAL VARCHAR " +
                    ", TPINFRACAO VARCHAR " +
                    ", TPNAVEGACAO VARCHAR " +
                    ", VLMULTAMAXIMA VARCHAR " +
                    ", FLAGCHECK VARCHAR " +
                    ", DESCRICAOFATO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    ", PRIMARY KEY (IDFISCALIZACAOIRREGULARIDADE, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOCHECKLIST (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL" +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IDCHECKLIST VARCHAR " +
                    " ,IDOBJETOFISCALIZADO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,CDLATITUDE VARCHAR " +
                    " ,CDLONGITUDE VARCHAR " +
                    " ,DTCADASTRO VARCHAR " +
                    " ,STRESPOSTA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO  VARCHAR " +
                    " ,IDSECAO  VARCHAR " +
                    " ,DESCRICAOFATO  VARCHAR " +
                    " ,RESPOSTA  VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IMAGEMIRREGULARIDADE VARCHAR " +
                    " ,TITULOIMAGEMIRREGULARIDADE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEQUIPE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,STCOORDENADOR VARCHAR " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, NRMATRICULA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOTRECHO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOQUESTIONARIO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,MARQUE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOS (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEVIDENCIA (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOIRREGULARIDADE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDIRREGULARIDADE INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDIRREGULARIDADE) " +
                    ")");


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMBARCACAO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDEMBARCACAO VARCHAR NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDEMBARCACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACOESREALIZADAS (" +
                    "  IDFISCALIZACAOREALIZADA INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,QTDFISCALIZACAOENVIADA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAINTERIOR INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAMARITIMA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAPORTO INTEGER " +
                    " ,QTDEMPRESAFISCALIZADA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAINTERIOR INTEGER " +
                    ", QTDEMPRESAFISCALIZADAMARITIMA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAPORTO INTEGER " +
                    " ,QTDFISCALIZACAOAUTOINFRACAO INTEGER " +
                    " ,QTDFISCALIZACAONOTIFICACAO INTEGER " +
                    " ,QTDAUTOINFRACAO INTEGER " +
                    " ,QTDNOTIFICACAO INTEGER " +
                    " ,QTEXTRAORDINARIA INTEGER " +
                    " ,QTAPARTADO INTEGER " +
                    " ,QTROTINA INTEGER " +
                    " ,QTPROGRAMADA INTEGER " +
                    " ,NRMES VARCHAR " +
                    " ,NRANO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAOREALIZADA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS USUARIO (" +
                    "  IDUSUARIO INTEGER NOT NULL " +
                    " ,DSSENHA VARCHAR " +
                    " ,EEFUNCIONARIO VARCHAR " +
                    " ,NOLOGINUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,NRMATRICULASERVIDOR INTEGER " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,MANTERCONECTADO VARCHAR " +
                    " ,DATALOGOFF VARCHAR " +
                    " ,IDPOSTOAVANCADO INTEGER " +
                    " ,DSPOSTOAVANCADO VARCHAR " +
                    " ,IDPERFILFISCALIZACAO INTEGER " +
                    " ,PRIMARY KEY (IDUSUARIO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,AREAPPF VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,DTADITAMENTO VARCHAR " +
                    " ,DTOUTORGA VARCHAR " +
                    " ,EMAIL VARCHAR " +
                    " ,INSTALACAO VARCHAR " +
                    " ,INSTALACAOSEMACENTOS VARCHAR " +
                    " ,LISTATIPOEMPRESA VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRADITAMENTO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NOMECONTATO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO INTEGER " +
                    " ,VLMONTANTEINVESTIMENTO VARCHAR " +
                    " ,NRTLO VARCHAR " +
                    " ,NRRESOLUCAO VARCHAR " +
                    " ,AUTORIDADEPORTUARIA VARCHAR " +
                    " ,NRINSCRICAOINSTALACAO VARCHAR " +
                    " ,NORAZAOSOCIALINSTALACAO VARCHAR " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSERVICOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSINCRONIZAR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOSERVICONAOAUTORIZADO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    ", OBS VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    " ,IDTIPOENTIDADE INTEGER " +
                    ", IDTERMINALENVIADA INTEGER " +
                    " ,NOTERMINAL VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,VLLATITUDE VARCHAR " +
                    " ,VLLONGITUDE VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MUNICIPIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,SGUF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,DSTIPOTRANSPORTE VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,DSTRECHOLINHA VARCHAR " +
                    " ,IDTIPOTRANSPORTE1 VARCHAR " +
                    " ,IDTIPOTRANSPORTE2 VARCHAR " +
                    " ,IDTIPOTRANSPORTE3 VARCHAR " +
                    " ,IDTIPOTRANSPORTE4 VARCHAR " +
                    " ,IDTIPOTRANSPORTE5 VARCHAR " +
                    " ,IDTIPOTRANSPORTE6 VARCHAR " +
                    " ,IDTIPOTRANSPORTE7 VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACOESINTERIOR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    " ,IDFROTA VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EQUIPE (" +
                    "  NRMATRICULASERVIDOR INTEGER NOT NULL " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,PRIMARY KEY (NRMATRICULASERVIDOR) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS IRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE INTEGER " +
                    " ,IDREQUISITO INTEGER " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO INTEGER " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO INTEGER " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO INTEGER " +
                    " ,TPNAVEGACAO INTEGER " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                //tx.executeSql("DROP TABLE IF EXISTS PERGUNTAS;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,IRREGULARIDADES VARCHAR " +
                    " ,STATIVO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS QUESTIONARIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO INTEGER " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTASIRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IDREQUISITO VARCHAR " +
                    " ,IDSUPERINTENDENCIA VARCHAR " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO VARCHAR " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO VARCHAR " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO VARCHAR " +
                    " ,TPNAVEGACAO VARCHAR " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS INSTALACAOPORTUARIA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,BAIRRO VARCHAR " +
                    " ,CDBIGRAMA VARCHAR " +
                    " ,CDCENTROIDE VARCHAR " +
                    " ,CDINSTALACAOPORTUARIA VARCHAR " +
                    " ,CDTERMINAL VARCHAR " +
                    " ,CDTRIGRAMA VARCHAR " +
                    " ,CEP VARCHAR " +
                    " ,CIDADE VARCHAR " +
                    " ,CNPJ VARCHAR " +
                    " ,COMPANHIA VARCHAR " +
                    " ,COMPLEMENTO VARCHAR " +
                    " ,ENDERECO VARCHAR " +
                    " ,ESTADO VARCHAR " +
                    " ,FONTE VARCHAR " +
                    " ,GESTAO VARCHAR " +
                    " ,IDCIDADE VARCHAR " +
                    " ,IDREGIAOHIDROGRAFICA VARCHAR " +
                    " ,LATITUDE VARCHAR " +
                    " ,LEGISLACAO VARCHAR " +
                    " ,LOCALIZACAO VARCHAR " +
                    " ,LONGITUDE VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOME VARCHAR " +
                    " ,NUMERO VARCHAR " +
                    " ,OBSERVACAO VARCHAR " +
                    " ,PAIS VARCHAR " +
                    " ,PROFUNDIDADE VARCHAR " +
                    " ,REGIAOHIDROGRAFICA VARCHAR " +
                    " ,SITUACAO VARCHAR " +
                    " ,TIPO VARCHAR " +
                    " ,UF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHATIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,INSTALACAO VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,IDTIPOTRANSPORTE VARCHAR " +
                    " ,IDTRECHOLINHA VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DATAEMPRESASAUTORIZADAS VARCHAR " +
                    " ,DATAEQUIPE VARCHAR " +
                    " ,DATAIRREGULARIDADES VARCHAR " +
                    " ,DATAQUESTIONARIOS VARCHAR " +
                    " ,DATAPERGUNTAS VARCHAR " +
                    " ,DATAPERGUNTASIRREGULARIDADES VARCHAR " +
                    " ,DATAINSTALACAOPORTUARIA VARCHAR " +
                    " ,DATATRECHOLINHATIPOTRANSPORTE VARCHAR " +
                    " ,DATAFROTAALOCADA VARCHAR " +
                    " ,DATAMENSAGEMPUSH VARCHAR " +
                    " ,DATAESQUEMASOPERACIONAIS VARCHAR " +
                    " ,DATAPRESTADORESSERVICOS VARCHAR " +
                    " ,DATAMUNICIPIOS VARCHAR " +
                    " ,DATATIPOTRANSPORTE VARCHAR " +
                    " ,DATATRECHOLINHA VARCHAR " +
                    " ,DATAEMBARCACOESINTERIOR VARCHAR " +
                    " ,DATAFISCALIZACOESREALIZADAS VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGERRO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,DTREGISTRO VARCHAR " +
                    " ,TELAREFERENCIA VARCHAR " +
                    " ,ACAO VARCHAR " +
                    " ,DESCRICAOERRO VARCHAR " +
                    " ,PARAMETROS VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGVERSAO (" +
                    "  ID INTEGER PRIMARY KEY AUTOINCREMENT " +
                    " ,VERSAO VARCHAR " +
                    " ,FLAGRELEASE VARCHAR " +
                    " ,FLAGTUOR VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADAMARITIMA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACAOCONSTRUCAO (" +
                    "  IDEMBARCACAOCONSTRUCAO INTEGER NOT NULL " +
                    " ,NRCASCO VARCHAR " +
                    " ,IDESTALEIROCONSTRUCAO VARCHAR " +
                    " ,VLPESOLEVEEDIFICADO VARCHAR " +
                    " ,STCOMPROVACAOPESOLEVE VARCHAR " +
                    " ,DTINICIOCONSTRUCAO VARCHAR " +
                    " ,DTCONCLUSAOCONSTRUCAO VARCHAR " +
                    " ,DTLANCAMENTO VARCHAR " +
                    " ,NRLICENCAMARINHA VARCHAR " +
                    " ,STCONSTRUCAO VARCHAR " +
                    " ,IDTIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,IDCLASSIFICACAOEMBARCACAO VARCHAR " +
                    " ,VLPESOLEVETOTAL VARCHAR " +
                    " ,VLTPB VARCHAR " +
                    " ,VLBHP VARCHAR " +
                    " ,VLTTE VARCHAR " +
                    " ,IDTIPOMATERIALCASCO VARCHAR " +
                    " ,VLCOMPRIMENTO VARCHAR " +
                    " ,VLBOCA VARCHAR " +
                    " ,VLCALADOMAXIMO VARCHAR " +
                    " ,VLCAPACIDADEPASSAGEIROS VARCHAR " +
                    " ,QTTRIPULANTE VARCHAR " +
                    " ,VLPONTAL VARCHAR " +
                    " ,QTMOTOR VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,IDAGENTEFINANCEIRO VARCHAR " +
                    " ,DTTERMOCOMPROMISSO VARCHAR " +
                    " ,STGARANTIAOUTORGA VARCHAR " +
                    " ,DSOBSERVACAO VARCHAR " +
                    " ,DTAPRESENTACAOCRONOGRAMA VARCHAR " +
                    " ,VLPESOLEVEEDIFICADOEVOLUCAO VARCHAR " +
                    " ,STCRONOGRAMA VARCHAR " +
                    " ,STATRASO VARCHAR " +
                    " ,STATRASOFORCAMAIOR VARCHAR " +
                    " ,DSOBSERVACAOEVOLUCAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,VLARQUEACAOBRUTA VARCHAR " +
                    " ,PRIMARY KEY (IDEMBARCACAOCONSTRUCAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTERMINAL (" +
                    "  IDTIPOTERMINAL INTEGER NOT NULL " +
                    " ,NOTIPOTERMINAL VARCHAR " +
                    " ,TPINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,PRIMARY KEY (IDTIPOTERMINAL) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESACONTRATO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRCNPJ VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGA VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI VARCHAR " +
                    " ,IDGRUPOMERCADORIA VARCHAR " +
                    " ,IDNATUREZACARGA VARCHAR " +
                    " ,NRVERSAO VARCHAR " +
                    " ,CDCONTRATO VARCHAR " +
                    " ,NOGRUPOMERCADORIA VARCHAR " +
                    " ,VLAREATOTAL VARCHAR " +
                    " ,IDTIPOSERVICO VARCHAR " +
                    " ,NOTIPOSERVICO VARCHAR " +
                    " ,NOCLASSIFICACAOCARGA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MENSAGEMPUSH (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TITULO VARCHAR " +
                    " ,MENSAGEM VARCHAR " +
                    " ,DATA VARCHAR " +
                    " ,FLAGLIDA VARCHAR " +
                    " ,TPDESTINATARIO INTEGER" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS ESQUEMASOPERACIONAIS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,SENTIDO VARCHAR " +
                    " ,PARTIDAPORTO VARCHAR " +
                    " ,PARTIDADIASEMANA VARCHAR " +
                    " ,HRPARTIDA VARCHAR " +
                    " ,UFPARTIDA VARCHAR " +
                    " ,PORTOCHEGADA VARCHAR " +
                    " ,CHEGADADIASEMANA VARCHAR " +
                    " ,HRCHEGADA VARCHAR " +
                    " ,UFCHEGADA VARCHAR " +
                    " ,IDESQUEMAOPERACIONALITINERARIO INTEGER " +
                    " ,IDESQUEMAOPERACIONAL INTEGER " +
                    " ,STIDAVOLTA INTEGER " +
                    " ,CDLOCALPARTIDA INTEGER " +
                    " ,VLLATITUDEPARTIDA VARCHAR " +
                    " ,VLLONGITUDEPARTIDA VARCHAR " +
                    " ,CDSEMANAPARTIDA INTEGER " +
                    " ,CDLOCALCHEGADA INTEGER " +
                    " ,VLLATITUDECHEGADA VARCHAR " +
                    " ,VLLONGITUDECHEGADA VARCHAR " +
                    " ,CDSEMANACHEGADA INTEGER " +
                    " ,NRORDEM INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                resolve(true);
            }, async function (tx, e) {
                console.log("ERROR: " + e.message);
                resolve(true);
            }, async function () {
                console.log('transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (err) {
        console.log('gestorVerificarTabelas: ' + err.message);
    }
}


// ---- pegarQtdAutorgas ----
function pegarQtdAutorgas() {

    let qtdAutorgas = 0;

    try {
        qtdAutorgas = await gestorExecuteReaderInteger('SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdAutorgas == null) {
            qtdAutorgas = 0;
        }
    } catch (err) {
        alert('pegarQtdAutorgas: ' + err.message);
    }

    return qtdAutorgas;
}


// ---- pegarQtdEmpresas ----
function pegarQtdEmpresas() {

    let qtdEmpresas = 0;

    try {
        qtdEmpresas = await gestorExecuteReaderInteger('SELECT COUNT(DISTINCT NRINSCRICAO) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdEmpresas == null) {
            qtdEmpresas = 0;
        }
    } catch (err) {
        alert('pegarQtdEmpresas: ' + err.message);
    }

    return qtdEmpresas;
}


// ---- pegarQtdInterior ----
function pegarQtdInterior() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";

        query += ") ";

        query += " GROUP BY NRINSCRICAO, MODALIDADE ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}


// ---- pegarQtdMaritima ----
function pegarQtdMaritima() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}


// ---- pegarQtdPorModalidade ----
function pegarQtdPorModalidade() {

    let arDados = 0;

    try {
        var query = "SELECT SUM(mycount) as mycount, MODALIDADE, AREAPPF, TIPO FROM ( ";

        query += " SELECT 1 AS ORDEM, COUNT(*) as mycount, 'Porto Publico' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Porto Publico%') ";
        query += " UNION ALL ";
        query += " SELECT 2 AS ORDEM, COUNT(*) as mycount, 'Arrendamento' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Arrendamento%') ";
        query += " UNION ALL ";
        query += " SELECT 3 AS ORDEM, COUNT(*) as mycount, 'Contrato de Transicao' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Transicao%') ";
        query += " UNION ALL ";
        query += " SELECT 4 AS ORDEM, COUNT(*) as mycount, 'Contrato de Passagem' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Passagem%') ";
        query += " UNION ALL ";
        query += " SELECT 5 AS ORDEM, COUNT(*) as mycount, 'Contrato de Uso Temporario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Uso Temporario%') ";
        query += " UNION ALL ";
        query += " SELECT 6 AS ORDEM, COUNT(*) as mycount, 'Operador Portuario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Operador Portuario%') ";
        query += " UNION ALL ";
        query += " SELECT 7 AS ORDEM, COUNT(*) as mycount, 'Terminal de uso privado' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Terminal de uso privado%') ";
        query += " UNION ALL ";
        query += " SELECT 8 AS ORDEM, COUNT(*) as mycount, 'Estacao de transbordo de cargas' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Estacao de transbordo de cargas%') ";
        query += " UNION ALL ";
        query += " SELECT 9 AS ORDEM, COUNT(*) as mycount, 'Instalacao portuaria de turismo' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Instalacao portuaria de turismo') ";
        query += " UNION ALL ";

        query += " SELECT 10 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro') ";
        query += " UNION ALL ";
        query += " SELECT 11 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estacao de transbordo de cargas') ";
        query += " UNION ALL ";
        query += " SELECT 12 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao para transferencia de petroleo') ";
        query += " UNION ALL ";
        query += " SELECT 13 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao temporaria') ";
        query += " UNION ALL ";
        query += " SELECT 14 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao flutuante') ";
        query += " UNION ALL ";
        query += " SELECT 15 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Terminal de uso privado') ";
        query += " UNION ALL ";
        query += " SELECT 16 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro ate 1.000 TPB') ";
        query += " UNION ALL ";
        query += " SELECT 17 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao portuaria publica de pequeno porte') ";
        query += " UNION ALL ";
        query += " SELECT 18 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao rudimentar') ";
        query += " UNION ALL ";
        query += " SELECT 19 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro') ";
        query += " UNION ALL ";
        query += " SELECT 20 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao de apoio') ";
        query += " UNION ALL ";

        query += " SELECT 21 AS ORDEM, COUNT(*) as mycount, 'Longo Curso' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Longo Curso%')";
        query += " UNION ALL ";
        query += " SELECT 22 AS ORDEM, COUNT(*) as mycount, 'Cabotagem' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Cabotagem%') ";
        query += " UNION ALL ";
        query += " SELECT 23 AS ORDEM, COUNT(*) as mycount, 'Apoio Maritimo' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Maritimo%') ";
        query += " UNION ALL ";
        query += " SELECT 24 AS ORDEM, COUNT(*) as mycount, 'Apoio Portuario' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Portuario%') ";
        query += " UNION ALL ";


        query += " SELECT 26 AS ORDEM, 1 as mycount, 'Longitudinal de Carga' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Carga')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 27 AS ORDEM, 1 as mycount, 'Longitudinal de Passageiros' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Passageiros')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 28 AS ORDEM, 1 as mycount, 'Longitudinal Misto' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal Misto')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 29 AS ORDEM, 1 as mycount, 'Travessia' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Travessia')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";

        //query += " UNION ALL ";
        //query += " SELECT 30 AS ORDEM, COUNT(*) as mycount, 'Embarcacao em Construcao' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Embarcacao em Construcao%') ";


        //query += " UNION ALL ";
        //query += " SELECT COUNT(*) as mycount, 'Interior' AS MODALIDADE, AREAPPF FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Interior') ";


        query += " ) where mycount > 0 GROUP BY MODALIDADE, AREAPPF ORDER BY ORDEM ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = 0;
        }
    } catch (err) {
        alert('pegarQtdPorModalidade: ' + err.message);
    }

    return arDados;
}


// ---- pegarQtdPorto ----
function pegarQtdPorto() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "NOT IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";
        query += " ,'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}


// ===== CREATE TABLE: FROTAALOCADA =====

tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");


// ===== Funções relacionadas a FROTAALOCADA (total 17) =====

// ---- exportDadosDetalhados ----
function exportDadosDetalhados(cnpj, nrinstrumento) {
    openDB();
    db.transaction(function (tx) {
        var params = [],
            statement =
                " select " +
                "     empresa.AREAPPF 'Área', " +
                "     empresa.MODALIDADE 'Tipo de Serviço', " +
                "     empresa.NRINSCRICAO 'CNPJ', " +
                "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                "     CASE                                                       " +
                "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                "       ELSE empresa.DTOUTORGA " +
                "     END AS 'Data de Outorga',                                   " +
                "     empresa.SGUF 'UF', " +
                "     empresa.NOMUNICIPIO 'Município', " +
                "     frota.NOME 'Embarcação', " +
                "     frota.STATUS 'Status' " +
                " from EMPRESASAUTORIZADAS empresa  " +
                " left join ( select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADA " +
                " union " +
                " select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADAMARITIMA ) " +
                " frota on frota.NRINSCRICAO = empresa.NRINSCRICAO " +
                " where 1=1 ";
        if (cnpj && cnpj != "undefined") {
            statement += " and empresa.NRINSCRICAO = ? ";
            params.push(cnpj);
        }
        if (nrinstrumento && nrinstrumento != "undefined") {
            statement += " and empresa.NRINSTRUMENTO = ? ";
            params.push(nrinstrumento);
        }
        tx.executeSql(statement, params, function (tx, results) {
            var rows = [];
            for (let i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                row["CNPJ"] = mCNPJ(row["CNPJ"]);
                row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                rows.push(row);
            }
            triggerXlsxDownload(rows, nomeAPK() + "-Detalhes_Empresa");
        });
    });
}


// ---- gestorCarregarCadastroAutorizadas ----
function gestorCarregarCadastroAutorizadas(valor, tipo, nrinstrumento) {

    var arData = {};
    arData.empresas = [];
    arData.contrato = [];
    let flagAgruparInterior = false;
    let modalidade = null;

    try {
        modalidade = removerAcentos(sessionStorage.filtroConsultaCadastroNivel3);
        modalidade = modalidade.replace(" (TUP)", "");
        modalidade = modalidade.replace(" (ETC)", "");
        modalidade = modalidade.replace(" (IPT)", "");
        modalidade = modalidade.replace(" (IPR)", "");
    } catch (error) {
        console.log(error.message);
    }

    try {
        openDB();

        var query = "SELECT ";
        query += "  EMPRESASAUTORIZADAS.ID ";
        query += " ,EMPRESASAUTORIZADAS.AREAPPF ";
        query += " ,EMPRESASAUTORIZADAS.DSBAIRRO ";
        query += " ,EMPRESASAUTORIZADAS.DSENDERECO ";
        query += " ,EMPRESASAUTORIZADAS.DTADITAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.DTOUTORGA ";
        query += " ,EMPRESASAUTORIZADAS.EMAIL ";
        query += " ,EMPRESASAUTORIZADAS.INSTALACAO ";
        query += " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA ";
        if ((modalidade != null) && (modalidade != "undefined")) {
            query += " ,'" + modalidade + "' as MODALIDADE ";
        } else {
            query += " ,EMPRESASAUTORIZADAS.MODALIDADE ";
        }
        query += " ,EMPRESASAUTORIZADAS.NOMUNICIPIO ";
        query += " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL ";
        query += " ,EMPRESASAUTORIZADAS.NRADITAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NRCEP ";
        query += " ,EMPRESASAUTORIZADAS.NRINSCRICAO ";
        query += " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NOMECONTATO ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADAMARITIMA WHERE FROTAALOCADAMARITIMA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAOMARITIMA ";
        query += " ,(SELECT COUNT(*) FROM EMBARCACAOCONSTRUCAO WHERE EMBARCACAOCONSTRUCAO.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAOCONSTRUCAO ";
        query += " ,EMPRESASAUTORIZADAS.SGUF ";
        query += " ,EMPRESASAUTORIZADAS.TPINSCRICAO ";
        query += " ,EMPRESASAUTORIZADAS.IDCONTRATOARRENDAMENTO ";
        query += " ,EMPRESASAUTORIZADAS.VLMONTANTEINVESTIMENTO ";
        query += " ,EMPRESASAUTORIZADAS.NRTLO ";
        query += " ,EMPRESASAUTORIZADAS.NRRESOLUCAO ";
        query += " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA "
        query += " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO "
        query += " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO "
        query += " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE "
        query += " ,EMPRESASAUTORIZADAS.NRTELEFONE "
        query += " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE "
        query += " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI "
        query += " FROM EMPRESASAUTORIZADAS ";

        if (tipo == "AUTORIZADA") {
            query += " WHERE (EMPRESASAUTORIZADAS.NRINSCRICAO = '" + valor + "' ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO = '" + valor + "') ";

            query += " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento.replace("TA - ", "") + "' ";

            try {
                if ((modalidade != null) && (modalidade != "undefined")) {
                    query += "AND UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + modalidade + "%') ";
                }
            } catch (error) {
                console.log(error.message);
            }

            query += " LIMIT 1 ";

        } else if (tipo == "AUTORIZADAS") {

            query += " WHERE UPPER( EMPRESASAUTORIZADAS.NORAZAOSOCIAL ) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
            query += " OR UPPER( EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO ) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";

            //...
            query += " GROUP BY EMPRESASAUTORIZADAS.NRINSCRICAO, EMPRESASAUTORIZADAS.MODALIDADE, EMPRESASAUTORIZADAS.NRINSTRUMENTO ";

        } else {

            query += " WHERE ";

            try {

                if (modalidade != null) {
                    let n = false;
                    try {
                        //boolean inserido para evitar a mesclagem de Ex.: Registro de Estacao .... com Estacao de transbordo de carga
                        n = modalidade.toUpperCase().includes("LONGO CURSO");
                        if (n == false) {
                            n = modalidade.toUpperCase().includes("CABOTAGEM");
                        }

                        if (n == false) {
                            n = modalidade.toUpperCase().includes("APOIO PORTUARIO");
                        }

                        if (n == false) {
                            n = modalidade.toUpperCase().includes("APOIO MARITIMO");
                        }
                    } catch (error) {
                        console.log(error.message);
                    }


                    try {
                        //boolean inserido para evitar a mesclagem de Ex.: Registro de Estacao .... com Estacao de transbordo de carga
                        flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL DE CARGA");
                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL DE PASSAGEIROS");
                        }

                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("LONGITUDINAL MISTO");
                        }

                        if (flagAgruparInterior == false) {
                            flagAgruparInterior = modalidade.toUpperCase().includes("TRAVESSIA");
                        }
                    } catch (error) {
                        console.log(error.message);
                    }

                    if (n == true) {
                        query += " UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + modalidade + "%') ";
                    } else {
                        query += " UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('" + modalidade + "%') ";

                    }


                }
            } catch (error) {
                console.log(error.message);
            }

            try {
                if ((valor != null) && (valor != "")) {
                    valor = removerAcentos(valor);
                    valor = valor.toUpperCase();

                    query += " AND UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIAL) LIKE UPPER('%" + valor + "%') ";
                    query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
                    query += " OR UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO) LIKE UPPER('%" + valor + "%') ";
                    query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";
                }

            } catch (error) {
                console.log(error.message);
            }

            if (flagAgruparInterior == true) {
                query += " GROUP BY EMPRESASAUTORIZADAS.NRINSCRICAO, EMPRESASAUTORIZADAS.MODALIDADE, EMPRESASAUTORIZADAS.NRINSTRUMENTO ";
            }

            query += " ORDER BY EMPRESASAUTORIZADAS.NORAZAOSOCIAL ";
            query += " LIMIT 3000 ";
        }


        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {
                    let qtdRegAutorizada = res.rows.length;

                    for (let i = 0; i < qtdRegAutorizada; i++) {
                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            QTDEmbarcacaoMaritima: res.rows.item(i).QTDEMBARCACAOMARITIMA,
                            QTDEmbarcacaoConstrucao: res.rows.item(i).QTDEMBARCACAOCONSTRUCAO,
                            IDContratoArrendamento: res.rows.item(i).IDCONTRATOARRENDAMENTO,
                            VLMontanteInvestimento: res.rows.item(i).VLMONTANTEINVESTIMENTO,
                            NRTLO: res.rows.item(i).NRTLO,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }

                    //...
                    angular.forEach(arData.empresas, function (value, key) {
                        arData = verificaAutorizacao(arData, key);
                    });

                    //...
                    try {
                        let qtdEmpresas = 0;
                        qtdEmpresas = arData.empresas.length;
                        if (qtdEmpresas > 0) {
                            for (var emp = 0; emp < qtdEmpresas; emp++) {
                                if (arData.empresas[emp].IDContratoArrendamento > 0) {
                                    var resultSet01 = [];
                                    resultSet01 = await gestorExecuteReaderArray("SELECT * FROM EMPRESACONTRATO WHERE IDCONTRATOARRENDAMENTO = " +
                                        arData.empresas[emp].IDContratoArrendamento);

                                    console.log(resultSet01);
                                    let qtd = 0;
                                    qtd = resultSet01.length;
                                    if (qtd > 0) {
                                        for (var x = 0; x < qtd; x++) {
                                            arData.contrato = {
                                                NRCnpj: resultSet01[x].NRCNPJ,
                                                IDContratoArrendamento: resultSet01[x].IDCONTRATOARRENDAMENTO,
                                                IDClassificaoSubclassificaoCarga: resultSet01[x].IDCLASSIFICAOSUBCLASSIFICAOCARGA,
                                                IDClassificaoSubclassificaoCargaPai: resultSet01[x].IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI,
                                                IDGrupoMercadoria: resultSet01[x].IDGRUPOMERCADORIA,
                                                IDNaturezaCarga: resultSet01[x].IDNATUREZACARGA,
                                                NRVersao: resultSet01[x].NRVERSAO,
                                                CDContrato: resultSet01[x].CDCONTRATO,
                                                NOGrupoMercadoria: resultSet01[x].NOGRUPOMERCADORIA,
                                                VLAreaTotal: resultSet01[x].VLAREATOTAL,
                                                IDTipoServico: resultSet01[x].IDTIPOSERVICO,
                                                NOTipoServico: resultSet01[x].NOTIPOSERVICO,
                                                NOClassificacaoCarga: resultSet01[x].NOCLASSIFICACAOCARGA
                                            }
                                        }
                                    }

                                } else {
                                    arData.contrato = {
                                        NRCnpj: "",
                                        IDContratoArrendamento: "",
                                        IDClassificaoSubclassificaoCarga: "",
                                        IDClassificaoSubclassificaoCargaPai: "",
                                        IDGrupoMercadoria: "",
                                        IDNaturezaCarga: "",
                                        NRVersao: "",
                                        CDContrato: "",
                                        NOGrupoMercadoria: "",
                                        VLAreaTotal: "",
                                        IDTipoServico: "",
                                        NOTipoServico: "",
                                        NOClassificacaoCarga: ""
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.log("Erro ao carregar contrato: " + error.message);
                    }


                    if (tipo == "AUTORIZADA") {
                        //...
                        sessionStorage.removeItem("arEmpresa");
                        sessionStorage.setItem("arEmpresa", angular.toJson(arData.empresas[0]));

                        //...
                        sessionStorage.removeItem("arEmpresaCadastros");
                        sessionStorage.setItem("arEmpresaCadastros", angular.toJson(arData));

                    } else {
                        //...
                        sessionStorage.removeItem("arEmpresaCadastros");
                        sessionStorage.setItem("arEmpresaCadastros", angular.toJson(arData));
                    }

                    console.log(arData.empresas);

                    resolve(true);
                });


            }, function (err) {
                logErro('gestorCarregarCadastroAutorizadas', err.message, JSON.stringify({
                    'valor': valor,
                    'tipo': tipo,
                    'nrinstrumento': nrinstrumento
                }));
                resolve(true);
                alert('gestorCarregarCadastroAutorizadas' + err.message);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarCadastroAutorizadas', erro.message, JSON.stringify({
            'valor': valor,
            'tipo': tipo,
            'nrinstrumento': nrinstrumento
        }));
    }

    return arData;
}


// ---- gestorCarregarCadastroFrotaAlocada ----
function gestorCarregarCadastroFrotaAlocada(nrinscricao, nrinstrumento) {
    try {
        nrinscricao = formatarCNPJ(nrinscricao);

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  ID " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,IDEMBARCACAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM FROTAALOCADA " +
            " WHERE NRINSCRICAO = ?" +
            " AND NRINSTRUMENTO = ?"

            + " ORDER BY NOEMBARCACAO ";

        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [nrinscricao, nrinstrumento], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            IDFrota: res.rows.item(i).IDFROTA,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            IDEmbarcacao: res.rows.item(i).IDEMBARCACAO,
                            STEmbarcacao: res.rows.item(i).STEMBARCACAO,
                            DTInicio: res.rows.item(i).DTINICIO,
                            DTTermino: res.rows.item(i).DTTERMINO,
                            TPAfretamento: res.rows.item(i).TPAFRETAMENTO,
                            STRegistro: res.rows.item(i).STREGISTRO,
                            IDFrotaPai: res.rows.item(i).IDFROTAPAI,
                            STHomologacao: res.rows.item(i).STHOMOLOGACAO,
                            NoEmbarcacao: res.rows.item(i).NOEMBARCACAO,
                            NRCapitania: res.rows.item(i).NRCAPITANIA,
                            TipoEmbarcacao: res.rows.item(i).TIPOEMBARCACAO,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: res.rows.item(i).NRINSTRUMENTO
                        });
                    }

                    //...
                    console.log('ArDATA', arData);

                    //...
                    sessionStorage.removeItem("arEmbarcacao");
                    sessionStorage.setItem("arEmbarcacao", angular.toJson(arData));

                    resolve(true);
                });

            }, function (err) {
                logErro('gestorCarregarCadastroFrotaAlocada', err.message, JSON.stringify({
                    'nrinscricao': nrinscricao,
                    'nrinstrumento': nrinstrumento
                }));
                resolve(true);
                alert('gestorCarregarCadastroFrotaAlocada' + err.message);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarCadastroFrotaAlocada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarCadastroFrotaAlocadaMaritima ----
function gestorCarregarCadastroFrotaAlocadaMaritima(nrinscricao) {
    try {
        nrinscricao = formatarCNPJ(nrinscricao);

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  ID " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,IDEMBARCACAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,DSTIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM FROTAALOCADAMARITIMA " +
            " WHERE NRINSCRICAO = ?"
            //+" AND NRINSTRUMENTO = ?"

            + " ORDER BY NOEMBARCACAO ";

        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [nrinscricao], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            IDFrota: res.rows.item(i).IDFROTA,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            IDEmbarcacao: res.rows.item(i).IDEMBARCACAO,
                            STEmbarcacao: res.rows.item(i).STEMBARCACAO,
                            DTInicio: res.rows.item(i).DTINICIO,
                            DTTermino: res.rows.item(i).DTTERMINO,
                            TPAfretamento: res.rows.item(i).TPAFRETAMENTO,
                            STRegistro: res.rows.item(i).STREGISTRO,
                            IDFrotaPai: res.rows.item(i).IDFROTAPAI,
                            STHomologacao: res.rows.item(i).STHOMOLOGACAO,
                            NoEmbarcacao: res.rows.item(i).NOEMBARCACAO,
                            NRCapitania: res.rows.item(i).NRCAPITANIA,
                            TipoEmbarcacao: res.rows.item(i).TIPOEMBARCACAO,
                            DSTipoEmbarcacao: res.rows.item(i).DSTIPOEMBARCACAO,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: res.rows.item(i).NRINSTRUMENTO
                        });
                    }

                    //...
                    console.log(arData);

                    //...
                    sessionStorage.removeItem("arEmbarcacaoMaritima");
                    sessionStorage.setItem("arEmbarcacaoMaritima", angular.toJson(arData));

                    resolve(true);
                });

            }, function (err) {
                logErro('gestorCarregarCadastroFrotaAlocadaMaritima', err.message, JSON.stringify({'nrinscricao': nrinscricao}));
                resolve(true);
                alert('gestorCarregarCadastroFrotaAlocadaMaritima' + err.message);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarCadastroFrotaAlocadaMaritima', erro.message, JSON.stringify({'nrinscricao': nrinscricao}));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosAutorizada ----
function gestorCarregarDadosAutorizada(nrinscricao, nrinstrumento, flagEnviada) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'" +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);

                //flagEnviada = "F";
                if (flagEnviada != "T") {
                    //...
                    //sessionStorage.setItem("dados_off", angular.toJson(arData));
                    //sessionStorage.setItem("empresa_off", angular.toJson(arData.empresas));


                    //...
                    window.location = "comum.tipo.html";

                    //window.location = "comum.tipo.naoenviada.html";
                    //window.location = "minhasfiscalizacoes.naoenviadas.listar.html";
                } else {
                    //var mensagem = '<p>Os dados desta fiscalizacao ja foram enviados!</p>';
                    //M.toast({ html: mensagem, classes: "#c62828 red darken-3" });

                    //...
                    window.location = "comum.fiscalizacaoenviada.html";
                }

            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizada', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento,
                'flagEnviada': flagEnviada
            }));
            alert('gestorCarregarDadosAutorizada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento,
            'flagEnviada': flagEnviada
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosAutorizadaProgramada ----
function gestorCarregarDadosAutorizadaProgramada(nrinscricao) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'";
        //+" AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '"+ nrinstrumento +"'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);


                //...
                window.location = "comum.tipo.html";


            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizadaProgramada', err.message, JSON.stringify({'nrinscricao': nrinscricao}));
            alert('gestorCarregarDadosAutorizadaProgramada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizadaProgramada', erro.message, JSON.stringify({'nrinscricao': nrinscricao}));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosAutorizadas ----
function gestorCarregarDadosAutorizadas(valor, tipo, valorNumero) {
    try {
        valor = removerAcentos(valor);
        valor = valor.toUpperCase();

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRRESOLUCAO " +
            " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS";


        if (tipo == "MODALIDADE") {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.MODALIDADE) LIKE UPPER('%" + valor + "%') ";
        } else if (tipo == "AUTORIZADA") {
            query += " WHERE (EMPRESASAUTORIZADAS.NRINSCRICAO = '%" + valor + "%' OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO = '%" + valor + "%') ";
        } else if (tipo == "INSTALACAO") {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.AREAPPF) = 'PORTO' AND UPPER(EMPRESASAUTORIZADAS.INSTALACAOSEMACENTOS) LIKE UPPER('%" + valor + "%') ";
        } else {
            query += " WHERE UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIAL) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAO LIKE UPPER('%" + valor + "%') ";
            query += " OR UPPER(EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO) LIKE UPPER('%" + valor + "%') ";
            query += " OR EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO LIKE UPPER('%" + valor + "%') ";
        }


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).MODALIDADE != "Contrato de Passagem") {

                        let novoInstrumento = null;
                        novoInstrumento = unirTermosRepetidos(res.rows.item(i).MODALIDADE, res.rows.item(i).NRINSTRUMENTO);

                        let DescInstrumento = "";

                        let n = res.rows.item(i).MODALIDADE.includes("Longo Curso");

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Cabotagem");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Portuario");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Maritimo");
                        }


                        if (n == true) {
                            DescInstrumento = "Termo de Autorização: " + novoInstrumento;
                        } else {
                            DescInstrumento = "Instrumento: " + novoInstrumento;
                        }

                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: novoInstrumento, //res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            DescricaoNRInstrumento: DescInstrumento,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }
                }

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });


                console.log(arData.empresas);
                sessionStorage.removeItem("arEmpresas");
                sessionStorage.setItem("arEmpresas", angular.toJson(arData.empresas));


                window.location = "empresa.listarAutorizadas.html";

            });


        }, function (err) {
            logErro('CarregarDadosAutorizadas', err.message, JSON.stringify({
                'valor': valor,
                'tipo': tipo,
                'valorNumero': valorNumero
            }));
            alert('CarregarDadosAutorizadas: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('CarregarDadosAutorizadas', erro.message, JSON.stringify({
            'valor': valor,
            'tipo': tipo,
            'valorNumero': valorNumero
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosEmpresaEmbarcacao ----
function gestorCarregarDadosEmpresaEmbarcacao(nrinscricao, nrinstrumento) {
    try {
        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = FROTAALOCADA.NRINSTRUMENTO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRRESOLUCAO " +
            " ,EMPRESASAUTORIZADAS.AUTORIDADEPORTUARIA " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS";

        query += " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "' " +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "' ";

        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    if (res.rows.item(i).MODALIDADE != "Contrato de Passagem") {

                        let novoInstrumento = null;
                        novoInstrumento = unirTermosRepetidos(res.rows.item(i).MODALIDADE, res.rows.item(i).NRINSTRUMENTO);

                        let DescInstrumento = "";

                        let n = res.rows.item(i).MODALIDADE.includes("Longo Curso");

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Cabotagem");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Portuario");
                        }

                        if (n == false) {
                            n = res.rows.item(i).MODALIDADE.includes("Apoio Maritimo");
                        }


                        if (n == true) {
                            DescInstrumento = "Termo de Autorização: " + novoInstrumento;
                        } else {
                            DescInstrumento = "Instrumento: " + novoInstrumento;
                        }

                        //...
                        arData.empresas.push({
                            AreaPPF: res.rows.item(i).AREAPPF,
                            DSBairro: res.rows.item(i).DSBAIRRO,
                            DSEndereco: res.rows.item(i).DSENDERECO,
                            DTAditamento: res.rows.item(i).DTADITAMENTO,
                            DTOutorga: res.rows.item(i).DTOUTORGA,
                            Email: res.rows.item(i).EMAIL,
                            Instalacao: res.rows.item(i).INSTALACAO,
                            ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                            Modalidade: res.rows.item(i).MODALIDADE,
                            NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                            NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                            NRAditamento: res.rows.item(i).NRADITAMENTO,
                            NRCEP: res.rows.item(i).NRCEP,
                            NRInscricao: res.rows.item(i).NRINSCRICAO,
                            NRInstrumento: novoInstrumento, //res.rows.item(i).NRINSTRUMENTO,
                            NomeContato: res.rows.item(i).NOMECONTATO,
                            QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            SGUF: res.rows.item(i).SGUF,
                            TPInscricao: res.rows.item(i).TPINSCRICAO,
                            DescricaoNRInstrumento: DescInstrumento,
                            NRResolucao: res.rows.item(i).NRRESOLUCAO,
                            AutoridadePortuaria: res.rows.item(i).AUTORIDADEPORTUARIA,
                            NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                            NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                            NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                            NRTelefone: res.rows.item(i).NRTELEFONE,
                            EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                            NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                        });
                    }
                }

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });


                console.log(arData.empresas);
                var empresas = [];
                if (arData.empresas.length > 0)
                    empresas.push(arData.empresas[0]);
                sessionStorage.removeItem("arEmpresas");
                sessionStorage.setItem("arEmpresas", angular.toJson(empresas));

                window.location = "empresa.detalharEmbarcacao.html";

            });


        }, function (err) {
            logErro('gestorCarregarDadosEmpresaEmbarcacao', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento
            }));
            alert('gestorCarregarDadosEmpresaEmbarcacao: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosEmpresaEmbarcacao', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarDadosFrotaAlocada ----
function gestorCarregarDadosFrotaAlocada(nrinscricao, nrinstrumento, flagcarregartrecho) {
    try {
        nrinscricao = formatarCNPJ(nrinscricao);

        preloadInit("Carregando Dados");

        openDB();

        var query = "SELECT " +
            "  ID " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,IDEMBARCACAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM FROTAALOCADA " +
            " WHERE NRINSCRICAO = ?" +
            " AND NRINSTRUMENTO = ?";

        var arData = [];

        /*===============================================*/
        db.transaction(function (tx) {
            tx.executeSql(query, [nrinscricao, nrinstrumento], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.push({
                        IDFrota: res.rows.item(i).IDFROTA,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        IDEmbarcacao: res.rows.item(i).IDEMBARCACAO,
                        STEmbarcacao: res.rows.item(i).STEMBARCACAO,
                        DTInicio: res.rows.item(i).DTINICIO,
                        DTTermino: res.rows.item(i).DTTERMINO,
                        TPAfretamento: res.rows.item(i).TPAFRETAMENTO,
                        STRegistro: res.rows.item(i).STREGISTRO,
                        IDFrotaPai: res.rows.item(i).IDFROTAPAI,
                        STHomologacao: res.rows.item(i).STHOMOLOGACAO,
                        NoEmbarcacao: res.rows.item(i).NOEMBARCACAO,
                        NRCapitania: res.rows.item(i).NRCAPITANIA,
                        TipoEmbarcacao: res.rows.item(i).TIPOEMBARCACAO,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO
                    });
                }

                //...
                console.log(arData);

                //...
                sessionStorage.removeItem("arEmbarcacao");
                sessionStorage.setItem("arEmbarcacao", angular.toJson(arData));

                if (flagcarregartrecho == "T") {
                    window.location = "empresa.trecho.html";
                } else {
                    //...
                    window.location = "empresa.embarcacao.html";
                }
            });
        }, function (err) {
            logErro('gestorCarregarDadosFrotaAlocada', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento,
                'flagcarregartrecho': flagcarregartrecho
            }));
            alert('gestorCarregarDadosFrotaAlocada: An error occured while displaying saved notes', err.message);
        });
    } catch (erro) {
        logErro('gestorCarregarDadosFrotaAlocada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento,
            'flagcarregartrecho': flagcarregartrecho
        }));
    } finally {
        preloaderStop();
    }
}


// ---- gestorCarregarEsquemasOperacionais ----
function gestorCarregarEsquemasOperacionais(sentido, partida, chegada) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT " +
            "  ESQUEMASOPERACIONAIS.ID" +
            " ,ESQUEMASOPERACIONAIS.NRINSCRICAO" +
            " ,ESQUEMASOPERACIONAIS.SENTIDO" +
            " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO" +
            " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA" +
            " ,ESQUEMASOPERACIONAIS.HRPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.UFPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA" +
            " ,ESQUEMASOPERACIONAIS.HRCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.UFCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO" +
            " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL" +
            " ,ESQUEMASOPERACIONAIS.STIDAVOLTA" +
            " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA" +
            " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA" +
            " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA" +
            " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA" +
            " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA" +
            " ,ESQUEMASOPERACIONAIS.NRORDEM" +
            " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL" +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " FROM ESQUEMASOPERACIONAIS " +
            "WHERE ESQUEMASOPERACIONAIS.ID >= 0 ";

        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";

        //query +="AND ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";
        //query +="SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        //query +=" OR ( ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + partida + "') ";
        //
        //query +=") ";
        //
        //query +="AND ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";
        //query +="SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + chegada + "' ";
        //query +=") ";

        //if(partida != "") {
        //   query += " AND ESQUEMASOPERACIONAIS.PARTIDAPORTO =  '" + partida + "'";
        //}

        //if(chegada != "") {
        //    query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA =  '" + chegada + "'";
        //    query += " OR ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + chegada + "' ";
        //}

        //query +=" AND ESQUEMASOPERACIONAIS.PORTOCHEGADA <> '" + partida + "' ";
        //query +=" GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";

        query += " ORDER BY ESQUEMASOPERACIONAIS.NRORDEM ";
        //query+= " LIMIT 100 ";

        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //if( (res.rows.item(i).PARTIDAPORTO == partida ) || (res.rows.item(i).PORTOCHEGADA == partida ) ) {
                        if (res.rows.item(i).PARTIDAPORTO == partida) {

                            let flagChegada = false;
                            let portoChegada = "";
                            portoChegada = res.rows.item(i).PORTOCHEGADA;

                            let idEsquema = res.rows.item(i).IDESQUEMAOPERACIONAL;
                            let cnpj = res.rows.item(i).NRINSCRICAO;

                            if (chegada != "") {
                                let verificou = await gestorVerificarChegadaEsquemaOperacional(
                                    idEsquema, chegada, cnpj
                                );

                                if (verificou > 0) {
                                    portoChegada = await gestorCarregarDadosChegada(idEsquema, sentido, cnpj, chegada);
                                    flagChegada = true;
                                }
                            } else {
                                flagChegada = true;
                            }

                            var tema = null;
                            var temaCor = null;
                            if (res.rows.item(i).NRORDEM == "1") {
                                tema = '#31445C';
                                temaCor = 'cortema';
                            } else {
                                tema = '#F7AA17';
                                temaCor = 'orange';
                            }

                            //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                            //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                            let nomeDiaSemana;
                            let nomeDiaSemanaChegada;

                            //if(dia == diaSemana ) {
                            //    nomeDiaSemana = "Hoje";
                            //} else {
                            nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                            nomeDiaSemana = nomeDiaSemana.replace("-Feira", "");
                            //}

                            //if(dia == diaSemanaChegada ) {
                            //    nomeDiaSemanaChegada = "Hoje";
                            //} else {
                            nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                            nomeDiaSemanaChegada = nomeDiaSemanaChegada.replace("-Feira", "");
                            //}

                            //...
                            if (flagChegada == true) {
                                arData.push({
                                    id: (res.rows.item(i).ID + 1) //"2618-3156"
                                    ,
                                    idEsquemaOperacional: res.rows.item(i).IDESQUEMAOPERACIONAL,
                                    CDLocalPartida: res.rows.item(i).CDLOCALPARTIDA,
                                    price: (res.rows.item(i).ID + 1),
                                    requests: 5,
                                    pledge: 150,
                                    weight: 50,
                                    sender: res.rows.item(i).NORAZAOSOCIAL
                                    //, sender: 'Empresa Autorizada'
                                    ,
                                    senderImg: 'img/icon-consultar.png',
                                    themeColor: temaCor,
                                    themeColorHex: '#1C4A6B',
                                    bgImgUrl: 'img/fundo.png',
                                    rating: 5,
                                    ratingCount: 26,
                                    fromStreet: res.rows.item(i).PARTIDAPORTO
                                    //, fromStreet: 'Mácapa'
                                    ,
                                    fromCity: res.rows.item(i).UFPARTIDA
                                    //, fromCity: 'Pará, PA 10025'
                                    ,
                                    toStreet: res.rows.item(i).PORTOCHEGADA //portoChegada
                                    //, toStreet: 'Almeirim'
                                    ,
                                    toCity: res.rows.item(i).UFCHEGADA
                                    //, toCity: 'Santarém, PA 11101'
                                    ,
                                    delivTime: res.rows.item(i).HRPARTIDA
                                    //, delivTime: '06:30 pm'
                                    ,
                                    delivDate: 'Maio 16, 2015'
                                    //, delivDateNoun: 'Hoje'
                                    ,
                                    delivDateNoun: nomeDiaSemana,
                                    reqDl: res.rows.item(i).HRCHEGADA,
                                    latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                                    longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                                    latTo: res.rows.item(i).VLLATITUDECHEGADA,
                                    longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                                    qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                                    diasemanachegada: nomeDiaSemanaChegada
                                });
                            }
                        }
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionais', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'chegada': chegada
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionais', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'chegada': chegada
        }));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisPesquisa(sentido, partida, destino) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.ID ";
        query += " ,ESQUEMASOPERACIONAIS.NRINSCRICAO ";
        query += " ,ESQUEMASOPERACIONAIS.SENTIDO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.UFPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.UFCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " ,ESQUEMASOPERACIONAIS.STIDAVOLTA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.NRORDEM ";
        query += " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO ";
        query += " FROM ESQUEMASOPERACIONAIS ";


        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "'";

        //+" LIMIT 70 ";


        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        var tema = null;
                        var temaCor = null;
                        if (res.rows.item(i).SENTIDO == "Ida") {
                            tema = '#74A2DC';
                            temaCor = 'cortemapartida';
                        } else {
                            tema = '#31445C';
                            temaCor = 'cortema';
                        }

                        //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                        //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                        let nomeDiaSemana;
                        let nomeDiaSemanaChegada;

                        //if(dia == diaSemana ) {
                        //    nomeDiaSemana = "Hoje";
                        //} else {
                        nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                        //}

                        //if(dia == diaSemanaChegada ) {
                        //    nomeDiaSemanaChegada = "Hoje";
                        //} else {
                        nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                        //}


                        //...
                        arData.push({
                            id: (res.rows.item(i).ID + 1) //"2618-3156"
                            ,
                            price: (res.rows.item(i).ID + 1),
                            requests: 5,
                            pledge: 150,
                            weight: 50,
                            sender: res.rows.item(i).NORAZAOSOCIAL
                            //, sender: 'Empresa Autorizada'
                            ,
                            senderImg: 'img/icon-consultar.png',
                            themeColor: temaCor,
                            themeColorHex: tema,
                            bgImgUrl: 'img/fundo.png',
                            rating: 5,
                            ratingCount: 26,
                            fromStreet: res.rows.item(i).PARTIDAPORTO
                            //, fromStreet: 'Mácapa'
                            ,
                            fromCity: res.rows.item(i).UFPARTIDA
                            //, fromCity: 'Pará, PA 10025'
                            ,
                            toStreet: res.rows.item(i).PORTOCHEGADA
                            //, toStreet: 'Almeirim'
                            ,
                            toCity: res.rows.item(i).UFCHEGADA
                            //, toCity: 'Santarém, PA 11101'
                            ,
                            delivTime: res.rows.item(i).HRPARTIDA
                            //, delivTime: '06:30 pm'
                            ,
                            delivDate: 'Maio 16, 2015'
                            //, delivDateNoun: 'Hoje'
                            ,
                            delivDateNoun: nomeDiaSemana,
                            reqDl: '24 minutes',
                            latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                            longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                            latTo: res.rows.item(i).VLLATITUDECHEGADA,
                            longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                            qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            ordem: res.rows.item(i).NRORDEM,
                            horaChegada: res.rows.item(i).HRCHEGADA,
                            diasemanachegada: nomeDiaSemanaChegada,
                            sentido: res.rows.item(i).SENTIDO
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPesquisa', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'destino': destino
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPesquisa', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'destino': destino
        }));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisPartida(sentido) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += " ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " GROUP BY ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        arData.push({
                            ID: (i + 1),
                            partidaPorto: res.rows.item(i).PARTIDAPORTO,
                            CDLocalPartida: res.rows.item(i).CDLOCALPARTIDA
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPartida', err.message, JSON.stringify({'sentido': sentido}));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPartida', erro.message, JSON.stringify({'sentido': sentido}));
    }

    return arData;
}

async function gestorCarregarEsquemasOperacionaisChegada(sentido) {
    let arData = [];

    try {

        let partida = null;
        partida = angular.fromJson(sessionStorage.getItem("partida"));

        openDB();
        var query = "SELECT ";
        query += " ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL IN ( ";

        query += "SELECT ";
        query += " ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        query += ") ";

        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA <> '" + partida + "' ";
        query += " GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";

        //var query = "SELECT ";
        //query +=" ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        //query +=" FROM ESQUEMASOPERACIONAIS ";
        //query +=" WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        //query +=" AND ESQUEMASOPERACIONAIS.PARTIDAPORTO = '" + partida + "' ";
        //query +=" GROUP BY ESQUEMASOPERACIONAIS.PORTOCHEGADA ";

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        arData.push({
                            ID: (i + 1),
                            chegadaPorto: res.rows.item(i).PORTOCHEGADA,
                            CDLocalChegada: res.rows.item(i).CDLOCALCHEGADA
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisChegada', err.message, JSON.stringify({'sentido': sentido}));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisChegada', erro.message, JSON.stringify({'sentido': sentido}));
    }

    return arData;
}

async function gestorVerificarChegadaEsquemaOperacional(IDEsquemaOperacional, chegada, NRInscricao) {

    var ID = 0;

    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT count(*) AS mycount FROM ESQUEMASOPERACIONAIS WHERE IDESQUEMAOPERACIONAL = ? AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = ? AND ESQUEMASOPERACIONAIS.NRINSCRICAO = ?', [IDEsquemaOperacional, chegada, NRInscricao], async function (tx, rs) {

                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    resolve(true);

                }, async function (error) {
                    logErro('gestorVerificarChegadaEsquemaOperacional transaction', error.message, JSON.stringify({
                        'IDEsquemaOperacional': IDEsquemaOperacional,
                        'chegada': chegada,
                        'NRInscricao': NRInscricao
                    }));
                    resolve(true);
                }, async function () {
                    console.log('gestorVerificarChegadaEsquemaOperacional transaction ok');
                    resolve(true);
                });
            })
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorVerificarChegadaEsquemaOperacional', err.message, JSON.stringify({
            'IDEsquemaOperacional': IDEsquemaOperacional,
            'chegada': chegada,
            'NRInscricao': NRInscricao
        }));
        alert('gestorVerificarChegadaEsquemaOperacional: ' + err.message);
    }

    return ID;
}

async function gestorCarregarDadosChegada(IDEsquemaOperacional, sentido, cnpj, chegada) {
    let strChegada;

    try {
        openDB();
        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA";
        query += " FROM ESQUEMASOPERACIONAIS ";
        query += " WHERE ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL = " + IDEsquemaOperacional;
        query += " AND ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "' ";
        query += " AND ESQUEMASOPERACIONAIS.PORTOCHEGADA = '" + chegada + "' ";
        query += " AND ESQUEMASOPERACIONAIS.NRINSCRICAO = '" + cnpj + "' ";


        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        //...
                        strChegada = res.rows.item(i).PORTOCHEGADA +
                            " - " + res.rows.item(i).CHEGADADIASEMANA +
                            " - " + res.rows.item(i).HRCHEGADA;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarDadosChegada', err.message, JSON.stringify({
                    'IDEsquemaOperacional': IDEsquemaOperacional,
                    'sentido': sentido,
                    'cnpj': cnpj,
                    'chegada': chegada
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarDadosChegada', erro.message, JSON.stringify({
            'IDEsquemaOperacional': IDEsquemaOperacional,
            'sentido': sentido,
            'cnpj': cnpj,
            'chegada': chegada
        }));
    }

    return strChegada;
}

/*==============================================================*/
async function gestorCarregarEmbarcacoesInteriorWebAsinc($http) {
    try {

        preloadInit("Atualizando Dados");

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var data = {NRCapitania: '', NOEmbarcacao: ''}
            $http({
                url: urlService() + 'ConsultarEmbarcacoesPorNomeOuCapitania',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                tx.executeSql("DELETE FROM EMBARCACOESINTERIOR");

                                //...
                                var embarcacoes = response.data.d;

                                //...
                                angular.forEach(embarcacoes, async function (value, key) {
                                    var nomeEmbarcacao = removerAcentos(embarcacoes[key].NoEmbarcacao);
                                    var numeroCapitania = removerAcentos(embarcacoes[key].NRCapitania);

                                    var query = "INSERT INTO EMBARCACOESINTERIOR ( " +
                                        "  ID " +
                                        " ,TPINSCRICAO " +
                                        " ,NRINSCRICAO " +
                                        " ,NRINSTRUMENTO " +
                                        " ,IDFROTA " +
                                        " ,IDFROTAPAI " +
                                        " ,IDEMBARCACAO " +
                                        " ,NOEMBARCACAO " +
                                        " ,STEMBARCACAO " +
                                        " ,TIPOEMBARCACAO " +
                                        " ,NRCAPITANIA " +
                                        " ,DTINICIO " +
                                        " ,DTTERMINO " +
                                        " ,TPAFRETAMENTO " +
                                        " ,STREGISTRO " +
                                        " ,STHOMOLOGACAO " +
                                        " ) " +
                                        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                    tx.executeSql(query, [
                                            key, embarcacoes[key].TPInscricao, embarcacoes[key].NRInscricao, embarcacoes[key].NRInstrumento, embarcacoes[key].IDFrota, embarcacoes[key].IDFrotaPai, embarcacoes[key].IDEmbarcacao, nomeEmbarcacao,
                                            embarcacoes[key].STEmbarcacao, embarcacoes[key].TipoEmbarcacao, numeroCapitania, embarcacoes[key].DTInicio, embarcacoes[key].DTTermino, embarcacoes[key].TPAfretamento,
                                            embarcacoes[key].STRegistro, embarcacoes[key].STHomologacao
                                        ], function (tx, res) {
                                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                        },
                                        function (tx, error) {
                                            preloaderStop();
                                            console.log('INSERT error: ' + error.message);
                                        });

                                });

                                //...
                                gestorMarcarAtualizacao("EMBARCACOESINTERIOR");

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        preloaderStop();
                        resolve(true);
                    }

                })
                .catch(async function () {
                    preloaderStop();
                    resolve(true);
                });

        }, function (err) {
            logErro('gestorCarregarEmbarcacoesInteriorWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorCarregarEmbarcacoesInteriorWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}

/*==============================================================*/
async function gestorCarregarFiscalizacoesRealizadasWebAsinc($http) {
    try {

        preloadInit("Atualizando Dados");

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var arUsuario = angular.fromJson(sessionStorage.getItem("arUsuario"));

            var data = {matricula: arUsuario.NRMatricula, anoInicial: null}
            $http({
                url: urlService() + 'ConsultarFiscalizacoesRealizadasPorMatricula',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                tx.executeSql("DELETE FROM FISCALIZACOESREALIZADAS");

                                //...
                                var fiscalizacoes = response.data.d;

                                //...
                                angular.forEach(fiscalizacoes, async function (value, key) {

                                    var query = "INSERT INTO FISCALIZACOESREALIZADAS ( " +
                                        "  IDFISCALIZACAOREALIZADA " +
                                        " ,NRMATRICULA " +
                                        " ,QTDFISCALIZACAOENVIADA " +
                                        " ,QTDFISCALIZACAOENVIADAINTERIOR " +
                                        " ,QTDFISCALIZACAOENVIADAMARITIMA " +
                                        " ,QTDFISCALIZACAOENVIADAPORTO " +
                                        " ,QTDEMPRESAFISCALIZADA " +
                                        " ,QTDEMPRESAFISCALIZADAINTERIOR " +
                                        " ,QTDEMPRESAFISCALIZADAMARITIMA " +
                                        " ,QTDEMPRESAFISCALIZADAPORTO " +
                                        " ,QTDFISCALIZACAOAUTOINFRACAO " +
                                        " ,QTDFISCALIZACAONOTIFICACAO " +
                                        " ,QTDAUTOINFRACAO " +
                                        " ,QTDNOTIFICACAO " +
                                        " ,QTEXTRAORDINARIA " +
                                        " ,QTAPARTADO " +
                                        " ,QTROTINA " +
                                        " ,QTPROGRAMADA " +
                                        " ,NRMES " +
                                        " ,NRANO " +
                                        " ) " +
                                        " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                    tx.executeSql(query, [
                                            key, arUsuario.NRMatricula, fiscalizacoes[key].QTFiscalizacao, fiscalizacoes[key].QTFiscalizacaoInterior, fiscalizacoes[key].QTFiscalizacaoMaritima, fiscalizacoes[key].QTFiscalizacaoPorto,
                                            fiscalizacoes[key].QTNRInscricao, fiscalizacoes[key].QTNRInscricaoInterior, fiscalizacoes[key].QTNRInscricaoMaritima, fiscalizacoes[key].QTNRInscricaoPorto,
                                            fiscalizacoes[key].QTFiscalizacaoAutoInfracao, fiscalizacoes[key].QTFiscalizacaoNotificacao,
                                            fiscalizacoes[key].QTProcedimentoAutoInfracao, fiscalizacoes[key].QTProcedimentoNoci, fiscalizacoes[key].QTProcedimentoExtraordinaria,
                                            fiscalizacoes[key].QTProcedimentoApartado, fiscalizacoes[key].QTProcedimentoRotina, fiscalizacoes[key].QTProcedimentoProgramada, fiscalizacoes[key].Mes, fiscalizacoes[key].Ano
                                        ], function (tx, res) {
                                            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                                        },
                                        function (tx, error) {
                                            preloaderStop();
                                            console.log('INSERT error: ' + error.message);
                                        });

                                });

                                //...
                                gestorMarcarAtualizacao("FISCALIZACOESREALIZADAS");

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        preloaderStop();
                        resolve(true);
                    }

                })
                .catch(async function () {
                    preloaderStop();
                    resolve(true);
                });

        }, function (err) {
            logErro('gestorCarregarFiscalizacoesRealizadasWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorCarregarFiscalizacoesRealizadasWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}

/*==============================================================*/
async function gestorMarcarAtualizacao(campo) {

    var ID = 0;

    try {
        var d = new Date();
        var mes = d.getMonth() + 1;
        var dia = d.getDate();
        var ano = d.getFullYear();

        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var dataAtualizacao = ano + "/" + mes + "/" + dia + " " + h + ":" + m + ":" + s;

        console.log(dataAtualizacao);

        openDB();

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT COUNT(*) AS mycount FROM LOGATUALIZACAO', [], async function (tx, rs) {
                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    var query01 = "INSERT INTO LOGATUALIZACAO (ID, DATA" + campo + ") VALUES (?,?)";
                    var query02 = "UPDATE LOGATUALIZACAO SET DATA" + campo + " = '" + dataAtualizacao + "' WHERE ID = ?";

                    if (ID == 0) {
                        tx.executeSql(query01, [1, dataAtualizacao], async function (tx, res) {
                                resolve(true);
                                console.log("INSERIU LOG: " + res.insertId + " = " + campo);
                            },
                            function (tx, error) {
                                resolve(true);
                                console.log('INSERIU LOG error: ' + error.message);
                            });
                    } else {
                        tx.executeSql(query02, [1], async function (tx, res) {
                                resolve(true);
                                console.log("ATUALIZOU LOG " + campo);
                            },
                            async function (tx, error) {
                                resolve(true);
                                console.log('ATUALIZOU LOG error: ' + error.message);
                            });
                    }

                });
            }, async function (error) {
                logErro('gestorMarcarAtualizacao transaction', error.message, JSON.stringify({'campo': campo}));
                resolve(true);
            }, async function () {
                resolve(true);
                console.log('gestorMarcarAtualizacao transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorMarcarAtualizacao', err.message, JSON.stringify({'campo': campo}));
        alert('gestorMarcarAtualizacao: ' + err.message);
    }
}

async function gestorVerificarAtualizacao() {
    let Qtd = 0;

    try {

        openDB();

        var query = "SELECT * FROM LOGATUALIZACAO";

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let qtd = res.rows.length;

                    for (var i = 0; i < res.rows.length; i++) {
                        var DATAFROTAALOCADA = res.rows.item(i).DATAFROTAALOCADA;

                        //...
                        let dataA = new Date(DATAFROTAALOCADA);

                        let dataConvertida = "";


                        //...
                        var d = new Date();
                        var dia = d.getDate();
                        var mes = d.getMonth() + 1;
                        var ano = d.getFullYear();
                        var dataAtual = ano + "/" + mes + "/" + dia;

                        dataConvertida = dataA.getFullYear() + "/" + (dataA.getMonth() + 1) + "/" + dataA.getDate();


                        var date_diff_indays = function (date1, date2) {
                            let dt1 = new Date(date1);
                            let dt2 = new Date(date2);
                            return Math.floor((
                                Date.UTC(
                                    dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                        }

                        //console.log(date_diff_indays('2014/07/03', '2014/07/14'));
                        Qtd = date_diff_indays(dataAtual, dataConvertida);
                        console.log('Dias para atualizar: ', Qtd);


                    }

                    if (qtd == 0) {
                        Qtd = -1;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorVerificarAtualizacao', err.message);
                resolve(true);
                alert("Não foi possível carregar os dados do usuário");
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorVerificarAtualizacao', erro.message);
    }

    return Qtd;
}

function formatarCNPJ(nrinscricao) {
    try {
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace(".", "");
        nrinscricao = nrinscricao.replace("-", "");
        nrinscricao = nrinscricao.replace("/", "");
        nrinscricao = nrinscricao.replace(" ", "");
    } catch (erro) {
        console.log('formatarCNPJ', erro.message);
    }

    return nrinscricao;
}


function gestorAbrirNotificacao(id, title, msg, mostrar) {
    try {
        if (mostrar == "T") {
            //Get the device's operating system name
            var plat = device.platform;
            var model = device.model;
            var vers = device.version;
            var deviceManufacturer = device.manufacturer;
            var seri = device.serial;

            /*available: true
            cordova: "8.0.0"
            isVirtual: false
            manufacturer: "LGE"
            model: "LG-K430"
            platform: "Android"
            serial: "LGK430MRJJIVJF"
            uuid: "c2b6de2f86c1ec41"
            version: "6.0"*/

            //if(vers == "8.1.0")
            //{
            //    cordova.plugins.notification.local.schedule({
            //                            id: id,
            //                            title: title,
            //                            text: msg,
            //                            sticky: true, // Only use this is you want your notification to be sticky / ongoing!
            //                            lockscreen: true, // Only use this if you want the notification to be shown in lockscreen!
            //                            foreground: true, // Only use this if you want to show the notification when app is in foreground
            //                            vibrate: false,
            //                            sound: false,
            //                            priority: 2
            //                        });
            //}
            //else
            //{
            var mensagem = '<p>' + title + ': ' + msg + '.</p>';
            M.toast({html: mensagem, classes: "#c62828 black darken-3"});
            //}
        }
    } catch (erro) {
        console.log('gestorAbrirNotificacao', erro.message);
    }
}

function gestorFecharNotificacao(id, title, msg, mostrar) {
    try {
        if (mostrar == "T") {
            //Get the device's operating system name
            var plat = device.platform;
            var model = device.model;
            var vers = device.version;
            var deviceManufacturer = device.manufacturer;
            var seri = device.serial;

            /*available: true
            cordova: "8.0.0"
            isVirtual: false
            manufacturer: "LGE"
            model: "LG-K430"
            platform: "Android"
            serial: "LGK430MRJJIVJF"
            uuid: "c2b6de2f86c1ec41"
            version: "6.0"*/

            //if(vers == "8.1.0")
            //{
            //    cordova.plugins.notification.local.cancel(id);
            //}
            //else
            //{
            var mensagem = '<p>' + title + ': ' + msg + '.</p>';
            M.toast({html: mensagem, classes: "#c62828 black darken-3"});
            //}
        }
    } catch (erro) {
        console.log('gestorFecharNotificacao', erro.message);
    }
}


async function gestorSalvarDadosFiscalizacao(IdFiscalizacaoSalva, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, CodProcessoProgramada, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao, acao, latitude, longitude, altitude, arEmbarcacao, tpFiscalizacaoProgramada, arFotoIrregularidade, nrMatricula) {
    try {

        let ID = 0;

        ID = await pegarIdFiscalizacao(data, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao);

        console.log('Pegou id: ', ID);

        await gestorSalvarFiscalizacao(ID, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, nrnotificacao, CodProcessoProgramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula);
        await gestorSalvarFiscalizacaoIrregularidades(ID, arIrregularidades);
        await gestorSalvarFiscalizacaoEquipe(ID, arEquipe);
        await gestorSalvarFiscalizacaoTrecho(ID, arTrecho);
        await gestorSalvarFiscalizacaoCheckList(ID, arPerguntas);
        await gestorSalvarFiscalizacaoQuestionario(ID, arQuestionario);
        await gestorSalvarFiscalizacaoFotos(ID, arRotina);
        await gestorSalvarFiscalizacaoEvidencia(ID, arEvidencias);
        await gestorSalvarFiscalizacaoEmbarcacao(ID, arEmbarcacao);
        await gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa(ID, arFotoIrregularidade);


        if (IdFiscalizacaoSalva > 0) {
            await gestorExcluirFiscalizacao(IdFiscalizacaoSalva, null);
        }
    } catch (err) {
        logErro('gestorSalvarDadosFiscalizacao', err.message, JSON.stringify({
            'IdFiscalizacaoSalva': IdFiscalizacaoSalva,
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'CodProcessoProgramada': CodProcessoProgramada,
            'nrnotificacao': nrnotificacao,
            'acao': acao,
            'latitude': latitude,
            'longitude': longitude,
            'altitude': altitude,
            'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorSalvarDadosFiscalizacao: ' + err.message);
    }
}

async function pegarIdFiscalizacao(data, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, arIrregularidades, arEquipe, arTrecho, arPerguntas, arQuestionario, arRotina, arEvidencias, nrnotificacao) {

    var ID = 0;

    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], async function (tx, rs) {

                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }


                    if (ID == 0) {
                        ID = 1;
                    }


                    let objFiscalizacaoTemp = {IdFiscalizacaoTemp: ID};
                    sessionStorage.removeItem("arFiscalizacaoTemp");
                    sessionStorage.setItem("arFiscalizacaoTemp", angular.toJson(objFiscalizacaoTemp));


                    resolve(true);

                }, async function (error) {
                    logErro('pegarIdFiscalizacao transaction', error.message, JSON.stringify({
                        'cnpjautorizada': cnpjautorizada,
                        'norazaosocial': norazaosocial,
                        'assunto': assunto,
                        'areappf': areappf,
                        'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
                        'obsfiscalizacao': obsfiscalizacao,
                        'nrnotificacao': nrnotificacao
                    }));
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('pegarIdFiscalizacao', err.message, JSON.stringify({
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'nrnotificacao': nrnotificacao
        }));
        alert('pegarIdFiscalizacao: ' + err.message);
    }

    return ID;
}

async function gestorSalvarFiscalizacao(id, data, hora, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, obsfiscalizacao, arEmpresa, nrnotificacao, codprocessoprogramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula) {
    try {

        openDB();

        cnpjautorizada = formatarCNPJ(cnpjautorizada);

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO " +
                    ", DATA " +
                    ", HORA " +
                    ", CNPJAUTORIZADA " +
                    ", FLAGENVIADA " +
                    ", OBS " +
                    ", NRNOTIFICACAO " +
                    ", CODPROCESSOPROGRAMADA " +
                    ", ACAO " +
                    ", LATITUDE " +
                    ", LONGITUDE " +
                    ", ALTITUDE " +
                    ", TPFISCALIZACAOPROGRAMADA" +
                    ", NRMATRICULA" +
                    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [id, data, hora, cnpjautorizada, "F", obsfiscalizacao, nrnotificacao, codprocessoprogramada, acao, latitude, longitude, altitude, tpFiscalizacaoProgramada, nrMatricula]);

                // ...
                var queryEmpresa = "INSERT INTO FISCALIZACAOEMPRESA (" +
                    " IDFISCALIZACAO " +
                    ", NRINSCRICAO " +
                    ", NORAZAOSOCIAL " +
                    ", ASSUNTO " +
                    ", AREAPPF " +
                    ", IDTIPOINSTALACAOPORTUARIA " +
                    ", NRINSTRUMENTO " +
                    " ) VALUES (?,?,?,?,?,?,?);";

                tx.executeSql(queryEmpresa, [
                    id, cnpjautorizada, norazaosocial, assunto, areappf, idtipoinstalacaoportuaria, arEmpresa.NRInstrumento
                ]);
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'cnpjautorizada': cnpjautorizada,
                    'norazaosocial': norazaosocial,
                    'assunto': assunto,
                    'areappf': areappf,
                    'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
                    'obsfiscalizacao': obsfiscalizacao,
                    'nrnotificacao': nrnotificacao,
                    'codprocessoprogramada': codprocessoprogramada,
                    'acao': acao,
                    'latitude': latitude,
                    'longitude': longitude,
                    'altitude': altitude,
                    'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
                    'numeroMatricula': nrMatricula
                }));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacao', err.message, JSON.stringify({
            'id': id,
            'cnpjautorizada': cnpjautorizada,
            'norazaosocial': norazaosocial,
            'assunto': assunto,
            'areappf': areappf,
            'idtipoinstalacaoportuaria': idtipoinstalacaoportuaria,
            'obsfiscalizacao': obsfiscalizacao,
            'nrnotificacao': nrnotificacao,
            'codprocessoprogramada': codprocessoprogramada,
            'acao': acao,
            'latitude': latitude,
            'longitude': longitude,
            'altitude': altitude,
            'tpFiscalizacaoProgramada': tpFiscalizacaoProgramada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorSalvarFiscalizacao: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoIrregularidades(id, arIrregularidades) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arIrregularidades.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOIRREGULARIDADES (" +
                        " IDFISCALIZACAOIRREGULARIDADE " +
                        " ,ORDEM " +
                        " ,DSALINEA " +
                        " ,DSINCISO " +
                        " ,DSNORMA " +
                        " ,DSNORMACOMPLETA " +
                        " ,DSNORMATIVA " +
                        " ,DSREQUISITO " +
                        " ,IDFISCALIZACAO " +
                        " ,IDIRREGULARIDADE " +
                        " ,IDREQUISITO " +
                        " ,IDSUPERINTENDENCIA " +
                        " ,NOREQUISITO " +
                        " ,NRARTIGO " +
                        " ,NRPARAGRAFO " +
                        " ,NRPRAZO " +
                        " ,STNOTIFICAVEL " +
                        " ,STQUINZENAL " +
                        " ,TPINFRACAO " +
                        " ,TPNAVEGACAO " +
                        " ,VLMULTAMAXIMA " +
                        " ,FLAGCHECK " +
                        " ,DESCRICAOFATO " +
                        " ,IDSECAO " +
                        " ,STACAOVARIAVEL" +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";


                    tx.executeSql(query, [
                        id, i, arIrregularidades[i].DSAlinea, arIrregularidades[i].DSInciso, arIrregularidades[i].DSNorma, arIrregularidades[i].DSNormaCompleta, arIrregularidades[i].DSNormativa, arIrregularidades[i].DSRequisito, arIrregularidades[i].IDFiscalizacao, arIrregularidades[i].IDIrregularidade, arIrregularidades[i].IDRequisito, arIrregularidades[i].IDSuperintendencia, arIrregularidades[i].NORequisito, arIrregularidades[i].NRArtigo, arIrregularidades[i].NRParagrafo, arIrregularidades[i].NRPrazo, arIrregularidades[i].STNotificavel, arIrregularidades[i].STQuinzenal, arIrregularidades[i].TPInfracao, arIrregularidades[i].TPNavegacao, arIrregularidades[i].VLMultaMaxima, arIrregularidades[i].check, arIrregularidades[i].descricaoFato, arIrregularidades[i].IDSecao, arIrregularidades[i].STACAOVARIAVEL
                    ]);
                }
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoIrregularidades transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoIrregularidades transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoIrregularidades', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoIrregularidades: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEquipe(id, arEquipe) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arEquipe.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOEQUIPE (" +
                        "  IDFISCALIZACAO " +
                        " ,NRMATRICULA " +
                        " ,NOUSUARIO " +
                        " ,NRCPF " +
                        " ,STCOORDENADOR " +
                        " ,NOCARGO " +
                        " ,NOUNIDADEORGANIZACIONAL " +
                        " ) VALUES (?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arEquipe[i].NRMatriculaServidor, arEquipe[i].NOUsuario, arEquipe[i].NRCPF, null, null, null
                    ]);
                }
                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoEquipe transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoEquipe transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEquipe', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoEquipe: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoCheckList(id, arPerguntas) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arPerguntas.length; i++) {
                    // ...
                    var imagemirregularidade = arPerguntas[i].Foto && arPerguntas[i].Foto.imagem ? arPerguntas[i].Foto.imagem : null;
                    var tituloimagemirregularidade = arPerguntas[i].Foto && arPerguntas[i].Foto.titulo ? arPerguntas[i].Foto.titulo : null;

                    var query = "INSERT INTO FISCALIZACAOCHECKLIST (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IDCHECKLIST " +
                        " ,IDOBJETOFISCALIZADO " +
                        " ,IDQUESTIONARIO " +
                        " ,IDPERGUNTA " +
                        " ,NRMATRICULA " +
                        " ,CDLATITUDE " +
                        " ,CDLONGITUDE " +
                        " ,DTCADASTRO " +
                        " ,STRESPOSTA " +
                        " ,DSPERGUNTA "
                        //DADOS PERGUNTA
                        +
                        " ,DSSECAO " +
                        " ,IDSECAO " +
                        " ,DESCRICAOFATO " +
                        " ,RESPOSTA " +
                        " ,IDIRREGULARIDADE " +
                        " ,IMAGEMIRREGULARIDADE " +
                        " ,TITULOIMAGEMIRREGULARIDADE " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, 1, 0, arPerguntas[i].IDQuestionario, arPerguntas[i].IDPergunta, arPerguntas[i].NRMatricula, arPerguntas[i].latitude, arPerguntas[i].longitude, null, arPerguntas[i].STResposta, arPerguntas[i].DSPergunta

                        //DADOS PERGUNTA
                        , arPerguntas[i].DSSecao, arPerguntas[i].IDSecao, arPerguntas[i].descricaoFato, arPerguntas[i].resposta, arPerguntas[i].IDIrregularidade, imagemirregularidade, tituloimagemirregularidade
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoCheckList transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoCheckList transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoCheckList', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoCheckList: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoTrecho(id, arTrecho) {
    try {

        if (arTrecho != null) {

            openDB();

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    var query = "INSERT INTO FISCALIZACAOTRECHO (" +
                        "  IDFISCALIZACAO " +
                        " ,IDTIPOTRANSPORTE " +
                        " ,IDTRECHOLINHA " +
                        " ) VALUES (?,?,?);";

                    tx.executeSql(query, [
                        id, arTrecho.IDTipoTransporte, arTrecho.IDTrechoLinha
                    ]);

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoTrecho transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);
                }, async function () {
                    console.log('gestorSalvarFiscalizacaoTrecho transaction ok');
                    resolve(true);
                });
            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoTrecho', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorSalvarFiscalizacaoQuestionario(id, arQuestionario) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {

                for (var i = 0; i < arQuestionario.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOQUESTIONARIO (" +
                        "  IDFISCALIZACAO "

                        + " ,DSNORMA " +
                        " ,DSSECAO " +
                        " ,DTCRIACAO " +
                        " ,IDQUESTIONARIO " +
                        " ,IDSECAO " +
                        " ,NOQUESTIONARIO " +
                        " ,MARQUE "


                        +
                        " ) VALUES (?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arQuestionario[i].DSNorma, arQuestionario[i].DSSecao, arQuestionario[i].DTCriacao, arQuestionario[i].IDQuestionario, arQuestionario[i].IDSecao, arQuestionario[i].NOQuestionario, arQuestionario[i].check
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoQuestionario transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);
            }, async function () {
                console.log('gestorSalvarFiscalizacaoQuestionario transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoQuestionario', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoQuestionario: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoFotos(id, arRotina) {
    try {
        if (!arRotina || !arRotina.fotos || arRotina.fotos.length == 0) return;

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arRotina.fotos.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOFOTOS (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IMAGEM " +
                        " ,TITULO " +
                        " ) VALUES (?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, arRotina.fotos[i].imagem, arRotina.fotos[i].titulo
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoFotos transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);

            }, async function () {
                console.log('gestorSalvarFiscalizacaoFotos transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoFotos', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoFotos: ' + err.message);
    }
}

async function gestorMarcarEnvioFiscalizacao(id, nrMatricula, idfiscalizacaoenviada, idobjetofiscalizadoenviada) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET FLAGENVIADA = 'T', IDFISCALIZACAOENVIADA = " + idfiscalizacaoenviada +
                    ", IDOBJETOFISCALIZADOENVIADA = " + idobjetofiscalizadoenviada + ", NRMATRICULA = '" + nrMatricula + "' WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorMarcarEnvioFiscalizacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'idfiscalizacaoenviada': idfiscalizacaoenviada,
                    'idobjetofiscalizadoenviada': idobjetofiscalizadoenviada,
                    'numeroMatricula': nrMatricula
                }));
                resolve(true);
            }, async function () {
                console.log('gestorMarcarEnvioFiscalizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorMarcarEnvioFiscalizacao', err.message, JSON.stringify({
            'id': id,
            'idfiscalizacaoenviada': idfiscalizacaoenviada,
            'idobjetofiscalizadoenviada': idobjetofiscalizadoenviada,
            'numeroMatricula': nrMatricula
        }));
        alert('gestorMarcarEnvioFiscalizacao: ' + err.message);
    }
}

async function gestorRegistrarNumeroNotificacao(id, nrnotificacao) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET NRNOTIFICACAO = " + nrnotificacao + " WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorRegistrarNumeroNotificacao transaction', error.message, JSON.stringify({
                    'id': id,
                    'nrnotificacao': nrnotificacao
                }));
                resolve(true);
            }, async function () {
                console.log('gestorRegistrarNumeroNotificacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRegistrarNumeroNotificacao', err.message, JSON.stringify({
            'id': id,
            'nrnotificacao': nrnotificacao
        }));
        alert('gestorRegistrarNumeroNotificacao: ' + err.message);
    }
}

async function gestorRegistrarNumeroAutoInfracao(id, nrautoinfracao) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "UPDATE FISCALIZACAO SET NRAUTOINFRACAO = '" + nrautoinfracao + "' WHERE IDFISCALIZACAO = ? ;"
                tx.executeSql(query, [
                    id
                ]);

                resolve(true);
            }, async function (error) {
                logErro('gestorRegistrarNumeroAutoInfracao transaction', error.message, JSON.stringify({
                    'id': id,
                    'nrautoinfracao': nrautoinfracao
                }));
                resolve(true);
            }, async function () {
                console.log('gestorRegistrarNumeroAutoInfracao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRegistrarNumeroAutoInfracao', err.message, JSON.stringify({
            'id': id,
            'nrautoinfracao': nrautoinfracao
        }));
        alert('gestorRegistrarNumeroAutoInfracao: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEvidencia(id, arEvidencias) {
    try {
        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                for (var i = 0; i < arEvidencias.length; i++) {
                    // ...
                    var query = "INSERT INTO FISCALIZACAOEVIDENCIA (" +
                        "  IDFISCALIZACAO " +
                        " ,ORDEM " +
                        " ,IMAGEM " +
                        " ,TITULO " +
                        " ) VALUES (?,?,?,?);";

                    tx.executeSql(query, [
                        id, i, arEvidencias[i].imagem, arEvidencias[i].titulo
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarFiscalizacaoEvidencia transaction', error.message, JSON.stringify({'id': id}));
                resolve(true);

            }, async function () {
                console.log('gestorSalvarFiscalizacaoEvidencia transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEvidencia', err.message, JSON.stringify({'id': id}));
        alert('gestorSalvarFiscalizacaoEvidencia: ' + err.message);
    }
}

async function gestorSalvarFiscalizacaoEmbarcacao(id, arEmbarcacao) {
    try {

        if (arEmbarcacao != null) {

            openDB();

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    var query = "INSERT INTO FISCALIZACAOEMBARCACAO (" +
                        "  IDFISCALIZACAO " +
                        " ,IDEMBARCACAO " +
                        " ,IDFROTA " +
                        " ,TPINSCRICAO " +
                        " ,STEMBARCACAO " +
                        " ,DTINICIO " +
                        " ,DTTERMINO " +
                        " ,TPAFRETAMENTO " +
                        " ,STREGISTRO " +
                        " ,IDFROTAPAI " +
                        " ,STHOMOLOGACAO " +
                        " ,NOEMBARCACAO " +
                        " ,NRCAPITANIA " +
                        " ,TIPOEMBARCACAO " +
                        " ,NRINSCRICAO " +
                        " ,NRINSTRUMENTO " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    tx.executeSql(query, [
                        id, arEmbarcacao.IDEmbarcacao, arEmbarcacao.IDFrota, arEmbarcacao.TPInscricao, arEmbarcacao.STEmbarcacao, arEmbarcacao.DTInicio, arEmbarcacao.DTTermino, arEmbarcacao.TPAfretamento, arEmbarcacao.STRegistro, arEmbarcacao.IDFrotaPai, arEmbarcacao.STHomologacao, arEmbarcacao.NOEmbarcacao, arEmbarcacao.NRCapitania, arEmbarcacao.TipoEmbarcacao, arEmbarcacao.NRInscricao, arEmbarcacao.NRInstrumento
                    ]);

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoEmbarcacao transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);
                }, async function () {
                    console.log('gestorSalvarFiscalizacaoEmbarcacao transaction ok');
                    resolve(true);
                });
            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoEmbarcacao', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa(id, arFotoIrregularidade) {
    try {
        openDB();

        if (arFotoIrregularidade != null) {

            let firstFunction = new Promise(function (resolve, reject) {

                db.transaction(async function (tx) {
                    for (var i = 0; i < arFotoIrregularidade.length; i++) {
                        // ...
                        var query = "INSERT INTO FISCALIZACAOFOTOIRREGULARIDADE (" +
                            "  IDFISCALIZACAO " +
                            " ,IDIRREGULARIDADE " +
                            " ,IMAGEM " +
                            " ,TITULO " +
                            " ) VALUES (?,?,?,?);";

                        tx.executeSql(query, [
                            id, arFotoIrregularidade[i].IDIrregularidade, arFotoIrregularidade[i].Foto.imagem, arFotoIrregularidade[i].Foto.titulo
                        ]);
                    }

                    resolve(true);

                }, async function (error) {
                    logErro('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa transaction', error.message, JSON.stringify({'id': id}));
                    resolve(true);

                }, async function () {
                    console.log('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa transaction ok');
                    resolve(true);

                });

            })

            async function secondFunction() {
                let result = await firstFunction
            };

            await secondFunction();
        }
    } catch (err) {
        logErro('gestorSalvarFiscalizacaoFotoIrregularidadeAvulsa', err.message, JSON.stringify({'id': id}));
    }
}

async function gestorExcluirFiscalizacao(idFiscalizacaoSalva, local) {
    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            //todo: db não possui executeSql, apenas o tx (comentário abaixo)
            // ...
            //let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
            let query01 = "UPDATE FISCALIZACAO SET FLAGEXCLUIDO = 'T' WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query01, [idFiscalizacaoSalva]);

            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(300);

            let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAOIRREGULARIDADE = ?;";
            db.executeSql(query02, [idFiscalizacaoSalva]);
            await delay(300);

            let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query03, [idFiscalizacaoSalva]);
            await delay(300);

            let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query04, [idFiscalizacaoSalva]);
            await delay(300);

            let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query05, [idFiscalizacaoSalva]);
            await delay(300);

            let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query06, [idFiscalizacaoSalva]);
            await delay(300);

            let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query07, [idFiscalizacaoSalva]);
            await delay(300);

            let query08 = "DELETE FROM FISCALIZACAOEMBARCACAO WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query08, [idFiscalizacaoSalva]);
            await delay(300);

            let query09 = "DELETE FROM FISCALIZACAOFOTOIRREGULARIDADE WHERE IDFISCALIZACAO = ?;";
            db.executeSql(query09, [idFiscalizacaoSalva]);
            await delay(300);


            if (local != null) {
                try {

                    gestorLimparCache();

                    gestorCarregarDadosEquipe();

                    var msgCancelar = '<p>Excluido!</p>';
                    M.toast({html: msgCancelar, classes: "#c62828 blue darken-3"});
                    window.location = local;
                } catch (erro) {
                    console.log("erro ao excluir fiscalizacao!");
                }

            }

            resolve(true);
            /*
                        db.transaction(async function (tx) {
                            // ...
                            //let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
                            let query01 = "UPDATE FISCALIZACAO SET FLAGEXCLUIDO = 'T' WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query01, [idFiscalizacaoSalva]);

                            // const delay = ms => new Promise(res => setTimeout(res, ms));
                            // await delay(300);

                            let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAOIRREGULARIDADE = ?;";
                            tx.executeSql(query02, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query03, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query04, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query05, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query06, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query07, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query08 = "DELETE FROM FISCALIZACAOEMBARCACAO WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query08, [idFiscalizacaoSalva]);
                            // await delay(300);

                            let query09 = "DELETE FROM FISCALIZACAOFOTOIRREGULARIDADE WHERE IDFISCALIZACAO = ?;";
                            tx.executeSql(query09, [idFiscalizacaoSalva]);
                            // await delay(300);


                            if (local != null) {
                                try {

                                    gestorLimparCache();

                                    gestorCarregarDadosEquipe();

                                    var msgCancelar = '<p>Excluido!</p>';
                                    M.toast({ html: msgCancelar, classes: "#c62828 blue darken-3" });
                                    window.location = local;
                                } catch (erro) {
                                    console.log("erro ao excluir fiscalizacao!");
                                }

                            }

                            resolve(true);
                        }, async function (error) {
                            console.log('gestorExcluirFiscalizacao transaction error: ' + error.message);
                        }, async function () {
                            console.log('gestorExcluirFiscalizacao transaction ok');
                        });*/
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorExcluirFiscalizacao', err.message, JSON.stringify({
            'idFiscalizacaoSalva': idFiscalizacaoSalva,
            'local': local
        }));
        resolve(true);
        alert('gestorExcluirFiscalizacao: ' + err.message);
    }
}

async function gestorExcluirFiscalizacao_OLD(id) {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                let query01 = "DELETE FROM FISCALIZACAO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query01, [id]);

                let query02 = "DELETE FROM FISCALIZACAOIRREGULARIDADES WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query02, [id]);

                let query03 = "DELETE FROM FISCALIZACAOEQUIPE WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query03, [id]);

                let query04 = "DELETE FROM FISCALIZACAOCHECKLIST WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query04, [id]);

                let query05 = "DELETE FROM FISCALIZACAOTRECHO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query05, [id]);

                let query06 = "DELETE FROM FISCALIZACAOQUESTIONARIO WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query06, [id]);

                let query07 = "DELETE FROM FISCALIZACAOFOTOS WHERE IDFISCALIZACAO = ?;";
                tx.executeSql(query07, [id]);

                resolve(true);

            }, async function (error) {
                console.log('gestorExcluirFiscalizacao transaction error: ' + error.message);
                resolve(true);

            }, async function () {
                console.log('gestorExcluirFiscalizacao transaction ok');
                resolve(true);

            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExcluirFiscalizacao: ' + err.message);
    }
}

async function gestorLimparCache() {
    try {

        let firstFunction = new Promise(function (resolve, reject) {

            sessionStorage.removeItem("arFiscalizacao");
            sessionStorage.removeItem("arEmpresa");
            sessionStorage.removeItem("arEquipeSelecionada");
            sessionStorage.removeItem("arEquipe");
            sessionStorage.removeItem("arIrregularidade");
            sessionStorage.removeItem("arQuestionario");
            sessionStorage.removeItem("arPergunta");
            sessionStorage.removeItem("totalIrregularidades");
            sessionStorage.removeItem("NRAutoInfracao");
            sessionStorage.removeItem("NRNotificacao");
            sessionStorage.removeItem("rotina");
            sessionStorage.removeItem("notificado");
            sessionStorage.removeItem("notificante");
            sessionStorage.removeItem("testemunha1");
            sessionStorage.removeItem("testemunha2");

            sessionStorage.removeItem("arTerminais");
            sessionStorage.removeItem('arTrecho');
            sessionStorage.removeItem("arEmbarcacao");
            sessionStorage.removeItem("arEmbarcacaoConstrucao");
            sessionStorage.removeItem("arEmbarcacaoMaritima");
            sessionStorage.removeItem("arIrregularidades");
            sessionStorage.removeItem("arEmpresas");
            sessionStorage.removeItem("arFiscalizacaoTemp");
            sessionStorage.removeItem("arEvidencias");
            sessionStorage.removeItem("arFotoIrregularidade");
            sessionStorage.removeItem("arFormInstalacaoCadastrar");
            sessionStorage.removeItem("arFormPrestadorCadastrar");

            resolve(true);

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        logErro('gestorLimparCache', erro.message);
        resolve(true);
    }
}


async function gestorSalvarUsuario(arUsuario, manterconectado, datalogoff) {
    try {

        let firstFunction = new Promise(function (resolve, reject) {
            openDB();

            db.transaction(async function (tx) {

                tx.executeSql("DELETE FROM USUARIO");

                //for(var i = 0; i < arUsuario.length; i++)
                if (arUsuario.IDUsuario > 0) {
                    // ...
                    var query = "INSERT INTO USUARIO (" +
                        "  IDUSUARIO " +
                        " ,DSSENHA " +
                        " ,EEFUNCIONARIO " +
                        " ,NOLOGINUSUARIO " +
                        " ,NRMATRICULA " +
                        " ,FOTO " +
                        " ,IDUNIDADEORGANIZACIONAL " +
                        " ,NOCARGO " +
                        " ,NOUNIDADEORGANIZACIONAL " +
                        " ,NOUSUARIO " +
                        " ,NRCPF " +
                        " ,NRMATRICULASERVIDOR " +
                        " ,SGUNIDADE " +
                        " ,MANTERCONECTADO " +
                        " ,DATALOGOFF " +
                        " ,IDPOSTOAVANCADO " +
                        " ,DSPOSTOAVANCADO " +
                        " ,IDPERFILFISCALIZACAO " +
                        " ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                    let fotoUsuario = "";
                    let idUnidade = "";
                    let cargo = "";
                    let Unidade = "";
                    let usuario = "";
                    let nrCpf = "";
                    let nrMatricula = "";
                    let sgUnidade = "";
                    let idPostoAvancado = "";
                    let dsPostoAvancado = "";

                    try {

                        fotoUsuario = arUsuario.servidor.Foto;

                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {
                        idPostoAvancado = arUsuario.servidor.IDPostoAvancado;
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {
                        dsPostoAvancado = arUsuario.servidor.DSPostoAvancado;
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    try {

                        idUnidade = arUsuario.servidor.IDUnidadeOrganizacional;
                        cargo = arUsuario.servidor.NOCargo;
                        Unidade = arUsuario.servidor.NOUnidadeOrganizacional;
                        usuario = arUsuario.servidor.NOUsuario;
                        nrCpf = arUsuario.servidor.NRCPF;
                        nrMatricula = arUsuario.servidor.NRMatriculaServidor;
                        sgUnidade = arUsuario.servidor.SGUnidade;

                    } catch (ex) {
                        console.log(ex.message);
                    }

                    tx.executeSql(query, [
                        arUsuario.IDUsuario, arUsuario.DSSenha, arUsuario.EEFuncionario, arUsuario.NOLoginUsuario, arUsuario.NRMatricula

                        , fotoUsuario, idUnidade, cargo, Unidade, usuario, nrCpf, nrMatricula, sgUnidade, manterconectado, datalogoff, idPostoAvancado, dsPostoAvancado, arUsuario.servidor.IDPerfilFiscalizacao
                    ]);
                }

                resolve(true);

            }, async function (error) {
                logErro('gestorSalvarUsuario transaction', error.message);
            }, async function () {
                console.log('gestorSalvarUsuario transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorSalvarUsuario', err.message);
        alert('gestorSalvarUsuario: ' + err.message);
    }
}

function gestorRemoverUsuario(enviarParaTelaInicial) {
    try {
        openDB();

        db.transaction(function (tx) {
            // ...
            let query = "DELETE FROM USUARIO";
            tx.executeSql(query, []);

            // ...
            //let query01 = "DELETE FROM LOGATUALIZACAO";
            //tx.executeSql(query01, []);

        }, function (error) {
            logErro('gestorRemoverUsuario transaction', error.message);
        }, function () {
            if (enviarParaTelaInicial == 'T') {
                window.location = "index.html";
            }
            console.log('gestorRemoverUsuario transaction ok');
        });
    } catch (err) {
        logErro('gestorRemoverUsuario', err.message);
        alert('gestorRemoverUsuario: ' + err.message);
    }
}

async function gestorRemoverLogAtualizacao() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "DELETE FROM LOGATUALIZACAO;"

                tx.executeSql(query, []);

                resolve(true);
            }, async function (error) {
                logErro('gestorRemoverLogAtualizacao transaction', error.message);
                resolve(true);
            }, async function () {
                console.log('gestorRemoverLogAtualizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRemoverLogAtualizacao', err.message);
    }
}


async function gestorCarregarDadosFiscalizacao(id) {
    try {
        openDB();

        var query = "SELECT " +
            " FISCALIZACAO.IDFISCALIZACAO " +
            ", FISCALIZACAO.DATA " +
            ", FISCALIZACAO.HORA " +
            ", FISCALIZACAO.CNPJAUTORIZADA " +
            ", FISCALIZACAO.FLAGENVIADA " +
            ", FISCALIZACAO.OBS " +
            ", FISCALIZACAO.NRNOTIFICACAO " +
            ", FISCALIZACAO.CODPROCESSOPROGRAMADA " +
            ", FISCALIZACAO.ACAO " +
            ", FISCALIZACAO.IDFISCALIZACAOENVIADA " +
            ", FISCALIZACAO.IDOBJETOFISCALIZADOENVIADA " +
            ", FISCALIZACAO.LATITUDE " +
            ", FISCALIZACAO.LONGITUDE " +
            ", FISCALIZACAO.ALTITUDE "

            + ", FISCALIZACAOEMPRESA.NORAZAOSOCIAL " +
            ", FISCALIZACAOEMPRESA.AREAPPF " +
            ", FISCALIZACAOEMPRESA.NORMA " +
            ", FISCALIZACAOEMPRESA.NRINSTRUMENTO " +
            ", FISCALIZACAOEMPRESA.IDTIPOINSTALACAOPORTUARIA "

            +
            " FROM FISCALIZACAO " +
            " JOIN FISCALIZACAOEMPRESA ON FISCALIZACAO.IDFISCALIZACAO = FISCALIZACAOEMPRESA.IDFISCALIZACAO " +
            " WHERE FISCALIZACAO.IDFISCALIZACAO = ?";

        var query03 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,ORDEM " +
            " ,IDCHECKLIST " +
            " ,IDOBJETOFISCALIZADO " +
            " ,IDQUESTIONARIO " +
            " ,IDPERGUNTA " +
            " ,NRMATRICULA " +
            " ,CDLATITUDE " +
            " ,CDLONGITUDE " +
            " ,DTCADASTRO " +
            " ,STRESPOSTA " +
            " ,DSPERGUNTA "
            //DADOS PERGUNTA
            +
            " ,DSSECAO " +
            " ,IDSECAO " +
            " ,DESCRICAOFATO " +
            " ,RESPOSTA " +
            " ,IDIRREGULARIDADE " +
            " ,IMAGEMIRREGULARIDADE " +
            " ,TITULOIMAGEMIRREGULARIDADE " +
            " FROM FISCALIZACAOCHECKLIST " +
            " WHERE FISCALIZACAOCHECKLIST.IDFISCALIZACAO = ?";


        var query07 = "SELECT " +
            "  FISCALIZACAOEVIDENCIA.IDFISCALIZACAO " +
            " ,FISCALIZACAOEVIDENCIA.ORDEM " +
            " ,FISCALIZACAOEVIDENCIA.IMAGEM " +
            " ,FISCALIZACAOEVIDENCIA.TITULO " +
            " FROM FISCALIZACAOEVIDENCIA " +
            " WHERE FISCALIZACAOEVIDENCIA.IDFISCALIZACAO = ?";

        var arData = [];
        var arEmpresa = [];

        var qtdIrregularidadesCheck = 0;


        var arPergunta = [];
        var arPerguntas = [];
        var arEvidencias = [];
        var arRotina = {};

        var arDadosEmpresa = [];

        let flagEnviada = "F";

        /*======================================================================================================*/
        var arIrregularidade = [];
        arIrregularidade = await carregarFiscalizacaoIrregularidades(id);
        if (arIrregularidade.length > 0) {
            sessionStorage.removeItem("arIrregularidade");
            sessionStorage.setItem("arIrregularidade", angular.toJson(arIrregularidade) || '[]');
        }

        /*======================================================================================================*/
        var arEquipe = [];
        arEquipe = await carregarFiscalizacaoEquipe(id);
        if (arEquipe.length > 0) {
            sessionStorage.removeItem("arEquipeSelecionada");
            sessionStorage.setItem("arEquipeSelecionada", angular.toJson(arEquipe));
        }

        /*======================================================================================================*/
        var arPerguntasIrregularidade = [];
        arPerguntasIrregularidade = await carregarFiscalizacaoPerguntaIrregularidade(id);

        /*======================================================================================================*/
        var arQuestionario = [];
        arQuestionario = await carregarFiscalizacaoQuestionario(id);
        if (arQuestionario.length > 0) {
            sessionStorage.removeItem("arQuestionario");
            sessionStorage.setItem("arQuestionario", angular.toJson(arQuestionario));
        }

        arRotina.fotos = [];
        arRotina.fotos = await carregarFiscalizacaoFotos(id);


        /*======================================================================================================*/
        var arTrecho = [];
        arTrecho = await carregarFiscalizacaoTrecho(id);
        sessionStorage.removeItem("arTrecho");
        sessionStorage.setItem("arTrecho", angular.toJson(arTrecho));

        var arEmbarcacao = {};
        arEmbarcacao = await carregarFiscalizacaoEmbarcacao(id);
        sessionStorage.removeItem("arEmbarcacao");
        sessionStorage.setItem("arEmbarcacao", angular.toJson(arEmbarcacao));

        let arFotoIrregularidade = {};
        arFotoIrregularidade = await carregarFiscalizacaoFotoIrregularidadeAvulsa(id);
        sessionStorage.removeItem("arFotoIrregularidade");
        sessionStorage.setItem("arFotoIrregularidade", angular.toJson(arFotoIrregularidade));

        db.transaction(async function (tx) {
            /*======================================================================================================*/
            tx.executeSql(query03, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    arPerguntas.push({
                        IDCheckList: res.rows.item(i).IDCHECKLIST,
                        IDFiscalizacao: 0,
                        IDQuestionario: res.rows.item(i).IDQUESTIONARIO,
                        DSSecao: res.rows.item(i).DSSECAO,
                        IDSecao: res.rows.item(i).IDSECAO,
                        IDPergunta: res.rows.item(i).IDPERGUNTA,
                        NRMatricula: res.rows.item(i).NRMATRICULA,
                        CDLatitude: res.rows.item(i).CDLATITUDE,
                        CDLongitude: res.rows.item(i).CDLONGITUDE,
                        DTCadastro: res.rows.item(i).DTCADASTRO,
                        STResposta: null,
                        resposta: res.rows.item(i).STRESPOSTA,
                        DSPergunta: res.rows.item(i).DSPERGUNTA
                    });

                    if (res.rows.item(i).STRESPOSTA == 'nao') {
                        qtdIrregularidadesCheck += 1;
                    }

                    var fotoPergunta = null;
                    if (res.rows.item(i).IMAGEMIRREGULARIDADE && res.rows.item(i).TITULOIMAGEMIRREGULARIDADE)
                        fotoPergunta = {
                            "imagem": res.rows.item(i).IMAGEMIRREGULARIDADE
                            , "titulo": res.rows.item(i).TITULOIMAGEMIRREGULARIDADE
                        };

                    arPergunta.push({
                        DSPergunta: res.rows.item(i).DSPERGUNTA,
                        IDQuestionario: res.rows.item(i).IDQUESTIONARIO,
                        DSSecao: res.rows.item(i).DSSECAO,
                        IDSecao: res.rows.item(i).IDSECAO,
                        descricaoFato: res.rows.item(i).DESCRICAOFATO,
                        resposta: res.rows.item(i).RESPOSTA,
                        IDIrregularidade: res.rows.item(i).IDIRREGULARIDADE,
                        IDPergunta: res.rows.item(i).IDPERGUNTA,
                        Foto: fotoPergunta
                    });

                }

                for (var x = 0; x < arPerguntas.length; x++) {
                    let IDPerg = arPerguntas[x].IDPergunta;

                    angular.forEach(arPerguntasIrregularidade, async function (value, key) {
                        let IDPerg2 = arPerguntasIrregularidade[key].IDPergunta;
                        if (IDPerg2 == IDPerg) {
                            arPergunta[x].Irregularidades = [];
                            arPergunta[x].Irregularidades[0] = arPerguntasIrregularidade[key];
                        }
                    });
                }

                sessionStorage.removeItem("totalIrregularidades");
                sessionStorage.setItem("totalIrregularidades", angular.toJson(qtdIrregularidadesCheck));

                sessionStorage.removeItem("arPerguntas");
                sessionStorage.setItem("arPerguntas", angular.toJson(arPerguntas));

                sessionStorage.removeItem("arPergunta");
                sessionStorage.setItem("arPergunta", angular.toJson(arPergunta));
            });


            /*======================================================================================================*/
            tx.executeSql(query07, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    arEvidencias.push({
                        imagem: res.rows.item(i).IMAGEM,
                        titulo: res.rows.item(i).TITULO
                    });
                }

                sessionStorage.removeItem("arEvidencias");
                sessionStorage.setItem("arEvidencias", angular.toJson(arEvidencias));
            });


            /*======================================================================================================*/
            tx.executeSql(query, [id], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.push({NORAZAOSOCIAL: res.rows.item(i).NORAZAOSOCIAL});

                    flagEnviada = res.rows.item(i).FLAGENVIADA;

                    sessionStorage.acao = formataAcao(res.rows.item(i).ACAO, "0", res.rows.item(i).CODPROCESSOPROGRAMADA);
                    sessionStorage.idfiscalizacaoenviada = res.rows.item(i).IDFISCALIZACAOENVIADA;
                    sessionStorage.idobjetofiscalizadoenviada = res.rows.item(i).IDOBJETOFISCALIZADOENVIADA;

                    try {
                        let objFiscalizacaoTemp = {IdFiscalizacaoTemp: res.rows.item(i).IDFISCALIZACAO};
                        sessionStorage.removeItem("arFiscalizacaoTemp");
                        sessionStorage.setItem("arFiscalizacaoTemp", angular.toJson(objFiscalizacaoTemp));
                    } catch (error) {
                        console.log(error.message);
                    }

                    try {
                        var localizacao = {
                            'latitude': res.rows.item(i).LATITUDE,
                            'longitude': res.rows.item(i).LONGITUDE,
                            'altitude': res.rows.item(i).ALTITUDE
                        };
                        sessionStorage.setItem("position", angular.toJson(localizacao));
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    //...
                    arEmpresa.push({
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRInscricao: res.rows.item(i).CNPJAUTORIZADA,
                        DSEndereco: "endereco",
                        Modalidade: "modalidade",
                        norma: res.rows.item(i).NORMA,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        IDTipoInstalacaoPortuaria: res.rows.item(i).IDTIPOINSTALACAOPORTUARIA
                    });

                    //...
                    var Observacao = res.rows.item(i).OBS;
                    //let myObj = { descricao: Observacao, fotos: [] };
                    let myObj = {
                        descricao: Observacao,
                        IdFiscalizacaoBd: res.rows.item(i).IDFISCALIZACAO,
                        DataFiscalizacaoBd: res.rows.item(i).DATA,
                        HoraFiscalizacaoBd: res.rows.item(i).HORA,
                        fotos: arRotina.fotos
                    };


                    //Pegar processo da fiscalizacao programada
                    let CodProcessoProgramada = null;
                    try {
                        CodProcessoProgramada = res.rows.item(i).CODPROCESSOPROGRAMADA;
                        if (CodProcessoProgramada != null) {
                            await gestorCarregarDadosProgramada(res.rows.item(i).CNPJAUTORIZADA, CodProcessoProgramada);
                        }
                    } catch (ex) {
                        console.log(ex.message);
                    }

                    sessionStorage.removeItem("rotina");
                    sessionStorage.setItem("rotina", angular.toJson(myObj));

                    sessionStorage.removeItem("NRNotificacao");
                    sessionStorage.setItem("NRNotificacao", angular.toJson(res.rows.item(i).NRNOTIFICACAO));
                }

                //...
                gestorCarregarDadosAutorizada(arEmpresa[0].NRInscricao, arEmpresa[0].NRInstrumento, flagEnviada);
            });

        }, function (err) {
            logErro('gestorCarregarDadosFiscalizacao', err.message, JSON.stringify({'id': id}));
            alert("An error occured while displaying saved notes", err.message);
        });
    } catch (erro) {
        logErro('gestorCarregarDadosFiscalizacao', erro.message, JSON.stringify({'id': id}));
    }
}

async function carregarFiscalizacaoIrregularidades(id) {
    var resultSet01 = [];
    var arDados = [];
    try {
        var query01 = "SELECT " +
            " IDFISCALIZACAO " +
            " ,ORDEM " +
            " ,DSALINEA " +
            " ,DSINCISO " +
            " ,DSNORMA " +
            " ,DSNORMACOMPLETA " +
            " ,DSNORMATIVA " +
            " ,DSREQUISITO " +
            " ,IDFISCALIZACAO " +
            " ,IDIRREGULARIDADE " +
            " ,IDREQUISITO " +
            " ,IDSUPERINTENDENCIA " +
            " ,NOREQUISITO " +
            " ,NRARTIGO " +
            " ,NRPARAGRAFO " +
            " ,NRPRAZO " +
            " ,STNOTIFICAVEL " +
            " ,STQUINZENAL " +
            " ,TPINFRACAO " +
            " ,TPNAVEGACAO " +
            " ,VLMULTAMAXIMA " +
            " ,FLAGCHECK " +
            " ,DESCRICAOFATO " +
            " ,IDSECAO " +
            " ,STACAOVARIAVEL" +
            " FROM FISCALIZACAOIRREGULARIDADES " +
            " WHERE FISCALIZACAOIRREGULARIDADES.IDFISCALIZACAOIRREGULARIDADE = " + id;

        resultSet01 = await gestorExecuteReaderArray(query01);

        console.log(resultSet01);
        let qtdIrregularidades = 0;
        qtdIrregularidades = resultSet01.length;
        if (qtdIrregularidades > 0) {
            for (var i = 0; i < qtdIrregularidades; i++) {
                let stnotificavel = false;
                if (resultSet01[i].STNOTIFICAVEL === "true") {
                    stnotificavel = true;
                }

                let stquinzenal = false;
                if (resultSet01[i].STQUINZENAL === "true") {
                    stquinzenal = true;
                }

                let flagcheck = false;
                if (resultSet01[i].FLAGCHECK === "true") {
                    flagcheck = true;
                }

                let stacaovariavel = false;
                if (resultSet01[i].FLAGCHECK === "true") {
                    flagcheck = true;
                }

                if (!flagcheck) continue;

                arDados.push({
                    DSAlinea: resultSet01[i].DSALINEA, //null
                    DSInciso: resultSet01[i].DSINCISO, //"V"
                    DSNorma: resultSet01[i].DSNORMA, //"1274 ANTAQ, 13 02/14"
                    DSNormaCompleta: resultSet01[i].DSNORMACOMPLETA, //"1274-ANTAQ, 13/02/14 - ART 23, Inciso V"
                    DSNormativa: resultSet01[i].DSNORMATIVA, //"deixar de manter, no local de prestação dos serviços, formulário próprio ↵para registro das reclamações dos usuários"
                    DSRequisito: resultSet01[i].DSREQUISITO, //""
                    IDFiscalizacao: resultSet01[i].IDFISCALIZACAO, //null
                    IDIrregularidade: resultSet01[i].IDIRREGULARIDADE, //475
                    IDRequisito: resultSet01[i].IDREQUISITO, //27
                    IDSuperintendencia: resultSet01[i].IDSUPERINTENDENCIA, //91
                    NORequisito: resultSet01[i].NOREQUISITO, //"Téc/Jur/Fisc/Econ."
                    NRArtigo: resultSet01[i].NRARTIGO, //23
                    NRParagrafo: resultSet01[i].NRPARAGRAFO, //null
                    NRPrazo: resultSet01[i].NRPRAZO, //null
                    STNotificavel: stnotificavel, //res.rows[i].STNOTIFICAVEL,//false
                    STQuinzenal: stquinzenal, //res.rows[i].STQUINZENAL,//false
                    TPInfracao: resultSet01[i].TPINFRACAO, //1
                    TPNavegacao: resultSet01[i].TPNAVEGACAO, //1
                    VLMultaMaxima: resultSet01[i].VLMULTAMAXIMA, //"1000"
                    check: flagcheck, //res.rows.item(i).FLAGCHECK,//true
                    descricaoFato: resultSet01[i].DESCRICAOFATO, //"Aaa"
                    IDSecao: resultSet01[i].IDSecao,
                    STAcaaoVariavel: stacaovariavel
                });
            }
        }
    } catch (ex) {
        logErro('carregarFiscalizacaoIrregularidades', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoEquipe(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query02 = "SELECT " +
            " IDFISCALIZACAO " +
            " ,NRMATRICULA " +
            " ,NOUSUARIO " +
            " ,NRCPF " +
            " ,STCOORDENADOR " +
            " ,NOCARGO " +
            " ,NOUNIDADEORGANIZACIONAL " +
            " FROM FISCALIZACAOEQUIPE " +
            " WHERE FISCALIZACAOEQUIPE.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    NOUsuario: resultSet01[i].NOUSUARIO,
                    NRMatricula: resultSet01[i].NRMATRICULA,
                    NRCPF: resultSet01[i].NRCPF,
                    IDFiscalizacao: "",
                    STCoordenador: "",
                    NOCargo: "",
                    NOUnidadeOrganizacional: "",
                    NRMatriculaServidor: resultSet01[i].NRMATRICULA
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoEquipe', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoPerguntaIrregularidade(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query06 = "SELECT " +
            "  PERGUNTASIRREGULARIDADES.ID " +
            " ,PERGUNTASIRREGULARIDADES.DSALINEA " +
            " ,PERGUNTASIRREGULARIDADES.DSINCISO " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMA " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMACOMPLETA " +
            " ,PERGUNTASIRREGULARIDADES.DSNORMATIVA " +
            " ,PERGUNTASIRREGULARIDADES.DSREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.IDFISCALIZACAO " +
            " ,PERGUNTASIRREGULARIDADES.IDIRREGULARIDADE " +
            " ,PERGUNTASIRREGULARIDADES.IDREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.IDSUPERINTENDENCIA " +
            " ,PERGUNTASIRREGULARIDADES.NOREQUISITO " +
            " ,PERGUNTASIRREGULARIDADES.NRARTIGO " +
            " ,PERGUNTASIRREGULARIDADES.NRPARAGRAFO " +
            " ,PERGUNTASIRREGULARIDADES.NRPRAZO " +
            " ,PERGUNTASIRREGULARIDADES.STNOTIFICAVEL " +
            " ,PERGUNTASIRREGULARIDADES.STQUINZENAL " +
            " ,PERGUNTASIRREGULARIDADES.TPINFRACAO " +
            " ,PERGUNTASIRREGULARIDADES.TPNAVEGACAO " +
            " ,PERGUNTASIRREGULARIDADES.VLMULTAMAXIMA " +
            " ,PERGUNTASIRREGULARIDADES.IDPERGUNTA " +
            " ,PERGUNTASIRREGULARIDADES.IDSECAO " +
            " ,PERGUNTASIRREGULARIDADES.STACAOVARIAVEL " +
            " FROM PERGUNTASIRREGULARIDADES ";
        //+" WHERE UPPER(PERGUNTASIRREGULARIDADES.DSNORMA) LIKE UPPER('%1274%')";

        resultSet01 = await gestorExecuteReaderArray(query06);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    DSAlinea: resultSet01[i].DSALINEA,
                    DSInciso: resultSet01[i].DSINCISO,
                    DSNorma: resultSet01[i].DSNORMA,
                    DSNormaCompleta: resultSet01[i].DSNORMACOMPLETA,
                    DSNormativa: resultSet01[i].DSNORMATIVA,
                    DSRequisito: resultSet01[i].DSREQUISITO,
                    IDFiscalizacao: resultSet01[i].IDFISCALIZACAO,
                    IDIrregularidade: resultSet01[i].IDIRREGULARIDADE,
                    IDPergunta: resultSet01[i].IDPERGUNTA,
                    IDRequisito: resultSet01[i].IDREQUISITO,
                    IDSuperintendencia: resultSet01[i].IDSUPERINTENDENCIA,
                    NORequisito: resultSet01[i].NOREQUISITO,
                    NRArtigo: resultSet01[i].NRARTIGO,
                    NRParagrafo: resultSet01[i].NRPARAGRAFO,
                    NRPrazo: resultSet01[i].NRPRAZO,
                    STNotificavel: resultSet01[i].STNOTIFICAVEL,
                    STQuinzenal: resultSet01[i].STQUINZENAL,
                    TPInfracao: resultSet01[i].TPINFRACAO,
                    TPNavegacao: resultSet01[i].TPNAVEGACAO,
                    VLMultaMaxima: resultSet01[i].VLMULTAMAXIMA,
                    IDSecao: resultSet01[i].IDSECAO,
                    STACAOVARIAVEL: resultSet01[i].STACAOVARIAVEL
                    //resposta: "sim"
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoPerguntaIrregularidade', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoQuestionario(id) {
    var resultSet01 = [];
    var arDados = [];

    try {
        var query04 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,DSNORMA " +
            " ,DSSECAO " +
            " ,DTCRIACAO " +
            " ,IDQUESTIONARIO " +
            " ,IDSECAO " +
            " ,NOQUESTIONARIO " +
            " ,MARQUE " +
            " FROM FISCALIZACAOQUESTIONARIO " +
            " WHERE FISCALIZACAOQUESTIONARIO.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query04);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    DSNorma: resultSet01[i].DSNORMA,
                    DSSecao: resultSet01[i].DSSECAO,
                    DTCriacao: resultSet01[i].DTCRIACAO,
                    IDQuestionario: resultSet01[i].IDQUESTIONARIO,
                    IDSecao: resultSet01[i].IDSECAO,
                    NOQuestionario: resultSet01[i].NOQUESTIONARIO,
                    check: resultSet01[i].MARQUE
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoQuestionario', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoFotos(id) {
    var resultSet01 = [];
    var arDados = [];

    try {

        var query05 = "SELECT " +
            "  FISCALIZACAOFOTOS.IDFISCALIZACAO " +
            " ,FISCALIZACAOFOTOS.ORDEM " +
            " ,FISCALIZACAOFOTOS.IMAGEM " +
            " ,FISCALIZACAOFOTOS.TITULO " +
            " FROM FISCALIZACAOFOTOS " +
            " WHERE FISCALIZACAOFOTOS.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query05);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados.push({
                    imagem: resultSet01[i].IMAGEM,
                    titulo: resultSet01[i].TITULO
                });
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoFotos', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoTrecho(id) {
    var resultSet01 = [];
    var arDados = {};

    try {
        var query02 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,IDTIPOTRANSPORTE " +
            " ,IDTRECHOLINHA " +
            " FROM FISCALIZACAOTRECHO " +
            " WHERE IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados = {
                    IDTipoTransporte: resultSet01[i].IDTIPOTRANSPORTE,
                    IDTrechoLinha: resultSet01[i].IDTRECHOLINHA,
                    Instalacao: "",
                    Modalidade: "",
                    NRInscricao: "",
                    NRInstrumento: ""
                }
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoTrecho', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoEmbarcacao(id) {
    var resultSet01 = [];
    var arDados = null;

    try {
        var query02 = "SELECT " +
            "  IDFISCALIZACAO " +
            " ,IDEMBARCACAO " +
            " ,IDFROTA " +
            " ,TPINSCRICAO " +
            " ,STEMBARCACAO " +
            " ,DTINICIO " +
            " ,DTTERMINO " +
            " ,TPAFRETAMENTO " +
            " ,STREGISTRO " +
            " ,IDFROTAPAI " +
            " ,STHOMOLOGACAO " +
            " ,NOEMBARCACAO " +
            " ,NRCAPITANIA " +
            " ,TIPOEMBARCACAO " +
            " ,NRINSCRICAO " +
            " ,NRINSTRUMENTO " +
            " FROM FISCALIZACAOEMBARCACAO " +
            " WHERE IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query02);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados = {
                    IDFrota: resultSet01[i].IDFROTA,
                    TPInscricao: resultSet01[i].TPINSCRICAO,
                    IDEmbarcacao: resultSet01[i].IDEMBARCACAO,
                    STEmbarcacao: resultSet01[i].STEMBARCACAO,
                    DTInicio: resultSet01[i].DTINICIO,
                    DTTermino: resultSet01[i].DTTERMINO,
                    TPAfretamento: resultSet01[i].TPAFRETAMENTO,
                    STRegistro: resultSet01[i].STREGISTRO,
                    IDFrotaPai: resultSet01[i].IDFROTAPAI,
                    STHomologacao: resultSet01[i].STHOMOLOGACAO,
                    NoEmbarcacao: resultSet01[i].NOEMBARCACAO,
                    NRCapitania: resultSet01[i].NRCAPITANIA,
                    TipoEmbarcacao: resultSet01[i].TIPOEMBARCACAO,
                    NRInscricao: resultSet01[i].NRINSCRICAO,
                    NRInstrumento: resultSet01[i].NRINSTRUMENTO
                }
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoEmbarcacao', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}

async function carregarFiscalizacaoFotoIrregularidadeAvulsa(id) {
    var resultSet01 = [];
    var arDados = [];
    //arDados.Foto = [];

    try {

        var query05 = "SELECT " +
            "  FISCALIZACAOFOTOIRREGULARIDADE.IDFISCALIZACAO " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.IDIRREGULARIDADE " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.IMAGEM " +
            " ,FISCALIZACAOFOTOIRREGULARIDADE.TITULO " +
            " FROM FISCALIZACAOFOTOIRREGULARIDADE " +
            " WHERE FISCALIZACAOFOTOIRREGULARIDADE.IDFISCALIZACAO = " + id;

        resultSet01 = await gestorExecuteReaderArray(query05);

        console.log(resultSet01);
        let qtd = 0;
        qtd = resultSet01.length;
        if (qtd > 0) {
            for (var i = 0; i < qtd; i++) {
                arDados[i] = {"IDIrregularidade": resultSet01[i].IDIRREGULARIDADE};
                arDados[i].Foto = {
                    "imagem": resultSet01[i].IMAGEM,
                    "titulo": resultSet01[i].TITULO
                };
            }
        }

    } catch (ex) {
        logErro('carregarFiscalizacaoFotoIrregularidadeAvulsa', ex.message, JSON.stringify({'id': id}));
    }

    return arDados;
}


async function gestorCarregarDadosAutorizada(nrinscricao, nrinstrumento, flagEnviada) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'" +
            " AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '" + nrinstrumento + "'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);

                //flagEnviada = "F";
                if (flagEnviada != "T") {
                    //...
                    //sessionStorage.setItem("dados_off", angular.toJson(arData));
                    //sessionStorage.setItem("empresa_off", angular.toJson(arData.empresas));


                    //...
                    window.location = "comum.tipo.html";

                    //window.location = "comum.tipo.naoenviada.html";
                    //window.location = "minhasfiscalizacoes.naoenviadas.listar.html";
                } else {
                    //var mensagem = '<p>Os dados desta fiscalizacao ja foram enviados!</p>';
                    //M.toast({ html: mensagem, classes: "#c62828 red darken-3" });

                    //...
                    window.location = "comum.fiscalizacaoenviada.html";
                }

            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizada', err.message, JSON.stringify({
                'nrinscricao': nrinscricao,
                'nrinstrumento': nrinstrumento,
                'flagEnviada': flagEnviada
            }));
            alert('gestorCarregarDadosAutorizada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizada', erro.message, JSON.stringify({
            'nrinscricao': nrinscricao,
            'nrinstrumento': nrinstrumento,
            'flagEnviada': flagEnviada
        }));
    } finally {
        preloaderStop();
    }
}

async function gestorCarregarDadosAutorizadaProgramada(nrinscricao) {
    try {

        nrinscricao = formatarCNPJ(nrinscricao);

        openDB();

        var query = "SELECT " +
            "  EMPRESASAUTORIZADAS.ID " +
            " ,EMPRESASAUTORIZADAS.AREAPPF " +
            " ,EMPRESASAUTORIZADAS.DSBAIRRO " +
            " ,EMPRESASAUTORIZADAS.DSENDERECO " +
            " ,EMPRESASAUTORIZADAS.DTADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.DTOUTORGA " +
            " ,EMPRESASAUTORIZADAS.EMAIL " +
            " ,EMPRESASAUTORIZADAS.INSTALACAO " +
            " ,EMPRESASAUTORIZADAS.LISTATIPOEMPRESA " +
            " ,EMPRESASAUTORIZADAS.MODALIDADE " +
            " ,EMPRESASAUTORIZADAS.NOMUNICIPIO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIAL " +
            " ,EMPRESASAUTORIZADAS.NRADITAMENTO " +
            " ,EMPRESASAUTORIZADAS.NRCEP " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSTRUMENTO " +
            " ,EMPRESASAUTORIZADAS.NOMECONTATO " +
            " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = EMPRESASAUTORIZADAS.NRINSCRICAO ) AS QTDEMBARCACAO " +
            " ,EMPRESASAUTORIZADAS.SGUF " +
            " ,EMPRESASAUTORIZADAS.TPINSCRICAO " +
            " ,EMPRESASAUTORIZADAS.NRINSCRICAOINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NORAZAOSOCIALINSTALACAO " +
            " ,EMPRESASAUTORIZADAS.NOREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRTELEFONE " +
            " ,EMPRESASAUTORIZADAS.EEREPRESENTANTE " +
            " ,EMPRESASAUTORIZADAS.NRDOCUMENTOSEI " +
            " FROM EMPRESASAUTORIZADAS " +
            " WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = '" + nrinscricao + "'";
        //+" AND EMPRESASAUTORIZADAS.NRINSTRUMENTO = '"+ nrinstrumento +"'";


        var arData = {};
        arData.empresas = [];

        /*===============================================*/
        db.transaction(async function (tx) {

            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.empresas.push({
                        //ID: res.rows.item(i).ID
                        AreaPPF: res.rows.item(i).AREAPPF,
                        DSBairro: res.rows.item(i).DSBAIRRO,
                        DSEndereco: res.rows.item(i).DSENDERECO,
                        DTAditamento: res.rows.item(i).DTADITAMENTO,
                        DTOutorga: res.rows.item(i).DTOUTORGA,
                        Email: res.rows.item(i).EMAIL,
                        Instalacao: res.rows.item(i).INSTALACAO,
                        ListaTipoEmpresa: res.rows.item(i).LISTATIPOEMPRESA,
                        Modalidade: res.rows.item(i).MODALIDADE,
                        NOMunicipio: res.rows.item(i).NOMUNICIPIO,
                        NORazaoSocial: res.rows.item(i).NORAZAOSOCIAL,
                        NRAditamento: res.rows.item(i).NRADITAMENTO,
                        NRCEP: res.rows.item(i).NRCEP,
                        NRInscricao: res.rows.item(i).NRINSCRICAO,
                        NRInstrumento: res.rows.item(i).NRINSTRUMENTO,
                        NomeContato: res.rows.item(i).NOMECONTATO,
                        QTDEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                        SGUF: res.rows.item(i).SGUF,
                        TPInscricao: res.rows.item(i).TPINSCRICAO,
                        NRInscricaoInstalacao: res.rows.item(i).NRINSCRICAOINSTALACAO,
                        NORazaoSocialInstalacao: res.rows.item(i).NORAZAOSOCIALINSTALACAO,
                        NOREpresentante: res.rows.item(i).NOREPRESENTANTE,
                        NRTelefone: res.rows.item(i).NRTELEFONE,
                        EERepresentante: res.rows.item(i).EEREPRESENTANTE,
                        NRDocumentoSEI: res.rows.item(i).NRDOCUMENTOSEI
                    });
                }

                //...
                //$scope.empresas = arData;
                console.log(arData.empresas);

                //...
                angular.forEach(arData.empresas, function (value, key) {
                    arData = verificaAutorizacao(arData, key);
                });

                console.log(arData.empresas);

                var arEmpresa = {};
                arEmpresa = arData.empresas[0];

                sessionStorage.removeItem("arEmpresa");
                sessionStorage.setItem("arEmpresa", angular.toJson(arEmpresa));

                console.log(arEmpresa);


                //...
                window.location = "comum.tipo.html";


            });


        }, function (err) {
            logErro('gestorCarregarDadosAutorizadaProgramada', err.message, JSON.stringify({'nrinscricao': nrinscricao}));
            alert('gestorCarregarDadosAutorizadaProgramada: An error occured while displaying saved notes');
        });
    } catch (erro) {
        logErro('gestorCarregarDadosAutorizadaProgramada', erro.message, JSON.stringify({'nrinscricao': nrinscricao}));
    } finally {
        preloaderStop();
    }
}


function gestorCarregarDados() {
    try {
        openDB();

        var query = "SELECT " +
            " FISCALIZACAO.IDFISCALIZACAO " +
            ", FISCALIZACAO.DATA " +
            ", FISCALIZACAO.CNPJAUTORIZADA " +
            ", FISCALIZACAO.FLAGENVIADA " +
            ", FISCALIZACAOEMPRESA.NORAZAOSOCIAL " +
            " FROM FISCALIZACAO " +
            " JOIN FISCALIZACAOEMPRESA ON FISCALIZACAO.IDFISCALIZACAO = FISCALIZACAOEMPRESA.IDFISCALIZACAO ";

        var arData = [];


        db.transaction(function (tx) {
            tx.executeSql(query, [], function (tx, res) {

                for (var i = 0; i < res.rows.length; i++) {
                    arData.push({NORAZAOSOCIAL: res.rows.item(i).NORAZAOSOCIAL});
                }

                dataFiscalizacoesNaoEnviadas = arData;

                sessionStorage.setItem("dados_off", angular.toJson(localizacao));
            });
        }, function (err) {
            logErro('gestorCarregarDados', err.message);
            alert("An error occured while displaying saved notes");
        });
    } catch (erro) {
        logErro('gestorCarregarDados', erro.message);
    } finally {
        //preloaderStop();
    }
}

function gestorTesteIrregularidades(arIrregularidades) {
    var ordem = 0;
    for (var i = 0; i < arIrregularidades.length; i++) {
        arIrregularidades[i].IDIrregularidade
    }
}


function gestorGetDataFiscalizacoes() {

    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    dataFiscalizacoesNaoEnviadas.push({
                        IDFISCALIZACAO: resultSet.rows.item(x).IDFISCALIZACAO,
                        DATA: resultSet.rows.item(x).DATA,
                        CNPJAUTORIZADA: resultSet.rows.item(x).CNPJAUTORIZADA,
                    });
                }
            },
            function (tx, error) {
                logErro('gestorGetDataFiscalizacoes SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorGetDataFiscalizacoes transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function gestorPegarDados() {
    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    dataFiscalizacoesNaoEnviadas.push({
                        IDFISCALIZACAO: resultSet.rows.item(x).IDFISCALIZACAO,
                        DATA: resultSet.rows.item(x).DATA,
                        CNPJAUTORIZADA: resultSet.rows.item(x).CNPJAUTORIZADA,
                    });
                }
            },
            function (tx, error) {
                logErro('gestorPegarDados SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorPegarDados transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });

    return dataFiscalizacoesNaoEnviadas;
}

function gestorGetData() {

    openDB();

    db.transaction(function (tx) {

        var query = "SELECT IDFISCALIZACAO, DATA, CNPJAUTORIZADA FROM FISCALIZACAO";

        tx.executeSql(query, [], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    console.log("First name: " + resultSet.rows.item(x).IDFISCALIZACAO +
                        ", Acct: " + resultSet.rows.item(x).CNPJAUTORIZADA);
                }
            },
            function (tx, error) {
                logErro('gestorGetData SELECT', error.message);
            });
    }, function (error) {
        logErro('gestorGetData transaction', error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function gestorGetData2(last) {

    db.transaction(function (tx) {

        var query = "SELECT firstname, lastname, acctNo FROM customerAccounts WHERE lastname = ?";

        tx.executeSql(query, [last], function (tx, resultSet) {

                for (var x = 0; x < resultSet.rows.length; x++) {
                    console.log("First name: " + resultSet.rows.item(x).firstname +
                        ", Acct: " + resultSet.rows.item(x).acctNo);
                }
            },
            function (tx, error) {
                console.log('SELECT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}


function gestorSalvarDadosFiscalizacao_OLD(arFiscalizacao, CheckList, IrregularidadeEncontrada) {
    try {

        openDB();

        db.transaction(function (tx) {
            // ...
            tx.executeSql('CREATE TABLE IF NOT EXISTS FISCALIZACAO (IDFISCALIZACAO INTEGER NOT NULL, DATA VARCHAR, CNPJAUTORIZADA VARCHAR, PRIMARY KEY ( IDFISCALIZACAO ) );');

            tx.executeSql("DELETE FROM FISCALIZACAO;");

            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [1, '12/06/2019', '99999999999999']);
            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [2, '12/06/2019', '99999999999999']);
            tx.executeSql("INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);", [3, '12/06/2019', '99999999999999']);

        }, function (error) {
            console.log('transaction error: ' + error.message);
        }, function () {
            console.log('transaction ok');
        });
    } catch (err) {
        alert('gestorSalvarFiscalizacao: ' + err.message);
    }
}

function pegarIdTabela() {

    var ID = 0;

    try {
        openDB();

        //todo: db não possui executeSql, apenas o tx (comentário abaixo)
        db.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], function (rs) {
            console.log('Record count (expected to be 2): ' + res.rows.item(0).mycount);
            ID = rs.rows.item(0).mycount;
        }, function (error) {
            console.log('SELECT SQL statement ERROR: ' + error.message);
        });

        if (ID == 0) {
            ID = 1;
        }
        /*
                db.transaction(function (tx) {
                    tx.executeSql('SELECT MAX(IDFISCALIZACAO) + 1 AS mycount FROM FISCALIZACAO', [], function(rs) {
                        console.log('Record count (expected to be 2): ' + res.rows.item(0).mycount);
                        ID = rs.rows.item(0).mycount;
                    }, function(error) {
                        console.log('SELECT SQL statement ERROR: ' + error.message);
                    });

                    if (ID == 0) {
                        ID = 1;
                    }
                }, function(err){
                    alert('pegarIdTabela: An error occured while getting idTabela');
                });
        */
    } catch (err) {
        alert('pegarIdTabela: ' + err.message);
    }

    return ID;
}

function inserirFiscalizacao(idfiscalizacao, data, cnpjautorizada) {

    openDB();

    db.transaction(function (tx) {

        var query = "INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?);";

        tx.executeSql(query, [idfiscalizacao, data, cnpjautorizada], function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (tx, error) {
                console.log('INSERT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function addItem(first, last, acctNum) {

    openDB();

    db.transaction(function (tx) {

        var query = "INSERT INTO FISCALIZACAO (IDFISCALIZACAO, DATA, CNPJAUTORIZADA) VALUES (?,?,?)";

        tx.executeSql(query, [idfiscalizacao, data, cnpjautorizada], function (tx, res) {
                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
            },
            function (tx, error) {
                console.log('INSERT error: ' + error.message);
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

function verificaAutorizacaoFiscalizacao(unidade) {

    let flagSomenteConsulta = true;

    switch (unidade) {
        case 'SFC':
        case 'GFP':
        case 'GFN':
        case 'GPF':
        case 'URESP':
        case 'URERJ':
        case 'UREFL':
        case 'UREBL':
        case 'UREMN':
        case 'URERE':
        case 'UREPV':
        case 'UREFT':
        case 'URESV':
        //case 'UREPR':  --ESSA URE MODOU DE NOME PARA URECB - Conforme Victor Heimburger 12/02/2020
        case 'URECB':
        case 'UREPL':
        case 'URECO':
        case 'UREVT':
        case 'URESL':
            flagSomenteConsulta = false;
            break;
    }


    if (flagSomenteConsulta == true) {
        console.log("USUARIO DE CONSULTA");
    } else {
        console.log("USUARIO DE FISCALIZACAO");
    }

    return flagSomenteConsulta;
}


/*=============================================================
                            DASHBOARD
=============================================================*/
async function gestorCarregarDadosDashBoard() {
    try {

        let qtdEmpresas = 0;
        let qtdAutorgas = 0;
        let qtdMaritima = 0;
        let qtdInterior = 0;
        let qtdPorto = 0;
        let ArQtdModalidade = [];

        qtdEmpresas = await pegarQtdEmpresas();
        qtdAutorgas = await pegarQtdAutorgas();
        qtdMaritima = await pegarQtdMaritima();
        qtdInterior = await pegarQtdInterior();
        qtdPorto = await pegarQtdPorto();

        ArQtdModalidade = await pegarQtdPorModalidade();

        let dadosTemp = {
            QtdEmpresas: qtdEmpresas,
            QtdAutorgas: qtdAutorgas,
            QtdMaritima: qtdMaritima,
            QtdInterior: qtdInterior,
            QtdPorto: qtdPorto,
            Modalidades: ArQtdModalidade
        };


        sessionStorage.removeItem("arDashBoard");
        sessionStorage.setItem("arDashBoard", angular.toJson(dadosTemp));

        console.log(dadosTemp)

        //await gestorSalvarFiscalizacaoIrregularidades(ID, arIrregularidades);
        //await gestorSalvarFiscalizacaoEquipe(ID, arEquipe);
        //await gestorSalvarFiscalizacaoTrecho(ID, arTrecho);
        //await gestorSalvarFiscalizacaoCheckList(ID, arPerguntas);
        //await gestorSalvarFiscalizacaoQuestionario(ID, arQuestionario);
        //await gestorSalvarFiscalizacaoFotos(ID, arRotina);
        //await gestorSalvarFiscalizacaoEvidencia(ID, arEvidencias);


    } catch (err) {
        alert('gestorCarregarDadosDashBoard: ' + err.message);
    }
}

async function pegarQtdEmpresas() {

    let qtdEmpresas = 0;

    try {
        qtdEmpresas = await gestorExecuteReaderInteger('SELECT COUNT(DISTINCT NRINSCRICAO) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdEmpresas == null) {
            qtdEmpresas = 0;
        }
    } catch (err) {
        alert('pegarQtdEmpresas: ' + err.message);
    }

    return qtdEmpresas;
}

async function pegarQtdAutorgas() {

    let qtdAutorgas = 0;

    try {
        qtdAutorgas = await gestorExecuteReaderInteger('SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS');
        if (qtdAutorgas == null) {
            qtdAutorgas = 0;
        }
    } catch (err) {
        alert('pegarQtdAutorgas: ' + err.message);
    }

    return qtdAutorgas;
}

async function pegarQtdMaritima() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdInterior() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";

        query += ") ";

        query += " GROUP BY NRINSCRICAO, MODALIDADE ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdPorto() {

    let qtd = 0;

    try {
        let query = "SELECT COUNT(*) as mycount FROM EMPRESASAUTORIZADAS WHERE upper(MODALIDADE) ";
        query += "NOT IN ("

        query += "  'LONGITUDINAL MISTO' ";
        query += " ,'LONGITUDINAL DE PASSAGEIROS' ";
        query += " ,'LONGITUDINAL DE CARGAS' ";
        query += " ,'TRAVESSIA' ";
        query += " ,'APOIO MARITIMO' ";
        query += " ,'APOIO PORTUARIO' ";
        query += " ,'CABOTAGEM' ";
        query += " ,'LONGO CURSO' ";

        query += ") ";

        qtd = await gestorExecuteReaderInteger(query);
        if (qtd == null) {
            qtd = 0;
        }
    } catch (err) {
        alert('pegarQtdMaritima: ' + err.message);
    }

    return qtd;
}

async function pegarQtdPorModalidade() {

    let arDados = 0;

    try {
        var query = "SELECT SUM(mycount) as mycount, MODALIDADE, AREAPPF, TIPO FROM ( ";

        query += " SELECT 1 AS ORDEM, COUNT(*) as mycount, 'Porto Publico' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Porto Publico%') ";
        query += " UNION ALL ";
        query += " SELECT 2 AS ORDEM, COUNT(*) as mycount, 'Arrendamento' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Arrendamento%') ";
        query += " UNION ALL ";
        query += " SELECT 3 AS ORDEM, COUNT(*) as mycount, 'Contrato de Transicao' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Transicao%') ";
        query += " UNION ALL ";
        query += " SELECT 4 AS ORDEM, COUNT(*) as mycount, 'Contrato de Passagem' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Passagem%') ";
        query += " UNION ALL ";
        query += " SELECT 5 AS ORDEM, COUNT(*) as mycount, 'Contrato de Uso Temporario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Contrato de Uso Temporario%') ";
        query += " UNION ALL ";
        query += " SELECT 6 AS ORDEM, COUNT(*) as mycount, 'Operador Portuario' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Operador Portuario%') ";
        query += " UNION ALL ";
        query += " SELECT 7 AS ORDEM, COUNT(*) as mycount, 'Terminal de uso privado' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Terminal de uso privado%') ";
        query += " UNION ALL ";
        query += " SELECT 8 AS ORDEM, COUNT(*) as mycount, 'Estacao de transbordo de cargas' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Estacao de transbordo de cargas%') ";
        query += " UNION ALL ";
        query += " SELECT 9 AS ORDEM, COUNT(*) as mycount, 'Instalacao portuaria de turismo' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Instalacao portuaria de turismo') ";
        query += " UNION ALL ";

        query += " SELECT 10 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro') ";
        query += " UNION ALL ";
        query += " SELECT 11 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estacao de transbordo de cargas') ";
        query += " UNION ALL ";
        query += " SELECT 12 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao para transferencia de petroleo') ";
        query += " UNION ALL ";
        query += " SELECT 13 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao temporaria') ";
        query += " UNION ALL ";
        query += " SELECT 14 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao flutuante') ";
        query += " UNION ALL ";
        query += " SELECT 15 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Terminal de uso privado') ";
        query += " UNION ALL ";
        query += " SELECT 16 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro ate 1.000 TPB') ";
        query += " UNION ALL ";
        query += " SELECT 17 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao portuaria publica de pequeno porte') ";
        query += " UNION ALL ";
        query += " SELECT 18 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao rudimentar') ";
        query += " UNION ALL ";
        query += " SELECT 19 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Estaleiro') ";
        query += " UNION ALL ";
        query += " SELECT 20 AS ORDEM, COUNT(*) as mycount, 'Registro' AS MODALIDADE, AREAPPF, 'P' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Registro - Instalacao de apoio') ";
        query += " UNION ALL ";

        query += " SELECT 21 AS ORDEM, COUNT(*) as mycount, 'Longo Curso' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Longo Curso%')";
        query += " UNION ALL ";
        query += " SELECT 22 AS ORDEM, COUNT(*) as mycount, 'Cabotagem' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Cabotagem%') ";
        query += " UNION ALL ";
        query += " SELECT 23 AS ORDEM, COUNT(*) as mycount, 'Apoio Maritimo' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Maritimo%') ";
        query += " UNION ALL ";
        query += " SELECT 24 AS ORDEM, COUNT(*) as mycount, 'Apoio Portuario' AS MODALIDADE, AREAPPF, 'NM' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Apoio Portuario%') ";
        query += " UNION ALL ";


        query += " SELECT 26 AS ORDEM, 1 as mycount, 'Longitudinal de Carga' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Carga')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 27 AS ORDEM, 1 as mycount, 'Longitudinal de Passageiros' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal de Passageiros')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 28 AS ORDEM, 1 as mycount, 'Longitudinal Misto' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Longitudinal Misto')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";
        query += " UNION ALL ";
        query += " SELECT 29 AS ORDEM, 1 as mycount, 'Travessia' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) = UPPER('Travessia')  GROUP BY NRINSCRICAO, MODALIDADE, NRINSTRUMENTO ";

        //query += " UNION ALL ";
        //query += " SELECT 30 AS ORDEM, COUNT(*) as mycount, 'Embarcacao em Construcao' AS MODALIDADE, AREAPPF, 'NI' AS TIPO FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('%Embarcacao em Construcao%') ";


        //query += " UNION ALL ";
        //query += " SELECT COUNT(*) as mycount, 'Interior' AS MODALIDADE, AREAPPF FROM EMPRESASAUTORIZADAS WHERE UPPER(MODALIDADE) LIKE UPPER('Interior') ";


        query += " ) where mycount > 0 GROUP BY MODALIDADE, AREAPPF ORDER BY ORDEM ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = 0;
        }
    } catch (err) {
        alert('pegarQtdPorModalidade: ' + err.message);
    }

    return arDados;
}

/*=============================================================*/


/*=============================================================
                            RELATORIO MOBILE
=============================================================*/
async function gestorCarregarDadosRelatorioUsuario() {
    try {

        let ArFiscalizacoesRealizadas = [];
        let ArEmpresasFiscalizadas = [];
        let ArFiscalizacoes = [];

        ArFiscalizacoesRealizadas = await pegarQtdFiscalizacoesRealizadas();
        ArEmpresasFiscalizadas = await pegarQtdEmpresasFiscalizadas();
        ArFiscalizacoes = await pegarQtdFiscalizacoes();

        let dadosTemp = {
            FiscalizacoesRealizadas: ArFiscalizacoesRealizadas,
            EmpresasFiscalizadas: ArEmpresasFiscalizadas,
            Fiscalizacoes: ArFiscalizacoes,
        };

        sessionStorage.removeItem("arRelatorioUsuario");
        sessionStorage.setItem("arRelatorioUsuario", angular.toJson(dadosTemp));

        console.log(dadosTemp)
    } catch (err) {
        alert('gestorCarregarDadosRelatorioUsuario: ' + err.message);
    }
}

async function pegarQtdFiscalizacoesRealizadas() {

    let arDados = [];

    try {
        let query = "SELECT QTDAUTOINFRACAO, QTDNOTIFICACAO, QTEXTRAORDINARIA, QTAPARTADO, QTROTINA, QTPROGRAMADA, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdFiscalizacoesRealizadas: ' + err.message);
    }

    return arDados;
}

async function pegarQtdEmpresasFiscalizadas() {

    let arDados = [];

    try {
        let query = "SELECT SUM(QTDEMPRESAFISCALIZADAINTERIOR) AS QTDINTERIOR, SUM(QTDEMPRESAFISCALIZADAMARITIMA) AS QTDMARITIMA, SUM(QTDEMPRESAFISCALIZADAPORTO) AS QTDPORTO, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "GROUP BY NRMES, NRANO ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdEmpresasFiscalizadas: ' + err.message);
    }

    return arDados;
}

async function pegarQtdFiscalizacoes() {

    let arDados = [];

    try {
        let query = "SELECT SUM(QTDFISCALIZACAOAUTOINFRACAO) AS QTDAUTOINFRACAO, SUM(QTDFISCALIZACAONOTIFICACAO) AS QTDNOTIFICACAO, ";
        query += "PRINTF('%02d', NRMES) AS NRMES, PRINTF('%02d', NRANO) AS NRANO ";
        query += "FROM FISCALIZACOESREALIZADAS ";
        query += "GROUP BY NRMES, NRANO ";
        query += "ORDER BY NRANO, NRMES ";

        arDados = await gestorExecuteReaderArray(query);
        if (arDados == null) {
            arDados = [];
        }
    } catch (err) {
        alert('pegarQtdFiscalizacoes: ' + err.message);
    }

    return arDados;
}

/*=============================================================*/


/*==============================================================*/
async function gestorExecuteReaderInteger(sqlQuery) {

    let qtd = 0;

    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {
                    if (rs.rows.length > 0) {
                        qtd = rs.rows.item(0).mycount;
                    }

                    if (qtd == null) {
                        qtd = 0;
                    }

                    resolve(true);

                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReader: ' + err.message);
    }

    return qtd;
}

async function gestorExecuteReaderString(sqlQuery) {

    let valor = "";

    try {
        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {

                    valor = rs.rows.item(0).VALOR;
                    if (valor == null) {
                        valor = "";
                    }
                    resolve(true);

                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            await firstFunction
        }

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReaderString: ' + err.message);
    }

    return valor;
}

async function gestorExecuteReaderArray(sqlQuery) {

    var resultSet = [];

    try {

        openDB();

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {

                tx.executeSql(sqlQuery, [], async function (tx, rs) {

                    for (var x = 0; x < rs.rows.length; x++) {
                        resultSet.push(rs.rows.item(x));
                    }

                    resolve(true);
                }, async function (error) {
                    console.log('transaction error: ' + error.message);
                    resolve(true);
                }, async function () {
                    console.log('transaction ok');
                    resolve(true);
                });
            })

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorExecuteReader: ' + err.message);
    }

    return resultSet;
}

function exportDadosEmpresa(nomeArquivo, searchTerm, modalidade, empresas) {
    let columns = ["Área", "Tipo de Serviço", "CNPJ", "Razão Social", "Instalação/Trecho/Linha", "Nº Outorga", "Data de Outorga", "UF", "Município", "CNPJ Instalação", "Razão Social Instalação"];
    if (!empresas) {
        openDB();
        db.transaction(function (tx) {

            var params = [],
                statement =
                    " select " +
                    "     empresa.AREAPPF 'Área', " +
                    "     empresa.MODALIDADE 'Tipo de Serviço', " +
                    "     empresa.NRINSCRICAO 'CNPJ', " +
                    "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                    "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                    "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                    "     CASE                                                       " +
                    "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                    "       ELSE empresa.DTOUTORGA " +
                    "     END AS 'Data de Outorga',                                   " +
                    "     empresa.SGUF 'UF', " +
                    "     empresa.NOMUNICIPIO 'Município', " +
                    "     empresa.NRINSCRICAOINSTALACAO 'CNPJ Instalação', " +
                    "     empresa.NORAZAOSOCIALINSTALACAO 'Razão Social Instalação' " +
                    " from EMPRESASAUTORIZADAS empresa " +
                    " where 1=1" +
                    "     and empresa.NRINSCRICAO is not null " +
                    '     and empresa.NRINSCRICAO <> "" ';

            if (modalidade && modalidade != "undefined") {
                statement += " and empresa.MODALIDADE = ? ";
                params.push(modalidade);
            }
            if (searchTerm && searchTerm != "undefined") {
                statement +=
                    " and (empresa.NRINSCRICAO like ? or upper(empresa.NORAZAOSOCIAL) like upper(?)) ";
                params.push(searchTerm);
                params.push("%" + searchTerm + "%");
            }
            tx.executeSql(statement, params, function (tx, results) {
                var rows = [];
                for (let i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    if (row["CNPJ Instalação"] && row["CNPJ"] != row["CNPJ Instalação"]) {
                        row["CNPJ Instalação"] = mCNPJ(row["CNPJ Instalação"]);
                    } else {
                        row["CNPJ Instalação"] = "";
                        row["Razão Social Instalação"] = "";
                    }
                    row["CNPJ"] = mCNPJ(row["CNPJ"]);
                    row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                    rows.push(row);
                }
                triggerXlsxDownload(rows, nomeArquivo);
            }, (e) => {
                console.log(e);
            });
        });
        return;
    }

    let treatedArray = empresas.map((e) => {
        let cnpj = mCNPJ(e.NRInscricao);
        let cnpjInstalacao = "";
        let razaoSocialInstalacao = "";
        if (e.NRInscricaoInstalacao && e.NRInscricao != e.NRInscricaoInstalacao) {
            cnpjInstalacao = mCNPJ(e.NRInscricaoInstalacao);
            razaoSocialInstalacao = e.NORazaoSocialInstalacao;
        }

        let dtOutorga = (e.Modalidade && e.Modalidade == 'Porto Publico') ? 'NULL' : (e.DTOutorga ? formatDate(e.DTOutorga, "pt-br") : 'NULL');
        return {
            "Área": e.AreaPPF,
            "Tipo de Serviço": e.Modalidade,
            "CNPJ": cnpj,
            "Razão Social": e.NORazaoSocial,
            "Instalação/Trecho/Linha": e.Instalacao,
            "Nº Outorga": e.NRInstrumento,
            "Data de Outorga": dtOutorga,
            "UF": e.SGUF,
            "Município": e.NOMunicipio,
            "CNPJ Instalação": cnpjInstalacao,
            "Razão Social Instalação": razaoSocialInstalacao,
        }
    })

    triggerXlsxDownload(treatedArray, nomeArquivo);

}

function exportDadosDetalhados(cnpj, nrinstrumento) {
    openDB();
    db.transaction(function (tx) {
        var params = [],
            statement =
                " select " +
                "     empresa.AREAPPF 'Área', " +
                "     empresa.MODALIDADE 'Tipo de Serviço', " +
                "     empresa.NRINSCRICAO 'CNPJ', " +
                "     empresa.NORAZAOSOCIAL 'Razão Social', " +
                "     empresa.INSTALACAO 'Instalação/Trecho/Linha', " +
                "     empresa.NRINSTRUMENTO 'Nº Outorga', " +
                "     CASE                                                       " +
                "       WHEN empresa.MODALIDADE LIKE 'Porto Publico' THEN 'NULL' " +
                "       ELSE empresa.DTOUTORGA " +
                "     END AS 'Data de Outorga',                                   " +
                "     empresa.SGUF 'UF', " +
                "     empresa.NOMUNICIPIO 'Município', " +
                "     frota.NOME 'Embarcação', " +
                "     frota.STATUS 'Status' " +
                " from EMPRESASAUTORIZADAS empresa  " +
                " left join ( select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADA " +
                " union " +
                " select NOEMBARCACAO NOME, NRINSCRICAO, STHOMOLOGACAO STATUS, NRINSTRUMENTO FROM FROTAALOCADAMARITIMA ) " +
                " frota on frota.NRINSCRICAO = empresa.NRINSCRICAO " +
                " where 1=1 ";
        if (cnpj && cnpj != "undefined") {
            statement += " and empresa.NRINSCRICAO = ? ";
            params.push(cnpj);
        }
        if (nrinstrumento && nrinstrumento != "undefined") {
            statement += " and empresa.NRINSTRUMENTO = ? ";
            params.push(nrinstrumento);
        }
        tx.executeSql(statement, params, function (tx, results) {
            var rows = [];
            for (let i = 0; i < results.rows.length; i++) {
                var row = results.rows.item(i);
                row["CNPJ"] = mCNPJ(row["CNPJ"]);
                row["Data de Outorga"] = row["Data de Outorga"] ? formatDate(row["Data de Outorga"], "pt-br") : 'NULL';
                rows.push(row);
            }
            triggerXlsxDownload(rows, nomeAPK() + "-Detalhes_Empresa");
        });
    });
}

function triggerXlsxDownload(content, fileName) {

    if (window.cordova.platformId === "browser") {
        var encodedUri =
            "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + content);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
    } else {
        downloadFile(fileName, content);
    }
}

function downloadFile(fileName, content) {
    var fileURL =
        cordova.file.externalApplicationStorageDirectory + "Download/" + fileName + '.xlsx';
    var uri = createXlsx(content, fileName);
    var fileTransfer = new FileTransfer();
    var mensagem = '<p> Iniciando Download... </p>';
    M.toast({html: mensagem, classes: "#c62828 green darken-3"});
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download completo");
            var mensagem = '<p> Download Completo! </p>';
            M.toast({html: mensagem, classes: "#c62828 green darken-3"});
            cordova.plugins.fileOpener2.open(fileURL, "application/vnd.ms-excel", {
                error: function () {
                },
                success: function () {
                },
            });
        },
        function (error) {
            console.log(error);
            var mensagem = '<p> Ocorreu um erro ao baixar o arquivo </p>';
            M.toast({html: mensagem, classes: "#c62828 red darken-3"});
        }
    );

}


function createXlsx(data, sheetName) {
    let sheet = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, sheetName);

    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    var out = XLSX.write(wb, {type: 'base64'});
    return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + out;
}

function retornarBit(campo) {
    return campo ? '1' : '0';
}


// ---- gestorCarregarEsquemasOperacionaisPesquisa ----
function gestorCarregarEsquemasOperacionaisPesquisa(sentido, partida, destino) {
    let arData = [];

    try {

        openDB();

        var query = "SELECT ";
        query += "  ESQUEMASOPERACIONAIS.ID ";
        query += " ,ESQUEMASOPERACIONAIS.NRINSCRICAO ";
        query += " ,ESQUEMASOPERACIONAIS.SENTIDO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDAPORTO ";
        query += " ,ESQUEMASOPERACIONAIS.PARTIDADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.UFPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.PORTOCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CHEGADADIASEMANA ";
        query += " ,ESQUEMASOPERACIONAIS.HRCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.UFCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONALITINERARIO ";
        query += " ,ESQUEMASOPERACIONAIS.IDESQUEMAOPERACIONAL ";
        query += " ,ESQUEMASOPERACIONAIS.STIDAVOLTA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDEPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANAPARTIDA ";
        query += " ,ESQUEMASOPERACIONAIS.CDLOCALCHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLATITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.VLLONGITUDECHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.CDSEMANACHEGADA ";
        query += " ,ESQUEMASOPERACIONAIS.NRORDEM ";
        query += " ,(SELECT EMPRESASAUTORIZADAS.NORAZAOSOCIAL FROM EMPRESASAUTORIZADAS WHERE EMPRESASAUTORIZADAS.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO LIMIT 1) AS NORAZAOSOCIAL ";
        query += " ,(SELECT COUNT(*) AS QTDEMBARCACAO FROM FROTAALOCADA WHERE FROTAALOCADA.NRINSCRICAO = ESQUEMASOPERACIONAIS.NRINSCRICAO ) AS QTDEMBARCACAO ";
        query += " FROM ESQUEMASOPERACIONAIS ";


        query += " WHERE ESQUEMASOPERACIONAIS.SENTIDO = '" + sentido + "'";

        //+" LIMIT 70 ";


        var d = new Date();
        var dia = d.getDay();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let linha = res.rows.length;
                    for (var i = 0; i < linha; i++) {
                        var tema = null;
                        var temaCor = null;
                        if (res.rows.item(i).SENTIDO == "Ida") {
                            tema = '#74A2DC';
                            temaCor = 'cortemapartida';
                        } else {
                            tema = '#31445C';
                            temaCor = 'cortema';
                        }

                        //let diaSemana = res.rows.item(i).CDSEMANAPARTIDA;
                        //let diaSemanaChegada = res.rows.item(i).CDSEMANACHEGADA;

                        let nomeDiaSemana;
                        let nomeDiaSemanaChegada;

                        //if(dia == diaSemana ) {
                        //    nomeDiaSemana = "Hoje";
                        //} else {
                        nomeDiaSemana = res.rows.item(i).PARTIDADIASEMANA;
                        //}

                        //if(dia == diaSemanaChegada ) {
                        //    nomeDiaSemanaChegada = "Hoje";
                        //} else {
                        nomeDiaSemanaChegada = res.rows.item(i).CHEGADADIASEMANA;
                        //}


                        //...
                        arData.push({
                            id: (res.rows.item(i).ID + 1) //"2618-3156"
                            ,
                            price: (res.rows.item(i).ID + 1),
                            requests: 5,
                            pledge: 150,
                            weight: 50,
                            sender: res.rows.item(i).NORAZAOSOCIAL
                            //, sender: 'Empresa Autorizada'
                            ,
                            senderImg: 'img/icon-consultar.png',
                            themeColor: temaCor,
                            themeColorHex: tema,
                            bgImgUrl: 'img/fundo.png',
                            rating: 5,
                            ratingCount: 26,
                            fromStreet: res.rows.item(i).PARTIDAPORTO
                            //, fromStreet: 'Mácapa'
                            ,
                            fromCity: res.rows.item(i).UFPARTIDA
                            //, fromCity: 'Pará, PA 10025'
                            ,
                            toStreet: res.rows.item(i).PORTOCHEGADA
                            //, toStreet: 'Almeirim'
                            ,
                            toCity: res.rows.item(i).UFCHEGADA
                            //, toCity: 'Santarém, PA 11101'
                            ,
                            delivTime: res.rows.item(i).HRPARTIDA
                            //, delivTime: '06:30 pm'
                            ,
                            delivDate: 'Maio 16, 2015'
                            //, delivDateNoun: 'Hoje'
                            ,
                            delivDateNoun: nomeDiaSemana,
                            reqDl: '24 minutes',
                            latFrom: res.rows.item(i).VLLATITUDEPARTIDA,
                            longFrom: res.rows.item(i).VLLONGITUDEPARTIDA,
                            latTo: res.rows.item(i).VLLATITUDECHEGADA,
                            longTo: res.rows.item(i).VLLONGITUDECHEGADA,
                            qtdEmbarcacao: res.rows.item(i).QTDEMBARCACAO,
                            ordem: res.rows.item(i).NRORDEM,
                            horaChegada: res.rows.item(i).HRCHEGADA,
                            diasemanachegada: nomeDiaSemanaChegada,
                            sentido: res.rows.item(i).SENTIDO
                        });
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorCarregarEsquemasOperacionaisPesquisa', err.message, JSON.stringify({
                    'sentido': sentido,
                    'partida': partida,
                    'destino': destino
                }));
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarEsquemasOperacionaisPesquisa', erro.message, JSON.stringify({
            'sentido': sentido,
            'partida': partida,
            'destino': destino
        }));
    }

    return arData;
}


// ---- gestorCarregarFrotaAlocadaListarWeb ----
function gestorCarregarFrotaAlocadaListarWeb($http) {
    try {
        $http({
            url: urlService() + 'ListarFrotaAlocada',
            method: "POST",
            data: ''
        })
            .then(function (response) {
                if (response.status == 200) {
                    //...
                    openDB();

                    //...
                    db.transaction(function (tx) {
                        //...
                        tx.executeSql("DELETE FROM FROTAALOCADA");

                        //...
                        var dados = response.data.d;

                        //...
                        angular.forEach(dados, function (value, key) {
                            //...
                            var cgc = formatarCNPJ(dados[key].NRInscricao);

                            //...
                            var query = "INSERT INTO FROTAALOCADA ( " +
                                "  ID" +
                                " ,IDFROTA " +
                                " ,TPINSCRICAO " +
                                " ,IDEMBARCACAO " +
                                " ,STEMBARCACAO " +
                                " ,DTINICIO " +
                                " ,DTTERMINO " +
                                " ,TPAFRETAMENTO " +
                                " ,STREGISTRO " +
                                " ,IDFROTAPAI " +
                                " ,STHOMOLOGACAO " +
                                " ,NOEMBARCACAO " +
                                " ,NRCAPITANIA " +
                                " ,TIPOEMBARCACAO " +
                                " ,NRINSCRICAO " +
                                " ,NRINSTRUMENTO " +
                                " ) " +
                                " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                            tx.executeSql(query, [
                                key, dados[key].IDFrota, dados[key].TPInscricao, dados[key].IDEmbarcacao, dados[key].STEmbarcacao, dados[key].DTInicio, dados[key].DTTermino, dados[key].TPAfretamento, dados[key].STRegistro, dados[key].IDFrotaPai, dados[key].STHomologacao, dados[key].NoEmbarcacao, dados[key].NRCapitania, dados[key].TipoEmbarcacao, cgc, dados[key].NRInstrumento
                            ]);
                        });

                        //...
                        gestorMarcarAtualizacao("FROTAALOCADA");

                        //...
                        gestorCarregarProgramadasWeb($http);

                        //...
                        gestorFecharNotificacao(idSincAutorizadas, 'Sincronizando dados', 'Os dados foram atualizados', 'T');

                        //...
                        preloaderStop();

                        idSincFinalizar = 1;
                    });
                }
            }).catch(function () {
            preloaderStop();
            idSincFinalizar = 2;
        });
    } catch (erro) {
        logErro('gestorCarregarFrotaAlocadaListarWeb', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
        idSincFinalizar = 2;
    }
}


// ---- gestorCarregarFrotaAlocadaListarWebAsinc ----
function gestorCarregarFrotaAlocadaListarWebAsinc($http) {
    try {
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            $http({
                url: urlService() + 'ListarFrotaAlocada',
                method: "POST",
                data: ''
            })
                .then(async function (response) {
                    if (response.status == 200) {
                        //...
                        openDB();

                        //...
                        db.transaction(async function (tx) {
                            //...
                            tx.executeSql("DELETE FROM FROTAALOCADA");

                            //...
                            var dados = response.data.d;

                            //...
                            angular.forEach(dados, async function (value, key) {
                                //...
                                var cgc = formatarCNPJ(dados[key].NRInscricao);

                                //...
                                var query = "INSERT INTO FROTAALOCADA ( " +
                                    "  ID" +
                                    " ,IDFROTA " +
                                    " ,TPINSCRICAO " +
                                    " ,IDEMBARCACAO " +
                                    " ,STEMBARCACAO " +
                                    " ,DTINICIO " +
                                    " ,DTTERMINO " +
                                    " ,TPAFRETAMENTO " +
                                    " ,STREGISTRO " +
                                    " ,IDFROTAPAI " +
                                    " ,STHOMOLOGACAO " +
                                    " ,NOEMBARCACAO " +
                                    " ,NRCAPITANIA " +
                                    " ,TIPOEMBARCACAO " +
                                    " ,NRINSCRICAO " +
                                    " ,NRINSTRUMENTO " +
                                    " ) " +
                                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                tx.executeSql(query, [
                                    key, dados[key].IDFrota, dados[key].TPInscricao, dados[key].IDEmbarcacao, dados[key].STEmbarcacao, dados[key].DTInicio, dados[key].DTTermino, dados[key].TPAfretamento, dados[key].STRegistro, dados[key].IDFrotaPai, dados[key].STHomologacao, dados[key].NoEmbarcacao, dados[key].NRCapitania, dados[key].TipoEmbarcacao, cgc, dados[key].NRInstrumento
                                ], function (tx, res) {
                                    console.log("rowsAffectedFrota: " + res.rowsAffected + " -- should be 1");
                                }, function (tx, error) {
                                    preloaderStop();
                                    console.log('INSERT error Frota: ' + error.message);
                                });
                            });

                            //...
                            gestorMarcarAtualizacao("FROTAALOCADA");

                            resolve(true);
                        });
                    }
                }).catch(function () {
                preloaderStop();
                resolve(true);
            });

        }, function (err) {
            logErro('gestorCarregarFrotaAlocadaListarWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarFrotaAlocadaListarWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}


// ---- gestorCarregarFrotaAlocadaMaritimaListarWebAsinc ----
function gestorCarregarFrotaAlocadaMaritimaListarWebAsinc($http) {
    try {
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            $http({
                url: urlService() + 'ListarFrotaAlocadaMaritima',
                method: "POST",
                data: ''
            })
                .then(async function (response) {
                    if (response.status == 200) {
                        //...
                        openDB();

                        //...
                        db.transaction(async function (tx) {
                            //...
                            tx.executeSql("DELETE FROM FROTAALOCADAMARITIMA");

                            //...
                            var dados = response.data.d;

                            //...
                            angular.forEach(dados, async function (value, key) {
                                //...
                                var cgc = formatarCNPJ(dados[key].NRInscricao);

                                //...
                                var query = "INSERT INTO FROTAALOCADAMARITIMA ( " +
                                    "  ID" +
                                    " ,IDFROTA " +
                                    " ,TPINSCRICAO " +
                                    " ,IDEMBARCACAO " +
                                    " ,STEMBARCACAO " +
                                    " ,DTINICIO " +
                                    " ,DTTERMINO " +
                                    " ,TPAFRETAMENTO " +
                                    " ,STREGISTRO " +
                                    " ,IDFROTAPAI " +
                                    " ,STHOMOLOGACAO " +
                                    " ,NOEMBARCACAO " +
                                    " ,NRCAPITANIA " +
                                    " ,TIPOEMBARCACAO " +
                                    " ,DSTIPOEMBARCACAO " +
                                    " ,NRINSCRICAO " +
                                    " ,NRINSTRUMENTO " +
                                    " ) " +
                                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

                                tx.executeSql(query, [
                                        key, dados[key].IDFrota, dados[key].TPInscricao, dados[key].IDEmbarcacao, dados[key].STEmbarcacao, dados[key].DTInicio, dados[key].DTTermino, dados[key].TPAfretamento, dados[key].STRegistro, dados[key].IDFrotaPai, dados[key].STHomologacao, dados[key].NoEmbarcacao, dados[key].NRCapitania, dados[key].TipoEmbarcacao, dados[key].DSTipoEmbarcacao, cgc, dados[key].NRInstrumento
                                    ], async function (tx, res) {
                                        console.log("rowsAffectedFrotaMaritima: " + res.rowsAffected + " -- should be 1");
                                    },
                                    function (tx, error) {
                                        preloaderStop();
                                        console.log('INSERT error FrotaMaritima: ' + error.message);
                                    });
                            });

                            //...
                            //gestorMarcarAtualizacao("FROTAALOCADA");

                            resolve(true);
                        });
                    }
                }).catch(function () {
                preloaderStop();
                resolve(true);
            });

        }, function (err) {
            logErro('gestorCarregarFrotaAlocadaMaritimaListarWebAsinc', err.message, JSON.stringify({'linha': err.lineNumber}));
            resolve(true);
            alert('Erro ao carregar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorCarregarFrotaAlocadaMaritimaListarWebAsinc', erro.message, JSON.stringify({'linha': erro.lineNumber}));
        preloaderStop();
    }
}


// ---- gestorVerificarAtualizacao ----
function gestorVerificarAtualizacao() {
    let Qtd = 0;

    try {

        openDB();

        var query = "SELECT * FROM LOGATUALIZACAO";

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let qtd = res.rows.length;

                    for (var i = 0; i < res.rows.length; i++) {
                        var DATAFROTAALOCADA = res.rows.item(i).DATAFROTAALOCADA;

                        //...
                        let dataA = new Date(DATAFROTAALOCADA);

                        let dataConvertida = "";


                        //...
                        var d = new Date();
                        var dia = d.getDate();
                        var mes = d.getMonth() + 1;
                        var ano = d.getFullYear();
                        var dataAtual = ano + "/" + mes + "/" + dia;

                        dataConvertida = dataA.getFullYear() + "/" + (dataA.getMonth() + 1) + "/" + dataA.getDate();


                        var date_diff_indays = function (date1, date2) {
                            let dt1 = new Date(date1);
                            let dt2 = new Date(date2);
                            return Math.floor((
                                Date.UTC(
                                    dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                        }

                        //console.log(date_diff_indays('2014/07/03', '2014/07/14'));
                        Qtd = date_diff_indays(dataAtual, dataConvertida);
                        console.log('Dias para atualizar: ', Qtd);


                    }

                    if (qtd == 0) {
                        Qtd = -1;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorVerificarAtualizacao', err.message);
                resolve(true);
                alert("Não foi possível carregar os dados do usuário");
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorVerificarAtualizacao', erro.message);
    }

    return Qtd;
}


// ---- gestorVerificarEstrutura_versao1_1_7_A1 ----
function gestorVerificarEstrutura_versao1_1_7_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " DSTIPOEMBARCACAO " +
            " FROM FROTAALOCADAMARITIMA LIMIT 5 "

        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            DSTipoEmbarcacao: res.rows.item(i).DSTIPOEMBARCACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, function (err) {
                resolve(true);
                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: DSTIPOEMBARCACAO") {
                    gestorCriarCampoTabela("FROTAALOCADAMARITIMA", "DSTIPOEMBARCACAO", "VARCHAR");
                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarTabelas ----
function gestorVerificarTabelas() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS FISCALIZACAO');
                //tx.executeSql('DELETE FROM FISCALIZACAO');


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", CNPJAUTORIZADA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    ", OBS VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", CODPROCESSOPROGRAMADA VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", TPFISCALIZACAOPROGRAMADA VARCHAR " +
                    ", NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMPRESA (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", AREAPPF VARCHAR " +
                    ", DSBAIRRO VARCHAR " +
                    ", DSENDERECO VARCHAR " +
                    ", DTADITAMENTO VARCHAR " +
                    ", DTAUTORGA VARCHAR " +
                    ", EMAIL VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    ", INSTALACAO VARCHAR " +
                    ", LISTATIPOEMPRESA VARCHAR " +
                    ", MODALIDADE VARCHAR " +
                    ", NOMUNICIPIO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", NRADITAMENTO VARCHAR " +
                    ", NRCEP VARCHAR " +
                    ", NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    ", NOMECONTATO VARCHAR " +
                    ", QTDEMBARCACAO VARCHAR " +
                    ", SGUF VARCHAR " +
                    ", TPINSCRICAO VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", ICONE VARCHAR " +
                    ", LINK VARCHAR " +
                    ", NORMA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOIRREGULARIDADES (" +
                    " IDFISCALIZACAOIRREGULARIDADE INTEGER NOT NULL" +
                    ", ORDEM INTEGER NOT NULL" +
                    ", DSALINEA VARCHAR " +
                    ", DSINCISO VARCHAR " +
                    ", DSNORMA VARCHAR " +
                    ", DSNORMACOMPLETA VARCHAR " +
                    ", DSNORMATIVA VARCHAR " +
                    ", DSREQUISITO VARCHAR " +
                    ", IDFISCALIZACAO VARCHAR " +
                    ", IDIRREGULARIDADE VARCHAR " +
                    ", IDREQUISITO VARCHAR " +
                    ", IDSUPERINTENDENCIA VARCHAR " +
                    ", NOREQUISITO VARCHAR " +
                    ", NRARTIGO VARCHAR " +
                    ", NRPARAGRAFO VARCHAR " +
                    ", NRPRAZO VARCHAR " +
                    ", STNOTIFICAVEL VARCHAR " +
                    ", STQUINZENAL VARCHAR " +
                    ", TPINFRACAO VARCHAR " +
                    ", TPNAVEGACAO VARCHAR " +
                    ", VLMULTAMAXIMA VARCHAR " +
                    ", FLAGCHECK VARCHAR " +
                    ", DESCRICAOFATO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    ", PRIMARY KEY (IDFISCALIZACAOIRREGULARIDADE, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOCHECKLIST (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL" +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IDCHECKLIST VARCHAR " +
                    " ,IDOBJETOFISCALIZADO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,CDLATITUDE VARCHAR " +
                    " ,CDLONGITUDE VARCHAR " +
                    " ,DTCADASTRO VARCHAR " +
                    " ,STRESPOSTA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO  VARCHAR " +
                    " ,IDSECAO  VARCHAR " +
                    " ,DESCRICAOFATO  VARCHAR " +
                    " ,RESPOSTA  VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IMAGEMIRREGULARIDADE VARCHAR " +
                    " ,TITULOIMAGEMIRREGULARIDADE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEQUIPE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,STCOORDENADOR VARCHAR " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, NRMATRICULA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOTRECHO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOQUESTIONARIO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,MARQUE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOS (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEVIDENCIA (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOIRREGULARIDADE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDIRREGULARIDADE INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDIRREGULARIDADE) " +
                    ")");


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMBARCACAO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDEMBARCACAO VARCHAR NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDEMBARCACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACOESREALIZADAS (" +
                    "  IDFISCALIZACAOREALIZADA INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,QTDFISCALIZACAOENVIADA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAINTERIOR INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAMARITIMA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAPORTO INTEGER " +
                    " ,QTDEMPRESAFISCALIZADA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAINTERIOR INTEGER " +
                    ", QTDEMPRESAFISCALIZADAMARITIMA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAPORTO INTEGER " +
                    " ,QTDFISCALIZACAOAUTOINFRACAO INTEGER " +
                    " ,QTDFISCALIZACAONOTIFICACAO INTEGER " +
                    " ,QTDAUTOINFRACAO INTEGER " +
                    " ,QTDNOTIFICACAO INTEGER " +
                    " ,QTEXTRAORDINARIA INTEGER " +
                    " ,QTAPARTADO INTEGER " +
                    " ,QTROTINA INTEGER " +
                    " ,QTPROGRAMADA INTEGER " +
                    " ,NRMES VARCHAR " +
                    " ,NRANO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAOREALIZADA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS USUARIO (" +
                    "  IDUSUARIO INTEGER NOT NULL " +
                    " ,DSSENHA VARCHAR " +
                    " ,EEFUNCIONARIO VARCHAR " +
                    " ,NOLOGINUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,NRMATRICULASERVIDOR INTEGER " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,MANTERCONECTADO VARCHAR " +
                    " ,DATALOGOFF VARCHAR " +
                    " ,IDPOSTOAVANCADO INTEGER " +
                    " ,DSPOSTOAVANCADO VARCHAR " +
                    " ,IDPERFILFISCALIZACAO INTEGER " +
                    " ,PRIMARY KEY (IDUSUARIO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,AREAPPF VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,DTADITAMENTO VARCHAR " +
                    " ,DTOUTORGA VARCHAR " +
                    " ,EMAIL VARCHAR " +
                    " ,INSTALACAO VARCHAR " +
                    " ,INSTALACAOSEMACENTOS VARCHAR " +
                    " ,LISTATIPOEMPRESA VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRADITAMENTO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NOMECONTATO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO INTEGER " +
                    " ,VLMONTANTEINVESTIMENTO VARCHAR " +
                    " ,NRTLO VARCHAR " +
                    " ,NRRESOLUCAO VARCHAR " +
                    " ,AUTORIDADEPORTUARIA VARCHAR " +
                    " ,NRINSCRICAOINSTALACAO VARCHAR " +
                    " ,NORAZAOSOCIALINSTALACAO VARCHAR " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSERVICOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSINCRONIZAR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOSERVICONAOAUTORIZADO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    ", OBS VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    " ,IDTIPOENTIDADE INTEGER " +
                    ", IDTERMINALENVIADA INTEGER " +
                    " ,NOTERMINAL VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,VLLATITUDE VARCHAR " +
                    " ,VLLONGITUDE VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MUNICIPIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,SGUF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,DSTIPOTRANSPORTE VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,DSTRECHOLINHA VARCHAR " +
                    " ,IDTIPOTRANSPORTE1 VARCHAR " +
                    " ,IDTIPOTRANSPORTE2 VARCHAR " +
                    " ,IDTIPOTRANSPORTE3 VARCHAR " +
                    " ,IDTIPOTRANSPORTE4 VARCHAR " +
                    " ,IDTIPOTRANSPORTE5 VARCHAR " +
                    " ,IDTIPOTRANSPORTE6 VARCHAR " +
                    " ,IDTIPOTRANSPORTE7 VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACOESINTERIOR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    " ,IDFROTA VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EQUIPE (" +
                    "  NRMATRICULASERVIDOR INTEGER NOT NULL " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,PRIMARY KEY (NRMATRICULASERVIDOR) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS IRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE INTEGER " +
                    " ,IDREQUISITO INTEGER " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO INTEGER " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO INTEGER " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO INTEGER " +
                    " ,TPNAVEGACAO INTEGER " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                //tx.executeSql("DROP TABLE IF EXISTS PERGUNTAS;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,IRREGULARIDADES VARCHAR " +
                    " ,STATIVO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS QUESTIONARIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO INTEGER " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTASIRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IDREQUISITO VARCHAR " +
                    " ,IDSUPERINTENDENCIA VARCHAR " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO VARCHAR " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO VARCHAR " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO VARCHAR " +
                    " ,TPNAVEGACAO VARCHAR " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS INSTALACAOPORTUARIA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,BAIRRO VARCHAR " +
                    " ,CDBIGRAMA VARCHAR " +
                    " ,CDCENTROIDE VARCHAR " +
                    " ,CDINSTALACAOPORTUARIA VARCHAR " +
                    " ,CDTERMINAL VARCHAR " +
                    " ,CDTRIGRAMA VARCHAR " +
                    " ,CEP VARCHAR " +
                    " ,CIDADE VARCHAR " +
                    " ,CNPJ VARCHAR " +
                    " ,COMPANHIA VARCHAR " +
                    " ,COMPLEMENTO VARCHAR " +
                    " ,ENDERECO VARCHAR " +
                    " ,ESTADO VARCHAR " +
                    " ,FONTE VARCHAR " +
                    " ,GESTAO VARCHAR " +
                    " ,IDCIDADE VARCHAR " +
                    " ,IDREGIAOHIDROGRAFICA VARCHAR " +
                    " ,LATITUDE VARCHAR " +
                    " ,LEGISLACAO VARCHAR " +
                    " ,LOCALIZACAO VARCHAR " +
                    " ,LONGITUDE VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOME VARCHAR " +
                    " ,NUMERO VARCHAR " +
                    " ,OBSERVACAO VARCHAR " +
                    " ,PAIS VARCHAR " +
                    " ,PROFUNDIDADE VARCHAR " +
                    " ,REGIAOHIDROGRAFICA VARCHAR " +
                    " ,SITUACAO VARCHAR " +
                    " ,TIPO VARCHAR " +
                    " ,UF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHATIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,INSTALACAO VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,IDTIPOTRANSPORTE VARCHAR " +
                    " ,IDTRECHOLINHA VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DATAEMPRESASAUTORIZADAS VARCHAR " +
                    " ,DATAEQUIPE VARCHAR " +
                    " ,DATAIRREGULARIDADES VARCHAR " +
                    " ,DATAQUESTIONARIOS VARCHAR " +
                    " ,DATAPERGUNTAS VARCHAR " +
                    " ,DATAPERGUNTASIRREGULARIDADES VARCHAR " +
                    " ,DATAINSTALACAOPORTUARIA VARCHAR " +
                    " ,DATATRECHOLINHATIPOTRANSPORTE VARCHAR " +
                    " ,DATAFROTAALOCADA VARCHAR " +
                    " ,DATAMENSAGEMPUSH VARCHAR " +
                    " ,DATAESQUEMASOPERACIONAIS VARCHAR " +
                    " ,DATAPRESTADORESSERVICOS VARCHAR " +
                    " ,DATAMUNICIPIOS VARCHAR " +
                    " ,DATATIPOTRANSPORTE VARCHAR " +
                    " ,DATATRECHOLINHA VARCHAR " +
                    " ,DATAEMBARCACOESINTERIOR VARCHAR " +
                    " ,DATAFISCALIZACOESREALIZADAS VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGERRO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,DTREGISTRO VARCHAR " +
                    " ,TELAREFERENCIA VARCHAR " +
                    " ,ACAO VARCHAR " +
                    " ,DESCRICAOERRO VARCHAR " +
                    " ,PARAMETROS VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGVERSAO (" +
                    "  ID INTEGER PRIMARY KEY AUTOINCREMENT " +
                    " ,VERSAO VARCHAR " +
                    " ,FLAGRELEASE VARCHAR " +
                    " ,FLAGTUOR VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADAMARITIMA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACAOCONSTRUCAO (" +
                    "  IDEMBARCACAOCONSTRUCAO INTEGER NOT NULL " +
                    " ,NRCASCO VARCHAR " +
                    " ,IDESTALEIROCONSTRUCAO VARCHAR " +
                    " ,VLPESOLEVEEDIFICADO VARCHAR " +
                    " ,STCOMPROVACAOPESOLEVE VARCHAR " +
                    " ,DTINICIOCONSTRUCAO VARCHAR " +
                    " ,DTCONCLUSAOCONSTRUCAO VARCHAR " +
                    " ,DTLANCAMENTO VARCHAR " +
                    " ,NRLICENCAMARINHA VARCHAR " +
                    " ,STCONSTRUCAO VARCHAR " +
                    " ,IDTIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,IDCLASSIFICACAOEMBARCACAO VARCHAR " +
                    " ,VLPESOLEVETOTAL VARCHAR " +
                    " ,VLTPB VARCHAR " +
                    " ,VLBHP VARCHAR " +
                    " ,VLTTE VARCHAR " +
                    " ,IDTIPOMATERIALCASCO VARCHAR " +
                    " ,VLCOMPRIMENTO VARCHAR " +
                    " ,VLBOCA VARCHAR " +
                    " ,VLCALADOMAXIMO VARCHAR " +
                    " ,VLCAPACIDADEPASSAGEIROS VARCHAR " +
                    " ,QTTRIPULANTE VARCHAR " +
                    " ,VLPONTAL VARCHAR " +
                    " ,QTMOTOR VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,IDAGENTEFINANCEIRO VARCHAR " +
                    " ,DTTERMOCOMPROMISSO VARCHAR " +
                    " ,STGARANTIAOUTORGA VARCHAR " +
                    " ,DSOBSERVACAO VARCHAR " +
                    " ,DTAPRESENTACAOCRONOGRAMA VARCHAR " +
                    " ,VLPESOLEVEEDIFICADOEVOLUCAO VARCHAR " +
                    " ,STCRONOGRAMA VARCHAR " +
                    " ,STATRASO VARCHAR " +
                    " ,STATRASOFORCAMAIOR VARCHAR " +
                    " ,DSOBSERVACAOEVOLUCAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,VLARQUEACAOBRUTA VARCHAR " +
                    " ,PRIMARY KEY (IDEMBARCACAOCONSTRUCAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTERMINAL (" +
                    "  IDTIPOTERMINAL INTEGER NOT NULL " +
                    " ,NOTIPOTERMINAL VARCHAR " +
                    " ,TPINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,PRIMARY KEY (IDTIPOTERMINAL) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESACONTRATO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRCNPJ VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGA VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI VARCHAR " +
                    " ,IDGRUPOMERCADORIA VARCHAR " +
                    " ,IDNATUREZACARGA VARCHAR " +
                    " ,NRVERSAO VARCHAR " +
                    " ,CDCONTRATO VARCHAR " +
                    " ,NOGRUPOMERCADORIA VARCHAR " +
                    " ,VLAREATOTAL VARCHAR " +
                    " ,IDTIPOSERVICO VARCHAR " +
                    " ,NOTIPOSERVICO VARCHAR " +
                    " ,NOCLASSIFICACAOCARGA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MENSAGEMPUSH (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TITULO VARCHAR " +
                    " ,MENSAGEM VARCHAR " +
                    " ,DATA VARCHAR " +
                    " ,FLAGLIDA VARCHAR " +
                    " ,TPDESTINATARIO INTEGER" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS ESQUEMASOPERACIONAIS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,SENTIDO VARCHAR " +
                    " ,PARTIDAPORTO VARCHAR " +
                    " ,PARTIDADIASEMANA VARCHAR " +
                    " ,HRPARTIDA VARCHAR " +
                    " ,UFPARTIDA VARCHAR " +
                    " ,PORTOCHEGADA VARCHAR " +
                    " ,CHEGADADIASEMANA VARCHAR " +
                    " ,HRCHEGADA VARCHAR " +
                    " ,UFCHEGADA VARCHAR " +
                    " ,IDESQUEMAOPERACIONALITINERARIO INTEGER " +
                    " ,IDESQUEMAOPERACIONAL INTEGER " +
                    " ,STIDAVOLTA INTEGER " +
                    " ,CDLOCALPARTIDA INTEGER " +
                    " ,VLLATITUDEPARTIDA VARCHAR " +
                    " ,VLLONGITUDEPARTIDA VARCHAR " +
                    " ,CDSEMANAPARTIDA INTEGER " +
                    " ,CDLOCALCHEGADA INTEGER " +
                    " ,VLLATITUDECHEGADA VARCHAR " +
                    " ,VLLONGITUDECHEGADA VARCHAR " +
                    " ,CDSEMANACHEGADA INTEGER " +
                    " ,NRORDEM INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                resolve(true);
            }, async function (tx, e) {
                console.log("ERROR: " + e.message);
                resolve(true);
            }, async function () {
                console.log('transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (err) {
        console.log('gestorVerificarTabelas: ' + err.message);
    }
}


// ===== CREATE TABLE: LOGATUALIZACAO =====

tx.executeSql("CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DATAEMPRESASAUTORIZADAS VARCHAR " +
                    " ,DATAEQUIPE VARCHAR " +
                    " ,DATAIRREGULARIDADES VARCHAR " +
                    " ,DATAQUESTIONARIOS VARCHAR " +
                    " ,DATAPERGUNTAS VARCHAR " +
                    " ,DATAPERGUNTASIRREGULARIDADES VARCHAR " +
                    " ,DATAINSTALACAOPORTUARIA VARCHAR " +
                    " ,DATATRECHOLINHATIPOTRANSPORTE VARCHAR " +
                    " ,DATAFROTAALOCADA VARCHAR " +
                    " ,DATAMENSAGEMPUSH VARCHAR " +
                    " ,DATAESQUEMASOPERACIONAIS VARCHAR " +
                    " ,DATAPRESTADORESSERVICOS VARCHAR " +
                    " ,DATAMUNICIPIOS VARCHAR " +
                    " ,DATATIPOTRANSPORTE VARCHAR " +
                    " ,DATATRECHOLINHA VARCHAR " +
                    " ,DATAEMBARCACOESINTERIOR VARCHAR " +
                    " ,DATAFISCALIZACOESREALIZADAS VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");


// ===== Funções relacionadas a LOGATUALIZACAO (total 10) =====

// ---- gestorMarcarAtualizacao ----
function gestorMarcarAtualizacao(campo) {

    var ID = 0;

    try {
        var d = new Date();
        var mes = d.getMonth() + 1;
        var dia = d.getDate();
        var ano = d.getFullYear();

        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var dataAtualizacao = ano + "/" + mes + "/" + dia + " " + h + ":" + m + ":" + s;

        console.log(dataAtualizacao);

        openDB();

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT COUNT(*) AS mycount FROM LOGATUALIZACAO', [], async function (tx, rs) {
                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    var query01 = "INSERT INTO LOGATUALIZACAO (ID, DATA" + campo + ") VALUES (?,?)";
                    var query02 = "UPDATE LOGATUALIZACAO SET DATA" + campo + " = '" + dataAtualizacao + "' WHERE ID = ?";

                    if (ID == 0) {
                        tx.executeSql(query01, [1, dataAtualizacao], async function (tx, res) {
                                resolve(true);
                                console.log("INSERIU LOG: " + res.insertId + " = " + campo);
                            },
                            function (tx, error) {
                                resolve(true);
                                console.log('INSERIU LOG error: ' + error.message);
                            });
                    } else {
                        tx.executeSql(query02, [1], async function (tx, res) {
                                resolve(true);
                                console.log("ATUALIZOU LOG " + campo);
                            },
                            async function (tx, error) {
                                resolve(true);
                                console.log('ATUALIZOU LOG error: ' + error.message);
                            });
                    }

                });
            }, async function (error) {
                logErro('gestorMarcarAtualizacao transaction', error.message, JSON.stringify({'campo': campo}));
                resolve(true);
            }, async function () {
                resolve(true);
                console.log('gestorMarcarAtualizacao transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorMarcarAtualizacao', err.message, JSON.stringify({'campo': campo}));
        alert('gestorMarcarAtualizacao: ' + err.message);
    }
}


// ---- gestorRemoverLogAtualizacao ----
function gestorRemoverLogAtualizacao() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                // ...
                var query = "DELETE FROM LOGATUALIZACAO;"

                tx.executeSql(query, []);

                resolve(true);
            }, async function (error) {
                logErro('gestorRemoverLogAtualizacao transaction', error.message);
                resolve(true);
            }, async function () {
                console.log('gestorRemoverLogAtualizacao transaction ok');
                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        logErro('gestorRemoverLogAtualizacao', err.message);
    }
}


// ---- gestorRemoverUsuario ----
function gestorRemoverUsuario(enviarParaTelaInicial) {
    try {
        openDB();

        db.transaction(function (tx) {
            // ...
            let query = "DELETE FROM USUARIO";
            tx.executeSql(query, []);

            // ...
            //let query01 = "DELETE FROM LOGATUALIZACAO";
            //tx.executeSql(query01, []);

        }, function (error) {
            logErro('gestorRemoverUsuario transaction', error.message);
        }, function () {
            if (enviarParaTelaInicial == 'T') {
                window.location = "index.html";
            }
            console.log('gestorRemoverUsuario transaction ok');
        });
    } catch (err) {
        logErro('gestorRemoverUsuario', err.message);
        alert('gestorRemoverUsuario: ' + err.message);
    }
}


// ---- gestorVerificarAtualizacao ----
function gestorVerificarAtualizacao() {
    let Qtd = 0;

    try {

        openDB();

        var query = "SELECT * FROM LOGATUALIZACAO";

        let firstFunction = new Promise(async function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let qtd = res.rows.length;

                    for (var i = 0; i < res.rows.length; i++) {
                        var DATAFROTAALOCADA = res.rows.item(i).DATAFROTAALOCADA;

                        //...
                        let dataA = new Date(DATAFROTAALOCADA);

                        let dataConvertida = "";


                        //...
                        var d = new Date();
                        var dia = d.getDate();
                        var mes = d.getMonth() + 1;
                        var ano = d.getFullYear();
                        var dataAtual = ano + "/" + mes + "/" + dia;

                        dataConvertida = dataA.getFullYear() + "/" + (dataA.getMonth() + 1) + "/" + dataA.getDate();


                        var date_diff_indays = function (date1, date2) {
                            let dt1 = new Date(date1);
                            let dt2 = new Date(date2);
                            return Math.floor((
                                Date.UTC(
                                    dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                                Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                        }

                        //console.log(date_diff_indays('2014/07/03', '2014/07/14'));
                        Qtd = date_diff_indays(dataAtual, dataConvertida);
                        console.log('Dias para atualizar: ', Qtd);


                    }

                    if (qtd == 0) {
                        Qtd = -1;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorVerificarAtualizacao', err.message);
                resolve(true);
                alert("Não foi possível carregar os dados do usuário");
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (erro) {
        logErro('gestorVerificarAtualizacao', erro.message);
    }

    return Qtd;
}


// ---- gestorVerificarAtualizacaoEsquemasOperacionais ----
function gestorVerificarAtualizacaoEsquemasOperacionais() {
    let Qtd = 0;

    try {

        openDB();

        var query = "SELECT * FROM LOGATUALIZACAO";

        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql(query, [], async function (tx, res) {

                    let qtd = res.rows.length;

                    for (var i = 0; i < res.rows.length; i++) {
                        var DATAESQUEMASOPERACIONAIS = res.rows.item(i).DATAESQUEMASOPERACIONAIS;
                        if (DATAESQUEMASOPERACIONAIS == "undefined") {
                            DATAESQUEMASOPERACIONAIS = "";
                        }

                        if (DATAESQUEMASOPERACIONAIS != "") {
                            //...
                            let dataA = new Date(DATAESQUEMASOPERACIONAIS);

                            let dataConvertida = "";


                            //...
                            var d = new Date();
                            var dia = d.getDate();
                            var mes = d.getMonth() + 1;
                            var ano = d.getFullYear();
                            var dataAtual = ano + "/" + mes + "/" + dia;

                            dataConvertida = dataA.getFullYear() + "/" + (dataA.getMonth() + 1) + "/" + dataA.getDate();


                            var date_diff_indays = function (date1, date2) {
                                let dt1 = new Date(date1);
                                let dt2 = new Date(date2);
                                return Math.floor((
                                    Date.UTC(
                                        dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
                                    Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                            }

                            //console.log(date_diff_indays('2014/07/03', '2014/07/14'));
                            Qtd = date_diff_indays(dataAtual, dataConvertida);
                        }

                        console.log('Dias para atualizar: ', Qtd);
                    }

                    if (qtd == 0) {
                        Qtd = -1;
                    }

                    resolve(true);
                });
            }, async function (err) {
                logErro('gestorVerificarAtualizacaoEsquemasOperacionais', err.message);
                resolve(true);
                alert("Não foi possível carregar os dados do usuário");
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        logErro('gestorVerificarAtualizacaoEsquemasOperacionais', erro.message);
    }

    return Qtd;
}


// ---- gestorVerificarEstrutura_versao1_1_10_A1 ----
function gestorVerificarEstrutura_versao1_1_10_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " DATAESQUEMASOPERACIONAIS " +
            " FROM LOGATUALIZACAO LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: DATAESQUEMASOPERACIONAIS") {
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAMENSAGEMPUSH", "VARCHAR");
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAESQUEMASOPERACIONAIS", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_0_A1 ----
function gestorVerificarEstrutura_versao1_2_0_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " DATAPRESTADORESSERVICOS " +
            " FROM LOGATUALIZACAO LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: DATAPRESTADORESSERVICOS" ||
                    err.message.toLowerCase().includes("no such column: DATAPRESTADORESSERVICOS".toLowerCase())) {
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAPRESTADORESSERVICOS", "VARCHAR");
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAMUNICIPIOS", "VARCHAR");
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATATIPOTRANSPORTE", "VARCHAR");
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATATRECHOLINHA", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_1_A2 ----
function gestorVerificarEstrutura_versao1_2_1_A2() {
    try {
        openDB();

        var query = "SELECT " +
            " DATAEMBARCACOESINTERIOR " +
            " FROM LOGATUALIZACAO LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: DATAEMBARCACOESINTERIOR" ||
                    err.message.toLowerCase().includes("no such column: DATAEMBARCACOESINTERIOR".toLowerCase())) {
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAEMBARCACOESINTERIOR", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOCHECKLIST", "IMAGEMIRREGULARIDADE", "VARCHAR");
                    await gestorCriarCampoTabela("FISCALIZACAOCHECKLIST", "TITULOIMAGEMIRREGULARIDADE", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarEstrutura_versao1_2_6_A1 ----
function gestorVerificarEstrutura_versao1_2_6_A1() {
    try {
        openDB();

        var query = "SELECT " +
            " DATAFISCALIZACOESREALIZADAS " +
            " FROM LOGATUALIZACAO LIMIT 5"


        var arData = [];
        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            /*===============================================*/
            db.transaction(function (tx) {
                tx.executeSql(query, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //...
                        arData.push({
                            Acao: res.rows.item(i).ACAO
                        });
                    }

                    //...
                    console.log(arData);
                    resolve(true);
                });

            }, async function (err) {

                if (err.message == "a statement with no error handler failed: sqlite3_prepare_v2 failure: no such column: DATAFISCALIZACOESREALIZADAS" ||
                    err.message.toLowerCase().includes("no such column: DATAFISCALIZACOESREALIZADAS".toLowerCase())) {
                    await gestorCriarCampoTabela("LOGATUALIZACAO", "DATAFISCALIZACOESREALIZADAS", "VARCHAR");

                } else {
                    console.log('gestorVerificarEstrutura: ' + err.message);
                }

                resolve(true);
            });
        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (erro) {
        console.log('gestorVerificarEstrutura', erro.message);
    }
}


// ---- gestorVerificarTabelas ----
function gestorVerificarTabelas() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS FISCALIZACAO');
                //tx.executeSql('DELETE FROM FISCALIZACAO');


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", CNPJAUTORIZADA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    ", OBS VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", CODPROCESSOPROGRAMADA VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", TPFISCALIZACAOPROGRAMADA VARCHAR " +
                    ", NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMPRESA (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", AREAPPF VARCHAR " +
                    ", DSBAIRRO VARCHAR " +
                    ", DSENDERECO VARCHAR " +
                    ", DTADITAMENTO VARCHAR " +
                    ", DTAUTORGA VARCHAR " +
                    ", EMAIL VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    ", INSTALACAO VARCHAR " +
                    ", LISTATIPOEMPRESA VARCHAR " +
                    ", MODALIDADE VARCHAR " +
                    ", NOMUNICIPIO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", NRADITAMENTO VARCHAR " +
                    ", NRCEP VARCHAR " +
                    ", NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    ", NOMECONTATO VARCHAR " +
                    ", QTDEMBARCACAO VARCHAR " +
                    ", SGUF VARCHAR " +
                    ", TPINSCRICAO VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", ICONE VARCHAR " +
                    ", LINK VARCHAR " +
                    ", NORMA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOIRREGULARIDADES (" +
                    " IDFISCALIZACAOIRREGULARIDADE INTEGER NOT NULL" +
                    ", ORDEM INTEGER NOT NULL" +
                    ", DSALINEA VARCHAR " +
                    ", DSINCISO VARCHAR " +
                    ", DSNORMA VARCHAR " +
                    ", DSNORMACOMPLETA VARCHAR " +
                    ", DSNORMATIVA VARCHAR " +
                    ", DSREQUISITO VARCHAR " +
                    ", IDFISCALIZACAO VARCHAR " +
                    ", IDIRREGULARIDADE VARCHAR " +
                    ", IDREQUISITO VARCHAR " +
                    ", IDSUPERINTENDENCIA VARCHAR " +
                    ", NOREQUISITO VARCHAR " +
                    ", NRARTIGO VARCHAR " +
                    ", NRPARAGRAFO VARCHAR " +
                    ", NRPRAZO VARCHAR " +
                    ", STNOTIFICAVEL VARCHAR " +
                    ", STQUINZENAL VARCHAR " +
                    ", TPINFRACAO VARCHAR " +
                    ", TPNAVEGACAO VARCHAR " +
                    ", VLMULTAMAXIMA VARCHAR " +
                    ", FLAGCHECK VARCHAR " +
                    ", DESCRICAOFATO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    ", PRIMARY KEY (IDFISCALIZACAOIRREGULARIDADE, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOCHECKLIST (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL" +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IDCHECKLIST VARCHAR " +
                    " ,IDOBJETOFISCALIZADO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,CDLATITUDE VARCHAR " +
                    " ,CDLONGITUDE VARCHAR " +
                    " ,DTCADASTRO VARCHAR " +
                    " ,STRESPOSTA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO  VARCHAR " +
                    " ,IDSECAO  VARCHAR " +
                    " ,DESCRICAOFATO  VARCHAR " +
                    " ,RESPOSTA  VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IMAGEMIRREGULARIDADE VARCHAR " +
                    " ,TITULOIMAGEMIRREGULARIDADE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEQUIPE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,STCOORDENADOR VARCHAR " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, NRMATRICULA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOTRECHO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOQUESTIONARIO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,MARQUE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOS (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEVIDENCIA (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOIRREGULARIDADE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDIRREGULARIDADE INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDIRREGULARIDADE) " +
                    ")");


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMBARCACAO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDEMBARCACAO VARCHAR NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDEMBARCACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACOESREALIZADAS (" +
                    "  IDFISCALIZACAOREALIZADA INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,QTDFISCALIZACAOENVIADA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAINTERIOR INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAMARITIMA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAPORTO INTEGER " +
                    " ,QTDEMPRESAFISCALIZADA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAINTERIOR INTEGER " +
                    ", QTDEMPRESAFISCALIZADAMARITIMA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAPORTO INTEGER " +
                    " ,QTDFISCALIZACAOAUTOINFRACAO INTEGER " +
                    " ,QTDFISCALIZACAONOTIFICACAO INTEGER " +
                    " ,QTDAUTOINFRACAO INTEGER " +
                    " ,QTDNOTIFICACAO INTEGER " +
                    " ,QTEXTRAORDINARIA INTEGER " +
                    " ,QTAPARTADO INTEGER " +
                    " ,QTROTINA INTEGER " +
                    " ,QTPROGRAMADA INTEGER " +
                    " ,NRMES VARCHAR " +
                    " ,NRANO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAOREALIZADA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS USUARIO (" +
                    "  IDUSUARIO INTEGER NOT NULL " +
                    " ,DSSENHA VARCHAR " +
                    " ,EEFUNCIONARIO VARCHAR " +
                    " ,NOLOGINUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,NRMATRICULASERVIDOR INTEGER " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,MANTERCONECTADO VARCHAR " +
                    " ,DATALOGOFF VARCHAR " +
                    " ,IDPOSTOAVANCADO INTEGER " +
                    " ,DSPOSTOAVANCADO VARCHAR " +
                    " ,IDPERFILFISCALIZACAO INTEGER " +
                    " ,PRIMARY KEY (IDUSUARIO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,AREAPPF VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,DTADITAMENTO VARCHAR " +
                    " ,DTOUTORGA VARCHAR " +
                    " ,EMAIL VARCHAR " +
                    " ,INSTALACAO VARCHAR " +
                    " ,INSTALACAOSEMACENTOS VARCHAR " +
                    " ,LISTATIPOEMPRESA VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRADITAMENTO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NOMECONTATO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO INTEGER " +
                    " ,VLMONTANTEINVESTIMENTO VARCHAR " +
                    " ,NRTLO VARCHAR " +
                    " ,NRRESOLUCAO VARCHAR " +
                    " ,AUTORIDADEPORTUARIA VARCHAR " +
                    " ,NRINSCRICAOINSTALACAO VARCHAR " +
                    " ,NORAZAOSOCIALINSTALACAO VARCHAR " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSERVICOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSINCRONIZAR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOSERVICONAOAUTORIZADO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    ", OBS VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    " ,IDTIPOENTIDADE INTEGER " +
                    ", IDTERMINALENVIADA INTEGER " +
                    " ,NOTERMINAL VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,VLLATITUDE VARCHAR " +
                    " ,VLLONGITUDE VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MUNICIPIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,SGUF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,DSTIPOTRANSPORTE VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,DSTRECHOLINHA VARCHAR " +
                    " ,IDTIPOTRANSPORTE1 VARCHAR " +
                    " ,IDTIPOTRANSPORTE2 VARCHAR " +
                    " ,IDTIPOTRANSPORTE3 VARCHAR " +
                    " ,IDTIPOTRANSPORTE4 VARCHAR " +
                    " ,IDTIPOTRANSPORTE5 VARCHAR " +
                    " ,IDTIPOTRANSPORTE6 VARCHAR " +
                    " ,IDTIPOTRANSPORTE7 VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACOESINTERIOR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    " ,IDFROTA VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EQUIPE (" +
                    "  NRMATRICULASERVIDOR INTEGER NOT NULL " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,PRIMARY KEY (NRMATRICULASERVIDOR) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS IRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE INTEGER " +
                    " ,IDREQUISITO INTEGER " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO INTEGER " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO INTEGER " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO INTEGER " +
                    " ,TPNAVEGACAO INTEGER " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                //tx.executeSql("DROP TABLE IF EXISTS PERGUNTAS;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,IRREGULARIDADES VARCHAR " +
                    " ,STATIVO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS QUESTIONARIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO INTEGER " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTASIRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IDREQUISITO VARCHAR " +
                    " ,IDSUPERINTENDENCIA VARCHAR " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO VARCHAR " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO VARCHAR " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO VARCHAR " +
                    " ,TPNAVEGACAO VARCHAR " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS INSTALACAOPORTUARIA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,BAIRRO VARCHAR " +
                    " ,CDBIGRAMA VARCHAR " +
                    " ,CDCENTROIDE VARCHAR " +
                    " ,CDINSTALACAOPORTUARIA VARCHAR " +
                    " ,CDTERMINAL VARCHAR " +
                    " ,CDTRIGRAMA VARCHAR " +
                    " ,CEP VARCHAR " +
                    " ,CIDADE VARCHAR " +
                    " ,CNPJ VARCHAR " +
                    " ,COMPANHIA VARCHAR " +
                    " ,COMPLEMENTO VARCHAR " +
                    " ,ENDERECO VARCHAR " +
                    " ,ESTADO VARCHAR " +
                    " ,FONTE VARCHAR " +
                    " ,GESTAO VARCHAR " +
                    " ,IDCIDADE VARCHAR " +
                    " ,IDREGIAOHIDROGRAFICA VARCHAR " +
                    " ,LATITUDE VARCHAR " +
                    " ,LEGISLACAO VARCHAR " +
                    " ,LOCALIZACAO VARCHAR " +
                    " ,LONGITUDE VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOME VARCHAR " +
                    " ,NUMERO VARCHAR " +
                    " ,OBSERVACAO VARCHAR " +
                    " ,PAIS VARCHAR " +
                    " ,PROFUNDIDADE VARCHAR " +
                    " ,REGIAOHIDROGRAFICA VARCHAR " +
                    " ,SITUACAO VARCHAR " +
                    " ,TIPO VARCHAR " +
                    " ,UF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHATIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,INSTALACAO VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,IDTIPOTRANSPORTE VARCHAR " +
                    " ,IDTRECHOLINHA VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DATAEMPRESASAUTORIZADAS VARCHAR " +
                    " ,DATAEQUIPE VARCHAR " +
                    " ,DATAIRREGULARIDADES VARCHAR " +
                    " ,DATAQUESTIONARIOS VARCHAR " +
                    " ,DATAPERGUNTAS VARCHAR " +
                    " ,DATAPERGUNTASIRREGULARIDADES VARCHAR " +
                    " ,DATAINSTALACAOPORTUARIA VARCHAR " +
                    " ,DATATRECHOLINHATIPOTRANSPORTE VARCHAR " +
                    " ,DATAFROTAALOCADA VARCHAR " +
                    " ,DATAMENSAGEMPUSH VARCHAR " +
                    " ,DATAESQUEMASOPERACIONAIS VARCHAR " +
                    " ,DATAPRESTADORESSERVICOS VARCHAR " +
                    " ,DATAMUNICIPIOS VARCHAR " +
                    " ,DATATIPOTRANSPORTE VARCHAR " +
                    " ,DATATRECHOLINHA VARCHAR " +
                    " ,DATAEMBARCACOESINTERIOR VARCHAR " +
                    " ,DATAFISCALIZACOESREALIZADAS VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGERRO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,DTREGISTRO VARCHAR " +
                    " ,TELAREFERENCIA VARCHAR " +
                    " ,ACAO VARCHAR " +
                    " ,DESCRICAOERRO VARCHAR " +
                    " ,PARAMETROS VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGVERSAO (" +
                    "  ID INTEGER PRIMARY KEY AUTOINCREMENT " +
                    " ,VERSAO VARCHAR " +
                    " ,FLAGRELEASE VARCHAR " +
                    " ,FLAGTUOR VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADAMARITIMA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACAOCONSTRUCAO (" +
                    "  IDEMBARCACAOCONSTRUCAO INTEGER NOT NULL " +
                    " ,NRCASCO VARCHAR " +
                    " ,IDESTALEIROCONSTRUCAO VARCHAR " +
                    " ,VLPESOLEVEEDIFICADO VARCHAR " +
                    " ,STCOMPROVACAOPESOLEVE VARCHAR " +
                    " ,DTINICIOCONSTRUCAO VARCHAR " +
                    " ,DTCONCLUSAOCONSTRUCAO VARCHAR " +
                    " ,DTLANCAMENTO VARCHAR " +
                    " ,NRLICENCAMARINHA VARCHAR " +
                    " ,STCONSTRUCAO VARCHAR " +
                    " ,IDTIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,IDCLASSIFICACAOEMBARCACAO VARCHAR " +
                    " ,VLPESOLEVETOTAL VARCHAR " +
                    " ,VLTPB VARCHAR " +
                    " ,VLBHP VARCHAR " +
                    " ,VLTTE VARCHAR " +
                    " ,IDTIPOMATERIALCASCO VARCHAR " +
                    " ,VLCOMPRIMENTO VARCHAR " +
                    " ,VLBOCA VARCHAR " +
                    " ,VLCALADOMAXIMO VARCHAR " +
                    " ,VLCAPACIDADEPASSAGEIROS VARCHAR " +
                    " ,QTTRIPULANTE VARCHAR " +
                    " ,VLPONTAL VARCHAR " +
                    " ,QTMOTOR VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,IDAGENTEFINANCEIRO VARCHAR " +
                    " ,DTTERMOCOMPROMISSO VARCHAR " +
                    " ,STGARANTIAOUTORGA VARCHAR " +
                    " ,DSOBSERVACAO VARCHAR " +
                    " ,DTAPRESENTACAOCRONOGRAMA VARCHAR " +
                    " ,VLPESOLEVEEDIFICADOEVOLUCAO VARCHAR " +
                    " ,STCRONOGRAMA VARCHAR " +
                    " ,STATRASO VARCHAR " +
                    " ,STATRASOFORCAMAIOR VARCHAR " +
                    " ,DSOBSERVACAOEVOLUCAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,VLARQUEACAOBRUTA VARCHAR " +
                    " ,PRIMARY KEY (IDEMBARCACAOCONSTRUCAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTERMINAL (" +
                    "  IDTIPOTERMINAL INTEGER NOT NULL " +
                    " ,NOTIPOTERMINAL VARCHAR " +
                    " ,TPINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,PRIMARY KEY (IDTIPOTERMINAL) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESACONTRATO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRCNPJ VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGA VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI VARCHAR " +
                    " ,IDGRUPOMERCADORIA VARCHAR " +
                    " ,IDNATUREZACARGA VARCHAR " +
                    " ,NRVERSAO VARCHAR " +
                    " ,CDCONTRATO VARCHAR " +
                    " ,NOGRUPOMERCADORIA VARCHAR " +
                    " ,VLAREATOTAL VARCHAR " +
                    " ,IDTIPOSERVICO VARCHAR " +
                    " ,NOTIPOSERVICO VARCHAR " +
                    " ,NOCLASSIFICACAOCARGA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MENSAGEMPUSH (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TITULO VARCHAR " +
                    " ,MENSAGEM VARCHAR " +
                    " ,DATA VARCHAR " +
                    " ,FLAGLIDA VARCHAR " +
                    " ,TPDESTINATARIO INTEGER" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS ESQUEMASOPERACIONAIS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,SENTIDO VARCHAR " +
                    " ,PARTIDAPORTO VARCHAR " +
                    " ,PARTIDADIASEMANA VARCHAR " +
                    " ,HRPARTIDA VARCHAR " +
                    " ,UFPARTIDA VARCHAR " +
                    " ,PORTOCHEGADA VARCHAR " +
                    " ,CHEGADADIASEMANA VARCHAR " +
                    " ,HRCHEGADA VARCHAR " +
                    " ,UFCHEGADA VARCHAR " +
                    " ,IDESQUEMAOPERACIONALITINERARIO INTEGER " +
                    " ,IDESQUEMAOPERACIONAL INTEGER " +
                    " ,STIDAVOLTA INTEGER " +
                    " ,CDLOCALPARTIDA INTEGER " +
                    " ,VLLATITUDEPARTIDA VARCHAR " +
                    " ,VLLONGITUDEPARTIDA VARCHAR " +
                    " ,CDSEMANAPARTIDA INTEGER " +
                    " ,CDLOCALCHEGADA INTEGER " +
                    " ,VLLATITUDECHEGADA VARCHAR " +
                    " ,VLLONGITUDECHEGADA VARCHAR " +
                    " ,CDSEMANACHEGADA INTEGER " +
                    " ,NRORDEM INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                resolve(true);
            }, async function (tx, e) {
                console.log("ERROR: " + e.message);
                resolve(true);
            }, async function () {
                console.log('transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (err) {
        console.log('gestorVerificarTabelas: ' + err.message);
    }
}


// ===== CREATE TABLE: LOGERRO =====

tx.executeSql("CREATE TABLE IF NOT EXISTS LOGERRO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,DTREGISTRO VARCHAR " +
                    " ,TELAREFERENCIA VARCHAR " +
                    " ,ACAO VARCHAR " +
                    " ,DESCRICAOERRO VARCHAR " +
                    " ,PARAMETROS VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");


// ===== Funções relacionadas a LOGERRO (total 4) =====

// ---- gestorGravarLogErroAsinc ----
function gestorGravarLogErroAsinc($http, logErro) {
    try {

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            var data = {
                nomeUsuario: logErro.NOUsuario,
                numeroMatricula: logErro.NRMAtricula,
                dtRegistro: logErro.DTRegistro,
                nomeTelaReferencia: logErro.NOTelaReferencia,
                nomeAcao: logErro.NOAcao,
                dsParametros: logErro.DSParametros,
                dsLogErro: logErro.DSErro,
            };
            $http({
                url: urlService() + 'InserirLogErro',
                method: "POST",
                data: data
            })
                .then(async function (response) {

                    try {
                        if (response.status == 200) {
                            //...
                            openDB();

                            //...
                            db.transaction(async function (tx) {
                                //..
                                var query = "UPDATE LOGERRO SET FLAGENVIADA = 'T' WHERE ID = ? ;"
                                tx.executeSql(query, [
                                    logErro.IDLogErro
                                ]);

                                resolve(true);
                            });

                        }
                    } catch (erro) {
                        resolve(true);
                    }

                })
                .catch(async function () {
                    resolve(true);
                });

        }, function (err) {
            console.log('gestorGravarLogErroAsinc', err.message);
            resolve(true);
            alert('Erro ao sincronizar dados');
        });

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();

    } catch (erro) {
        console.log('gestorGravarLogErroAsinc', erro.message);
    }
}


// ---- gestorInserirLogErro ----
function gestorInserirLogErro(noUsuario, nrMatricula, telaReferencia, acao, descricaoErro, parametros) {

    var ID = 0;

    try {
        var d = new Date();
        var mes = d.getMonth() + 1;
        var dia = d.getDate();
        var ano = d.getFullYear();

        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var dataAtualizacao = ano + "/" + mes + "/" + dia + " " + h + ":" + m + ":" + s;

        openDB();

        /*===============================================*/
        let firstFunction = new Promise(function (resolve, reject) {

            db.transaction(async function (tx) {
                tx.executeSql('SELECT MAX(ID) + 1 AS mycount FROM LOGERRO', [], async function (tx, rs) {

                    ID = rs.rows.item(0).mycount;
                    if (ID == null) {
                        ID = 0;
                    }

                    if (ID == 0) {
                        ID = 1;
                    }

                    tx.executeSql("INSERT INTO LOGERRO (ID, NOUSUARIO, NRMATRICULA, DTREGISTRO, TELAREFERENCIA, ACAO, DESCRICAOERRO, PARAMETROS) VALUES (?,?,?,?,?,?,?,?)",
                        [ID, noUsuario, nrMatricula, dataAtualizacao, telaReferencia, acao, descricaoErro, parametros], async function (tx, res) {
                            resolve(true);
                            console.log("INSERIU LOGERRO rowsAffected: " + res.rowsAffected + " -- should be 1");
                        },
                        function (tx, error) {
                            resolve(true);
                            console.log('INSERIU LOGERRO error: ' + error.message);
                        });
                });
            }, async function (error) {
                resolve(true);
                console.log('gestorInserirLogErro transaction error: ' + error.message);
            }, async function () {
                resolve(true);
                console.log('gestorInserirLogErro transaction ok');
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        };

        await secondFunction();
    } catch (err) {
        alert('gestorInserirLogErro: ' + err.message);
    }
}


// ---- gestorSincronizarLogErro ----
function gestorSincronizarLogErro($http) {
    try {
        preloadInit("Sincronizando Dados");

        openDB();

        var query = "SELECT " +
            " ID " +
            " , NOUSUARIO " +
            " , NRMATRICULA " +
            " , DTREGISTRO " +
            " , TELAREFERENCIA " +
            " , ACAO " +
            " , DESCRICAOERRO " +
            " , PARAMETROS " +
            " FROM LOGERRO " +
            " WHERE FLAGENVIADA IS NULL OR FLAGENVIADA <> 'T' " +
            " ORDER BY ID ";

        var arData = {};
        arData.logErro = [];

        /*===============================================*/
        db.transaction(function (tx) {
            //..
            tx.executeSql("DELETE FROM LOGERRO WHERE FLAGENVIADA ='T'");

            //..
            tx.executeSql(query, [], async function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    //...
                    arData.logErro.push({
                        IDLogErro: res.rows.item(i).ID,
                        NOUsuario: res.rows.item(i).NOUSUARIO,
                        NRMAtricula: res.rows.item(i).NRMATRICULA,
                        DTRegistro: res.rows.item(i).DTREGISTRO,
                        NOTelaReferencia: res.rows.item(i).TELAREFERENCIA,
                        NOAcao: res.rows.item(i).ACAO,
                        DSParametros: res.rows.item(i).PARAMETROS,
                        DSErro: res.rows.item(i).DESCRICAOERRO
                    });
                }

                console.log(arData.logErro);
                angular.forEach(arData.logErro, async function (value, key) {
                    await gestorGravarLogErroAsinc($http, arData.logErro[key]);
                });
            });

        }, function (err) {
            console.log('gestorSincronizarLogErro', err.message);
            alert('SincronizarLogErro: An error occured while saving log');
        });
    } catch (erro) {
        console.log('gestorSincronizarLogErro', erro.message);
    } finally {
        preloaderStop();
    }
}


// ---- gestorVerificarTabelas ----
function gestorVerificarTabelas() {
    try {

        openDB();

        let firstFunction = new Promise(function (resolve, reject) {
            db.transaction(async function (tx) {
                //tx.executeSql('DROP TABLE IF EXISTS FISCALIZACAO');
                //tx.executeSql('DELETE FROM FISCALIZACAO');


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", CNPJAUTORIZADA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    ", OBS VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", CODPROCESSOPROGRAMADA VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", TPFISCALIZACAOPROGRAMADA VARCHAR " +
                    ", NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMPRESA (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", AREAPPF VARCHAR " +
                    ", DSBAIRRO VARCHAR " +
                    ", DSENDERECO VARCHAR " +
                    ", DTADITAMENTO VARCHAR " +
                    ", DTAUTORGA VARCHAR " +
                    ", EMAIL VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    ", INSTALACAO VARCHAR " +
                    ", LISTATIPOEMPRESA VARCHAR " +
                    ", MODALIDADE VARCHAR " +
                    ", NOMUNICIPIO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", NRADITAMENTO VARCHAR " +
                    ", NRCEP VARCHAR " +
                    ", NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    ", NOMECONTATO VARCHAR " +
                    ", QTDEMBARCACAO VARCHAR " +
                    ", SGUF VARCHAR " +
                    ", TPINSCRICAO VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", ICONE VARCHAR " +
                    ", LINK VARCHAR " +
                    ", NORMA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOIRREGULARIDADES (" +
                    " IDFISCALIZACAOIRREGULARIDADE INTEGER NOT NULL" +
                    ", ORDEM INTEGER NOT NULL" +
                    ", DSALINEA VARCHAR " +
                    ", DSINCISO VARCHAR " +
                    ", DSNORMA VARCHAR " +
                    ", DSNORMACOMPLETA VARCHAR " +
                    ", DSNORMATIVA VARCHAR " +
                    ", DSREQUISITO VARCHAR " +
                    ", IDFISCALIZACAO VARCHAR " +
                    ", IDIRREGULARIDADE VARCHAR " +
                    ", IDREQUISITO VARCHAR " +
                    ", IDSUPERINTENDENCIA VARCHAR " +
                    ", NOREQUISITO VARCHAR " +
                    ", NRARTIGO VARCHAR " +
                    ", NRPARAGRAFO VARCHAR " +
                    ", NRPRAZO VARCHAR " +
                    ", STNOTIFICAVEL VARCHAR " +
                    ", STQUINZENAL VARCHAR " +
                    ", TPINFRACAO VARCHAR " +
                    ", TPNAVEGACAO VARCHAR " +
                    ", VLMULTAMAXIMA VARCHAR " +
                    ", FLAGCHECK VARCHAR " +
                    ", DESCRICAOFATO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    ", PRIMARY KEY (IDFISCALIZACAOIRREGULARIDADE, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOCHECKLIST (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL" +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IDCHECKLIST VARCHAR " +
                    " ,IDOBJETOFISCALIZADO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,CDLATITUDE VARCHAR " +
                    " ,CDLONGITUDE VARCHAR " +
                    " ,DTCADASTRO VARCHAR " +
                    " ,STRESPOSTA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO  VARCHAR " +
                    " ,IDSECAO  VARCHAR " +
                    " ,DESCRICAOFATO  VARCHAR " +
                    " ,RESPOSTA  VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IMAGEMIRREGULARIDADE VARCHAR " +
                    " ,TITULOIMAGEMIRREGULARIDADE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEQUIPE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,STCOORDENADOR VARCHAR " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, NRMATRICULA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOTRECHO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOQUESTIONARIO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,MARQUE VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOS (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEVIDENCIA (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,ORDEM INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, ORDEM) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOFOTOIRREGULARIDADE (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDIRREGULARIDADE INTEGER NOT NULL" +
                    " ,IMAGEM VARCHAR " +
                    " ,TITULO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDIRREGULARIDADE) " +
                    ")");


                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOEMBARCACAO (" +
                    "  IDFISCALIZACAO INTEGER NOT NULL " +
                    " ,IDEMBARCACAO VARCHAR NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAO, IDEMBARCACAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACOESREALIZADAS (" +
                    "  IDFISCALIZACAOREALIZADA INTEGER NOT NULL " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,QTDFISCALIZACAOENVIADA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAINTERIOR INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAMARITIMA INTEGER " +
                    " ,QTDFISCALIZACAOENVIADAPORTO INTEGER " +
                    " ,QTDEMPRESAFISCALIZADA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAINTERIOR INTEGER " +
                    ", QTDEMPRESAFISCALIZADAMARITIMA INTEGER " +
                    ", QTDEMPRESAFISCALIZADAPORTO INTEGER " +
                    " ,QTDFISCALIZACAOAUTOINFRACAO INTEGER " +
                    " ,QTDFISCALIZACAONOTIFICACAO INTEGER " +
                    " ,QTDAUTOINFRACAO INTEGER " +
                    " ,QTDNOTIFICACAO INTEGER " +
                    " ,QTEXTRAORDINARIA INTEGER " +
                    " ,QTAPARTADO INTEGER " +
                    " ,QTROTINA INTEGER " +
                    " ,QTPROGRAMADA INTEGER " +
                    " ,NRMES VARCHAR " +
                    " ,NRANO VARCHAR " +
                    " ,PRIMARY KEY (IDFISCALIZACAOREALIZADA) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS USUARIO (" +
                    "  IDUSUARIO INTEGER NOT NULL " +
                    " ,DSSENHA VARCHAR " +
                    " ,EEFUNCIONARIO VARCHAR " +
                    " ,NOLOGINUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,NRMATRICULASERVIDOR INTEGER " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,MANTERCONECTADO VARCHAR " +
                    " ,DATALOGOFF VARCHAR " +
                    " ,IDPOSTOAVANCADO INTEGER " +
                    " ,DSPOSTOAVANCADO VARCHAR " +
                    " ,IDPERFILFISCALIZACAO INTEGER " +
                    " ,PRIMARY KEY (IDUSUARIO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESASAUTORIZADAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,AREAPPF VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,DTADITAMENTO VARCHAR " +
                    " ,DTOUTORGA VARCHAR " +
                    " ,EMAIL VARCHAR " +
                    " ,INSTALACAO VARCHAR " +
                    " ,INSTALACAOSEMACENTOS VARCHAR " +
                    " ,LISTATIPOEMPRESA VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRADITAMENTO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NOMECONTATO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO INTEGER " +
                    " ,VLMONTANTEINVESTIMENTO VARCHAR " +
                    " ,NRTLO VARCHAR " +
                    " ,NRRESOLUCAO VARCHAR " +
                    " ,AUTORIDADEPORTUARIA VARCHAR " +
                    " ,NRINSCRICAOINSTALACAO VARCHAR " +
                    " ,NORAZAOSOCIALINSTALACAO VARCHAR " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSERVICOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NOREPRESENTANTE VARCHAR " +
                    " ,NRTELEFONE VARCHAR " +
                    " ,EEREPRESENTANTE VARCHAR " +
                    " ,NRDOCUMENTOSEI VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PRESTADORESSINCRONIZAR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,NORAZAOSOCIAL VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,QTDEMBARCACAO INTEGER " +
                    " ,SGUF VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FISCALIZACAOSERVICONAOAUTORIZADO (" +
                    "IDFISCALIZACAO INTEGER PRIMARY KEY" +
                    ", DATA VARCHAR " +
                    ", HORA VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NORAZAOSOCIAL VARCHAR " +
                    ", ASSUNTO VARCHAR " +
                    ", IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,IDTRECHOLINHA INTEGER " +
                    ", OBS VARCHAR " +
                    ", ACAO VARCHAR " +
                    ", LATITUDE VARCHAR " +
                    ", LONGITUDE VARCHAR " +
                    ", ALTITUDE VARCHAR " +
                    ", FLAGEXCLUIDO VARCHAR " +
                    ", NRNOTIFICACAO INTEGER " +
                    ", NRAUTOINFRACAO VARCHAR " +
                    ", IDFISCALIZACAOENVIADA INTEGER " +
                    ", IDOBJETOFISCALIZADOENVIADA INTEGER " +
                    " ,IDTIPOENTIDADE INTEGER " +
                    ", IDTERMINALENVIADA INTEGER " +
                    " ,NOTERMINAL VARCHAR " +
                    " ,DSENDERECO VARCHAR " +
                    " ,NRENDERECO INTEGER " +
                    " ,EDCOMPLEMENTO VARCHAR " +
                    " ,DSBAIRRO VARCHAR " +
                    " ,NRCEP VARCHAR " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,VLLATITUDE VARCHAR " +
                    " ,VLLONGITUDE VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MUNICIPIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,CDMUNICIPIO VARCHAR " +
                    " ,NOMUNICIPIO VARCHAR " +
                    " ,SGUF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTIPOTRANSPORTE INTEGER " +
                    " ,DSTIPOTRANSPORTE VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDTRECHOLINHA INTEGER " +
                    " ,DSTRECHOLINHA VARCHAR " +
                    " ,IDTIPOTRANSPORTE1 VARCHAR " +
                    " ,IDTIPOTRANSPORTE2 VARCHAR " +
                    " ,IDTIPOTRANSPORTE3 VARCHAR " +
                    " ,IDTIPOTRANSPORTE4 VARCHAR " +
                    " ,IDTIPOTRANSPORTE5 VARCHAR " +
                    " ,IDTIPOTRANSPORTE6 VARCHAR " +
                    " ,IDTIPOTRANSPORTE7 VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACOESINTERIOR (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TPINSCRICAO INTEGER " +
                    " ,NRINSCRICAO VARCHAR " +
                    ", NRINSTRUMENTO VARCHAR " +
                    " ,IDFROTA VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EQUIPE (" +
                    "  NRMATRICULASERVIDOR INTEGER NOT NULL " +
                    " ,FOTO BLOB " +
                    " ,IDUNIDADEORGANIZACIONAL INTEGER " +
                    " ,NOCARGO VARCHAR " +
                    " ,NOUNIDADEORGANIZACIONAL VARCHAR " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRCPF VARCHAR " +
                    " ,SGUNIDADE VARCHAR " +
                    " ,PRIMARY KEY (NRMATRICULASERVIDOR) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS IRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE INTEGER " +
                    " ,IDREQUISITO INTEGER " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO INTEGER " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO INTEGER " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO INTEGER " +
                    " ,TPNAVEGACAO INTEGER " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                //tx.executeSql("DROP TABLE IF EXISTS PERGUNTAS;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTAS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSPERGUNTA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,IRREGULARIDADES VARCHAR " +
                    " ,STATIVO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS QUESTIONARIOS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSSECAO VARCHAR " +
                    " ,DTCRIACAO VARCHAR " +
                    " ,IDQUESTIONARIO VARCHAR " +
                    " ,IDSECAO INTEGER " +
                    " ,NOQUESTIONARIO VARCHAR " +
                    " ,IDSUPERINTENDENCIA INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS PERGUNTASIRREGULARIDADES (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDPERGUNTA VARCHAR " +
                    " ,DSALINEA VARCHAR " +
                    " ,DSINCISO VARCHAR " +
                    " ,DSNORMA VARCHAR " +
                    " ,DSNORMACOMPLETA VARCHAR " +
                    " ,DSNORMATIVA VARCHAR " +
                    " ,DSREQUISITO VARCHAR " +
                    " ,IDFISCALIZACAO VARCHAR " +
                    " ,IDIRREGULARIDADE VARCHAR " +
                    " ,IDREQUISITO VARCHAR " +
                    " ,IDSUPERINTENDENCIA VARCHAR " +
                    " ,NOREQUISITO VARCHAR " +
                    " ,NRARTIGO VARCHAR " +
                    " ,NRPARAGRAFO VARCHAR " +
                    " ,NRPRAZO VARCHAR " +
                    " ,STNOTIFICAVEL VARCHAR " +
                    " ,STQUINZENAL VARCHAR " +
                    " ,TPINFRACAO VARCHAR " +
                    " ,TPNAVEGACAO VARCHAR " +
                    " ,VLMULTAMAXIMA VARCHAR " +
                    " ,IDSECAO VARCHAR " +
                    " ,STACAOVARIAVEL VARCHAR" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS INSTALACAOPORTUARIA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,BAIRRO VARCHAR " +
                    " ,CDBIGRAMA VARCHAR " +
                    " ,CDCENTROIDE VARCHAR " +
                    " ,CDINSTALACAOPORTUARIA VARCHAR " +
                    " ,CDTERMINAL VARCHAR " +
                    " ,CDTRIGRAMA VARCHAR " +
                    " ,CEP VARCHAR " +
                    " ,CIDADE VARCHAR " +
                    " ,CNPJ VARCHAR " +
                    " ,COMPANHIA VARCHAR " +
                    " ,COMPLEMENTO VARCHAR " +
                    " ,ENDERECO VARCHAR " +
                    " ,ESTADO VARCHAR " +
                    " ,FONTE VARCHAR " +
                    " ,GESTAO VARCHAR " +
                    " ,IDCIDADE VARCHAR " +
                    " ,IDREGIAOHIDROGRAFICA VARCHAR " +
                    " ,LATITUDE VARCHAR " +
                    " ,LEGISLACAO VARCHAR " +
                    " ,LOCALIZACAO VARCHAR " +
                    " ,LONGITUDE VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,NOME VARCHAR " +
                    " ,NUMERO VARCHAR " +
                    " ,OBSERVACAO VARCHAR " +
                    " ,PAIS VARCHAR " +
                    " ,PROFUNDIDADE VARCHAR " +
                    " ,REGIAOHIDROGRAFICA VARCHAR " +
                    " ,SITUACAO VARCHAR " +
                    " ,TIPO VARCHAR " +
                    " ,UF VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TRECHOLINHATIPOTRANSPORTE (" +
                    "  ID INTEGER NOT NULL " +
                    " ,INSTALACAO VARCHAR " +
                    " ,MODALIDADE VARCHAR " +
                    " ,IDTIPOTRANSPORTE VARCHAR " +
                    " ,IDTRECHOLINHA VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGATUALIZACAO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,DATAEMPRESASAUTORIZADAS VARCHAR " +
                    " ,DATAEQUIPE VARCHAR " +
                    " ,DATAIRREGULARIDADES VARCHAR " +
                    " ,DATAQUESTIONARIOS VARCHAR " +
                    " ,DATAPERGUNTAS VARCHAR " +
                    " ,DATAPERGUNTASIRREGULARIDADES VARCHAR " +
                    " ,DATAINSTALACAOPORTUARIA VARCHAR " +
                    " ,DATATRECHOLINHATIPOTRANSPORTE VARCHAR " +
                    " ,DATAFROTAALOCADA VARCHAR " +
                    " ,DATAMENSAGEMPUSH VARCHAR " +
                    " ,DATAESQUEMASOPERACIONAIS VARCHAR " +
                    " ,DATAPRESTADORESSERVICOS VARCHAR " +
                    " ,DATAMUNICIPIOS VARCHAR " +
                    " ,DATATIPOTRANSPORTE VARCHAR " +
                    " ,DATATRECHOLINHA VARCHAR " +
                    " ,DATAEMBARCACOESINTERIOR VARCHAR " +
                    " ,DATAFISCALIZACOESREALIZADAS VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGERRO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NOUSUARIO VARCHAR " +
                    " ,NRMATRICULA VARCHAR " +
                    " ,DTREGISTRO VARCHAR " +
                    " ,TELAREFERENCIA VARCHAR " +
                    " ,ACAO VARCHAR " +
                    " ,DESCRICAOERRO VARCHAR " +
                    " ,PARAMETROS VARCHAR " +
                    ", FLAGENVIADA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS LOGVERSAO (" +
                    "  ID INTEGER PRIMARY KEY AUTOINCREMENT " +
                    " ,VERSAO VARCHAR " +
                    " ,FLAGRELEASE VARCHAR " +
                    " ,FLAGTUOR VARCHAR " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS FROTAALOCADAMARITIMA (" +
                    "  ID INTEGER NOT NULL " +
                    " ,IDFROTA VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,IDEMBARCACAO VARCHAR " +
                    " ,STEMBARCACAO VARCHAR " +
                    " ,DTINICIO VARCHAR " +
                    " ,DTTERMINO VARCHAR " +
                    " ,TPAFRETAMENTO VARCHAR " +
                    " ,STREGISTRO VARCHAR " +
                    " ,IDFROTAPAI VARCHAR " +
                    " ,STHOMOLOGACAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,NRCAPITANIA VARCHAR " +
                    " ,TIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,NRINSTRUMENTO VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMBARCACAOCONSTRUCAO (" +
                    "  IDEMBARCACAOCONSTRUCAO INTEGER NOT NULL " +
                    " ,NRCASCO VARCHAR " +
                    " ,IDESTALEIROCONSTRUCAO VARCHAR " +
                    " ,VLPESOLEVEEDIFICADO VARCHAR " +
                    " ,STCOMPROVACAOPESOLEVE VARCHAR " +
                    " ,DTINICIOCONSTRUCAO VARCHAR " +
                    " ,DTCONCLUSAOCONSTRUCAO VARCHAR " +
                    " ,DTLANCAMENTO VARCHAR " +
                    " ,NRLICENCAMARINHA VARCHAR " +
                    " ,STCONSTRUCAO VARCHAR " +
                    " ,IDTIPOEMBARCACAO VARCHAR " +
                    " ,DSTIPOEMBARCACAO VARCHAR " +
                    " ,IDCLASSIFICACAOEMBARCACAO VARCHAR " +
                    " ,VLPESOLEVETOTAL VARCHAR " +
                    " ,VLTPB VARCHAR " +
                    " ,VLBHP VARCHAR " +
                    " ,VLTTE VARCHAR " +
                    " ,IDTIPOMATERIALCASCO VARCHAR " +
                    " ,VLCOMPRIMENTO VARCHAR " +
                    " ,VLBOCA VARCHAR " +
                    " ,VLCALADOMAXIMO VARCHAR " +
                    " ,VLCAPACIDADEPASSAGEIROS VARCHAR " +
                    " ,QTTRIPULANTE VARCHAR " +
                    " ,VLPONTAL VARCHAR " +
                    " ,QTMOTOR VARCHAR " +
                    " ,TPINSCRICAO VARCHAR " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,IDAGENTEFINANCEIRO VARCHAR " +
                    " ,DTTERMOCOMPROMISSO VARCHAR " +
                    " ,STGARANTIAOUTORGA VARCHAR " +
                    " ,DSOBSERVACAO VARCHAR " +
                    " ,DTAPRESENTACAOCRONOGRAMA VARCHAR " +
                    " ,VLPESOLEVEEDIFICADOEVOLUCAO VARCHAR " +
                    " ,STCRONOGRAMA VARCHAR " +
                    " ,STATRASO VARCHAR " +
                    " ,STATRASOFORCAMAIOR VARCHAR " +
                    " ,DSOBSERVACAOEVOLUCAO VARCHAR " +
                    " ,NOEMBARCACAO VARCHAR " +
                    " ,VLARQUEACAOBRUTA VARCHAR " +
                    " ,PRIMARY KEY (IDEMBARCACAOCONSTRUCAO) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS TIPOTERMINAL (" +
                    "  IDTIPOTERMINAL INTEGER NOT NULL " +
                    " ,NOTIPOTERMINAL VARCHAR " +
                    " ,TPINSTALACAOPORTUARIA VARCHAR " +
                    " ,IDTIPOINSTALACAOPORTUARIA VARCHAR " +
                    " ,PRIMARY KEY (IDTIPOTERMINAL) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS EMPRESACONTRATO (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRCNPJ VARCHAR " +
                    " ,IDCONTRATOARRENDAMENTO VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGA VARCHAR " +
                    " ,IDCLASSIFICAOSUBCLASSIFICAOCARGAPAI VARCHAR " +
                    " ,IDGRUPOMERCADORIA VARCHAR " +
                    " ,IDNATUREZACARGA VARCHAR " +
                    " ,NRVERSAO VARCHAR " +
                    " ,CDCONTRATO VARCHAR " +
                    " ,NOGRUPOMERCADORIA VARCHAR " +
                    " ,VLAREATOTAL VARCHAR " +
                    " ,IDTIPOSERVICO VARCHAR " +
                    " ,NOTIPOSERVICO VARCHAR " +
                    " ,NOCLASSIFICACAOCARGA VARCHAR " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS MENSAGEMPUSH (" +
                    "  ID INTEGER NOT NULL " +
                    " ,TITULO VARCHAR " +
                    " ,MENSAGEM VARCHAR " +
                    " ,DATA VARCHAR " +
                    " ,FLAGLIDA VARCHAR " +
                    " ,TPDESTINATARIO INTEGER" +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                tx.executeSql("CREATE TABLE IF NOT EXISTS ESQUEMASOPERACIONAIS (" +
                    "  ID INTEGER NOT NULL " +
                    " ,NRINSCRICAO VARCHAR " +
                    " ,SENTIDO VARCHAR " +
                    " ,PARTIDAPORTO VARCHAR " +
                    " ,PARTIDADIASEMANA VARCHAR " +
                    " ,HRPARTIDA VARCHAR " +
                    " ,UFPARTIDA VARCHAR " +
                    " ,PORTOCHEGADA VARCHAR " +
                    " ,CHEGADADIASEMANA VARCHAR " +
                    " ,HRCHEGADA VARCHAR " +
                    " ,UFCHEGADA VARCHAR " +
                    " ,IDESQUEMAOPERACIONALITINERARIO INTEGER " +
                    " ,IDESQUEMAOPERACIONAL INTEGER " +
                    " ,STIDAVOLTA INTEGER " +
                    " ,CDLOCALPARTIDA INTEGER " +
                    " ,VLLATITUDEPARTIDA VARCHAR " +
                    " ,VLLONGITUDEPARTIDA VARCHAR " +
                    " ,CDSEMANAPARTIDA INTEGER " +
                    " ,CDLOCALCHEGADA INTEGER " +
                    " ,VLLATITUDECHEGADA VARCHAR " +
                    " ,VLLONGITUDECHEGADA VARCHAR " +
                    " ,CDSEMANACHEGADA INTEGER " +
                    " ,NRORDEM INTEGER " +
                    " ,PRIMARY KEY (ID) " +
                    ")");

                resolve(true);
            }, async function (tx, e) {
                console.log("ERROR: " + e.message);
                resolve(true);
            }, async function () {
                console.log('transaction ok');
                resolve(true);
            });

        })

        async function secondFunction() {
            let result = await firstFunction
        }

        await secondFunction();
    } catch (err) {
        console.log('gestorVerificarTabelas: ' + err.message);
    }
}

