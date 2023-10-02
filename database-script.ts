import axios from "axios";

const gistId = "seuGistId"; // Substitua pelo ID do seu Gist privado
const apiUrl = `https://api.github.com/gists/${gistId}`;
const githubToken = "seuTokenDeAcessoPessoal"; // Substitua pelo seu token de acesso pessoal

const newData = {
  files: {
    "seu-arquivo.json": {
      // Substitua pelo nome do arquivo no Gist
      content: '{"chave": "valor"}', // Conteúdo que você deseja inserir
    },
  },
};

axios
  .patch(apiUrl, newData, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  })
  .then((response) => {
    console.log("Dados inseridos com sucesso:", response.data);
  })
  .catch((error) => {
    console.error("Erro ao inserir dados no Gist privado:", error);
  });
