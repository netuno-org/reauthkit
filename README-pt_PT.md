![Logótipo](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/logo.svg)

# ReAuthKit

Uma solução *boilerplate* pronta a usar para registo de utilizadores, autenticação, edição de perfil e área reservada, utilizando [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/), [Redux](https://redux.js.org/) e [Ant Design](https://ant.design/).

![Apresentação](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/billboard.png)

## Instalação

#### Netuno

[Siga estes passos](https://doc.netuno.org/pt/docs/get-started/installation).

#### Aplicação ReAuthKit

Clone este projeto para `(diretório raiz do Netuno)/apps/reauthkit/`.

## Configuração

Para a descrição de todas as chaves da configuração de exemplo, consulte a [referência de configuração completa](docs/configuration-pt_PT.md). Para todas as rotas HTTP/WebSocket locais, estado da implementação, exports de server-core e hooks do ciclo de vida, consulte a [referência da API e extensões](docs/api-pt_PT.md).

> O processo seguinte destina-se a ambientes de desenvolvimento Linux e macOS, com indicações para Microsoft Windows quando necessário.

1. Na raiz da aplicação, copie o ficheiro de configuração de exemplo:

    * `cp config/sample.json config/_development.json` (para um ambiente de desenvolvimento)

    * `cp config/sample.json config/_production.json` (para um ambiente de produção)

    Em seguida, ajuste o ficheiro `_development.json` e/ou `_production.json` ao seu ambiente.

> Pode alterar o nome da aplicação modificando o nome da pasta e o parâmetro de configuração `name`.

2. No ficheiro de configuração selecionado, defina `settings.website.services.prefix` e `settings.website.websocket` com os endpoints corretos do Netuno. Por exemplo:

```json
  "settings": {
    "website": {
      "services": {
        "prefix": "http://localhost:9000/services"
      },
      "websocket": {
        "url": "ws://localhost:9000/ws/private/",
        "servicesPrefix": "/services"
      }
    }
  }
```

> Atenção: a configuração dos endpoints de WebSocket e dos serviços é exportada automaticamente para o website, que pode utilizar estes endereços diretamente.

3. É necessário configurar uma ligação SMTP para que a recuperação da palavra-passe funcione corretamente. [Saiba como fazê-lo](https://doc.netuno.org/pt/docs/academy/server/services/sending-emails/).

4. É também necessário configurar uma ligação a uma base de dados PostgreSQL para que a aplicação funcione corretamente. [Saiba como fazê-lo](https://doc.netuno.org/pt/docs/academy/server/database/psql).

5. Substitua o valor de exemplo em `auth` > `jwt` > `secret` por um segredo aleatório com, pelo menos, 16 caracteres; recomenda-se que tenha 32 ou mais. [Gerador de palavras-passe seguras](https://www.lastpass.com/features/password-generator).

6. Para configurar a definição OpenAPI, consulte os parâmetros de `openapi`. [Saiba como fazê-lo](https://doc.netuno.org/pt/docs/academy/server/services/openapi).

7. Instale os módulos de front-end com o [Bun](https://bun.sh/):

    - Website:

    ```bash
    cd website
    bun install
    bun pm trust --all
    ```

    - Interface de backoffice:

    ```bash
    cd ui
    bun install
    bun pm trust --all
    ```

## Execução

No diretório raiz do Netuno, execute:

`./netuno server app=reauthkit`

Este comando inicia o servidor de back-end e o servidor de front-end.

> A primeira execução pode demorar algum tempo devido à instalação das dependências de front-end.

Por predefinição, o backoffice do Netuno fica disponível em:

- http://localhost:9000/

A OpenAPI fica disponível em:

- http://localhost:9000/services/_openapi

O front-end (website reservado) inicia em:

- http://localhost:3000/

## Produção

Em produção, altere o ambiente do Netuno para `production` no ficheiro de configuração principal `config.js`, localizado na raiz:

```javascript
config.env = 'production'
```

Em `config/_production.json`, defina `enabled` como `false` em todas as entradas de `commands`, porque os processos de observação utilizados em desenvolvimento não devem ser executados com o Netuno em produção.

Para instalar as dependências do website e criar a versão otimizada em `website/dist`, execute `bash build.sh` no diretório `(diretório raiz da aplicação)/website/`. Em Microsoft Windows, execute `build.bat` no mesmo diretório. Estes scripts de produção utilizam npm.

## Estilo

Para personalizar o website, altere as configurações do tema do Ant Design.

No ficheiro `website/src/App.jsx`, procure o componente `ConfigProvider` e adapte os valores do atributo `theme`.

> Consulte a [documentação oficial do Ant Design sobre personalização do tema](https://ant.design/docs/react/customize-theme).

As variáveis LESS encontram-se em `website/src/styles/variables.less`.

## Capturas de ecrã

Seguem-se algumas capturas de ecrã da aplicação.

### Desktop

##### Iniciar sessão
![Iniciar sessão](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/login.png)
##### Criar conta
![Criar conta](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/registration.png)
##### Área reservada
![Área reservada](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/reserved-area.png)
##### Editar perfil
![Editar perfil](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/edit-profile.png)

### Mobile

Iniciar sessão | Criar conta
:-------------------------:|:-------------------------:
![Iniciar sessão](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/login.png) | ![Criar conta](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/registration.png)

Área reservada | Perfil e avatar 1
:-------------------------:|:-------------------------:
![Área reservada](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/reserved-area.png) | ![Perfil e avatar 1](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-1.png)

Perfil e avatar 2 | Editar perfil
:-------------------------:|:-------------------------:
![Perfil e avatar 2](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-2.png) | ![Editar perfil](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-3.png)
