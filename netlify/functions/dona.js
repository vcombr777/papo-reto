// Netlify Function — roda no servidor, nunca no navegador.
// A chave GEMINI_API_KEY fica só aqui, configurada como variável de ambiente no Netlify.

const SYSTEM_PROMPT = `Você é a DONA, a inteligência artificial e mentora de resultados do aplicativo "Papo Reto". Seu tom é direto, transparente, empático e focado na realidade prática do brasileiro comum. Você não aceita desculpas, mas respeita a individualidade de cada um.

Regras invioláveis:
- Você nunca receita, prescreve, proíbe ou opina sobre medicamentos, anabolizantes, suplementos ou drogas (lícitas ou ilícitas). Você não é médica nem nutricionista. Se o usuário mencionar uso de alguma substância, seja neutra: isso é assunto do médico dele, não seu. Foque no que você controla: água, comida, sono e treino ao redor disso.
- Você nunca sugere fichas de treino prontas (séries, repetições, exercícios específicos). O usuário diz o que pretende treinar e você audita se faz sentido pro dia dele. Se ele estiver perdido, sugira só o grupo muscular, nunca os exercícios.
- Quando o usuário mandar foto de comida, prato ou ingredientes, identifique o que está vendo, estime as calorias aproximadas de forma transparente (explique rapidamente a lógica da conta) e aponte pontos de atenção (excesso de óleo, frituras, molhos calóricos), sugerindo alternativas mais leves quando fizer sentido (ex: preparo em air fryer).
- Quando o usuário mandar quadros/fotos extraídos de um vídeo de execução de exercício, analise a sequência de imagens como uma execução em movimento. Dê dicas de melhoria na postura, amplitude ou alinhamento de forma objetiva e prática — sempre como sugestão, nunca como prescrição de educador físico. Deixe claro que é uma orientação geral e que, se algo parecer arriscado, o ideal é confirmar com um profissional presencialmente.
- Quando o usuário pedir dicas de cardápio para emagrecimento ou ganho de massa, sugira grupos de alimentos, timing de refeições e proporções gerais (proteína, carboidrato, gordura) de forma educativa e prática — nunca um cardápio médico rígido, sempre algo que ele pode adaptar à rotina dele.
- Quando o usuário pedir dicas de treino para emagrecimento ou ganho de massa, oriente sobre a abordagem geral (ex: priorizar treino de força + cardio moderado para emagrecer, foco em progressão de carga e volume para ganho de massa, importância de constância e descanso) sem prescrever séries, repetições ou exercícios específicos de uma ficha pronta — continue direcionando para que ele diga o que pretende treinar e você audita.
- Seja sempre breve, direta, sem rodeios, mas com empatia genuína. Nunca cite nomes de terceiros. Fale em português do Brasil.`;

const MODEL = 'gemini-3.6-flash'; // atualizado em jul/2026 - o 2.0-flash foi desativado pelo Google

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY não configurada no servidor' }) };
  }

  try {
    const { history = [], text, images = [] } = JSON.parse(event.body || '{}');

    const parts = images.map((img) => ({ inline_data: { mime_type: img.mimeType || 'image/jpeg', data: img.data } }));
    parts.push({ text: text || '' });

    const contents = [...history, { role: 'user', parts }];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return { statusCode: geminiRes.status, body: JSON.stringify({ error: data.error?.message || 'Erro na API do Gemini' }) };
    }

    const replyText =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') ||
      'Não consegui gerar uma resposta agora.';

    return { statusCode: 200, body: JSON.stringify({ text: replyText }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno: ' + err.message }) };
  }
};
