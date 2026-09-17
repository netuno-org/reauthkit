# Referência de configuração

Esta referência abrange todos os caminhos configuráveis de `config/sample.json`. Copie esse ficheiro para `config/_development.json` ou `config/_production.json` e substitua as credenciais e os URLs de exemplo. Os caminhos com `[]` aplicam-se a cada elemento do array.

## Aplicação e setup

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `name` | `reauthkit` | Nome da aplicação Netuno. Deve corresponder ao nome da pasta da aplicação. |
| `language` | `pt_PT` | Código do idioma predefinido da aplicação. |
| `locale` | `pt_PT` | Locale predefinido para formatação regional. |
| `setup.enabled` | `true` | Ativa a fase de setup da aplicação. |
| `setup.schema.execution` | `true` | Executa os scripts de setup do esquema. |
| `setup.schema.auto_create` | `true` | Permite criar automaticamente estruturas de esquema em falta. |
| `setup.scripts.execution` | `true` | Executa os restantes scripts de setup. |

## Configuração do website

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `settings.website.services.prefix` | `http://localhost:9000/services` | URL base utilizada pelo cliente de serviços do website. |
| `settings.website.websocket.url` | `ws://localhost:9000/ws/private/` | URL WebSocket utilizada pelo website. O cliente acrescenta o token de acesso no parâmetro `auth`. |
| `settings.website.websocket.servicesPrefix` | `/services` | Prefixo utilizado quando o cliente WebSocket invoca um serviço Netuno. |
| `settings.public` | `{}` | Objeto de extensão vazio para configurações que uma aplicação decida expor publicamente. O ReAuthKit não o lê. |

No arranque, `server/core/_config.js` escreve `website/public/reauthkit.js` em desenvolvimento ou `website/dist/reauthkit.js` em produção. Além dos valores de serviços e WebSocket acima, o ficheiro do browser contém os valores gerados `push.key`, `auth.altcha` e `auth.providers.{facebook,google,microsoft,github,discord}`, obtidos do Netuno; não são chaves adicionais de `sample.json`.

## Tarefa agendada

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `cron.jobs[].name` | `ws-sessions` | Identificador da tarefa. |
| `cron.jobs[].config` | `0 0/15 * * * ?` | Expressão cron Quartz; o exemplo executa a cada 15 minutos. |
| `cron.jobs[].url` | `/services/jobs/ws-sessions` | Serviço executado pelo agendador. Remove da base de dados sessões WebSocket que já não existem. |

## SMTP

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `smtp.default.enabled` | `true` | Ativa a ligação SMTP predefinida. |
| `smtp.default.host` | `example.org` | Nome do servidor SMTP. |
| `smtp.default.port` | `465` | Porta do servidor SMTP. |
| `smtp.default.ssl` | `true` | Ativa a ligação SSL. |
| `smtp.default.from` | `noreply@example.org` | Endereço de remetente predefinido. |
| `smtp.default.username` | `noreply@example.org` | Nome de utilizador SMTP. |
| `smtp.default.password` | apenas exemplo | Palavra-passe SMTP. Substitua-a e não submeta um segredo real no repositório. |

A recuperação de palavra-passe utiliza esta ligação e o template `server/templates/recovery-mail.html`.

## Comandos de desenvolvimento

Cada objeto de `commands[]` descreve um processo iniciado pelo Netuno com a aplicação.

| Caminho | Valores de exemplo | Finalidade |
| --- | --- | --- |
| `commands[].path` | `ui`, `website` | Diretório de trabalho relativo à raiz da aplicação. |
| `commands[].command` | `bun run watch`, `bun run dev` | Comando de desenvolvimento de longa duração. |
| `commands[].install` | `bun install` | Comando de instalação das dependências. |
| `commands[].enabled` | `true` | Ativa o comando. Desative todos os watchers em produção. |

