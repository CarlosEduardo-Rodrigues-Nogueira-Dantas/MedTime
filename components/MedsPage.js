export default {
  data() {
    return {
      showIntervalModal: false,
      intervalTemp: 0,
    };
  },

  template: `
  <section aria-labelledby="meds-title" class="space-y-4">
    <h2 id="meds-title" class="text-xl font-semibold">Medicamentos</h2>

    <form @submit.prevent="openIntervalModal" class="grid grid-cols-1 gap-4 bg-white p-4 rounded-2xl shadow">

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

      <label class="block">
        <span class="text-sm">Horário inicial</span>
        <input type="datetime-local" v-model="$root.form.inicio" class="mt-1 w-full rounded-xl border p-2" />
      </label>

      <button type="submit" class="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-700">
        Salvar
      </button>

    </form>

    <!-- MODAL DE INTERVALO -->
    <div v-if="showIntervalModal" class="fixed inset-0 flex items-center justify-center bg-black/40">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-80 space-y-4">

        <h3 class="text-lg font-semibold">Intervalo entre doses</h3>
        <p class="text-sm text-gray-600">De quantas em quantas horas deve tomar?</p>

        <input type="number" min="1" v-model.number="intervalTemp" class="w-full rounded-xl border p-2" />

        <div class="flex justify-end gap-2 mt-4">
          <button @click="cancelInterval" class="px-3 py-1.5 rounded-xl bg-gray-300">Cancelar</button>
          <button @click="saveInterval" class="px-3 py-1.5 rounded-xl bg-emerald-600 text-white">Confirmar</button>
        </div>

      </div>
    </div>

  </section>
  `,

  methods: {
    openIntervalModal() {
      this.showIntervalModal = true;
      this.intervalTemp = 0;
    },

    cancelInterval() {
      this.showIntervalModal = false;
    },

    saveInterval() {
      // COMPATÍVEL COM O main.js
      this.$root.form.intervaloHoras = this.intervalTemp;
      this.showIntervalModal = false;

      // Chama o método principal para adicionar o medicamento
      this.$root.addMed();
    }
  }
};
