// netlify/functions/byd.js

// Estado em memória (reset a cada cold start da function)
let estadoByd = {
  modelo: "" // "seal", "atto-2", "sealion-7"
};

exports.handler = async (event, context) => {
  const headersBase = {
    'Content-Type': 'application/json; charset=utf-8',
    // Se quiser CORS amplo:
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headersBase,
      body: ''
    };
  }

  // GET -> retorna o JSON (como se fosse o byd.json)
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: headersBase,
      body: JSON.stringify(estadoByd)
    };
  }

  // POST -> atualiza o modelo
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const modelo = body.modelo;

      if (!modelo) {
        return {
          statusCode: 400,
          headers: headersBase,
          body: JSON.stringify({ erro: 'modelo é obrigatório' })
        };
      }

      // Valida os modelos possíveis
      const modelosValidos = ['seal', 'atto-2', 'sealion-7'];
      if (!modelosValidos.includes(modelo)) {
        return {
          statusCode: 400,
          headers: headersBase,
          body: JSON.stringify({ erro: 'modelo inválido', permitido: modelosValidos })
        };
      }

      estadoByd.modelo = modelo;

      return {
        statusCode: 200,
        headers: headersBase,
        body: JSON.stringify(estadoByd)
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: headersBase,
        body: JSON.stringify({ erro: 'Erro ao processar JSON' })
      };
    }
  }

  return {
    statusCode: 405,
    headers: headersBase,
    body: JSON.stringify({ erro: 'Método não permitido' })
  };
};