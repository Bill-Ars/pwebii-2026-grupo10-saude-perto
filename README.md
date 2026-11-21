# Saúde Perto

Aplicação Web, feita com Vue.js, que ajuda a encontrar **hospitais, centros de saúde, consultórios e farmácias** perto de si em 11 cidades de Moçambique. Mostra o contacto, o horário e a distância de cada unidade, indica como lá chegar e permite **enviar os dados por e-mail** a um familiar.

Projecto Final de Programação Web II · LECC31 · ISUTC · 2026 · Docente: Ivan Ruby · **Grupo 10**

- **Aplicação publicada:** https://bill-ars.github.io/pwebii-2026-grupo10-saude-perto/
- **Repositório:** https://github.com/Bill-Ars/pwebii-2026-grupo10-saude-perto

## Problema que resolve

Muitas pessoas em Moçambique não sabem qual é a unidade de saúde ou a farmácia mais próxima, nem o seu contacto ou horário, sobretudo numa cidade que não conhecem ou numa situação urgente. Essa informação está dispersa e raramente está disponível de forma simples no telemóvel. O Saúde Perto junta esses dados numa página leve, pensada para telemóveis com dados móveis caros e rede instável. O problema está descrito em detalhe no documento BRD (`PF_Grupo10_PWEBII_2026.pdf`).

## Funcionalidades

- Escolha da cidade, ou detecção da cidade mais próxima pela localização do telemóvel
- Lista de unidades com filtros por tipo, pesquisa sem acentos (ex.: «farmacia») e ordenação pela distância
- Página de detalhe com telefone (ligar com um toque), horário, endereço e link «Como chegar»
- Envio por e-mail dos dados da unidade (formulário com validação)
- Cache de 24 horas no telemóvel, para não repetir pedidos e poupar dados móveis
- Estados de carregamento, erro (com «Tentar novamente») e lista vazia, e aviso quando está sem Internet
- Página 404 para endereços inexistentes
- Tema escuro e claro, com interruptor no cabeçalho (a escolha fica guardada no browser)

## Membros do grupo

| Nome | N.º de estudante | Utilizador GitHub |
|---|---|---|
| Ayrton Nhaguaga | 8267 | [@ayrton-nhaguaga](https://github.com/ayrton-nhaguaga) |
| Abelardo Miambo | 7928 | [@AbelPedro-cv](https://github.com/AbelPedro-cv) |
| Bill Ndayisaba | 7917 | [@Bill-Ars](https://github.com/Bill-Ars) |
| Edmilson Conge | 7926 | [@aresgrouplda](https://github.com/aresgrouplda) |

## Fonte de dados

- **OpenStreetMap**, através da **Overpass API**. Os pedidos são enviados em paralelo a três servidores públicos (`overpass-api.de`, `overpass.private.coffee` e `overpass.kumi.systems`) e é usada a primeira resposta válida. A consulta procura elementos com `amenity=hospital|clinic|doctors|pharmacy` dentro da área de cada cidade.
- Licença: [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/), © contribuidores do OpenStreetMap. A atribuição aparece no rodapé da aplicação.
- **Cópia local (mostrada primeiro):** para os dados aparecerem sem espera, a aplicação carrega primeiro `public/dados/<cidade>.json` (cópia do dataset obtida da Overpass API a 21/11/2026, licença ODbL; a data dos dados está no campo `osm3s.timestamp_osm_base` de cada ficheiro) e, em segundo plano, pede os dados actualizados à API. Os ficheiros podem ser regenerados com `npm run dados`.
- Os dados nunca estão escritos à mão nos componentes: o acesso está em `src/services/overpass.js` e nos composables `useUnidades.js` e `useUnidade.js`.

## Serviço de e-mail

- **EmailJS** (plano gratuito), chamado a partir do browser com `@emailjs/browser`.
- Só é usada a *public key* do EmailJS, que foi desenhada para ser usada no browser. A *private key* nunca é usada nem guardada. Os identificadores vêm de variáveis de ambiente e não estão escritos no código.
- A restrição de domínios autorizados só existe nos planos pagos do EmailJS. No plano gratuito, o risco de abuso fica limitado pela quota de 200 envios por mês, e a aplicação desactiva o botão durante o envio para evitar e-mails repetidos.
- Na publicação, os valores ficam em **Settings → Secrets and variables → Actions** e são lidos pelo GitHub Actions durante o *build*.

## Correr localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env    # preencher com os valores do EmailJS
npm run dev             # abre em http://localhost:5173/pwebii-2026-grupo10-saude-perto/
```

Outros comandos:

```bash
npm run build     # versão de produção na pasta dist/
npm run preview   # pré-visualizar a versão de produção
npm run dados     # actualizar a cópia local do dataset em public/dados/
```

### Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_EMAILJS_SERVICE_ID` | ID do serviço de e-mail criado no EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do modelo de mensagem no EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | *Public key* da conta EmailJS |

O ficheiro `.env` está no `.gitignore` e nunca deve ser enviado para o repositório.

## Estrutura do projecto

```
src/
├── components/   AppCabecalho, AppRodape, SeletorCidade, FiltroTipos, CaixaPesquisa,
│                 CartaoUnidade, BadgeTipo, EstadoPedido, FormularioEnvio, IconeSvg
├── views/        InicioView, CidadeView, UnidadeView, SobreView, NaoEncontradoView
├── composables/  useUnidades, useUnidade, useLocalizacao, useFormulario, useEmail, useLigacao
├── services/     overpass.js (pedidos à API), cache.js (memória + localStorage)
├── router/       index.js (hash history, 5 rotas, rota com parâmetros, 404)
├── data/         cidades.js, tipos.js, equipa.js (configuração da aplicação)
└── utils/        distancia.js, texto.js, validacao.js
```

### Rotas

| Rota | Página |
|---|---|
| `#/` | Início: escolher a cidade ou usar a localização |
| `#/cidade/:cidadeId` | Lista de unidades da cidade, com filtros e pesquisa |
| `#/unidade/:osmType/:osmId` | Detalhe da unidade e envio por e-mail |
| `#/sobre` | Sobre a aplicação, fontes e equipa |
| qualquer outra | Página não encontrada (404) |

## Tecnologias e bibliotecas

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`), [Vite](https://vite.dev/) e [Vue Router 4](https://router.vuejs.org/)
- [@emailjs/browser](https://www.emailjs.com/docs/sdk/installation/) para o envio de e-mail
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) / OpenStreetMap para os dados
- Publicação com GitHub Actions (`.github/workflows/deploy.yml`) no GitHub Pages

## Uso de ferramentas de IA

Usámos o **Claude** (Anthropic) para:

- discutir e escolher o tema do projecto e a fonte de dados;
- propor a estrutura inicial do projecto, dos composables e das rotas, e rever o código;
- apoiar a pesquisa de dados e a revisão do texto do BRD.

Todo o código e todo o texto foram revistos, testados e compreendidos pelo grupo, que é responsável pelo que foi entregue.

## Fluxo de trabalho no Git

Cada membro trabalhou num branch próprio (`nome/funcionalidade`) e integrou o seu trabalho no `main` através de um pull request, revisto e aprovado por outro membro, com a opção «Create a merge commit».
