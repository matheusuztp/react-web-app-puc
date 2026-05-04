# react-web-app-puc

Projeto simples feito em React para cadastro e login de usuario usando Firebase.

## Tecnologias

- React
- React Router Dom
- Firebase Authentication
- Firestore
- Netlify

## Paginas

- `/cadastro`: cria um usuario com e-mail, senha, nome, sobrenome e data de nascimento.
- `/login`: faz login com e-mail e senha.
- `/principal`: mostra os dados do usuario logado.

## Como rodar o projeto

Instale as dependencias:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Firebase

O arquivo `src/firebase.js` ja possui a configuracao do projeto Firebase.

No Firebase, e necessario habilitar:

- Authentication com provedor E-mail/senha
- Firestore Database

## Deploy no Netlify

https://react-web-app-puc.netlify.app/
```
