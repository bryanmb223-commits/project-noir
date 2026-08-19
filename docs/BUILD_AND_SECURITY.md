# Build e segurança

## IA

O renderer nunca recebe a chave da API. Para habilitar o provider OpenAI, defina `OPENAI_API_KEY` no ambiente que inicia o Electron e selecione `OpenAI` nas configurações. `OPENAI_MODEL` é opcional. Sem chave, o `MockProvider` permanece ativo.

## Persistência

Os dados são salvos em `project-noir-data.json` dentro do diretório `userData` administrado pelo Electron. O renderer acessa os dados apenas pelas APIs controladas do preload.

## Assinatura digital

Builds locais funcionam sem certificado. Para assinatura oficial, configure antes de executar `npm run desktop:build`:

- `CSC_LINK`: caminho ou URL segura para o certificado `.pfx`/`.p12`.
- `CSC_KEY_PASSWORD`: senha do certificado.

O `electron-builder` detecta essas variáveis e assina o executável, o desinstalador e o instalador NSIS durante a etapa de empacotamento. Não armazene certificado ou senha no Git.

## Atalhos e segundo plano

Fechar a janela oculta o Project Noir na bandeja. Use `Sair` no menu do tray para finalizar. O atalho padrão `Ctrl+Shift+Space` mostra ou oculta a janela.
