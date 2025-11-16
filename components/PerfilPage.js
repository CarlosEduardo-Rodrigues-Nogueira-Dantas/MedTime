export default {
  template: `
  <section aria-labelledby="perfil-title" class="space-y-4">
    <h2 id="perfil-title" class="text-xl font-semibold">Seu Perfil</h2>
    <!-- O formulário agora usa $root.userData para exibir e editar os dados -->
    <form v-if="$root.userData" @submit.prevent="$root.statusMsg='Perfil salvo com sucesso!'; setTimeout(()=>$root.statusMsg='',1500)" class="space-y-4 bg-white p-6 rounded-2xl shadow">
      <label class="block">
        <span class="text-sm">Nome completo</span>
        <input v-model.trim="$root.userData.nome" required class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
      </label>
      <label class="block">
        <span class="text-sm">Data de nascimento</span>
        <input v-model="$root.userData.dataNascimento" type="date" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
      </label>
      <label class="block">
        <span class="text-sm">Doenças crônicas (se houver)</span>
        <textarea v-model.trim="$root.userData.doencasCronicas" rows="3" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="Ex: Hipertensão, Diabetes tipo 2"></textarea>
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="$root.userData.contatoEmergencia">
        <label class="block">
          <span class="text-sm">Nome do Contato (opcional)</span>
          <input v-model.trim="$root.userData.contatoEmergencia.nome" type="text" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="Ex: Maria" />
        </label>
        <label class="block">
          <span class="text-sm">Telefone do Contato (opcional)</span>
          <input :value="$root.userData.contatoEmergencia.telefone" @input="formatarTelefone" type="tel" maxlength="15" class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" placeholder="(11) 98765-4321" />
        </label>
      </div>
      
      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button type="submit" class="rounded-xl bg-sky-600 px-4 py-2.5 text-white font-semibold shadow-md hover:bg-sky-700">Salvar Alterações</button>
        <button type="button" @click="$root.iniciarApagarPerfil()" class="rounded-xl bg-red-100 px-4 py-2.5 text-red-800 font-semibold shadow-md hover:bg-red-200">Apagar Perfil</button>
      </div>
    </form>
  </section>
  `,
  methods: {
    formatarTelefone(event) {
      let value = event.target.value.replace(/\D/g, "");
      value = value.substring(0, 11);
      if (value.length > 10) {
        // Celular com 9 dígitos: (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (value.length > 5) {
        // Fixo com 8 dígitos: (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d*)/, "($1) $2");
      }
      this.$root.userData.contatoEmergencia.telefone = value;
    }
  }
}
