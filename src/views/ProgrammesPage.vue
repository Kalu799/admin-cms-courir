<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const saisons = ref([])
const loading = ref(true)
const errorMessage = ref('')

const showAddSaison = ref(false)

const newSaison = ref({
  id: '',
  label: '',
  slug: '',
})

const actionError = ref('')

const editingSaisonId = ref(null)

const editSaison = ref({
  label: '',
  slug: '',
})

const addingWeekForSaisonId = ref(null)

const newWeek = ref({
  id: '',
  numero: '',
})

const editingWeekId = ref(null)

const editWeek = ref({
  numero: '',
})

const addingSessionForWeekId = ref(null)

const newSession = ref({
  id: '',
  label: '',
  ordre: '',
})


const getSaisons = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/saisons`
    )

    if (!response.ok) {
      throw new Error('Impossible de récupérer les programmes')
    }

    saisons.value = await response.json()
  }
  catch (error) {
    errorMessage.value = error.message
  }
  finally {
    loading.value = false
  }
}

const addSaison = async () => {
  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/saisons`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },

        body: JSON.stringify(newSaison.value),
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de créer le programme')
    }

    newSaison.value = {
      id: '',
      label: '',
      slug: '',
    }

    showAddSaison.value = false

    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const startEditSaison = (saison, event) => {
  editingSaisonId.value = saison.id

  editSaison.value = {
    label: saison.label,
    slug: saison.slug,
  }

  const details = event.currentTarget.closest('details')

  if (details) {
    details.open = true
  }
}

const cancelEditSaison = () => {
  editingSaisonId.value = null

  editSaison.value = {
    label: '',
    slug: '',
  }
}

const updateSaison = async (saisonId) => {
  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/saisons/${saisonId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(editSaison.value),
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de modifier le programme')
    }

    cancelEditSaison()
    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const deleteSaison = async (saison) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer le programme "${saison.label}" ?`
  )

  if (!confirmed) return

  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/saisons/${saison.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de supprimer le programme')
    }

    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const startAddWeek = (saisonId) => {
  addingWeekForSaisonId.value = saisonId

  newWeek.value = {
    id: '',
    numero: '',
  }
}

const cancelAddWeek = () => {
  addingWeekForSaisonId.value = null

  newWeek.value = {
    id: '',
    numero: '',
  }
}

const addWeek = async (saisonId) => {
  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/semaines`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          id: newWeek.value.id,
          saisonId,
          numero: Number(newWeek.value.numero),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de créer la semaine')
    }

    cancelAddWeek()
    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const startEditWeek = (semaine, event) => {
  editingWeekId.value = semaine.id

  editWeek.value = {
    numero: semaine.numero,
  }

  const details = event.currentTarget.closest('details')

  if (details) {
    details.open = true
  }
}

const cancelEditWeek = () => {
  editingWeekId.value = null

  editWeek.value = {
    numero: '',
  }
}

