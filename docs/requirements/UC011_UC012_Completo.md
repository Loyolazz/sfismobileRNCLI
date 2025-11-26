
# UC011 e UC012 — Documentação Completa das Telas e Regras  
Versão consolidada para uso no projeto **sfismobileRNCLI**

---

# UC011 – Consultar Empresa Não Autorizada

Este documento contém **toda a descrição funcional da UC011**, incluindo objetivo, regras e descrições detalhadas de todas as telas.

---

## 1. Objetivo da UC011

Permitir que o fiscal consulte empresas não autorizadas por meio de filtros (Nome da Empresa, CNPJ, Nome da Embarcação).  
O sistema retorna uma lista detalhada com informações específicas para cada modalidade, seguindo regras do caso de uso.

---

## 2. Regras Gerais

- Pelo menos **um** filtro deve ser informado antes de pesquisar.  
- Caso nenhum dado seja encontrado, o sistema exibe aviso e permite nova pesquisa.  
- Campos exibidos nos cards variam conforme modalidade da empresa.  
- Alguns campos devem aparecer em **CAIXA ALTA e NEGRITO** (Razão Social, CNPJ, entre outros).

---

## 3. Telas da UC011

---

### [TELA1] – Menu

- Tela principal do aplicativo.  
- Contém a opção **“Fiscalização de empresas não autorizadas”**.  
- Ao selecionar, inicia o fluxo e abre a TELA2.

---

### [TELA2] – Inserir informações da empresa

**Objetivo:**  
Permitir que o fiscal insira critérios de pesquisa.

**Campos disponíveis:**  
- Nome da Empresa  
- CNPJ  
- Nome da Embarcação  

**Regras:**  
- Pelo menos um campo deve ser preenchido.  
- Se pesquisar com tudo vazio → exibir aviso “Preencha este campo!”.  
- Com filtros válidos, ao tocar em Pesquisar → chamar API e ir para TELA3.

---

### [TELA3] – Resultado da Pesquisa

**Objetivo:**  
Mostrar as empresas não autorizadas encontradas.

**Topo da tela:**  
- Texto: **“XXX localizada(s)”**  
- Texto informando o filtro usado na busca.

**Cards exibem:**  

- **Razão Social** (caixa alta e negrito)  
- **CNPJ** (caixa alta e negrito)  
- Endereço  
- Modalidade  
- Instrumento (para modalidades aplicáveis)  
- Termo  
- Instalação  
- Data do Último Aditamento (DD/MM/AAAA)  
- Embarcações (quando aplicável)  
- Linha (quando aplicável)  
- Travessia (quando aplicável)

**Exceção:**  
- Se nenhum resultado vier → mensagem clara + botão de retorno para TELA2.

---

# UC012 – Consultar Serviço Não Autorizado

Documento consolidado com as regras e telas completas do fluxo de prestação de serviços não autorizados.

---

## 1. Objetivo da UC012

Permitir ao fiscal consultar, cadastrar e conduzir todo o fluxo de fiscalização de **serviços não autorizados**, incluindo:

- Consulta de prestadores  
- Cadastro de prestadores  
- Seleção de área de atuação  
- Cadastro de instalação  
- Seleção de equipe  
- Descrição da fiscalização  
- Seleção de irregularidades  
- Geração de Auto de Infração  
- Processo final  
- Reenvio de documentos ao SEI  

---

## 2. Regras Gerais

- Filtro obrigatório na pesquisa (CNPJ, CPF ou Razão Social).  
- Se nenhum prestador for localizado → exibir mensagem e permitir cadastro.  
- Documentos devem ser validados.  
- Fluxo se adapta conforme a área escolhida (Navegação Interior / Área Portuária).  
- Todos os erros de API devem gerar log.  

---

## 3. Telas da UC012

---

### [TELA1] – Menu

- Opção **“Serviços Não Autorizados”**.  
- Ao selecionar, abre TELA2.

---

### [TELA2] – Consultar Prestador

**Campos:**  
- Combobox de filtro (CNPJ, CPF, Razão Social)  
- Campo de texto dinâmico  
- Botão **Pesquisar**

**Regra:**  
- Campo obrigatório → se vazio, mensagem “Preencha este campo!”.  

**Fluxo:**  
- Resultado encontrado → TELA3  
- Nenhum resultado → TELA4

---

### [TELA3] – Resultado da Pesquisa

**Exibe:**  
- “XXX localizada(s)”  
- Texto do filtro  
- Lista de prestadores em cards  

**Cada card:**  
- Razão Social em caixa alta e negrito  
- Documento em negrito  
- Endereço em negrito  

**Ações:**  
- Tocar card → TELA6  
- Cadastrar → TELA5

---

### [TELA4] – Nenhuma empresa localizada

- Mensagem clara.  
- Botão **Cadastrar** → TELA5.

---

### [TELA5] – Cadastrar Prestador

**Campos:**  
- CNPJ/CPF  
- Razão Social / Nome  
- Endereço completo  

**Regras:**  
- Documento não pode estar duplicado.  
- Após salvar → retorna à TELA3.

---

### [TELA6] – Selecione a área de atuação

Opções:  
1. Navegação Interior → TELA7  
2. Área Portuária → TELA8

---

### [TELA7] – Navegação Interior

**Elementos:**  
- Tipos de Transporte  
- Trechos/Linhas dinâmicos  
- Botão Prosseguir

**Comportamento:**  
- Ao selecionar o tipo, carregar trechos via API.  
- Tratar erros (ex.: CarregarDadosTrechoLinha).  
- Prosseguir → TELA9.

---

### [TELA8] – Área Portuária

**Elementos:**  
- Registro / TUP  
- Campos auxiliares  
- Botão Prosseguir → TELA9

---

### [TELA9] – Cadastrar Instalação

**Campos:**  
- Nome da instalação  
- Tipo  
- Endereço completo  
- Latitude/Longitude (se aplicável)  

**Ao salvar:**  
- Prosseguir para equipe (TELA10).

---

### [TELA10] – Pesquisa de Equipe

**Elementos:**  
- Busca  
- Lista de servidores  
- Seleção múltipla  
- Prosseguir → TELA11

---

### [TELA11] – Descreva sua fiscalização

**Elementos:**  
- Texto com contador  
- Anexar foto  
- Gravar áudio  
- Salvar e sair  
- Próximo → TELA12

---

### [TELA12] – Seleção de Irregularidades

**Elementos:**  
- Campo de busca  
- Lista de irregularidades  
- Seleção múltipla  
- Confirmar → TELA13

---

### [TELA13] – Resultado da Fiscalização

**Exibe:**  
- Prestador  
- Área  
- Instalação  
- Equipe  
- Descrição  
- Irregularidades  

**Ações:**  
- Finalizar sem auto  
- Emitir auto → TELA14

---

### [TELA14] – Auto de Infração Emitido

Mostra:  
- Dados do auto  
- Ações para visualizar processo ou voltar

---

### [TELA15] – Processo (Fiscalização Registrada)

Mostra:  
- Lista de fiscalizações  
- Botão Reenviar Documentos → TELA16

---

### [TELA16] – Reenviar Documentos (SEI)

**Elementos:**  
- Cabeçalho  
- Lista de anexos com checkbox  
- Enviar Selecionados  
- Voltar/Sair

**Comportamento:**  
- Todos os erros são registrados via log.  

---

# Fim do Documento

Este arquivo pode ser colocado em:  

```
/docs/requisitos/UC011_UC012_Completo.md
```
