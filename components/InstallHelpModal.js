export default {
  data() {
    return {
      visivel: false,
      canInstall: false,
      deferredPrompt: null,
      isIOS: false,
      isStandalone: false
    };
  },
  emits: ['instalar'],
  created() {
    // Detecta iOS
    this.isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    // Detecta se já está instalado (iOS e Android)
    this.isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // Se já está instalado → não mostrar
    if (this.isStandalone) return;

    // Detecta evento PWA para Android/Chrome
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstall = true;
    });
  },
  methods: {
    abrir() {
      if (this.isStandalone) {
        this.$root.statusMsg = 'O aplicativo já está instalado!';
        setTimeout(() => this.$root.statusMsg = '', 2000);
        return;
      }
      this.visivel = true;
    },
    fechar() {
      this.visivel = false;
    },
    async instalar() {
      this.$emit('instalar', this.deferredPrompt);
      this.visivel = false;
    }
  },
  template: `
    <div v-if="visivel"
         class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 text-slate-700">

        <h2 class="text-xl font-semibold text-center">Instalar MedTime</h2>

        <!-- ANDROID / CHROME -->
        <div v-if="!isIOS">
          <p class="text-sm">
            Instale o MedTime para acesso rápido, notificações e uso offline.
          </p>

          <button v-if="canInstall"
                  @click="instalar"
                  class="mt-4 w-full rounded-xl bg-sky-600 text-white py-2 shadow hover:bg-sky-700">
            Instalar agora
          </button>

          <div v-else class="text-sm text-slate-600">
            Para instalar: abra o menu (⋮) do Chrome e toque em
            <strong>Adicionar à tela inicial</strong>.
          </div>
        </div>

        <!-- iOS / SAFARI -->
        <div v-if="isIOS" class="text-sm space-y-2">
          <p>Para instalar no iPhone/iPad:</p>
          <ol class="list-decimal list-inside space-y-1">
            <li>Toque no botão <strong>Compartilhar</strong> (quadrado com seta ↑)</li>
            <li>Selecione <strong>Adicionar à Tela de Início</strong></li>
          </ol>
        </div>

        <button @click="fechar"
                class="w-full mt-4 rounded-xl border py-2 text-slate-600 hover:bg-slate-100">
          Fechar
        </button>
      </div>
    </div>
  `
}
