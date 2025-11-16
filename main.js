import PerfilPage from './components/PerfilPage.js';
import MedsPage from './components/MedsPage.js';
import CriarPerfil from './CriarPerfil.js';
import HojePage from './components/HojePage.js';
import RelatoriosPage from './components/RelatoriosPage.js';
import InstallHelpModal from './components/InstallHelpModal.js';
import FinalizarTratamentoModal from './components/FinalizarTratamentoModal.js';

// A aba 'contas' foi removida, e 'perfil' será usada para gerenciar o perfil único.
const tabs = [
  { key: 'perfil', label: 'Perfil' },
  { key: 'meds', label: 'Medicamentos' },
  { key: 'hoje', label: 'Hoje' },
  { key: 'relatorios', label: 'Relatórios' }
];

const app = Vue.createApp({
  components: {
    CriarPerfil
  },
  data() {
    // O modelo de dados agora é um único objeto 'userData' que pode ser nulo se não existir.
    return {
      userData: JSON.parse(localStorage.getItem('medtime-userData')) || null,
      tab: 'hoje', // A aba inicial padrão é 'hoje'.
      tabs,

      // 🔥 INCREMENTADO: adicionamos intervaloHoras e duracaoDias ao form
      form: { 
        nome:'', 
        tipo:'continuo', 
        inicio:'', 
        qtdDose:1, 
        estoque:null, 
        limite:null, 
        horariosStr:'',
        intervaloHoras: null,
        duracaoDias: null
      },

      medicamentoParaExcluir: null,
      medicamentoParaFinalizar: null,
      perfilParaApagar: null,
      showCriarPerfilModal: false,

      statusMsg: '',
      errorMsg: '',

      historyIndex: 0,
      historyStack: ['perfil'],
      transitionName: 'slide-left'
    }
  },
  computed: {
    currentTabComponent() {
      // Se não houver dados de usuário, força a exibição da página de criação de perfil.
      if (!this.userData) {
        return null; // Não renderiza nenhum componente de aba se não houver perfil
      }
      return { perfil: PerfilPage, meds: MedsPage, hoje: HojePage, relatorios: RelatoriosPage, 'install-help': InstallHelpModal, 'finalizar-tratamento': FinalizarTratamentoModal }[this.tab];
    },
    medsHojeOrdenados() {
      if (!this.userData || !this.userData.meds) {
        return [];
      }
      return [...this.userData.meds].sort((a, b) => {
        const aTemHorario = a.horarios && a.horarios.length > 0;
        const bTemHorario = b.horarios && b.horarios.length > 0;

        if (!aTemHorario) return 1; // 'a' sem horário vai para o fim
        if (!bTemHorario) return -1; // 'b' sem horário vai para o fim

        // Compara pelo primeiro horário (formato 'HH:mm')
        if (a.horarios[0] < b.horarios[0]) return -1;
        if (a.horarios[0] > b.horarios[0]) return 1;
        return 0;
      });
    },
    canGoBack() { return this.historyIndex > 0; },
    canGoForward() { return this.historyIndex < this.historyStack.length - 1; }
  },
  watch: {
    // Observador para salvar os perfis sempre que houver uma alteração
    userData: {
      handler(newValue) {
        localStorage.setItem('medtime-userData', JSON.stringify(newValue));
      },
      deep: true // 'deep: true' garante que o observador detecte mudanças dentro dos objetos da lista
    }
  },
  methods: {
    navigateTo(key) {
      if (key === this.tab) return;
      const currentIdx = this.tabs.findIndex(t => t.key===this.tab);
      const newIdx = this.tabs.findIndex(t => t.key===key);
      this.transitionName = newIdx > currentIdx ? 'slide-left' : 'slide-right';
      this.historyIndex++;
      this.historyStack = this.historyStack.slice(0, this.historyIndex);
      this.historyStack.push(key);
      window.history.pushState({ tab: key }, '', '#'+key);
      this.tab = key;
    },

    // Cria o perfil único quando o evento é recebido do componente CriarPerfil
    onPerfilCriado(perfilData) {
      this.userData = {
        id: Date.now(),
        nome: perfilData.nome,
        dataNascimento: perfilData.dataNascimento,
        doencasCronicas: perfilData.doencasCronicas,
        contatoEmergencia: perfilData.contatoEmergencia,
        contatoEmergencia: { nome: perfilData.contatoEmergencia.nome, telefone: perfilData.contatoEmergencia.telefone },
        meds: [],
        rel: [],
        medsConcluidos: [] // Adiciona a lista de medicamentos concluídos
      };
      this.navigateTo('hoje');
      this.fecharModalCriarPerfil(); // Fecha o modal após criar
    },

    iniciarApagarPerfil() {
      this.perfilParaApagar = this.userData;
    },

    cancelarApagarPerfil() {
      this.perfilParaApagar = null;
    },

    // Apaga o perfil único para recomeçar.
    apagarPerfil() {
      if (!this.perfilParaApagar) return;
      this.perfilParaApagar = null;
      this.userData = null; // Isso fará a tela de criação aparecer.
    },

    // Abre e fecha o modal de criação de perfil
    abrirModalCriarPerfil() {
      this.showCriarPerfilModal = true;
    },
    fecharModalCriarPerfil() {
      this.showCriarPerfilModal = false;
    },

    // -----------------------------------------------------------
    // 🔥 INCREMENTO: Função que gera horários automáticos
    // -----------------------------------------------------------
    gerarHorariosAutomaticos(inicioISO, intervaloHoras, duracaoDias) {
      const horarios = [];
      if (!inicioISO || !intervaloHoras) return horarios;

      let inicio = new Date(inicioISO);
      const totalHoras = (duracaoDias ? duracaoDias : 1) * 24;
      const limite = new Date(inicio.getTime() + totalHoras * 60 * 60 * 1000);

      while (inicio <= limite) {
        horarios.push(inicio.toTimeString().substring(0,5));
        inicio = new Date(inicio.getTime() + intervaloHoras * 60 * 60 * 1000);
      }

      return horarios;
    },

    // -----------------------------------------------------------
    // Manter o reset original, apenas adicionamos novos campos
    // -----------------------------------------------------------
    resetForm() {
      this.form = { 
        nome:'', 
        tipo:'continuo', 
        inicio:'', 
        qtdDose:1, 
        estoque:null, 
        limite:null, 
        horariosStr:'',
        intervaloHoras:null,
        duracaoDias:null
      };
    },

    // -----------------------------------------------------------
    // 🔥 addMed incrementado com horário automático
    // -----------------------------------------------------------
    addMed() {
      let horarios = [];

      if (this.form.intervaloHoras) {
        horarios = this.gerarHorariosAutomaticos(
          this.form.inicio,
          Number(this.form.intervaloHoras),
          Number(this.form.duracaoDias)
        );
      } else if (this.form.horariosStr) {
        horarios = this.form.horariosStr.split(',').map(s=>s.trim());
      }

      const id = Date.now() + Math.floor(Math.random()*999);

      this.userData.meds.push({
        id,
        nome: this.form.nome,
        tipo: this.form.tipo,
        inicio: this.form.inicio,

        qtdDose: this.form.qtdDose,
        estoque: this.form.estoque ?? null,
        limite: this.form.limite ?? null,

        horarios,

        // 🔥 salvar intervalo/duração no objeto
        intervaloHoras: this.form.intervaloHoras ?? null,
        duracaoDias: this.form.duracaoDias ?? null
      });

      this.userData.rel.push({ 
        id: 'add-'+id,
        quando: new Date().toISOString(),
        nome: this.form.nome,
        tipo: this.form.tipo,
        qtdDose: this.form.qtdDose 
      });

      this.resetForm();
      this.navigateTo('hoje');
      this.statusMsg = 'Medicamento adicionado';
      setTimeout(()=>this.statusMsg='',1600);
    },

    iniciarFinalizacaoTratamento(medicamento) {
      this.medicamentoParaFinalizar = medicamento;
    },

    confirmarFinalizacaoTratamento() {
      const med = this.medicamentoParaFinalizar;
      if (med) {
        // Adiciona data de conclusão e move para a lista de concluídos
        med.concluidoEm = new Date().toISOString();
        if (!this.userData.medsConcluidos) {
          this.userData.medsConcluidos = []; // Garante que a lista exista
        }
        this.userData.medsConcluidos.push(med);

        // Remove da lista de medicamentos ativos
        this.userData.meds = this.userData.meds.filter(m => m.id !== med.id);

        this.statusMsg = `Tratamento com ${med.nome} foi concluído.`;
        setTimeout(()=>this.statusMsg='', 2000);

        this.medicamentoParaFinalizar = null;
      }
    },

    cancelarFinalizacaoTratamento() {
      this.medicamentoParaFinalizar = null;
    },

    confirmarExclusao() {
      if (this.medicamentoParaExcluir) this.removerMed(this.medicamentoParaExcluir.id);
      this.medicamentoParaExcluir = null;
    },

    removerMed(id) {
      this.userData.meds = this.userData.meds.filter(m=>m.id !== id);
      this.statusMsg = 'Medicamento removido';
      setTimeout(()=>this.statusMsg='',1600);
    },

    registrarDose(m) {
      this.userData.rel.push({ 
        id: 'dose-'+Date.now(),
        quando: new Date().toISOString(),
        nome: m.nome,
        tipo: m.tipo,
        qtdDose: m.qtdDose 
      });

      if (m.estoque!==null) m.estoque = Math.max(0, m.estoque - 1);

      this.statusMsg = 'Dose registrada';
      setTimeout(()=>this.statusMsg='',1200);
    },

    registrarDoseById(medId, hora) {
      const m = this.userData.meds.find(x=>x.id===medId);
      if (m) this.registrarDose(m);
    },

    formatDate(d) { 
      if(!d) return ''; 
      return new Date(d).toLocaleDateString(); 
    },

    exportCSV() {
      if (!this.userData || this.userData.rel.length === 0) {
        this.errorMsg = 'Nenhum histórico para exportar.';
        setTimeout(() => this.errorMsg = '', 1500);
        return;
      }

      const cabecalho = ['Data', 'Nome do Medicamento', 'Tipo', 'Dose'];
      const linhas = this.userData.rel.map(r => [
        new Date(r.quando).toLocaleString(),
        r.nome,
        r.tipo,
        r.qtdDose
      ]);

      const conteudoCSV = [cabecalho.join(','), ...linhas.map(l => l.join(','))].join('\n');
      this.downloadFile(conteudoCSV, 'historico-medtime.csv', 'text/csv;charset=utf-8;');
      this.statusMsg = 'Histórico CSV exportado.';
      setTimeout(() => this.statusMsg = '', 1500);
    },

    exportarHistorico() {
      const blob = new Blob([JSON.stringify(this.userData.rel,null,2)], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download='historico.json';
      a.click();
      URL.revokeObjectURL(url);
    },

    // Função auxiliar para download de arquivos
    downloadFile(data, filename, type) {
      const blob = new Blob([data], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },

    btnClass(active) { 
      return active 
      ? 'rounded-2xl bg-sky-600 px-3 py-1.5 text-white shadow' 
      : 'rounded-2xl bg-white px-3 py-1.5 shadow'; 
    },

    reqNotif() {
      Notification.requestPermission().then(()=>{
        this.statusMsg='Permissão de notificação atualizada';
        setTimeout(()=>this.statusMsg='',1400);
      })
    }
  },

  mounted() {
    // Ajusta o histórico de navegação com base no estado carregado
    this.historyStack = [this.tab];
    this.historyIndex = 0;

    window.history.replaceState({tab: this.tab},'', '#'+this.tab);

    const hash = location.hash.replace('#','');
    if (this.userData && hash && this.tabs.some(t=>t.key===hash)) {
      this.tab = hash;
      this.historyStack = [hash];
      this.historyIndex = 0;
      window.history.replaceState({tab:hash},'', '#'+hash);
    } 

    window.addEventListener('popstate', (e) => {
      const tab = e.state?.tab ?? this.tab;
      if (tab && this.tabs.some(t=>t.key===tab)) {
        const currentIdx = this.tabs.findIndex(t => t.key===this.tab);
        const newIdx = this.tabs.findIndex(t => t.key===tab);
        this.transitionName = newIdx > currentIdx ? 'slide-left' : 'slide-right';
        this.tab = tab;
      }
    });

    window.addEventListener('beforeinstallprompt', (e)=> {
      e.preventDefault();
      this._deferredPrompt = e;
      document.getElementById('installBtn').style.display='inline-block';
      document.getElementById('installBtn').onclick = async ()=> {
        e.prompt();
        const choice = await e.userChoice;
        document.getElementById('installBtn').style.display='none';
      }
    });
  }
});

app.mount('#app');
