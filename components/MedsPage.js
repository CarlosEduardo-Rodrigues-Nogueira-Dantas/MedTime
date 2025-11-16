export default {
  data() {
    return {
      modoHorario: 'auto' // 'auto' ou 'manual'
    }
  },
  template: `
  <section aria-labelledby="meds-title" class="space-y-4">
    <h2 id="meds-title" class="text-xl font-semibold">{{ $root.medParaEditar ? 'Editar Medicamento' : 'Adicionar Medicamento' }}</h2>

    <!-- Formulário de Adicionar/Editar -->
    <form @submit.prevent="salvar" class="grid grid-cols-1 gap-4 bg-white p-4 rounded-2xl shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label class="block">
          <span class="text-sm">Nome</span>
          <input v-model.trim="$root.form.nome" required class="mt-1 w-full rounded-xl border p-2" />
        </label>
        <label class="block">
          <span class="text-sm">Tipo</span>
          <select v-model="$root.form.tipo" class="mt-1 w-full rounded-xl border p-2">
            <option value="continuo">Uso contínuo</option>
            <option value="curto">Curto prazo</option>
          </select>
        </label>
        <label class="block">
          <span class="text-sm">Duração (dias)</span>
          <input type="number" min="1" v-model.number="$root.form.duracaoDias" class="mt-1 w-full rounded-xl border p-2" />
        </label>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
        <label class="block">
          <span class="text-sm">Dose (unidades)</span>
          <input type="number" min="1" v-model.number="$root.form.qtdDose" class="mt-1 w-full rounded-xl border p-2" />
        </label>
        <label class="block">
          <span class="text-sm">Estoque atual</span>
          <input type="number" min="0" v-model.number="$root.form.estoque" class="mt-1 w-full rounded-xl border p-2" placeholder="Opcional" />
        </label>
        <label class="block">
          <span class="text-sm">Avisar se menor que</span>
          <input type="number" min="1" v-model.number="$root.form.limite" class="mt-1 w-full rounded-xl border p-2" placeholder="Opcional" />
        </label>
      </div>

      <!-- Upload de Foto -->
      <div class="border-t pt-4">
        <label class="block">
          <span class="text-sm">Foto do Medicamento (opcional)</span>
          <input type="file" @change="handleFileUpload" accept="image/*" class="mt-1 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100">
        </label>
        <!-- Preview da Imagem -->
        <img v-if="$root.form.foto" :src="$root.form.foto" alt="Preview" class="mt-2 w-24 h-24 object-cover rounded-lg shadow-sm">
      </div>

      <!-- Seletor de Modo de Horário -->
      <div class="flex border border-slate-200 rounded-lg p-1 bg-slate-100">
        <button type="button" @click="modoHorario = 'auto'" :class="modoHorario === 'auto' ? 'bg-white shadow' : ''" class="flex-1 rounded-md py-1.5 text-sm font-semibold">Automático</button>
        <button type="button" @click="modoHorario = 'manual'" :class="modoHorario === 'manual' ? 'bg-white shadow' : ''" class="flex-1 rounded-md py-1.5 text-sm font-semibold">Manual</button>
      </div>

      <!-- Modo Automático -->
      <div v-if="modoHorario === 'auto'" class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <label class="block">
          <span class="text-sm">Horário inicial</span>
          <input type="datetime-local" v-model="$root.form.inicio" class="mt-1 w-full rounded-xl border p-2" />
        </label>
        <label class="block">
          <span class="text-sm">Intervalo entre doses (em horas)</span>
          <input type="number" min="1" v-model.number="$root.form.intervaloHoras" class="mt-1 w-full rounded-xl border p-2" placeholder="Ex: 8" />
        </label>
      </div>

      <!-- Modo Manual -->
      <div v-if="modoHorario === 'manual'" class="border-t pt-4">
        <label class="block">
          <span class="text-sm">Horários fixos (separados por vírgula)</span>
          <input v-model.trim="$root.form.horariosStr" class="mt-1 w-full rounded-xl border p-2" placeholder="Ex: 08:00, 16:00, 22:00" />
        </label>
      </div>

      <div class="flex gap-4">
        <button type="submit" class="w-full rounded-xl bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700">
          {{ $root.medParaEditar ? 'Salvar Alterações' : 'Adicionar Medicamento' }}
        </button>
        <button v-if="$root.medParaEditar" @click="$root.cancelarEdicaoMed()" type="button" class="w-full rounded-xl bg-slate-200 px-4 py-2 shadow hover:bg-slate-300">
          Cancelar Edição
        </button>
      </div>
    </form>

    <!-- Lista de Medicamentos Cadastrados -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Seus Medicamentos</h3>
      <ul v-if="$root.userData && $root.userData.meds.length" class="space-y-2">
        <li v-for="med in $root.userData.meds" :key="med.id" class="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img v-if="med.foto" :src="med.foto" :alt="med.nome" class="w-12 h-12 object-cover rounded-lg">
            <div>
              <p class="font-bold">{{ med.nome }}</p>
              <p class="text-sm text-slate-600">
                {{ med.horarios && med.horarios.length ? med.horarios.join(', ') : 'Sem horário fixo' }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="$root.iniciarEdicaoMed(med)" class="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-300">
              Editar
            </button>
            <button @click="$root.medicamentoParaExcluir = med" class="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-200">
              Excluir
            </button>
          </div>
        </li>
      </ul>
      <div v-else class="text-center text-slate-500 bg-white p-4 rounded-xl">
        <p>Nenhum medicamento cadastrado ainda.</p>
      </div>
    </div>
  </section>
  `,
  methods: {
    salvar() {
      // Limpa o modo não selecionado para evitar dados conflitantes
      if (this.modoHorario === 'auto') {
        this.$root.form.horariosStr = '';
      } else {
        this.$root.form.inicio = '';
        this.$root.form.intervaloHoras = null;
      }

      if (this.$root.medParaEditar) {
        this.$root.salvarEdicaoMed();
      } else {
        this.$root.addMed();
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.$root.form.foto = e.target.result; // Salva a imagem como string Base64
      };
      reader.readAsDataURL(file);
    }
  },
};
