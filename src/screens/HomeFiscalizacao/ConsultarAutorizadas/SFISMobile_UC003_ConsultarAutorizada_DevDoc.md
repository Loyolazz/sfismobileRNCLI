# SFISMobile — UC003: Consultar Autorizada (Documentação Estendida para Desenvolvedores)

> **Ambiente de referência (exemplos):** `https://sfismobile.antaq.gov.br/AntaqService/Services.asmx`  
> **Escopo:** UC003 completo, com fluxos FA1–FA8, FE1–FE3, telas 4.1–4.15, regras de negócio e notas técnicas para frontend/backend.  
> **Fonte oficial:** UC003_Consultar_Autorizada.pdf (trechos citados ao longo do documento).

---

## 1. Contexto e Objetivo

O caso de uso **UC003 – Consultar Autorizada** permite que o ator **Fiscal** pesquise **empresas autorizadas** e visualize informações associadas (dados cadastrais, modalidades, embarcações, instalações, localização e histórico de fiscalizações). Pré‑requisito: usuário autenticado e com permissão no SFISMobile fileciteturn1file1L91-L103 fileciteturn1file2L1-L1.

---

## 2. Visão Geral de Fluxo

### 2.1 Fluxo Básico — Consultar Empresa Autorizada
1) Abrir **Consultar Autorizadas** → 2) Selecionar **tipo de consulta** (CNPJ/Razão, Modalidade, Embarcação, Instalação) → 3) Informar parâmetros → 4) **Validar obrigatório** → 5) **Listar empresas** com campos e regras (inclui RN03, RN08, RN14, RN24, RN38, RN39, RN40) → 6) **Explorar** detalhes/opções (servidores, localização, histórico) fileciteturn1file2L4-L30.

### 2.2 Fluxos Alternativos (resumo)
- **FA1 – Consultar Servidor**: sequência de verificações e exibição da seleção de servidores (com possibilidade de filtro por unidade – FA8) fileciteturn1file2L46-L63 fileciteturn1file0L34-L41.  
- **FA2 – Consultar Embarcação**: quando modalidade permite, exibir **trecho** (4.8) e **embarcações** (4.3) fileciteturn1file2L66-L76.  
- **FA3 – Visualizar Localização do Terminal**: exibir mapa/localizações por instalação selecionada (4.7) fileciteturn1file4L34-L44.  
- **FA4 – Por Modalidade**: consulta por **Área/Tipo/Modalidade** (4.6) e lista empresas fileciteturn1file4L46-L62.  
- **FA5 – Por Embarcação**: busca por **IMO/Número Capitania** ou **Nome** (4.9) e lista empresas vinculadas fileciteturn1file1L31-L33.  
- **FA6 – Por Instalação**: busca por nome de porto/instalação (4.10) e lista empresas fileciteturn1file1L33-L34.  
- **FA7 – Histórico de Fiscalizações**: abre abas de **Processos, Sancionadores, Autos, NOCI, Ações** (4.11–4.15) fileciteturn1file0L42-L70.  
- **FA8 – Filtrar Unidade para seleção de servidores**: permite filtrar servidores por unidade e aplicar RN44 fileciteturn1file0L13-L16.

### 2.3 Exceções
- **FE1**: Campo obrigatório ausente → “Preencha este campo!” fileciteturn1file1L1-L3.  
- **FE2**: Empresa sem terminal vinculado → mensagem específica fileciteturn1file2L54-L55.  
- **FE3**: Sem histórico de Ações Fiscalizadoras → “Não existem Ações Fiscalizadoras” fileciteturn1file0L11-L12.

---

## 3. Telas e Campos (para Frontend)

> As seções abaixo resumem **quais campos exibir**, **ações** e **regras visuais** por interface. Use como contrato de UI/UX e base para validações.

