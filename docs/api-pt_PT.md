# Referência da API e extensões

Esta é uma referência baseada no código dos scripts roteáveis em `server/services` e dos exports reutilizáveis em `server/core/lib`. A URL base predefinida é `http://localhost:9000/services`.

O Netuno associa um ficheiro com o nome de um método HTTP ao caminho do seu diretório. Por exemplo, `server/services/profile/get.js` corresponde a `GET /profile`; o endpoint WebSocket encaminha ligação, mensagem e desligação para `POST`, `PUT` e `DELETE /ws/private`, respetivamente.

## Mapa de funcionalidades e rotas visíveis

| Rota do website | Acesso | Funcionalidade fornecida |
| --- | --- | --- |
| `/` | Público | Redireciona um visitante autenticado para `/dashboard` e os restantes para `/login`. |
| `/login` | Público | Autenticação por palavra-passe/JWT, credenciais memorizadas opcionalmente, ALTCHA, diálogo de recuperação e links dos fornecedores sociais ativos. |
| `/login/:provider` | Público | Conclui o callback de autenticação de um fornecedor social Netuno. |
| `/register` | Público | Registo por palavra-passe ou fornecedor social ativo, com ALTCHA quando configurado. |
| `/register/:provider` | Público | Conclui o registo social e autentica a nova conta. |
| `/recovery` | Público | Obtém a chave de recuperação do fragmento do URL e define uma nova palavra-passe. |
| `/dashboard` | Autenticado | Ecrã de boas-vindas da área reservada. |
| `/profile/edit` | Autenticado | Edita identidade, palavra-passe e avatar recortado; o defeito de servidor indicado abaixo afeta atualmente a persistência do perfil. |
| `/profile/view` | Autenticado | Ecrã placeholder de visualização; não carrega dados de outro utilizador. |
| `/messages` | Autenticado | Presença de amigos, contagem de não lidas, histórico de dez mensagens, envio e marcação de leitura através de envelopes de serviço WebSocket. |
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
| `DELETE /friend` | Placeholder | — | Ponto de extensão vazio; a remoção de amigos não está implementada. |
| `GET /friend/list` | Implementado | — | Devolve os amigos do perfil autenticado com `uid`, `name`, disponibilidade de avatar, estado online, data da última mensagem não lida e contagem de não lidas. |
| `POST /friend` | Placeholder | — | Ponto de extensão vazio; adicionar amigos não está implementado. |
| `PUT /friend` | Placeholder | — | Ponto de extensão vazio; atualizar amigos não está implementado. |
| `DELETE /message` | Placeholder | — | Ponto de extensão vazio; apagar mensagens não está implementado. |
| `GET /message` | Placeholder | — | Ponto de extensão vazio; obter uma mensagem individual não está implementado. |
| `POST /message` | Implementado | UID do perfil em `to`, texto em `message` | Guarda a mensagem, notifica o destinatário através de `POST message/new` e devolve `{ "result": true }`. |
| `PUT /message` | Placeholder | — | Ponto de extensão vazio; atualizar mensagens não está implementado. |
| `POST /message/list` | Implementado | UID do perfil em `with` | Marca como lidas as mensagens recebidas desse perfil, atualiza dados quando necessário e devolve as 10 mensagens mais recentes por ordem cronológica. |
| `GET /message/read/mark` | Implementado | UID do perfil em `from`, UID da mensagem em `uid` | Marca a mensagem não lida correspondente e devolve `{ "result": true, "from": UID }`. O SQL não valida o destinatário. |
| `GET /message/unread/count` | Implementado | — | Devolve `{ "total": número }` para o perfil autenticado. |
| `POST /notification/subscribe` | Implementado | `endpoint`, `keys.p256dh`, `keys.auth` | Guarda uma subscrição Web Push do perfil autenticado. Devolve 404 `not-exist` se o perfil não existir; caso contrário, `{ "result": true }`. |
| `GET /profile` | Implementado | `uid` opcional; caso contrário, perfil autenticado | Devolve `{ "result": true, "data": { uid, name, username, email, avatar, group } }` ou 404 `not-exist`. |
| `POST /profile` | Implementado | `name`, `username`; com palavra-passe: `email`, `password`, `altcha` opcional; com fornecedor: `code`, `provider` | Regista um utilizador/perfil genérico. Devolve 409 para dados do fornecedor ou ALTCHA inválidos e para email/utilizador existente. |
| `PUT /profile` | Implementado com defeito | Multipart `name`, `username`, `email`, `password` opcional, `avatar` opcional | Atualiza o utilizador Netuno e devolve `{ "result": true }`. O código escreve os dados do perfil no formulário `people`, embora o esquema e o restante código usem `profile`; o defeito tem de ser corrigido antes de depender da atualização de perfil/avatar. |
| `DELETE /profile` | Desativado | — | O script começa com `_exec.stop()` incondicional. Se essa linha for removida deliberadamente, o exemplo restante elimina o perfil autenticado e o utilizador Netuno. |
| `GET /profile/avatar` | Implementado | Valor de query `uid` obrigatório | Envia o avatar JPEG/PNG sem cache; devolve 404 vazio se o perfil não existir. |
| `GET /profile/list` | Placeholder | — | Ponto de extensão vazio; a listagem de perfis não está implementada. |
| `OPTIONS /recovery` | Implementado | — | Devolve `{ "result": true }` para preflight/deteção da funcionalidade. |
| `POST /recovery` | Implementado | `email` | Cria uma chave válida por um dia e envia email. Devolve 409 `user-not-active`, 404 `not-exists` ou `{ "result": true }`. O URL de recuperação deriva do header `Origin`. |
| `PUT /recovery` | Implementado | `key`, `password` | Altera a palavra-passe quando a chave existe e não expirou; caso contrário devolve 404 `user-not-found`. |

