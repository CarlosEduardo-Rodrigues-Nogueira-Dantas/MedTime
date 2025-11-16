export default {
  data() {
    return {
      novoNome: ''
    };
  },
  template: `
    <section aria-labelledby="contas-title" class="space-y-4">
      <h2 id="contas-title" class="text-xl font-semibold">Gerenciar Perfis</h2>

      <div class="bg-white p-4 rounded-2xl shadow space-y-4">
        <h3 class="font-semibold">Selecione um perfil</h3>
        <ul class="space-y-2">
          <li v-for="p in $root.profiles" :key="p.id" class="rounded-xl hover:bg-slate-100">
            <button @click="$root.selecionarPerfil(p.id)" class="w-full text-left p-3">
              {{ p.nome }}
            </button>
          </li>
        </ul>

        <form v-if="!$root.profiles || $root.profiles.length === 0" @submit.prevent="$root.criarPerfil(novoNome); novoNome=''" class="flex gap-2 pt-4 border-t">
          <input v-model.trim="novoNome" placeholder="Nome do novo perfil" required class="flex-grow w-full rounded-xl border p-2" />
          <button type="submit" class="rounded-xl bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700">Criar</button>
        </form>
      </div>
    </section>
  `
}