### 3.1 4.1 — Consultar por CNPJ/Razão Social
- **Campo**: “Digite o CNPJ ou o Nome” (obrigatório).  
- **Ações**: **Pesquisar**, **Prefiro informar o QRCode** (abre câmera), **Voltar**.  
- **Regras**: Se vazio ao pesquisar → **vermelho**; preenchido → **verde**; exibir valor em caixa alta no botão (até 35 chars); QRCode preenche o campo automaticamente fileciteturn1file1L15-L21 fileciteturn1file1L63-L67.

### 3.2 4.2 — Lista de Empresas Autorizadas (Cards)
**Campos em cada card**: **Razão Social**, **CNPJ**, **Endereço**, **Modalidade**, **Instrumento**, **Termo**, **Instalação**, **CNPJ Instalação**, **Razão Social Instalação**, **Data Último Aditamento**, **Embarcações**, **Linha**, **Travessia** (condicionais por modalidade). Ícones variam conforme **área/modalidade** fileciteturn1file1L17-L18.  
> Observação importante: para **Arrendamento**, exibir **CNPJ da Instalação** e **Razão Social da Instalação (RN40)** fileciteturn1file3L28-L36.

**Ações**:  
- **Selecionar empresa** → navega para **4.3/4.8** (se Longitudinal/Travessia), **4.7** (se há localização), ou **4.4** (se sem localização) fileciteturn1file1L17-L18.  
- **Histórico de Fiscalizações** → abre 4.11–4.15 fileciteturn1file0L42-L70.  
- **Prefiro informar o QRCode**; **Voltar**.

**Regras**: um **card por empresa**; ícone por área (Portuária, Operador Portuário, Navegação) fileciteturn1file1L17-L18.

### 3.3 4.3 — Consultar Embarcação
**Campos**: parâmetro de pesquisa + cabeçalho da empresa; em cada card de embarcação: **Nome**, **IMO**, **Tipo**, **Incluída à frota em** (exceto Longitudinal de Carga), **Autorização** (somente Longitudinal de Carga), **Situação (verde)**. Ação: **Selecionar embarcação** leva a 4.4; **Voltar** para 4.2 fileciteturn1file1L19-L21.

### 3.4 4.4 — Consultar Servidor
**Campos**: **Pesquisar**, **Unidade de Fiscalização** (filtro), dados da empresa (cabeçalho) e **lista de servidores** (foto, checkbox de seleção → vira ícone, nome, unidade, cargo). Ações: **Próximo** (vai para “Selecionar Tipo de Fiscalização” — REF2), **Voltar**. Regras: mostrar texto “Selecionar o(s) servidor(es) responsável(is)” e destacar selecionados fileciteturn1file1L21-L23.

### 3.5 4.5 — Informar Tipo de Consulta
Opções: **Por CNPJ/Razão Social**, **Por Modalidade**, **Por Embarcação** (com 2 campos: **IMO/Número Capitania** até 10 chars, **Nome**), **Por Instalação** (campo alfanumérico) fileciteturn1file1L23-L26.

### 3.6 4.6 — Consultar por Modalidade
**Campos**: **Área** (Portuária/Navegação) → **Tipo** (depende da Área) → **Modalidade** (depende do Tipo). Regras definem as listas para cada combinação (e.g., Marítima → Apoio Marítimo/Portuário, Cabotagem, Longo Curso, Embarcação em Construção; Interior → Longitudinal Misto/Passageiros/Carga/Travessia) fileciteturn1file1L25-L26.

### 3.7 4.7 — Visualizar Localização do Terminal
**Campos**: cabeçalho da empresa; **Website**; **Detalhamento do Terminal** (Situação, Modalidade, **Localizada na** — por instalação selecionada). Ações: **Detalhar localização** (ícone depende de área/modalidade), **Iniciar Fiscalização**, **Voltar**. Regras: ícones distintos por área/modalidade; se a empresa tiver várias instalações, exibir localizações por instalação escolhida fileciteturn1file1L27-L28.

### 3.8 4.8 — Consultar Trecho
Exibe **Bacia/Trecho/Linha** e **Tipo de Transporte**; não aparece para **Travessia**; é **transitória** (alguns segundos) e retorna à 4.3 automaticamente fileciteturn1file1L29-L31.

