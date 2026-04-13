# Report Tecnico

## Approccio

il progetto è diviso in due parti:

- un backend in py per leggere e preparare i dati
- un frontend Angular per mostrare il form e il grafico

In questo modo la logica di elaborazione resta nel backend, mentre il frontend si occupa soprattutto della visualizzazione.

## Scelte Architetturali

Il backend ha questi endpoint:

- `/stations` per ottenere l'elenco delle stazioni disponibili
- `/data` per ottenere i dati filtrati per stazione e intervallo di tempo

I dati vengono letti da file CSV locali. Ho usato funzioni separate per:

- leggere i metadati delle stazioni
- leggere i dati della singola stazione
- filtrare i record per data
- calcolare la precipitazione cumulata

Questa separazione rende il codice piu leggibile e piu facile da mantenere.

Nel frontend ho usato un form per selezionare stazione e intervallo di date e Chart.js per costruire il grafico delle precipitazioni cumulative.

## Gestione Dei Dati Idrologici

I dati vengono gestiti nella seguente maniera:

- ogni valore di precipitazione viene letto dal CSV
- i dati vengono filtrati in base al range temporale richiesto
- i valori vengono sommati progressivamente per ottenere la cumulata

Per rendere il sistema piu robusto, i valori non numerici o non validi vengono trattati come `0.0`.
Inoltre, se ci sono buchi temporali nel dataset, non vengono inventati dati mancanti: la cumulata prosegue solo sui dati realmente presenti.