const updateWeek = async (semaine, saisonId) => {
  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/semaines/${semaine.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          saisonId,
          numero: Number(editWeek.value.numero),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de modifier la semaine')
    }

    cancelEditWeek()
    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const deleteWeek = async (semaine) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer la semaine ${semaine.numero} ?`
  )

  if (!confirmed) return

  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/semaines/${semaine.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de supprimer la semaine')
    }

    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

const startAddSession = (weekId) => {
  addingSessionForWeekId.value = weekId

  newSession.value = {
    id: '',
    label: '',
    ordre: '',
  }
}

const cancelAddSession = () => {
  addingSessionForWeekId.value = null

  newSession.value = {
    id: '',
    label: '',
    ordre: '',
  }
}

const addSession = async (weekId) => {
  actionError.value = ''

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          id: newSession.value.id,
          semaineId: weekId,
          label: newSession.value.label,
          ordre: Number(newSession.value.ordre),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Impossible de créer la session')
    }

    cancelAddSession()
    await getSaisons()
  }
  catch (error) {
    actionError.value = error.message
  }
}

onMounted(() => {
  getSaisons()
})
</script>

<template>
  <section class="programmes-screen">
    <div class="programmes-container">
      <h1>Programmes</h1>

      <button class="add-button" @click="showAddSaison = !showAddSaison">
        + Ajouter un programme
      </button>

      <form v-if="showAddSaison" class="saison-form" @submit.prevent="addSaison">
        <label>
          Identifiant

          <input v-model="newSaison.id" type="text" placeholder="Ex : saison3" required>
        </label>

        <label>
          Nom du programme

          <input v-model="newSaison.label" type="text" placeholder="Ex : 15 kms" required>
        </label>

        <label>
          Slug

          <input v-model="newSaison.slug" type="text" placeholder="Ex : 15-kms" required>
        </label>

        <div class="saison-form__actions">
          <button type="submit">
            Ajouter
          </button>

          <button type="button" class="button-secondary" @click="showAddSaison = false">
            Annuler
          </button>
        </div>

        <p v-if="actionError" class="action-error">
          {{ actionError }}
        </p>
      </form>

      <p v-if="loading">
        Chargement...
      </p>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <div v-for="saison in saisons" :key="saison.id" class="saison-card">
        <details>
          <summary class="saison-summary">
            <span>{{ saison.label }}</span>

            <span class="summary-info">
              {{ saison.semaines.length }} semaines
            </span>

            <button type="button" class="action-button" @click.stop.prevent="startEditSaison(saison, $event)">
              Modifier
            </button>

            <button type="button" class="action-button action-button--delete"
              @click.stop.prevent="deleteSaison(saison)">
              Supprimer
            </button>
          </summary>

          <form v-if="editingSaisonId === saison.id" class="saison-form saison-form--edit"
            @submit.prevent="updateSaison(saison.id)">
            <label>
              Nom du programme

              <input v-model="editSaison.label" type="text" required>
            </label>

            <label>
              Slug

              <input v-model="editSaison.slug" type="text" required>
            </label>

            <div class="saison-form__actions">
              <button type="submit">
                Enregistrer
              </button>

              <button type="button" class="button-secondary" @click="cancelEditSaison">
                Annuler
              </button>
            </div>
          </form>

          <div class="saison-content">

            <button type="button" class="add-sub-button" @click="startAddWeek(saison.id)">
              + Ajouter une semaine
            </button>

            <form v-if="addingWeekForSaisonId === saison.id" class="saison-form week-form"
              @submit.prevent="addWeek(saison.id)">
              <label>
                Identifiant

                <input v-model="newWeek.id" type="text" placeholder="Ex : saison1-semaine13" required>
              </label>

              <label>
                Numéro de semaine

                <input v-model="newWeek.numero" type="number" min="1" placeholder="Ex : 13" required>
              </label>

              <div class="saison-form__actions">
                <button type="submit">
                  Ajouter
                </button>

                <button type="button" class="button-secondary" @click="cancelAddWeek">
                  Annuler
                </button>
              </div>
            </form>

            <details v-for="semaine in saison.semaines" :key="semaine.id" class="semaine-card">
              <summary class="semaine-summary">
                <span>
                  Semaine {{ semaine.numero }}
                </span>

                <div class="summary-actions">
                  <button type="button" class="action-button" @click.stop.prevent="startEditWeek(semaine, $event)">
                    Modifier
                  </button>

                  <button type="button" class="action-button action-button--delete"
                    @click.stop.prevent="deleteWeek(semaine)">
                    Supprimer
                  </button>
                </div>
              </summary>

              <form v-if="editingWeekId === semaine.id" class="saison-form week-form week-form--edit"
                @submit.prevent="updateWeek(semaine, saison.id)">
                <label>
                  Numéro de semaine

                  <input v-model="editWeek.numero" type="number" min="1" required>
                </label>

                <div class="saison-form__actions">
                  <button type="submit">
                    Enregistrer
                  </button>

                  <button type="button" class="button-secondary" @click="cancelEditWeek">
                    Annuler
                  </button>
                </div>
              </form>

              <div class="semaine-content">

                <button type="button" class="add-sub-button" @click="startAddSession(semaine.id)">
                  + Ajouter une session
                </button>

                <form v-if="addingSessionForWeekId === semaine.id" class="saison-form session-form"
                  @submit.prevent="addSession(semaine.id)">
                  <label>
                    Identifiant

                    <input v-model="newSession.id" type="text" placeholder="Ex : saison1-semaine1-jour3" required>
                  </label>

                  <label>
                    Nom de la session

                    <input v-model="newSession.label" type="text" placeholder="Ex : Jour 3" required>
                  </label>

                  <label>
                    Ordre

                    <input v-model="newSession.ordre" type="number" min="1" placeholder="Ex : 3" required>
                  </label>

                  <div class="saison-form__actions">
                    <button type="submit">
                      Ajouter
                    </button>

                    <button type="button" class="button-secondary" @click="cancelAddSession">
                      Annuler
                    </button>
                  </div>
                </form>

                <details v-for="session in semaine.jours" :key="session.id" class="session-card">
                  <summary class="session-summary">
                    <span>{{ session.label }}</span>

                    <span class="summary-info">
                      {{ session.exercices.length }} exercices
                    </span>
                  </summary>

                  <ul class="exercices-list">
                    <li v-for="exercice in session.exercices" :key="exercice.id" class="exercice-item">
                      <span>
                        {{ exercice.type }}
                      </span>

                      <strong>
                        {{ exercice.dureeMinutes }} min
                      </strong>
                    </li>
                  </ul>
                </details>
              </div>
            </details>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.programmes-screen {
  min-height: 100%;
  padding: 32px 16px 48px;

  background-color: #f7f8f5;
  color: #022c4d;
}

.programmes-container {
  width: 100%;
  max-width: 1000px;

  margin: 0 auto;
}

.programmes-container>h1 {
  margin: 0 0 28px;

  font-size: 2rem;
  font-weight: 800;
}

/* =========================
   DETAILS / SUMMARY GLOBAL
========================= */

details {
  width: 100%;
}

summary {
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.saison-summary,
.semaine-summary,
.session-summary {
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  box-sizing: border-box;
}

.saison-summary::before,
.semaine-summary::before,
.session-summary::before {
  content: '›';

  display: inline-block;

  flex-shrink: 0;

  font-size: 1.3rem;
  font-weight: 800;

  transition: transform 0.2s ease;
}

.summary-actions {
  display: flex;
  gap: 8px;

  margin-left: auto;
}

details[open]>.saison-summary::before,
details[open]>.semaine-summary::before,
details[open]>.session-summary::before {
  transform: rotate(90deg);
}

.summary-info {
  margin-left: auto;

  color: #70808b;

  font-size: 0.85rem;
  font-weight: 500;
}

.add-button {
  margin-bottom: 20px;
  padding: 11px 16px;

  border: 0;
  border-radius: 10px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.add-button:hover {
  opacity: 0.9;
}

.saison-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  margin-bottom: 24px;
  padding: 20px;

  border-radius: 14px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);
}

.saison-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;

  color: #022c4d;

  font-size: 0.9rem;
  font-weight: 700;
}

.saison-form input {
  width: 100%;
  box-sizing: border-box;

  padding: 11px 12px;

  border: 1px solid #d9e0e4;
  border-radius: 8px;

  background-color: #ffffff;
  color: #022c4d;

  font: inherit;
}

.saison-form input:focus {
  border-color: #85bc24;
  outline: none;
}

.saison-form__actions {
  display: flex;
  gap: 10px;
}

.saison-form__actions button {
  padding: 10px 15px;

  border: 0;
  border-radius: 8px;

  background-color: #85bc24;
  color: #ffffff;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.saison-form__actions .button-secondary {
  background-color: #eef1f2;
  color: #022c4d;
}

.action-error {
  margin: 0;

  color: #b43b3b;

  font-size: 0.9rem;
  font-weight: 600;
}

/* =========================
   SAISONS
========================= */

.saison-card {
  margin-bottom: 16px;

  border-radius: 16px;

  background-color: #ffffff;

  box-shadow:
    0 2px 8px rgb(2 44 77 / 5%),
    0 8px 24px rgb(2 44 77 / 6%);

  overflow: hidden;
}

.saison-summary {
  padding: 20px 22px;

  color: #022c4d;

  font-size: 1.2rem;
  font-weight: 800;
}

.saison-summary:hover {
  background-color: #fafbf8;
}

.saison-content {
  padding: 0 18px 18px;
}

.action-button {
  flex-shrink: 0;

  padding: 7px 11px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;

  cursor: pointer;
}

.action-button--delete {
  background-color: #fff1f1;
  color: #b43b3b;
}

.action-button--delete:hover {
  background-color: #ffe2e2;
}

.action-button:hover {
  background-color: #e7eedf;
}

.saison-form--edit {
  margin: 0 18px 18px;
}

/* =========================
   SEMAINES
========================= */

.week-form--edit {
  margin: 0 12px 12px;
}

.add-sub-button {
  margin: 10px 0 14px;
  padding: 9px 13px;

  border: 0;
  border-radius: 8px;

  background-color: #f2f6ed;
  color: #022c4d;

  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;

  cursor: pointer;
}

.add-sub-button:hover {
  background-color: #e7eedf;
}

.week-form {
  margin-bottom: 16px;

  background-color: #f7f8f5;
}

.semaine-card {
  margin-top: 10px;

  border-radius: 12px;

  background-color: #f7f8f5;

  overflow: hidden;
}

.semaine-summary {
  padding: 15px 16px;

  color: #022c4d;

  font-size: 1rem;
  font-weight: 700;
}

.semaine-summary:hover {
  background-color: #eef2ea;
}

.semaine-content {
  padding: 0 12px 12px;
}

/* =========================
   SESSIONS / JOURS
========================= */

.session-form {
  margin-bottom: 12px;

  background-color: #ffffff;
}

.session-card {
  margin-top: 8px;

  border-radius: 10px;

  background-color: #ffffff;

  overflow: hidden;
}

.session-summary {
  padding: 13px 14px;

  color: #022c4d;

  font-size: 0.95rem;
  font-weight: 700;
}

.session-summary:hover {
  background-color: #fafbf8;
}

/* =========================
   EXERCICES
========================= */

.exercices-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  margin: 0;
  padding: 0 14px 14px;

  list-style: none;
}

.exercice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 9px 12px;

  border-radius: 8px;

  background-color: #f2f6ed;

  color: #022c4d;

  font-size: 0.9rem;
}

.exercice-item span {
  min-width: 0;
}

.exercice-item strong {
  flex-shrink: 0;

  font-size: 0.85rem;
  font-weight: 700;
}

/* =========================
   MESSAGES
========================= */

.programmes-container>p {
  margin: 16px 0;

  color: #52616c;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 600px) {
  .programmes-screen {
    padding: 24px 12px 40px;
  }

  .programmes-container>h1 {
    margin-bottom: 22px;

    font-size: 1.7rem;
  }

  .saison-summary {
    padding: 17px 16px;

    font-size: 1.05rem;
  }

  .saison-content {
    padding: 0 10px 12px;
  }

  .semaine-summary {
    padding: 13px 12px;
  }

  .semaine-content {
    padding: 0 8px 10px;
  }

  .session-summary {
    padding: 12px;
  }

  .exercices-list {
    padding: 0 10px 10px;
  }

  .exercice-item {
    padding: 8px 10px;

    font-size: 0.85rem;
  }

  .summary-info {
    font-size: 0.78rem;
  }
}
</style>