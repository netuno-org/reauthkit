# Referência da API e extensões

Esta é uma referência baseada no código dos scripts roteáveis em `server/services` e dos exports reutilizáveis em `server/core/lib`. A URL base predefinida é `http://localhost:9000/services`.

O Netuno associa um ficheiro com o nome de um método HTTP ao caminho do seu diretório. Por exemplo, `server/services/profile/get.js` corresponde a `GET /profile`; o endpoint WebSocket encaminha ligação, mensagem e desligação para `POST`, `PUT` e `DELETE /ws/private`, respetivamente.

## Mapa de funcionalidades e rotas visíveis

| Rota do website | Acesso | Funcionalidade fornecida |
| --- | --- | --- |
| `/` | Público | Redireciona um visitante autenticado para `/dashboard`; caso contrário, para `/login`. |
| `/login` | Público | Autenticação por palavra-passe/JWT, credenciais memorizadas opcionalmente, ALTCHA, diálogo de recuperação de palavra-passe e links dos fornecedores sociais ativos. |
| `/login/:provider` | Público | Conclui o callback de autenticação de um fornecedor social do Netuno; redireciona para `/register` quando a conta do fornecedor ainda não tem conta local. |
| `/register` | Público | Registo por palavra-passe ou por fornecedor social ativo, com ALTCHA quando configurado. |
| `/register/:provider` | Público | Conclui o registo com fornecedor social e autentica a nova conta. |
| `/recovery` | Público | Obtém a chave de recuperação do fragmento do URL e define uma nova palavra-passe. |
| `/dashboard` | Autenticado | Ecrã de boas-vindas da área reservada com o nome do perfil. |
| `/profile/edit` | Autenticado | Edita os campos de identidade, a palavra-passe e o avatar recortado do utilizador atual. |
| `/profile/preferences` | Autenticado | Ativa ou desativa as preferências de notificação de amigos e mensagens. |
| `/profile/view` | Autenticado | Mostra o perfil do utilizador autenticado com uma ação de edição. |
| `/profile/:uid` | Autenticado | Mostra o perfil de outro utilizador com ações de amizade (adicionar, aceitar, remover, cancelar) e uma ligação para mensagens. |
| `/friends` | Autenticado | Amigos aceites e pedidos recebidos/enviados; pesquisa, aceitação, recusa, cancelamento, remoção e acesso ao perfil/mensagens. |
| `/people` | Autenticado | Diretório de perfis paginado e pesquisável. |
| `/messages` | Autenticado | Separadores de conversas e amigos, presença, contagens de não lidas, histórico paginado, envio/resposta/edição/eliminação, reações e marcação de leitura através de envelopes de serviço WebSocket. |
| `/notifications` | Autenticado | Separadores de não lidas/todas, paginação, marcação como lida/todas como lidas, eliminação e navegação para o perfil relacionado. |
| `/other-page` | Autenticado | Página placeholder da área reservada para extensão. |
| Qualquer rota desconhecida | Shell público | Apresenta a página de conteúdo não encontrado. |

Ao entrar na área reservada, o website carrega o perfil, abre o WebSocket autenticado e tenta registar uma subscrição Web Push. O bundle `ui` separado injeta no dashboard do backoffice Netuno um botão contador React/Ant Design de demonstração; não é uma funcionalidade de gestão da aplicação.

## Estado da implementação

