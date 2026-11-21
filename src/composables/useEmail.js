import { ref } from 'vue'
import emailjs from '@emailjs/browser'

// As chaves vêm de variáveis de ambiente (ficheiro .env local ou segredos do GitHub Actions).
// A "public key" do EmailJS foi desenhada para estar no browser; no painel do EmailJS
// limitamos os domínios autorizados ao nosso GitHub Pages.
const CONFIG = {
  servico: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  modelo: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  chavePublica: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

export function useEmail() {
  const aEnviar = ref(false)
  const enviado = ref(false)
  const erro = ref(null)
  const configurado = Boolean(CONFIG.servico && CONFIG.modelo && CONFIG.chavePublica)

  async function enviar(parametros) {
    if (aEnviar.value) return false
    if (!configurado) {
      erro.value = 'O envio de e-mail ainda não está configurado nesta versão da aplicação.'
      return false
    }

    aEnviar.value = true
    enviado.value = false
    erro.value = null

    try {
      await emailjs.send(CONFIG.servico, CONFIG.modelo, parametros, { publicKey: CONFIG.chavePublica })
      enviado.value = true
      return true
    } catch (falha) {
      console.warn('Falha no envio do e-mail:', falha)
      erro.value =
        falha?.status === 429
          ? 'Foram enviados muitos e-mails em pouco tempo. Aguarde um momento e tente novamente.'
          : 'Não foi possível enviar o e-mail. Verifique a ligação e tente novamente.'
      return false
    } finally {
      aEnviar.value = false
    }
  }

  function repor() {
    enviado.value = false
    erro.value = null
  }

  return { aEnviar, enviado, erro, configurado, enviar, repor }
}