O pacote do website disponibiliza `dev`, `build`, `lint` e `preview`; a interface de backoffice disponibiliza `dev`, `build`, `watch`, `lint` e `preview` através do Bun/npm.

## Base de dados

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `db.default.engine` | `pg` | Motor da base de dados; o esquema desta aplicação destina-se ao PostgreSQL. |
| `db.default.host` | `localhost` | Servidor da base de dados. |
| `db.default.port` | `5432` | Porta da base de dados. |
| `db.default.name` | `reauthkit` | Nome da base de dados. |
| `db.default.username` | `postgres` | Nome de utilizador da base de dados. |
| `db.default.password` | apenas exemplo | Palavra-passe da base de dados. Substitua-a e não submeta um segredo real no repositório. |

## Autenticação

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `auth.attempts.enabled` | `true` | Ativa a limitação de tentativas de autenticação falhadas. |
| `auth.attempts.interval` | `60` | Intervalo da contagem de falhas, em minutos. |
| `auth.attempts.maxFails` | `5` | Máximo de falhas consecutivas no intervalo. |
| `auth.altcha.enabled` | `true` | Ativa a proteção ALTCHA nos fluxos públicos de autenticação. O registo valida o parâmetro `altcha` quando esta opção está ativa. |
| `auth.altcha.admin.enabled` | `true` | Ativa o ALTCHA na autenticação da administração do Netuno. |
| `auth.jwt.enabled` | `true` | Ativa a autenticação JWT. |
| `auth.jwt.secret` | apenas exemplo | Segredo usado para assinar JWTs. Substitua-o por um segredo aleatório com pelo menos 16 caracteres; recomendam-se 32 ou mais. |
| `auth.jwt.expires.access` | `1440` | Duração do token de acesso, em minutos. |
| `auth.jwt.expires.refresh` | `1440` | Duração do token de renovação, em minutos. |

O website também utiliza os serviços da plataforma Netuno `/_auth`, `/_auth_provider` e `/_altcha`. Estas rotas não são implementadas por ficheiros deste repositório.

## Endpoint WebSocket

Cada objeto de `ws.endpoints[]` regista um endpoint WebSocket do Netuno.

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `ws.endpoints[].name` | `user` | Identificador do endpoint. |
| `ws.endpoints[].enabled` | `true` | Ativa o endpoint. |
| `ws.endpoints[].sendTimeout` | `10000` | Timeout de envio, em milissegundos. |
| `ws.endpoints[].idleTimeout` | `0` | Timeout de inatividade, em milissegundos; `0` desativa-o. |
| `ws.endpoints[].maxText` | `15000` | Tamanho máximo da mensagem de texto, em bytes. |
| `ws.endpoints[].public` | `/ws/private` | Caminho público do WebSocket. |
| `ws.endpoints[].path` | `/` | Caminho interno do endpoint. |
| `ws.endpoints[].service` | `/services/ws/private` | Serviço de destino para os métodos de ligação, mensagem e desligação. |

## CORS

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `cors[].enabled` | `true` | Ativa esta regra CORS. |
| `cors[].origins[]` | `*` | Padrão de origens permitidas. Substitua o wildcard por origens de confiança em produção. |

## OpenAPI

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `openapi.host` | `http://localhost:9000` | Host utilizado na definição da API gerada. |
| `openapi.basePath` | `/services` | Caminho base comum dos serviços. |
| `openapi.schemes[]` | `http` | Esquemas permitidos na definição gerada. |
| `openapi.servers[].url` | `http://localhost:9000/services` | URL do servidor OpenAPI. |
| `openapi.servers[].description` | `Local Development` | Descrição legível do servidor. |

## Contentor de extensão

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `remote` | `{}` | Objeto de extensão vazio para ligações remotas com nome. O exemplo do ReAuthKit não define nenhuma. |

A superfície HTTP/WebSocket local completa está documentada na [Referência da API e extensões](api-pt_PT.md).