### 3.9 4.9 — Por Embarcação (IMO/Capitania/Nome)
Regras de validação visual: ambos campos vazios → **vermelho** e não prossegue; preenchidos → **verde** fileciteturn1file1L31-L33.

### 3.10 4.10 — Por Instalação
Campo **Nome** (obrigatório); vermelho se vazio; verde se preenchido; **consulta tabelas de Porto e Terminal** e empresa portuária associada fileciteturn1file1L33-L34.

### 3.11 4.11–4.15 — Histórico de Fiscalizações
- **Processos em Andamento (4.11)**: nº processo, tipo, situação, nº auto, código de irregularidade, tipo de infração; ações: navegar ou fechar fileciteturn1file0L42-L48.  
- **Sancionadores Julgados (4.12)**: nº processo, tipo, código de irregularidade, nº auto, tipo de decisão, **valor da multa**; ações: navegar/fechar fileciteturn1file0L48-L53.  
- **Autos de Infração (4.13)**: nº auto, **data de ciência**, código, tipo, nº/situação do processo; ações: navegar/fechar fileciteturn1file0L54-L70.  
- **Notificações (NOCI) (4.14)**: nº NOCI, **data de ciência**, código, tipo, nº processo, **sanada (Sim/Não)**; ações: navegar/fechar fileciteturn1file1L41-L43.  
- **Ações Fiscalizadoras (4.15)**: tipo de fiscalização e **quantidade de ações**; ações: fechar/navegar fileciteturn1file1L41-L43.

---

## 4. Regras de Negócio (referências)
- **RN03 / RN08 / RN14 / RN24 / RN38 / RN39 / RN40**: aplicadas na **recuperação e apresentação** de empresas na lista (4.2). Destaque para **RN40** (Arrendamento: exibir CNPJ e Razão Social da Instalação) e **RN38** (log de erros) fileciteturn1file2L24-L26 fileciteturn1file3L28-L36.  
- **RN06**: controla quando **consultar embarcações** (ligação com FA2) fileciteturn1file2L51-L53.  
- **RN15**: condiciona **mapa de localização** no FA1/FA3 fileciteturn1file2L56-L57.  
- **RN43**: habilita **Histórico de Fiscalizações** (FA7) fileciteturn1file0L42-L46.  
- **RN44**: **seleção de servidores** com filtro por unidade (FA8) fileciteturn1file0L13-L16.

---

## 5. Integração com Serviços (AntaqService.asmx)

> **Observação**: Os nomes exatos dos métodos SOAP devem ser confirmados no **WSDL** do endpoint. Abaixo estão **exemplos ilustrativos** de chamadas e mapeamentos para facilitar a implementação no cliente.

### 5.1 Endpoints e Considerações
- **Endpoint SOAP** (produção): `https://sfismobile.antaq.gov.br/AntaqService/Services.asmx`  
- **Binding**: `text/xml; charset=utf-8` (SOAP 1.1).  
- **Timeout recomendado**: ≥ 30s (consultas por nome/modalidade podem retornar muitas linhas).  
- **Retentativa**: idempotente para consultas; tratar **backoff exponencial** em 429/5xx.  
- **Logs**: registrar falhas de transporte/parse e respostas de erro de aplicação (**RN38**) fileciteturn1file2L24-L26.

### 5.2 Mapeamento (tela → serviço) — sugestivo
| Tela/Fluxo | Finalidade | Exemplo de operação SOAP (ilustrativo) | Parâmetros chave |
|---|---|---|---|
| 4.1 / Fluxo Básico | Consultar empresa por CNPJ/Razão | `ConsultarEmpresasAutorizadas` | `cnpj` **ou** `razao` |
| 4.6 (FA4) | Consultar por Área/Tipo/Modalidade | `ConsultarEmpresasPorModalidade` | `area`, `tipo`, `modalidade` |
| 4.9 (FA5) | Consultar por Embarcação | `ConsultarPorEmbarcacao` | `imo`/`numeroCapitania`, `nome` |
| 4.10 (FA6) | Consultar por Instalação | `ConsultarPorInstalacao` | `nomeInstalacao` |
| 4.8 / 4.3 (FA2) | Trecho + Embarcações | `ConsultarTrecho` / `ConsultarEmbarcacoes` | `empresaId`/`modalidade` |
| 4.7 (FA3) | Localização Terminal | `ConsultarLocalizacaoTerminal` | `empresaId`/`instalacaoId` |
| 4.11–4.15 (FA7) | Histórico de Fiscalizações | `ConsultarHistoricoFiscalizacoes` | `empresaId`/`cnpj` |

