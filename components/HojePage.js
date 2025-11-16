export default {
  template: `
  <section aria-labelledby="hoje-title" class="space-y-4">
    <h2 id="hoje-title" class="text-xl font-semibold">Hoje</h2>

    <div class="rounded-2xl bg-white p-4 shadow space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-600">Próxima dose:</p>

          <!-- PROTEÇÃO: só mostra se existir med e horário -->
          <p class="text-lg font-semibold" v-if="$root.medsHojeOrdenados.length > 0 && $root.medsHojeOrdenados[0].horarios.length > 0">
            {{
              $root.medsHojeOrdenados[0].nome
            }} —
            {{
              $root.medsHojeOrdenados[0].horarios && $root.medsHojeOrdenados[0].horarios.length
                ? $root.medsHojeOrdenados[0].horarios[0]
                : ''
            }}
          </p>

          <p class="text-lg font-semibold" v-else>
            Nenhuma dose pendente hoje
          </p>

          <p class="text-xs text-slate-500">
            {{
              $root.medsHojeOrdenados.length > 0
                ? ($root.medsHojeOrdenados[0].tipo === 'continuo' ? 'Contínuo' : 'Curto')
                : ''
            }}
          </p>
        </div>

      </div>

      <div>
        <h3 class="font-semibold mb-2">Horários de hoje</h3>

        <ul class="divide-y">

          <!-- lista completa dos remédios -->
          <li
            v-for="(m,index) in $root.medsHojeOrdenados"
            :key="m.id + '-' + index"
            class="py-2 flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <img v-if="m.foto" :src="m.foto" :alt="m.nome" class="w-12 h-12 object-cover rounded-lg">
              <div>
                <!-- PROTEÇÃO: horários e qtdDose -->
                <p class="text-sm">
                  <strong>{{ m.nome }}</strong>
                  —
                  {{
                    m.horarios && m.horarios.length
                      ? m.horarios.join(', ')
                      : 'Sem horários'
                  }}

                  <span class="text-xs ml-2 text-slate-500">
                    Dose: {{ m.qtdDose ?? 1 }}
                  </span>
                </p>
                
                <!-- Lembrete de Estoque Baixo -->
                <div v-if="m.estoque !== null && m.limite !== null && m.estoque <= m.limite" class="text-xs text-amber-600 font-semibold mt-1">
                  ⚠️ Estoque baixo! (Restam: {{ m.estoque }})
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="$root.registrarDose(m)"
                class="rounded-xl bg-emerald-600 px-3 py-1.5 text-white shadow hover:bg-emerald-700"
              >
                Tomado
              </button>
              <button
                @click="$root.iniciarFinalizacaoTratamento(m)"
                class="rounded-xl bg-red-600 px-3 py-1.5 text-white shadow hover:bg-red-700"
              >
                Concluir
              </button>
            </div>

          </li>
        </ul>

      </div>

      <div class="flex gap-2 justify-end">
        <button
          @click="$root.exportCSV"
          class="rounded-2xl bg-slate-200 px-3 py-1.5 shadow hover:bg-slate-300"
        >
          Exportar histórico CSV
        </button>
      </div>

    </div>
  </section>
  `
}
