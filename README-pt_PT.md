# ReAuthKit

Uma solução *boilerplate* pronta a usar para registo, autenticação, edição de perfil e área reservada utilizando [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/), [Redux](https://redux.js.org/) e [Ant Design](https://ant.design/).

![Outdoor](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/billboard.png)

## Instalação

#### Netuno

[Siga os passos aqui](https://doc.netuno.org/docs/pt-PT/installation/)

#### ReAuthKit App

Clone este projeto para `(Netuno Root directory)/apps/reauthkit/`.

## Configuração

> Todo o processo a seguir descrito é destinado a ambientes de desenvolvimento Linux e MacOS com algumas notas também destinadas a ambientes Microsoft Windows.

1. Copie a configuração de amostra da aplicação executando (no diretório da raiz da aplicação):

    * `cp config/sample.json config/_development.json` (para um ambiente de desenvolvimento local/teste)

    * `cp config/sample.json config/_production.json` (para um ambiente de produção)

    e ajuste o ficheiro `_development.json` e/ou o `_production_.json` de acordo com o seu ambiente de desenvolvimento.
    
> Pode alterar o nome da aplicação, alterando o nome da pasta e o parâmetro de configuração `name`.

2. Vai ter de configurar obrigatoriamente uma ligação SMTP para a funcionalidade de recuperação de palavra-passe funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/services/sending-emails/)

3. Vai ter de configurar, também, obrigatoriamente uma ligação de base de dados do tipo PostgreSQL para esta aplicação funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/database/psql/)

4. Onde se encontra `JWTRandomSecureSecret` coloque um código secreto o mais aleatório visto ser isto que assegura a segurança das credenciais dos utiilzadores, como por exemplo: `#J&Az+7(8d+k/9q]` . [Geração de códigos seguros recomendado.](https://passwordsgenerator.net/)

5. Também vai ter de configurar a amostra de configuração do website localizada no diretório `website/src/config/`:

    1. Altere a configuração presente em `_development_config.json` e `_production_config.json` para ambientes de desenvolvimento/de testes e de produção respetivamente.

    2. Dentro do mesmo diretório execute `cp _development_config.json config.json` a fim de criar o ficheiro de configuração necessário baseado na configuração de desenvolvimento.

    > Para criar uma versão de produção otimizada basta executar `bash build.sh` no diretório `(diretório raíz da aplicação)/website/` que irá momentaneamente substituir o ficheiro `config.json` com a configuração baseada no ficheiro de produção e que ao terminar reverterá para a configuração presente no ficheiro de configuração de ambiente de desenvolvimento/de testes.

    > Também se encontra o ficheiro `build.bat` presente em `(diretório raíz da aplicação)/website/` destinado a ambientes de desenvolvimento em Microsoft Windows.

6. Para configurar a definição do OpenAPI, procure para parametrização do `openapi`, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/services/openapi/)

## Execução

No diretório da raiz do Netuno execute

`./netuno server app=reauthkit`

que fará com que o servidor de back-end e front-end iniciem.

> A primeira execução pode demorar um pouco devido a instalação das dependências de front-end.

Por padrão o backoffice do Netuno estará disponível em:

- http://localhost:9000/

A OpenAPI estará em:

- http://localhost:9000/services/_openapi

E o front-end (site restrito) começará em:

- http://localhost:3000/

## Estilo

Indicações para a estilização geral do website restrito.

### Escuro

Segue como pode ser aplicado o estilo escuro.

Ajuste no `website/src/craco.config.js` as variáveis:

```
  ...
  '@primary-color': '#1890ff',
  '@menu-bg': '#141414',
  '@layout-body-background': '#202020',
  '@layout-footer-background': '#303030',
  '@layout-header-background': '#141414',
  '@layout-trigger-color': '#eff8ff',
  ...
```

> [Lista completa das variáveis do Ant.Design.](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

No `website/src/styles/variables.less` ajuste a importação do tema do Ant.Design, comente o tema padrão (claro) e descomente o escuro:

```
//@import '~antd/lib/style/themes/default.less';
@import '~antd/lib/style/themes/dark.less';
```

No `website/src/App.js` procure pela tag do componente `Sider` e remova o atributo `theme="light"`.

### Claro

Segue como pode ser aplicado o estilo claro.

Ajuste no `website/src/craco.config.js` as variáveis:

```
  ...
  '@primary-color': '#1890ff',
  '@menu-bg': '#ffffff',
  '@layout-body-background': '#ffffff',
  '@layout-footer-background': '#eff8ff',
  '@layout-header-background': '#ffffff',
  '@layout-trigger-color': '#002140',
  ...
```

> [Lista completa das variáveis do Ant.Design.](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

No `website/src/styles/variables.less` ajuste a importação do tema do Ant.Design, comente o tema escuro e descomente o padrão (claro):

```
@import '~antd/lib/style/themes/default.less';
//@import '~antd/lib/style/themes/dark.less';
```

No `website/src/App.js` procure pela tag do componente `Sider` e adicione o atributo `theme="light"`.

## Capturas de Ecrã

Abaixo encontram-se algumas capturas de ecrã da aplicação.

### Desktop

##### Iniciar Sessão
![Login](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/login.png)
##### Criar Conta
![Register](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/registration.png)
##### Área Reservada
![Reserved Area](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/reserved-area.png)
##### Editar Perfil
![Edit Profile](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/edit-profile.png)

### Mobile

Iniciar Sessão  |  Criar Conta
:-------------------------:|:-------------------------:
![Login](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/login.png)  |  ![Register](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/registration.png)

Área Reservada |  Perfil + Avatar 1
:-------------------------:|:-------------------------:
![Reserved Area](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/reserved-area.png)  |  ![Perfil + Avatar 1](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-1.png)

Perfil + Avatar 2 |  Perfil + Avatar 3
:-------------------------:|:-------------------------:
![Perfil + Avatar 2](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-2.png)  |  ![Perfil + Avatar 3](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-3.png)