> **Importante**: o documento oficial define **o comportamento** e **os campos apresentados** nessas telas, mas **não lista nomes de métodos**; confirme-os no WSDL antes de codificar o cliente.

### 5.3 Exemplo SOAP (request/response) — ilustrativo

**Request (por CNPJ)**
```xml
POST /AntaqService/Services.asmx HTTP/1.1
Host: sfismobile.antaq.gov.br
Content-Type: text/xml; charset=utf-8
SOAPAction: "http://antaq.gov.br/ConsultarEmpresasAutorizadas"

<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ConsultarEmpresasAutorizadas xmlns="http://antaq.gov.br/">
      <cnpj>12345678000199</cnpj>
    </ConsultarEmpresasAutorizadas>
  </soap:Body>
</soap:Envelope>
```

**Response (resumo)**
```xml
<ConsultarEmpresasAutorizadasResponse xmlns="http://antaq.gov.br/">
  <ConsultarEmpresasAutorizadasResult>
    <Empresa>
      <RazaoSocial>...</RazaoSocial>
      <CNPJ>...</CNPJ>
      <Endereco>...</Endereco>
      <Modalidade>...</Modalidade>
      <!-- Campos podem variar conforme modalidade (RN08/RN40) -->
    </Empresa>
    <!-- ...N empresas -->
  </ConsultarEmpresasAutorizadasResult>
</ConsultarEmpresasAutorizadasResponse>
```

---

## 6. Validações e Regras de UI (Resumo Ação → Regra)

- **Pesquisar (4.1)** com campo vazio → bloquear e destacar em **vermelho**; preenchido → **verde**; QRCode preenche campo fileciteturn1file1L15-L21.  
- **Cards (4.2)**: montar 1 por empresa; **ícone por área/modalidade**; em **Arrendamento** exibir **CNPJ/Razão da Instalação** (RN40) fileciteturn1file3L28-L36.  
- **4.6 Por Modalidade**: listas dependentes **Área → Tipo → Modalidade** conforme regras definidas na seção 4.6 fileciteturn1file1L25-L26.  
- **4.7 Localização**: exibir por **instalação selecionada**; mostrar **ícones no mapa** por área/modalidade; **Iniciar Fiscalização** disponível após detalhar localização fileciteturn1file1L27-L28.  
- **4.9 Por Embarcação**: exigir ao menos um campo (IMO/Capitania ou Nome) — senão **vermelho** e não pesquisa fileciteturn1file1L31-L33.  
- **4.10 Por Instalação**: obrigatório; consulta Porto/Terminal + empresa associada fileciteturn1file1L33-L34.  
- **4.11–4.15 Histórico**: apresentar campos e navegação conforme telas específicas fileciteturn1file0L42-L70.

---

## 7. Mensagens de Sistema

- **“Preencha este campo!”** (FE1) fileciteturn1file1L1-L3.  
- **“Empresa sem terminal vinculado”** (FE2) fileciteturn1file2L54-L55.  
- **“Não existem Ações Fiscalizadoras”** (FE3) fileciteturn1file0L11-L12.

---

## 8. Histórico de Alterações Relevantes (impacto no cliente)

