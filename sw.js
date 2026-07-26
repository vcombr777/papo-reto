// Service worker mínimo — só existe pra o Chrome liberar a opção "Instalar app".
// Não faz cache agressivo pra não travar você nas atualizações durante os testes.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => {});
