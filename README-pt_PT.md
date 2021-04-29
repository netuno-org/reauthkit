# Netuno React AUTH

Uma solução *boilerplate* pronta a usar para registo, autenticação, edição de perfil e área reservada utilizando [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Instalação

#### Netuno

[Siga os passos aqui](https://doc.netuno.org/docs/pt-PT/installation/)

#### React AUTH

Clone este projeto para `(Netuno Root directory)/apps/react_auth/`.

Depois instale as dependências NPM excutando

`npm install` 

no diretório `react_auth/website/`.

## Configuração

> Todo o processo a seguir descrito é destinado a ambientes de desenvolvimento Linux com algumas notas também destinadas a ambientes Microsoft Windows.

1. Copie a configuração de amostra da aplicação executando (no diretório da raiz da aplicação):

    * `cp config/sample.json config/_development.json` (para um ambiente de desenvolvimento local/de testes)

    * `cp config/sample.json config/_production.json` (para um ambiente de produção)

    e ajuste o ficheiro `_development.json` e/ou o `_production_.json` de acordo com o seu ambiente de desenvolvimento.

2. Vai ter de configurar obrigatoriamente uma ligação SMTP para a funcionalidade de recuperação de palavra-passe funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/services/sending-emails/)

3. Vai ter de configurar, também, obrigatoriamente uma ligação de base de dados do tipo PostgreSQL para esta aplicação funcionar corretamente, [saiba como fazê-lo aqui.](https://doc.netuno.org/docs/pt-PT/academy/server/database/psql/)

4. Onde se encontra `JWTRandomSecureSecret` coloque um código secreto o mais aleatório visto ser isto que assegura a segurança das credenciais dos utiilzadores, como por exemplo: `#J&Az+7(8d+k/9q]` . [Geração de códigos seguros recomendado.](https://passwordsgenerator.net/)

5. Também vai ter de configurar a amostra de configuração do website localizada no diretório `website/src/config/`:

    1. Altere a configuração presente em `_development_config.json` e `_production_config.json` para ambientes de desenvolvimento/de testes e de produção respetivamente.

    2. Dentro do mesmo diretório execute `cp _development_config.json config.json` a fim de criar o ficheiro de configuração necessário baseado na configuração de desenvolvimento.

    > Para criar uma versão de produção otimizada basta executar `bash build.sh` no diretório `(diretório raíz da aplicação)/website/` que irá momentaneamente substituir o ficheiro `config.json` com a configuração baseada no ficheiro de produção e que ao terminar reverterá para a configuração presente no ficheiro de configuração de ambiente de desenvolvimento/de testes.

    > Também se encontra o ficheiro `build.bat` presente em `(diretório raíz da aplicação)/website/` destinado a ambientes de desenvolvimento em Microsoft Windows.

## Execução

No diretório da raiz do Netuno execute

`./netuno server app=react_auth`

que fará com que o servidor de backend e fronted iniciem.

## Capturas de Ecrã

Abaixo encontram-se algumas capturas de ecrã da aplicação.

### Desktop

##### Iniciar Sessão
![Login](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/login.png)
##### Criar Conta
![Register](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/registration.png)
##### Área Reservada
![Reserved Area](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/reserved-area.png)
##### Editar Perfil
![Edit Profile](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/edit-profile.png)

### Mobile

Iniciar Sessão  |  Criar Conta
:-------------------------:|:-------------------------:
![Login](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/login.png)  |  ![Register](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/registration.png)

Área Reservada |  Editar Perfil
:-------------------------:|:-------------------------:
![Reserved Area](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/reserved-area.png)  |  ![Edit Profile](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/edit-profile.png)
