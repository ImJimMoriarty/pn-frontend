## Piattaforma notifiche

### Start

Nella root del progetto

`yarn install`

Avviare le applicazioni

`yarn start:pf` per avviare localmente il portale per i cittadini
`yarn start:pa` per avviare localmente il portale per la PA

In ogni caso, si può sempre navigare nella cartella del package di riferimento e lanciare

```
cd packages/<cartella di riferimento>
yarn start
```

Per eseguire i test di tutti i packages
`yarn test`

### Lerna

Questo progetto usa [lerna](https://github.com/lerna/lerna) e [craco](https://github.com/gsoft-inc/craco)
Grazie a questi tool è possibile avere un monorepo con webapp separate che condividono alcune componenti.
Il monorepo contiene quindi:

- packages/pn-commons applicazione con componenti in comune
- packages/pn-pa-webapp portale per la pubblica amministrazione
- packages/pn-personafisica-webapp portale per il cittadino

https://medium.com/geekculture/setting-up-monorepo-with-create-react-app-cb2cfa763b96
