# SFISMobile – Especificação de Caso de Uso  
## UC003 – Consultar Autorizada  
**Versão 4.1**  
**Agência Nacional de Transportes Aquaviários – Secretaria de Tecnologia da Informação**

---

## Controle de Alterações

| Versão | Data | Alteração | Autor |
|---------|-------|------------|--------|
| 1.0 | 11/07/2018 | Criação do Documento | Amanda Fonseca |
| 2.0 | 14/05/2019 | Alterações no fluxo básico e FA1–FA3; inclusão de FE2 e referências | Larissa Lobato |
| 2.1 | 28/05/2019 | Alteração dos passos 5 e 6 do FA1 (consulta geográfica via Sistema Corporativo) | Larissa Lobato |
| 2.2 | 19/06/2019 | Inclusão da Interface “Consultar Trecho” e itens 3.11 e 3.12 | Larissa Lobato |
| 2.3 | 24/07/2019 | Inclusão da RN08 em fluxos básicos e alternativos | Rodrigo Vasconcelos |
| 3.0 | 08/08/2019 | Exclusão de passos de serviços obsoletos e seções redundantes | Larissa Lobato |
| 3.1 | 12/11/2019 | Alteração da regra de exibição do campo “Instrumento” | Larissa Lobato |
| 3.2 | 10/12/2019 | Inclusão das RN14 e RN15 | Larissa Lobato |
| 3.3 | 22/03/2021 | Inclusão da RN24 e ajuste no FA4 | Diego Fernandez (Mirante Tecnologia) |
| 3.4 | 23/11/2021 | Inclusão de consultas por Embarcação e Instalação | Andrei Martins (Mirante) |
| 3.5 | 15/08/2023 | Inclusão das telas 4.9 e 4.10, FA5 e FA6 | Carlos Caldas (Mirante) |
| 3.6 | 23/08/2023 | Ajuste da exibição geográfica múltipla no FA3 e Interface 4.7 | Carlos Caldas |
| 3.7 | 06/09/2023 | Inclusão da RN38 (log de erros das aplicações) | Carlos Caldas |
| 3.8 | 23/02/2024 | Inclusão de filtro marítimo e agrupamento por contrato | Carlos Caldas |
| 3.9 | 23/02/2024 | Inclusão da RN40 (CNPJ da Instalação) | Carlos Caldas |
| 4.0 | 23/04/2024 | Inclusão de CNPJ e Razão Social da Instalação (RN40) | Carlos Caldas |
| 4.1 | 01/08/2024 | Inclusão de FA7, FA8, FE3 e novas telas de histórico (4.11–4.15) | Carlos Caldas |

---

## Sumário

1. [Introdução](#1-introdução)  
2. [Especificação do Caso de Uso](#2-especificação-do-caso-de-uso)  
3. [Informações Complementares](#3-informações-complementares)  
4. [Detalhamento da Apresentação](#4-detalhamento-da-apresentação)

---

## 1. Introdução

### 1.1 Finalidade
Descrever as funcionalidades do caso de uso **Consultar Autorizada** no sistema SFISMobile.

### 1.2 Definições, Acrônimos e Abreviações
Não se aplica.

### 1.3 Referências
- **REF1:** Caso de Uso – *Efetuar Login*  
- **REF2:** Caso de Uso – *Aplicar Tipo de Fiscalização*

---

## 2. Especificação do Caso de Uso

### 2.1 Identificação
| ID | Nome |
|----|------|
| UC003 | Consultar Autorizada |

### 2.2 Descrição
Permite ao **Fiscal** consultar e aplicar fiscalizações a uma empresa.

### 2.3 Atores
| Ator | Descrição |
|-------|------------|
| Fiscal | Consultar empresa autorizada no sistema SFISMobile. |

### 2.4 Precondição
O usuário deve possuir acesso e estar autenticado no SFISMobile.

---

### 2.5 Fluxo Básico – Consultar Empresa Autorizada
1. Ator seleciona **Consultar Autorizadas**.  
2. Sistema apresenta tipo de consulta (ver item 4.5).  
3. Ator escolhe tipo (CNPJ, Razão Social, Modalidade, Embarcação ou Instalação).  
4. Sistema exibe interface adequada (ver 4.1).  
5. Ator insere parâmetro e clica em **Pesquisar**.  
6. Sistema valida campo obrigatório. [FE1]  
7. Sistema recupera e exibe resultados. [RN03][RN08][RN14][RN24][RN38][RN39][RN40]  
8. Ator visualiza lista. [FA1]  
9. Caso de uso encerrado.

---

### 2.6 Fluxos Alternativos
Inclui FA1–FA8: Consultar Servidor, Embarcação, Localização, Modalidade, Embarcação, Instalação, Histórico e Filtro de Unidades.

### 2.7 Fluxos de Exceção
- **FE1:** Campo obrigatório não informado  
- **FE2:** Empresa sem terminal vinculado  
- **FE3:** Não existem Ações Fiscalizadoras  

### 2.8 Pós-Condição
Não se aplica.

### 2.9 Extensões
**PE1:** Selecionar Tipo de Fiscalização → UC001_Selecionar_Tipo_de_Fiscalização

### 2.10 Inclusões
Não se aplica.

---

## 3. Informações Complementares
Não se aplica.

---

## 4. Detalhamento da Apresentação
*(Interfaces 4.1 a 4.15 com campos, opções e regras completas conforme documento original.)*

---

© ANTAQ / Mirante Tecnologia — Documento Técnico SFISMobile UC003
