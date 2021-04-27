# Netuno React AUTH

Uma solução pronta para registo, autenticação, edição de perfil e área reservada utilizando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Instalação

#### Netuno

[Siga os passos aqui](https://doc.netuno.org/docs/en/installation/)

#### React AUTH

Clone este projeto para `(Netuno Root directory)/apps/react_auth/`.

Depois instale as dependências NPM excutando

`npm install` 

no diretório `react_auth/website/`.

## Configuração

Copie a configuração de amostra da aplicação executando (no diretório da raiz da aplicação)

`cp config/sample.json config/_development.json` 

e ajustando o ficheiro `_development.json` de acordo com a sua configuração local.

> Onde se encontra `JWTRandomSecureSecret` coloque um código secreto o mais aleatório visto ser isto que assegura a segurança das credenciais dos utiilzadores, como por exemplo: `#J&Az+7(8d+k/9q]` . [Geração de códigos seguros.](https://passwordsgenerator.net/)

> Vai ter de configurar obrigatoriamente uma ligação SMTP para a funcionalidade de recuperação de palavra-passe funcionar corretamente.

Também vai ter de copiar a amostra de configuração de serviços executanto

`cp website/src/common/sample_Config.js website/src/common/Config.js` 

e modificar a fim de corresponder às configurações do seu ambiente de desenvolvimento.

## Execução

No diretório da raiz do Netuno execute

`./netuno server app=react_auth`

que fará com que o servidor de backend e fronted iniciem.