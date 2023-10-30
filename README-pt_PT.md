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

2. De acordo com o seu ambiente de desenvolvimento, altere o arquivo `.json` na chave `settings.api.endpoint` para o endereço correto dos serviços Netuno, exemplo:

```
  ...
    "api": {
      "endpoint": "http://localhost:9000/services/"
    },
  ...
```

> Atenção: A configuração do Endpoint da API é exportada para o website poder conseguir acessar aos endereços de serviços, através da definição do prefixo de URLs no cliente de serviços ([service-client](https://www.npmjs.com/package/@netuno/service-client)).

3. Vai ter de configurar obrigatoriamente uma ligação SMTP para a funcionalidade de recuperação de palavra-passe funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/services/sending-emails/)

4. Vai ter de configurar, também, obrigatoriamente uma ligação de base de dados do tipo PostgreSQL para esta aplicação funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/database/psql/)

5. Onde se encontra `JWTRandomSecureSecret` coloque um código secreto o mais aleatório visto ser isto que assegura a segurança das credenciais dos utiilzadores, como por exemplo: `#J&Az+7(8d+k/9q]` . [Geração de códigos seguros recomendado.](https://passwordsgenerator.net/)

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

## Produção

Em produção altere o ambiente do Netuno para `production`, isto é feito no arquivo de configuração principal do Netuno, o `config.js` que encontra-se na raíz, desta forma:

```
config.env = 'production'
```

Na configuração da aplicação, no arquivo `config/_production.json`, desabilite os `commands`, defina o valor de todos os comandos `enabled` com o valor `false`, por que em produção não queremos comandos do NPM sendo executados juntos com o Netuno.

Dentro da pasta do website execute:

`npm install`

Para criar a versão de produção do website otimizada, basta executar `bash build.sh` no diretório `(diretório raíz da aplicação)/website/`. Também se encontra o ficheiro `build.bat` presente em `(diretório raíz da aplicação)/website/` destinado a ambientes de desenvolvimento em Microsoft Windows.

## Estilo

Para customizar o website no geral altere as configurações de tema do Ant.Design.

No arquivo `website/src/App.jsx`, procure pelo componente `ConfigProvider` e adapte os valores do atributo do `theme`.

> Veja a [documentação oficial do Ant.Design sobre customização do tema](https://ant.design/docs/react/customize-theme).

As configurações das variávies do LESS encontra-se aqui: `website/src/styles/variables.less`

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
