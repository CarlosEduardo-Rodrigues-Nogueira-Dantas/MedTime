export default {
  template: `
    <div class="bg-white p-6 rounded-2xl shadow-md">
      <h2 class="text-xl font-bold mb-4">Criar seu Perfil</h2>
      <p class="mb-6 text-slate-600">
        Para começar, precisamos de algumas informações. Seus dados ficam salvos apenas no seu dispositivo.
      </p>

      <form @submit.prevent="submeter" class="space-y-4">
        <div>
          <label for="nome" class="block text-sm font-medium text-slate-700">Nome Completo</label>
          <input type="text" id="nome" v-model="form.nome" required class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm">
        </div>

        <div>
          <label for="dataNascimento" class="block text-sm font-medium text-slate-700">Data de Nascimento</label>
          <input type="date" id="dataNascimento" v-model="form.dataNascimento" :max="today" required class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm">
        </div>

        <div>
          <label for="doencasCronicas" class="block text-sm font-medium text-slate-700">Doenças Crônicas (se houver)</label>
          <textarea id="doencasCronicas" v-model="form.doencasCronicas" rows="3" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="Ex: Hipertensão, Diabetes tipo 2"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="contatoNome" class="block text-sm font-medium text-slate-700">Nome do Contato (opcional)</label>
            <input type="text" id="contatoNome" v-model="form.contatoEmergencia.nome" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="Ex: Maria">
          </div>
          <div>
            <label for="contatoTelefone" class="block text-sm font-medium text-slate-700">Telefone do Contato (opcional)</label>
            <input type="tel" id="contatoTelefone" v-model="form.contatoEmergencia.telefone" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="(11) 98765-4321">
          </div>
        </div>

        <div class="flex flex-col sm:flex-row-reverse gap-3 pt-2">
          <button type="submit" class="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-white font-semibold shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600">
            Criar Perfil e Começar
          </button>
          <button type="button" @click="$emit('cancelar')" class="w-full rounded-xl bg-slate-200 px-4 py-2.5 text-slate-800 font-semibold shadow-md hover:bg-slate-300">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  data() {
    return {
      form: { nome: '', dataNascimento: '', doencasCronicas: '', contatoEmergencia: { nome: '', telefone: '' } }
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    submeter() {
      this.$emit('perfil-criado', { ...this.form });
    }
  }
};