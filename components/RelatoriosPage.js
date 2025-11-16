export default {
  template: `
  <section aria-labelledby="rep-title" class="space-y-4">
    <h2 id="rep-title" class="text-xl font-semibold">Histórico e Relatórios</h2>

    <!-- Histórico de Doses Registradas -->
    <div class="rounded-2xl bg-white p-4 shadow space-y-3">
      <h3 class="font-semibold">Histórico de Doses Registradas</h3>
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <button @click="$root.exportCSV" class="rounded-2xl bg-slate-200 px-3 py-1.5 shadow hover:bg-slate-300">Exportar CSV</button>
      </div>

      <ul class="space-y-2 max-h-[50vh] overflow-auto">
        <li v-for="r in ($root.userData ? $root.userData.rel : [])" :key="r.id" class="rounded-xl border p-3">
          <p class="text-sm"><strong>{{ r.nome }}</strong> — {{ r.tipo==='continuo' ? 'Contínuo' : 'Curto' }}</p>
          <p class="text-xs text-slate-600">{{ new Date(r.quando).toLocaleString() }} — Dose: {{ r.qtdDose }}</p>
        </li>
        <li v-if="!$root.userData || !$root.userData.rel.length" class="text-sm text-slate-500">
          Nenhum registro de dose encontrado.
        </li>
      </ul>
    </div>

    <!-- Tratamentos Concluídos -->
    <div class="rounded-2xl bg-white p-4 shadow space-y-3">
      <h3 class="font-semibold">Tratamentos Concluídos</h3>
      <ul class="space-y-2">
        <li v-for="med in ($root.userData ? $root.userData.medsConcluidos : [])" :key="med.id" class="rounded-xl border p-3">
          <p class="text-sm"><strong>{{ med.nome }}</strong></p>
          <p class="text-xs text-slate-600">
            Concluído em: {{ $root.formatDate(med.concluidoEm) }}
          </p>
        </li>
        <li v-if="!$root.userData || !$root.userData.medsConcluidos || !$root.userData.medsConcluidos.length" class="text-sm text-slate-500">
          Nenhum tratamento concluído ainda.
        </li>
      </ul>
    </div>
  </section>
  `
}
