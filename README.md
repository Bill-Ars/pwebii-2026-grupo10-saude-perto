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

## Membros do grupo

| Nome | N.º de estudante | Utilizador GitHub |
|---|---|---|
| Ayrton Nhaguaga | 8267 | [@ayrton-nhaguaga](https://github.com/ayrton-nhaguaga) |
| Abelardo Miambo | 7928 | [@AbelPedro-cv](https://github.com/AbelPedro-cv) |
| Bill Ndayisaba | 7917 | [@Bill-Ars](https://github.com/Bill-Ars) |
| Edmilson Conge | 7926 | [@aresgrouplda](https://github.com/aresgrouplda) |
## Fonte de dados

- **OpenStreetMap**, através da **Overpass API** (`https://overpass-api.de/api/interpreter`, com o servidor alternativo `overpass.kumi.systems`). A consulta procura elementos com `amenity=hospital|clinic|doctors|pharmacy` ou `healthcare=*` dentro da área de cada cidade.
- Licença: [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/), © contribuidores do OpenStreetMap. A atribuição aparece no rodapé da aplicação.
- **Cópia local (alternativa):** se a API estiver em baixo, a aplicação usa os ficheiros `public/dados/<cidade>.json`, gerados com `npm run dados`. Cada ficheiro guarda a origem, a licença e a data de recolha (`recolhidoEm`).
- Os dados nunca estão escritos à mão nos componentes: o acesso está em `src/services/overpass.js` e nos composables `useUnidades.js` e `useUnidade.js`.

## Serviço de e-mail

- **EmailJS** (plano gratuito), chamado a partir do browser com `@emailjs/browser`.
- Só é usada a *public key* do EmailJS, e os domínios autorizados estão limitados ao nosso GitHub Pages no painel do serviço. As chaves vêm de variáveis de ambiente e nunca estão no código.
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