- **3.8 (2024‑02‑23)**: consulta por modalidade passa a trazer **todas as empresas de cada Contrato de Arrendamento**; filtro no tipo **Marítima** (FA4 / 4.6) fileciteturn1file3L1-L9.  
- **3.9 (2024‑02‑23)**: **RN40** no fluxo básico e 4.2 → exibir **CNPJ da Instalação** em **Arrendamento** fileciteturn1file3L14-L23.  
- **4.0 (2024‑04‑23)**: ampliar **RN40** para exibir **CNPJ do Contrato + CNPJ da Instalação + Razão Social da Instalação**; inclusão dos campos na 4.2 fileciteturn1file3L28-L36.  
- **4.1 (2024‑08‑01)**: inclusão de **FA7** (Histórico), **FE3**, **FA8** (filtro de unidade) e campo “Histórico de Fiscalização” na 4.2; filtro “Unidade de Fiscalização” em 4.4 fileciteturn1file0L34-L41 fileciteturn1file0L84-L90.

---

## 9. Considerações para Implementação (Dev Notes)

> **Estas notas são recomendações práticas para o time — não fazem parte do documento oficial.**

- **RN40 (Arrendamento)**: padronize DTO do card para **fonte/labels** de **CNPJ/Razão Social** quando houver instalação, evitando duplicidade de “CNPJ” (empresa vs instalação).  
- **Paginação/Limite**: telas 4.2, 4.3 e histórico podem ter grande volume; pagine na UI e nos serviços.  
- **Acessibilidade**: mantenha contraste (vermelho/verde), rótulos e foco de teclado.  
- **Telemetria e RN38**: centralize `try/catch` de chamadas SOAP; capture `status`, `faultstring`, `elapsed_ms`, `payload_hash`.  
- **Testes de UI**: mocks por modalidade (Portuária/Operador/Navegação) para ícones e campos condicionais.  
- **Offline**: se houver cache local, invalide quando **parâmetros de busca mudarem**.  
- **Segurança**: o endpoint é público do órgão, mas **não exponha** chaves internas; higienize campos de pesquisa para evitar logs com PII (CNPJ).

---

## 10. Pseudocódigo (Cliente RN)

```ts
// busca genérica → mapeia para 4.2 (cards)
async function consultarEmpresas(params) {
  validarObrigatorios(params); // FE1
  try {
    const xml = buildSoapEnvelope("ConsultarEmpresasAutorizadas", params);
    const res = await httpSoapPost(ENDPOINT, xml);
    const empresas = parseEmpresas(res); // aplica RN03/RN08/RN40
    return empresas.map(mapToCard4_2);
  } catch (e) {
    logErroRN38(e); // RN38
    throw e;
  }
}
```

---

## 11. Fluxograma (ASCII)

```
[Menu] → (Consultar Autorizadas)
   → [Tipo de Consulta 4.5]
      ├─ CNPJ/Razão → [4.1] → [Validar] → [Buscar] → [4.2 Cards]
      ├─ Modalidade → [4.6] → [Buscar] → [4.2 Cards]
      ├─ Embarcação → [4.9] → [Buscar] → [4.3/4.8] → [4.2 Cards]
      └─ Instalação → [4.10] → [Buscar] → [4.2 Cards]

[4.2 Cards] ── selecionar empresa ──►
   ├─ Longitudinal/Travessia? → [4.8/4.3] → [4.4 Servidor]
   ├─ Tem localização? → [4.7 Mapa] → (Iniciar Fiscalização)
   └─ Senão → [4.4 Servidor]

Opcional: [Histórico 4.11–4.15] a partir de 4.2
```

---

## 12. Referências Internas
- Sumário oficial e enumeração de telas 4.1–4.15 fileciteturn1file1L13-L43.  
- Definições de pré‑condição, atores e descrição do UC003 fileciteturn1file1L63-L103.  
- Fluxo básico e alternativos FA1–FA6 (e regras associadas) fileciteturn1file2L4-L30 fileciteturn1file4L1-L17 fileciteturn1file4L34-L62.  
- Histórico de alterações que impactam UI/API (3.8–4.1) fileciteturn1file3L1-L9 fileciteturn1file3L14-L23 fileciteturn1file3L28-L36 fileciteturn1file0L34-L41.