`POST /profile` depende também do grupo Netuno `generic`. No registo por fornecedor, a identidade vem do fluxo de fornecedores do Netuno e não de um email enviado pelo browser.

## Serviço de ciclo de vida WebSocket

O socket público configurado é `/ws/private`; `ws.endpoints[].service` encaminha-o para `/services/ws/private`.

| Método e serviço | Estado | Comportamento atual |
| --- | --- | --- |
| `POST /ws/private` | Implementado | Ao ligar, guarda a sessão do perfil autenticado e envia `friend/status/changed` com `online: true` às sessões dos amigos. |
| `PUT /ws/private` | Placeholder | Ponto de extensão vazio para uma mensagem WebSocket bruta recebida. Os pedidos da aplicação usam normalmente o envelope de serviço do cliente WebSocket. |
| `GET /ws/private` | Placeholder | Ponto de extensão vazio para um evento de ligação/leitura disponibilizado pelo runtime. |
| `DELETE /ws/private` | Implementado | Ao desligar, elimina a sessão e envia `friend/status/changed` com `online: false` às sessões dos amigos. |

O website envia o JWT como `?auth=<token-de-acesso>`. `_service_config.js` só permite o serviço do socket quando `_auth.isJWT()` é verdadeiro.

### Mensagens de serviço usadas pelo website

| Método e serviço | Direção | Payload/resultado |
| --- | --- | --- |
| `GET friend/list` | Pedido/resposta do cliente | `content` contém a lista de amigos descrita acima. |
| `GET message/unread/count` | Pedido/resposta ou atualização do servidor | `content.total` contém a contagem de não lidas. |
| `POST message` | Pedido/resposta do cliente | `data` contém `to` e `message`. |
| `POST message/list` | Pedido/resposta do cliente | `data.with` é um UID de perfil; `content` contém as 10 mensagens. |
| `GET message/read/mark` | Pedido/resposta do cliente | `data` contém `uid` e `from`. |
| `POST message/new` | Evento do servidor | `data.with` identifica o outro perfil; `content` contém `uid`, `from`, `to`, `message`, `sent_at` e `read_at`. |
| `GET friend/status/changed` | Evento do servidor | `content` contém o `uid` do perfil e o booleano `online`. |

## Serviço agendado

| Caminho | Estado | Comportamento atual |
| --- | --- | --- |
| `/services/jobs/ws-sessions` | Implementado | Percorre `profile_ws_session`, elimina registos cuja `_ws.session(id)` não existe e devolve `{ "result": true }`. O agendamento Quartz de exemplo executa-o a cada 15 minutos. |

## API dos módulos server-core

Estes objetos com export predefinido são APIs de extensão reutilizáveis. Importe-os através dos aliases do pacote, por exemplo `import profile from "#core/lib/profile.js"`.

| Módulo e função | Contrato |
| --- | --- |
| `profile.getFullDataByUID(uid)` | Devolve um mapa Netuno com `uid`, `name`, `username`, `email`, `avatar` booleano e `group`, ou `null`. |
| `profile.getLogged()` | Devolve o registo `profile` associado ao `_user.id` atual, ou nenhum registo. |
| `profile.getByUID(uid)` | Devolve o registo `profile` do UID, ou nenhum registo. |
| `profile.wsSendService(dbProfile, message)` | Envia um envelope de serviço como cliente para todas as sessões WebSocket guardadas do perfil. |
| `profile.wsSendAsService(dbProfile, message)` | Envia um envelope de serviço como servidor para todas as sessões WebSocket guardadas do perfil. |
| `friend.notifyAllWithStatusChanged(dbProfile, online)` | Notifica todas as sessões dos amigos com `friend/status/changed`. |
| `message.getByUID(uid)` | Devolve o registo `message` do UID, ou nenhum registo. |
| `message.getUnreadTotal(dbProfile)` | Devolve o número de mensagens não lidas destinadas ao perfil. |
| `message.toData(dbProfileFrom, dbProfileTo, dbMessage)` | Converte um registo de mensagem no mapa público da mensagem. |
| `notification.create(dbProfile, typeCode, title, content, extra)` | Guarda uma notificação, envia Web Push às subscrições ativas e desativa subscrições expiradas. O tipo pedido tem de existir e estar ativo. |

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

A allow-list de produção em `_service_config.js` refere `people/avatar/get`, `people/post` e `people/options`, mas as rotas implementadas estão em `profile`, não em `people`; também omite `profile/get`. Tal como fornecido, apenas `recovery/{post,put,options}` é explicitamente público e `ws/private*` só é permitido com JWT. Em desenvolvimento, `_service.allow()` é aplicado globalmente. Reveja e corrija esta lista e configure as permissões dos grupos Netuno antes da produção.

Os esquemas OpenAPI complementares abrangem apenas `profile/{get,post,put,delete}` e `recovery/{post,put}`. A tabela acima é, por isso, o inventário completo derivado do código; o documento OpenAPI gerado está atualmente incompleto.

Para todos os caminhos da configuração de exemplo, consulte a [Referência de configuração](configuration-pt_PT.md).