- **Implementado** significa que o script executa lógica da aplicação.
- **Desativado** significa que existe lógica, mas é inacessível no repositório tal como é fornecido.
- **Placeholder** significa que o ficheiro roteável está vazio e não produz uma resposta da aplicação.
- O acesso é controlado centralmente por `server/core/_service_config.js`, não em cada handler. Em desenvolvimento, esse hook executa `_service.allow()` para todos os serviços. Consulte as [ressalvas de controlo de acesso](#ressalvas-de-controlo-de-acesso) antes de publicar.

## Serviços HTTP

Todos os caminhos são relativos a `/services`.

| Método e caminho | Estado | Entrada | Comportamento atual |
| --- | --- | --- | --- |
| `DELETE /friend` | Implementado | `uid` | Remove a amizade nos dois sentidos e as notificações `friend_*` relacionadas; envia eventos de atualização de notificações; devolve `{ "result": true, "status": "none" }` ou 404 `user-not-found`. |
| `GET /friend/list` | Implementado | — | Devolve `{ result, friends, received, sent }`. `friends` contém as amizades aceites; `received` e `sent` contêm pedidos pendentes. Cada item tem `uid`, `name`, `email`, `avatar` (booleano) e `online`; os itens aceites têm `accepted_on` e os pendentes `request_on`. |
| `POST /friend` | Implementado | `uid` | Envia um pedido de amizade, aceita um pedido recebido ou devolve o estado existente. Devolve `{ result: true, status }` com `friend` ou `pending_sent`; 400 `cannot-friend-self`; 404 `user-not-found`. Cria uma notificação `friend`. |
| `PUT /friend` | Implementado | `uid` | Aceita um pedido recebido, cria ou atualiza a amizade recíproca e cria uma notificação `friend` para o requerente. Devolve `{ result: true, status: "friend" }` ou 404 `user-not-found`. |
| `DELETE /message` | Implementado | `uid` | Elimina logicamente (`deleted_at`, `active=false`) uma mensagem enviada pelo perfil autenticado; transmite `DELETE message`; devolve `{ result: true, content }`; erros `message-not-found` e `unauthorized`. |
| `GET /message` | Placeholder | — | Ponto de extensão vazio; a obtenção de uma mensagem individual não está implementada. |
| `POST /message` | Implementado | `to`, `message`, `parent_uid` opcional | Guarda uma mensagem (opcionalmente como resposta), envia eventos `message/new` e de contagem de não lidas, e devolve `{ result: true, content }`. |
| `PUT /message` | Implementado | `uid`, `message` | Edita uma mensagem enviada pelo perfil autenticado no prazo de uma hora; transmite `message/edit`; devolve `{ result: true, content }`; erros `message-not-found`, `unauthorized` e `edit-time-expired`. |
| `POST /message/list` | Implementado | `with`, `page` e `pageSize` opcionais | Marca como lidas as mensagens recebidas de `with` na página 1 e devolve `{ items, page, total }` com as mensagens por ordem cronológica. O tamanho predefinido da página é 10. |
| `GET /message/read/mark` | Implementado | `from`, `uid` | Marca a mensagem como lida e transmite `message/read`; devolve `{ result: true, from }`. O predicado SQL não valida o destinatário. |
| `GET /message/unread/count` | Implementado | — | Devolve `{ total }` para o perfil autenticado. Devolve 0 quando o tipo de notificação `message` está desativado nas preferências. |
| `GET /message/chat/list` | Implementado | — | Devolve um array simples (não envolvido em `result`) de conversas: `uid`, `name`, `avatar`, `online`, `latest_message` e `unread_messages`, ordenadas pela mensagem mais recente. |
| `DELETE /message/chat` | Implementado | `partner_uid` | Elimina todas as mensagens entre o perfil autenticado e o parceiro, envia atualizações da contagem de não lidas e devolve `{ result: true }` ou `{ result: false, error: "user-not-found" }`. |
| `PUT /message/reaction` | Implementado | `uid`, `reaction` opcional | Define ou remove uma reação numa mensagem recebida pelo perfil autenticado; transmite `PUT message`; devolve `{ result: true, content }`; erros `message-not-found` e `unauthorized`. |
| `DELETE /notification` | Implementado | `uid` | Elimina logicamente (`active=false`) uma notificação do perfil autenticado; envia a contagem de não lidas; devolve `{ result: true, total }`; erro `not-found`. |
| `POST /notification/list` | Implementado | `page`, `pageSize` e `unread` opcionais | Devolve `{ items, page, pageSize, total }` com as notificações ativas, das mais recentes para as mais antigas; `unread=true` filtra apenas as não lidas. |
| `PUT /notification/read` | Implementado | `all` e `uid` opcionais | Marca todas as notificações não lidas como lidas (`all=true`) ou uma notificação por `uid`; envia a contagem de não lidas; devolve `{ result: true, total }`. |
| `GET /notification/settings` | Implementado | — | Devolve `{ result: true, data: [{ id, code, name, enabled }] }` para todos os tipos de notificação; as preferências em falta assumem-se ativas. Erro `not-logged` quando não existe perfil. |
| `POST /notification/settings` | Implementado | `code`, `enabled` opcional | Cria ou atualiza a preferência de notificação de um tipo; devolve `{ result: true, code, enabled }`; erros `not-logged` e `type-not-found`. Também envia uma atualização de `message/unread/count`. |
| `GET /notification/unread/count` | Implementado | — | Devolve `{ total }` para o perfil autenticado. |
| `POST /notification/subscribe` | Implementado | `endpoint`, `keys.p256dh`, `keys.auth` | Guarda uma subscrição Web Push; devolve 404 `not-exist` quando não existe perfil; caso contrário, `{ result: true }`. |
| `GET /profile` | Implementado | `uid` opcional; caso contrário, perfil autenticado | Devolve `{ result: true, data }` com `uid`, `name`, `username`, `email`, `avatar` (booleano), `group` e `friendship_status` quando disponível (`self`, `friend`, `pending_sent`, `pending_received`, `none`); 404 `not-exist`. |
| `POST /profile` | Implementado | fluxo por palavra-passe: `name`, `username`, `email`, `password`, `altcha` opcional; fluxo por fornecedor: `name`, `username`, `code`, `provider` | Regista um utilizador Netuno no grupo `generic` e cria o perfil. A identidade do fornecedor é obtida pelo fluxo de fornecedores do Netuno. Devolve `{ result: true }`; 409 `invalid-provider-data`, `invalid-altcha-payload`, `email-already-exists` ou `user-already-exists`. |
| `PUT /profile` | Implementado | Multipart `name`, `username`, `email`, `password` opcional, `avatar` opcional | Atualiza o utilizador Netuno e o registo `profile`; um novo avatar é redimensionado para um JPEG de 500×500. Devolve `{ result: true }`. |
| `DELETE /profile` | Desativado | — | Começa com um `_exec.stop()` incondicional. Se essa linha for removida deliberadamente, elimina o perfil autenticado e o utilizador Netuno (200 ou 404). |
| `GET /profile/avatar` | Implementado | `uid` obrigatório | Envia o avatar guardado com cabeçalhos no-cache; usa o content type JPEG quando a extensão guardada é jpg/jpeg e PNG nos restantes casos; devolve 404 vazio quando o perfil ou o avatar não existem. |
| `POST /profile/list` | Implementado | `page`, `pageSize` e `search` opcionais | Devolve `{ items, page, pageSize, total }` com perfis ativos, excluindo o perfil autenticado; cada item tem `uid`, `name`, `username`, `email`, `avatar` (booleano), `group` e `online`. A pesquisa não distingue maiúsculas de minúsculas e abrange nome, nome de utilizador e email. O tamanho predefinido da página é 12. |
| `OPTIONS /recovery` | Implementado | — | Devolve `{ result: true }` para preflight/deteção da funcionalidade. |
| `POST /recovery` | Implementado | `email` | Cria uma chave de recuperação válida por um dia e envia o email de recuperação; devolve `{ result: true }`, 404 `not-exists` ou 409 `user-not-active`. O URL de recuperação deriva do cabeçalho `Origin` do pedido. |
| `PUT /recovery` | Implementado | `key`, `password` | Altera a palavra-passe quando a chave existe e não expirou; caso contrário, devolve 404 `user-not-found`; devolve `{ result: true }`. |

`POST /profile` depende também do grupo Netuno `generic`. No registo por fornecedor, a identidade vem do fluxo de fornecedores do Netuno e não de um email enviado pelo browser. A listagem de perfis é `POST /profile/list`; não existe uma rota `GET /profile/list`.

## Serviço de ciclo de vida WebSocket

O socket público configurado é `/ws/private`; `ws.endpoints[].service` encaminha-o para `/services/ws/private`.

| Método e serviço | Estado | Comportamento atual |
| --- | --- | --- |
| `POST /ws/private` | Implementado | Ao ligar, guarda a sessão do perfil autenticado e envia `friend/status/changed` com `online: true` às sessões dos amigos. |
| `PUT /ws/private` | Placeholder | Ponto de extensão vazio para uma mensagem WebSocket bruta recebida. Os pedidos da aplicação usam normalmente o envelope de serviço do cliente WebSocket. |
| `GET /ws/private` | Placeholder | Ponto de extensão vazio para um evento de ligação/leitura disponibilizado pelo runtime. |
| `DELETE /ws/private` | Implementado | Ao desligar, elimina a sessão e envia `friend/status/changed` com `online: false` às sessões dos amigos. |

O website envia o JWT como `?auth=<token-de-acesso>`. `server/core/_service_config.js` só permite o serviço do socket quando `_auth.isJWT()` é verdadeiro.

### Mensagens de serviço usadas pelo website

| Serviço | Direção | Payload/resultado |
| --- | --- | --- |
| `friend/status/changed` | Evento do servidor | `content` contém `{ uid, online }`. |
| `message` (POST) | Pedido/resposta do cliente | `data` contém `to`, `message` e `parent_uid` opcional; a resposta contém a mensagem formatada em `content`. |
| `message` (PUT) | Pedido/resposta do cliente | `data` contém `uid` e `message`; a resposta contém a mensagem formatada em `content`. |
| `message` (DELETE) | Pedido/resposta do cliente ou evento do servidor | Pedido com `data.uid`; no evento, `data.with` identifica o outro perfil; `content` contém a mensagem formatada. |
| `message` (PUT, atualização de reação) | Evento do servidor | `data.with` identifica o outro perfil; `content` contém a mensagem formatada. |
| `message/list` (POST) | Pedido/resposta do cliente | `data` contém `with`, `page` e `pageSize`; `content` contém `{ items, page, total }`. |
| `message/new` (POST) | Evento do servidor | `data.with` identifica o outro perfil; `content` contém `uid`, `from`, `to`, `message`, `sent_at`, `read_at`, `deleted_at`, `active`, `edited_at`, `reaction` e, opcionalmente, `parent`. |
| `message/edit` (PUT) | Evento do servidor | `data.with` identifica o outro perfil; `content` contém a mensagem formatada. |
| `message/read` (PUT) | Evento do servidor | `data.with` identifica o outro perfil; `content` contém `{ all: true, read_at }` ou `{ uid, read_at }`. |
| `message/read/mark` (GET) | Pedido/resposta do cliente | `data` contém `uid` e `from`. |
| `message/reaction` (PUT) | Pedido/resposta do cliente | `data` contém `uid` e `reaction`; a resposta contém a mensagem formatada em `content`. |
| `message/chat/list` (GET) | Pedido/resposta do cliente ou atualização do servidor | `content` contém o array simples de conversas. |
| `message/unread/count` | Atualização do servidor | `content.total` contém a contagem de não lidas. |
| `notification/unread/count` | Atualização do servidor | `content.total` contém a contagem de não lidas. |
| `notification/new` | Evento do servidor | `content` contém os dados da notificação (`uid`, `title`, `content`, `sent_at`, `read_at`, `extra`, `type`). |

## Serviço agendado

| Caminho | Estado | Comportamento atual |
| --- | --- | --- |
| `/services/jobs/ws-sessions` | Implementado | Percorre `profile_ws_session`, elimina registos cuja `_ws.session(id)` não existe e devolve `{ "result": true }`. O agendamento Quartz de exemplo executa-o a cada 15 minutos. |

## API dos módulos server-core

Estes objetos com export predefinido são APIs de extensão reutilizáveis. Importe-os através dos aliases do pacote, por exemplo `import profile from "#core/lib/profile.js"`.

| Módulo e função | Contrato |
| --- | --- |
| `profile.getFullDataByUid(uid)` | Devolve um mapa Netuno com `uid`, `name`, `username`, `email`, `avatar` booleano e `group`, ou `null`. |
| `profile.getLoggedIn()` | Devolve o registo `profile` associado ao `_user.id` atual, ou nenhum registo. |
| `profile.getByUid(uid)` | Devolve o registo `profile` do UID, ou nenhum registo. |
| `profile.wsSendService(dbProfile, message)` | Envia um envelope de serviço como cliente para todas as sessões WebSocket guardadas do perfil. |
| `profile.wsSendAsService(dbProfile, message)` | Envia um envelope de serviço como servidor para todas as sessões WebSocket guardadas do perfil. |
| `friend.notifyAllWithStatusChanged(dbProfile, online)` | Notifica todas as sessões dos amigos com `friend/status/changed`. |
| `message.getByUid(uid)` | Devolve o registo `message` do UID, ou nenhum registo. |
| `message.getUnreadTotal(dbProfile)` | Devolve o número de mensagens não lidas destinadas ao perfil, ou 0 quando o perfil não existe ou o tipo de notificação `message` está desativado. |
| `message.toData(dbProfileFrom, dbProfileTo, dbMessage)` | Converte um registo de mensagem no mapa público da mensagem, incluindo `uid`, `from`, `to`, `message`, `sent_at`, `read_at`, `deleted_at`, `active`, `edited_at`, `reaction` e um objeto `parent` opcional. |
| `notification.create(dbProfile, typeCode, title, content, extra)` | Guarda uma notificação, envia Web Push às subscrições ativas, desativa subscrições expiradas e emite eventos de contagem de não lidas e `notification/new`. O tipo de notificação pedido tem de existir e estar ativo. |
| `notification.isEnabled(dbProfile, typeCode)` | Indica se o perfil tem notificações ativas para o tipo. |
| `notification.getUnreadTotal(dbProfile)` | Devolve o número de notificações ativas não lidas do perfil, excluindo os tipos desativados. |
| `notification.toData(dbNotification)` | Converte um registo de notificação no mapa público da notificação. |

## Pontos de extensão do ciclo de vida

O Netuno descobre estes ficheiros pelo nome. Os ficheiros vazios são hooks intencionais disponíveis para personalização.

| Hook | Comportamento fornecido |
| --- | --- |
| `_config.js` | Define idioma/login de desenvolvimento, cache das respostas e gera a configuração `reauthkit.js` do browser. |
| `_init.js` | Contém apenas um exemplo comentado de listener Firebase. |
| `_auth_attempt.js` | Rejeita a autenticação com `custom-blocked: true` quando o código do utilizador Netuno é `blocked`. |
| `_auth_sign_in.js` | Aborta a autenticação sem perfil e acrescenta os dados completos do perfil à resposta de sucesso. |
| `_request_start.js` | Ativa a execução de `_request_end`. |
| `_request_url.js` | Mantém o URL pedido e contém um exemplo CORS comentado. |
| `_request_error.js` | Escreve `### SERVER ERROR ###` se o output continuar aberto. |
| `_request_end.js`, `_request_close.js` | Pontos de extensão vazios do ciclo do pedido. |
| `_service_config.js` | Aplica as decisões de acesso descritas abaixo. |
| `_service_start.js`, `_service_end.js` | Pontos de extensão vazios do ciclo do serviço. |
| `_service_error.js` | Contém apenas um exemplo comentado de log fatal. |

## Ressalvas de controlo de acesso

Em desenvolvimento, `_service_config.js` executa `_service.allow()` para todos os serviços. A lista de permissões explícita de produção contém atualmente `profile/avatar/get`, `profile/post`, `profile/options`, `recovery/post`, `recovery/put` e `recovery/options`. Isto torna públicos o registo, a leitura de avatares e a recuperação de palavra-passe. `profile/options` está na lista, mas não existe um ficheiro de serviço `profile/options`. A lista omite `profile/get`; o acesso autenticado a essa rota e às restantes rotas da aplicação deve ser concedido através das permissões dos grupos Netuno. `ws/private*` só é permitido quando `_auth.isJWT()` é verdadeiro e é negado nos restantes casos. Reveja e corrija esta lista e configure as permissões dos grupos Netuno antes da produção.

## Cobertura OpenAPI

`server/services/_openapi.json` define o `info` do documento e o esquema de segurança `BearerAuth`. O Netuno gera os caminhos, operações, parâmetros ou corpos de pedido e respostas a partir dos ficheiros complementares `*.in.json` e `*.out.<code>.json`. Todas as rotas HTTP da tabela acima têm agora um ficheiro `*.in.json` complementar: as propriedades de `GET` e `DELETE` tornam-se parâmetros de query, enquanto as de `POST` e `PUT` se tornam corpos de pedido JSON. Os métodos do ciclo de vida WebSocket são incluídos com a etiqueta `WebSocket`.

As definições de resposta reutilizáveis estão em `server/services/_schema/response`: `profile-data`, `friend-item`, `chat-item`, `people-item`, `message-data`, `notification-data`, `without-data`, `with-error` e `with-result-error`. Os estados de sucesso e os erros documentados estão cobertos para as rotas de amigos, mensagens, notificações, perfil e recuperação. `GET /profile/avatar` não tem esquema de resposta porque envia dados binários, e `GET /message` tem apenas metadados de pedido porque é um placeholder. As operações públicas (`GET /profile/avatar`, `POST /profile` e `POST`, `PUT` e `OPTIONS` em `/recovery`) declaram `security: []`; as restantes operações usam `BearerAuth`.

O documento gerado está disponível em `http://localhost:9000/services/_openapi` (interface) e `http://localhost:9000/services/_openapi.json` (JSON em bruto).

Para todos os caminhos da configuração de exemplo, consulte a [Referência de configuração](configuration-pt_PT.md).
