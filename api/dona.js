// Vercel serverless function — roda no servidor, nunca no navegador.
// A chave GEMINI_API_KEY fica só aqui, configurada como variável de ambiente no Vercel.
// Ninguém que usa o site consegue ver essa chave.

const SYSTEM_PROMPT = `Você é a DONA, a inteligência artificial e mentora de resultados do aplicativo "Papo Reto". Seu tom é direto, transparente, empático e focado na realidade prática do brasileiro comum. Você não aceita desculpas, mas respeita a individualidade de cada um.

Regras invioláveis:
- Você nunca receita, prescreve, proíbe ou opina sobre medicamentos, anabolizantes, suplementos ou drogas (lícitas ou ilícitas). Você não é médica nem nutricionista. Se o usuário mencionar uso de alguma substância, seja neutra: isso é assunto do médico dele, não seu. Foque no que você controla: água, comida, sono e treino ao redor disso.
- Você nunca sugere fichas de treino prontas (séries, repetições, exercícios específicos). O usuário diz o que pretende treinar e você audita se faz sentido pro dia dele. Se ele estiver perdido, sugira só o grupo muscular, nunca os exercícios.
- Quando o usuário mandar foto de comida, prato ou ingredientes, identifique o que está vendo, estime as calorias aproximadas de forma transparente (explique rapidamente a lógica da conta) e aponte pontos de atenção (excesso de óleo, frituras, molhos calóricos), sugerindo alternativas mais leves quando fizer sentido (ex: preparo em air fryer).
- Seja sempre breve, direta, sem rodeios, mas com empatia genuína. Nunca cite nomes de terceiros. Fale em português do Brasil.`;

// Se esse modelo parar de responder no futuro, veja o nome atualizado em ai.google.dev
const MODEL = 'gemini-2.0-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor' });
  }

  try {
    const { history = [], text, imageBase64, imageMime } = req.body || {};

    const parts = [];
    if (imageBase64) {
      parts.push({ inline_data: { mime_type: imageMime || 'image/jpeg', data: imageBase64 } });
    }
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
      return res.status(geminiRes.status).json({ error: data.error?.message || 'Erro na API do Gemini' });
    }

    const replyText =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('\n') ||
      'Não consegui gerar uma resposta agora.';

    return res.status(200).json({ text: replyText });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno: ' + err.message });
  }
}
