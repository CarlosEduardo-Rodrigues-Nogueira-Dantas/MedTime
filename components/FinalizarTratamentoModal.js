export default {
  props: {
    visivel: Boolean,
    medicamento: Object,
  },
  emits: ['cancelar', 'confirmar'],
  template: `
    <div v-if="visivel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full m-4">
        <h3 class="text-lg font-semibold mb-4">Concluir Tratamento</h3>
        <p class="mb-6" v-if="medicamento">
          Você concluiu o tratamento com <strong>{{ medicamento.nome }}</strong> e deseja removê-lo da sua lista de hoje?
        </p>
        <div class="flex justify-end gap-4">
          <button @click="$emit('cancelar')" class="rounded-xl bg-slate-200 px-4 py-2 shadow hover:bg-slate-300">Cancelar</button>
          <button @click="$emit('confirmar')" class="rounded-xl bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700">Sim, Concluir</button>
        </div>
      </div>
    </div>
  `
}